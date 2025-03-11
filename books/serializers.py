from rest_framework import serializers

from books.models import Book

class BookSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()
    class Meta:
        model = Book
        fields = '__all__'