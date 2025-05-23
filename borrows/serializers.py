from rest_framework import serializers
from django.db import transaction
from django.utils import timezone

from borrows.models import Borrow
from books.models import Book
from users.models import User

from users.serializers import UserSerializer 
from books.serializers import BookSerializer   

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
    borrow_date = serializers.DateTimeField(required=False, allow_null=True)
    exp_date = serializers.DateTimeField(required=False, allow_null=True)    
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
            'require_date', # Đã có sẵn, dùng để hiển thị ngày yêu cầu (GET)
            'exp_date',
            'return_date',
            'status'
        ]
        # 'status' không còn là read_only để admin có thể cập nhật.
        # 'borrow_date', 'exp_date', 'return_date', 'require_date' thường do hệ thống quản lý
        # hoặc được cập nhật dựa trên thay đổi 'status' hoặc tại thời điểm tạo.
        read_only_fields = ['id', 'return_date', 'require_date']
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

        return data

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
                require_date=timezone.now(), # Tự động gán ngày giờ yêu cầu hiện tại
                status='PENDING', # Trạng thái mặc định khi người dùng yêu cầu
                borrow_date=None, # Sẽ được cập nhật khi admin duyệt (APPROVED)
                exp_date=None     # Sẽ được cập nhật khi admin duyệt (APPROVED)
            )
        return borrow

    def update(self, instance, validated_data):
        with transaction.atomic():
            current_status = instance.status
            new_status = validated_data.get('status', current_status)

            instance.status = new_status
            if 'borrow_days' in validated_data:
                instance.borrow_days = validated_data.get('borrow_days')

            if current_status != new_status:
                if new_status == 'BORROWED':
                    # Luôn cập nhật lại ngày mượn và hạn trả khi chuyển sang BORROWED
                    instance.borrow_date = timezone.now()
                    days_to_add = instance.borrow_days
                    if days_to_add is None:
                        raise serializers.ValidationError({"borrow_days": "Không thể tính ngày hết hạn nếu không có số ngày mượn."})
                    instance.exp_date = instance.borrow_date + timezone.timedelta(days=days_to_add)

                elif new_status == 'RETURNED':
                    if not instance.return_date:
                        instance.return_date = timezone.now()
                    book_instance = instance.book
                    book_instance.avaliable += 1
                    book_instance.save(update_fields=['avaliable'])

                elif new_status in ['REJECTED', 'CANCELED']:
                    if current_status in ['PENDING', 'APPROVED']:
                        book_instance = instance.book
                        book_instance.avaliable += 1
                        book_instance.save(update_fields=['avaliable'])

            elif 'borrow_days' in validated_data and instance.borrow_days != validated_data.get('borrow_days') \
                    and instance.status == 'APPROVED':
                if instance.borrow_date and instance.borrow_days is not None:
                    instance.exp_date = instance.borrow_date + timezone.timedelta(days=instance.borrow_days)
                elif instance.borrow_days is None:
                    raise serializers.ValidationError({"borrow_days": "Không thể bỏ trống số ngày mượn khi phiếu đã duyệt."})

            instance.save()
            return instance