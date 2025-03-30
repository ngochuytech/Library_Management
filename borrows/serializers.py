from rest_framework import serializers

from borrows.models import Borrow

class BorrowSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    book = serializers.SerializerMethodField()

    class Meta:
        model = Borrow
        fields = '__all__'

    def get_book(self, obj):
        return {'id': obj.book.id, 'title': obj.book.title, 'author': obj.book.author, 'publication_year': obj.book.publication_year}