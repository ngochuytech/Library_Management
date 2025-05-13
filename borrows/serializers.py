from rest_framework import serializers
from borrows.models import Borrow
from books.models import Book
from users.models import User
from django.db import transaction

class BorrowSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    book = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all())
    borrow_days = serializers.IntegerField(min_value=1, required=True)

    class Meta:
        model = Borrow
        fields = ['id', 'user', 'book', 'borrow_days', 'borrow_date', 'exp_date', 'return_date', 'status']
        read_only_fields = ['borrow_date', 'exp_date', 'return_date', 'status']

    def validate(self, data):
        book = data.get('book')
        user = data.get('user')
        borrow_days = data.get('borrow_days')

        if book.avaliable <= 0:
            raise serializers.ValidationError("Sách này hiện không khả dụng để mượn.")

        if not user.is_active:
            raise serializers.ValidationError("Người dùng này đang bị cấm")

        if borrow_days not in [7, 14, 30]:
            raise serializers.ValidationError("Số ngày mượn phải là 7, 14 hoặc 30 ngày.")

        return data

    def create(self, validated_data):
        with transaction.atomic():
            book = validated_data['book']
            book.avaliable -= 1
            book.save()

            borrow = Borrow.objects.create(
                user=validated_data['user'],
                book=validated_data['book'],
                borrow_days=validated_data['borrow_days'],
                status='PENDING'
            )
        return borrow

    def get_book(self, obj):
        return {
            'id': obj.book.id,
            'title': obj.book.title,
            'author': str(obj.book.author),
            'publication_year': obj.book.publication_date.year
        }