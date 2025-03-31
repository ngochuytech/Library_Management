from rest_framework import serializers

from books.models import Book

class BookSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()
    author = serializers.SerializerMethodField()
    class Meta:
        model = Book
        fields = '__all__'

    def get_author(self, obj):
        return {'id': obj.author.id, 'name': obj.author.name}