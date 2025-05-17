from rest_framework import serializers
from django.db import transaction
from django.utils import timezone

from borrows.models import Borrow
from books.models import Book
from users.models import User

# Import các serializer đã có từ các app tương ứng
from users.serializers import UserSerializer # Giả sử đường dẫn này là đúng
from books.serializers import BookSerializer   # Giả sử đường dẫn này là đúng

class BorrowSerializer(serializers.ModelSerializer):
    # Sử dụng các serializer đã có để hiển thị thông tin chi tiết khi GET
    # read_only=True vì chúng ta sẽ không tạo/cập nhật User/Book thông qua BorrowSerializer
    # Thông tin này chỉ dùng để hiển thị.
    user = UserSerializer(read_only=True)
    book = BookSerializer(read_only=True)

    # Các trường này dùng để TẠO MỚI hoặc CẬP NHẬT phiếu mượn bằng ID
    # write_only=True để chúng không xuất hiện trong output của GET request,
    # vì thông tin chi tiết đã có ở 'user' và 'book' ở trên.
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True, label="User ID"
    )
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(), source='book', write_only=True, label="Book ID"
    )

    # borrow_days vẫn giữ nguyên cho việc tạo mới
    # Khi admin cập nhật, có thể không cần trường này, hoặc có thể cho phép gia hạn (logic phức tạp hơn)
    borrow_days = serializers.IntegerField(min_value=1, required=False, help_text="Số ngày mượn (7, 14, hoặc 30 ngày). Bắt buộc khi tạo mới.")

    class Meta:
        model = Borrow
        fields = [
            'id',
            'user',         # Dùng để hiển thị thông tin user (GET)
            'book',         # Dùng để hiển thị thông tin book (GET)
            'user_id',      # Dùng để tạo/cập nhật user liên quan (POST/PUT)
            'book_id',      # Dùng để tạo/cập nhật book liên quan (POST/PUT)
            'borrow_days',
            'borrow_date',
            'exp_date',
            'return_date',
            'status'
        ]
        # 'status' không còn là read_only để admin có thể cập nhật.
        # 'borrow_date', 'exp_date', 'return_date' thường do hệ thống quản lý
        # hoặc được cập nhật dựa trên thay đổi 'status'.
        read_only_fields = ['id', 'borrow_date', 'exp_date', 'return_date']
        # 'user' và 'book' (các object lồng nhau) là read_only vì chúng ta dùng user_id, book_id để ghi.

    def validate_borrow_days(self, value):
        """Kiểm tra riêng cho borrow_days nếu được cung cấp."""
        if value is not None and value not in [7, 14, 30]: # Cho phép null khi cập nhật mà không thay đổi borrow_days
            raise serializers.ValidationError("Số ngày mượn phải là 7, 14 hoặc 30 ngày.")
        return value

    def validate(self, data):
        """
        Validate dữ liệu cho việc tạo mới và cập nhật.
        """
        is_creating = self.instance is None # True nếu là POST (tạo mới)

        if is_creating:
            # Khi tạo mới, user_id, book_id và borrow_days là bắt buộc
            if 'user' not in data: # 'user' là source của 'user_id'
                raise serializers.ValidationError({"user_id": "Trường này là bắt buộc."})
            if 'book' not in data: # 'book' là source của 'book_id'
                raise serializers.ValidationError({"book_id": "Trường này là bắt buộc."})
            if 'borrow_days' not in data or data.get('borrow_days') is None:
                raise serializers.ValidationError({"borrow_days": "Trường này là bắt buộc khi tạo phiếu mượn."})

            book_to_validate = data.get('book') # Đây là đối tượng Book đã được resolve từ book_id
            user_to_validate = data.get('user') # Đây là đối tượng User đã được resolve từ user_id

            if book_to_validate and book_to_validate.avaliable <= 0:
                raise serializers.ValidationError({"book_id": "Sách này hiện không khả dụng để mượn."})
            if user_to_validate and not user_to_validate.is_active:
                raise serializers.ValidationError({"user_id": "Người dùng này đang bị cấm hoặc không hoạt động."})
        else: # Khi cập nhật (PUT/PATCH)
            # Nếu admin chỉ cập nhật status, không cần validate lại book, user, borrow_days
            # Nếu cho phép thay đổi book_id hoặc user_id khi cập nhật, cần thêm logic validate ở đây
            if 'borrow_days' in data and data.get('borrow_days') is not None:
                 # Nếu borrow_days được cung cấp khi cập nhật, validate nó
                self.validate_borrow_days(data.get('borrow_days'))


        # Kiểm tra logic về status transitions nếu cần
        # Ví dụ: không thể chuyển từ 'RETURNED' sang 'PENDING'
        # current_status = self.instance.status if self.instance else None
        # new_status = data.get('status')
        # if current_status and new_status and not self._is_valid_status_transition(current_status, new_status):
        #     raise serializers.ValidationError(f"Không thể chuyển trạng thái từ {current_status} sang {new_status}.")

        return data

    # def _is_valid_status_transition(self, current_status, new_status):
    #     # Định nghĩa các quy tắc chuyển trạng thái hợp lệ ở đây
    #     # Ví dụ:
    #     # valid_transitions = {
    #     #     'PENDING': ['APPROVED', 'REJECTED', 'CANCELED'],
    #     #     'APPROVED': ['BORROWING', 'CANCELED'], # Giả sử có trạng thái BORROWING
    #     #     'BORROWING': ['RETURNED', 'OVERDUE'],
    #     # }
    #     # return new_status in valid_transitions.get(current_status, [])
    #     return True # Tạm thời cho phép mọi chuyển đổi, cần định nghĩa rõ ràng hơn

    def create(self, validated_data):
        with transaction.atomic():
            book = validated_data['book'] # Đối tượng Book
            user = validated_data['user'] # Đối tượng User
            borrow_days = validated_data['borrow_days']

            # Giảm số lượng sách có sẵn
            if book.avaliable > 0:
                book.avaliable -= 1
                book.save(update_fields=['avaliable'])
            else:
                # Điều này không nên xảy ra nếu validate() hoạt động đúng
                raise serializers.ValidationError({"book_id": "Sách đã hết khi đang xử lý tạo phiếu mượn."})

            # Tạo phiếu mượn
            borrow = Borrow.objects.create(
                user=user,
                book=book,
                borrow_days=borrow_days,
                status='PENDING', # Trạng thái mặc định khi người dùng yêu cầu
                borrow_date=None, # Sẽ được cập nhật khi admin duyệt (APPROVED)
                exp_date=None     # Sẽ được cập nhật khi admin duyệt (APPROVED)
            )
        return borrow

    def update(self, instance, validated_data):
        """
        Xử lý cập nhật phiếu mượn, đặc biệt là thay đổi trạng thái bởi Admin.
        """
        with transaction.atomic():
            current_status = instance.status
            new_status = validated_data.get('status', current_status)

            # Cập nhật các trường được phép thay đổi
            # Admin có thể thay đổi 'status'.
            # Các trường khác như 'borrow_days' (để gia hạn) có thể cần logic riêng.
            instance.status = new_status

            # Xử lý logic dựa trên thay đổi trạng thái
            if current_status != new_status:
                if new_status == 'APPROVED':
                    if not instance.borrow_date: # Chỉ đặt nếu chưa có, tránh ghi đè nếu admin chỉ sửa cái khác
                        instance.borrow_date = timezone.now().date()
                    if not instance.exp_date:
                        # Nếu borrow_days được cung cấp khi cập nhật (ví dụ: admin sửa đổi), dùng nó
                        # Nếu không, dùng borrow_days ban đầu của phiếu mượn
                        days_to_add = validated_data.get('borrow_days', instance.borrow_days)
                        if days_to_add is None: # Cần borrow_days để tính exp_date
                             raise serializers.ValidationError({"borrow_days": "Không thể tính ngày hết hạn nếu không có số ngày mượn."})
                        instance.exp_date = instance.borrow_date + timezone.timedelta(days=days_to_add)

                    # (Tùy chọn) Nếu phiếu mượn được duyệt từ PENDING, số lượng sách đã được giảm ở create.
                    # Nếu có logic khác, ví dụ sách chỉ bị trừ khi APPROVED, thì xử lý ở đây.

                elif new_status == 'RETURNED':
                    if not instance.return_date: # Chỉ đặt nếu chưa có
                        instance.return_date = timezone.now().date()

                    # Tăng lại số lượng sách có sẵn
                    book_instance = instance.book
                    book_instance.avaliable += 1
                    book_instance.save(update_fields=['avaliable'])

                elif new_status == 'REJECTED' or new_status == 'CANCELED':
                    # Nếu yêu cầu bị từ chối/hủy và sách đã bị trừ (ví dụ, nếu trừ ở PENDING),
                    # thì cần cộng lại số lượng sách.
                    # Trong logic hiện tại, sách bị trừ ở create (khi status là PENDING).
                    # Vậy nếu từ PENDING -> REJECTED, cần cộng lại.
                    if current_status == 'PENDING': # Chỉ cộng lại nếu trước đó là PENDING
                        book_instance = instance.book
                        book_instance.avaliable += 1
                        book_instance.save(update_fields=['avaliable'])
                    # Nếu từ APPROVED -> CANCELED, và sách đã được tính là mượn, cũng cần cộng lại.
                    # Logic này cần rõ ràng về quy trình nghiệp vụ.

            # Cho phép cập nhật borrow_days nếu được cung cấp (ví dụ: gia hạn)
            # Điều này có thể cần cập nhật lại exp_date nếu phiếu mượn đã 'APPROVED'
            if 'borrow_days' in validated_data and validated_data['borrow_days'] is not None:
                if instance.status == 'APPROVED' or instance.status == 'BORROWING': # Giả sử có trạng thái BORROWING
                    instance.borrow_days = validated_data['borrow_days']
                    if instance.borrow_date: # Phải có borrow_date để tính lại exp_date
                        instance.exp_date = instance.borrow_date + timezone.timedelta(days=instance.borrow_days)
                # else:
                    # Có thể không cho phép thay đổi borrow_days nếu chưa APPROVED hoặc đã RETURNED
                    # raise serializers.ValidationError({"borrow_days": "Không thể thay đổi số ngày mượn ở trạng thái này."})


            instance.save()
            return instance

