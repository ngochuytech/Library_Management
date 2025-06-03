from rest_framework import serializers
from django.db import transaction
from django.utils import timezone

from borrows.models import Borrow
from books.models import Book
from users.models import User

from users.serializers import UserSerializer 
from books.serializers import BookSerializer   

class BorrowSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    book = BookSerializer(read_only=True)

    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True, label="User ID"
    )
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(), source='book', write_only=True, label="Book ID"
    )

    borrow_days = serializers.IntegerField(min_value=1, required=False, help_text="Số ngày mượn (7, 14, hoặc 30 ngày). Bắt buộc khi tạo mới.")
    borrow_date = serializers.DateTimeField(required=False, allow_null=True)
    exp_date = serializers.DateTimeField(required=False, allow_null=True)    
    class Meta:
        model = Borrow
        fields = [
            'id',
            'user',         
            'book',         
            'user_id',   
            'book_id',      
            'borrow_days',
            'borrow_date',
            'require_date',
            'exp_date',
            'return_date',
            'status'
        ]
        read_only_fields = ['id', 'return_date', 'require_date']

    def validate_borrow_days(self, value):
        """Kiểm tra riêng cho borrow_days nếu được cung cấp."""
        if value is not None and value not in [7, 14, 30]: 
            raise serializers.ValidationError("Số ngày mượn phải là 7, 14 hoặc 30 ngày.")
        return value

    def validate(self, data):
        """
        Validate dữ liệu cho việc tạo mới và cập nhật.
        """
        is_creating = self.instance is None # True nếu là POST (tạo mới)

        if is_creating:
            if 'user' not in data:
                raise serializers.ValidationError({"user_id": "Trường này là bắt buộc."})
            if 'book' not in data: 
                raise serializers.ValidationError({"book_id": "Trường này là bắt buộc."})
            if 'borrow_days' not in data or data.get('borrow_days') is None:
                raise serializers.ValidationError({"borrow_days": "Trường này là bắt buộc khi tạo phiếu mượn."})

            book_to_validate = data.get('book') 
            user_to_validate = data.get('user')

            if book_to_validate and book_to_validate.avaliable <= 0:
                raise serializers.ValidationError({"book_id": "Sách này hiện không khả dụng để mượn."})
            if user_to_validate and not user_to_validate.is_active:
                raise serializers.ValidationError({"user_id": "Người dùng này đang bị cấm hoặc không hoạt động."})
        else: # Khi cập nhật (PUT/PATCH)
            if 'borrow_days' in data and data.get('borrow_days') is not None:
                self.validate_borrow_days(data.get('borrow_days'))

        return data

    def create(self, validated_data):
        with transaction.atomic():
            book = validated_data['book']
            user = validated_data['user']
            borrow_days = validated_data['borrow_days']

            if book.avaliable > 0:
                book.avaliable -= 1
                book.save(update_fields=['avaliable'])
            else:
                raise serializers.ValidationError({"book_id": "Sách đã hết khi đang xử lý tạo phiếu mượn."})

            borrow = Borrow.objects.create(
                user=user,
                book=book,
                borrow_days=borrow_days,
                require_date=timezone.now(),
                status='PENDING', 
                borrow_date=None, 
                exp_date=None 
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