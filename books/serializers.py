from rest_framework import serializers

from categories.serializers import CategorySerializer
from books.models import Book

class BookSerializer(serializers.ModelSerializer):
    category = CategorySerializer(many=True)
    author = serializers.SerializerMethodField()
    class Meta:
        model = Book
        fields = '__all__'

    def get_author(self, obj):
        return {'id': obj.author.id, 'name': obj.author.name}