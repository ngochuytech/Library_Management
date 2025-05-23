from rest_framework import serializers

from categories.serializers import CategorySerializer
from books.models import Book
from authors.models import Author
from categories.models import Category

class BookSerializer(serializers.ModelSerializer):
    category = CategorySerializer(many=True, read_only=True)
    category_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    author = serializers.SerializerMethodField()
    author_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Book
        fields = '__all__'

    def get_author(self, obj):
        return {'id': obj.author.id, 'name': obj.author.name}
        
    def create(self, validated_data):
        category_ids = validated_data.pop('category_ids', [])
        author_id = validated_data.pop('author_id', None)
        
        #Add authories
        if author_id:
            author = Author.objects.get(id=author_id)
            validated_data['author'] = author
            
        book = Book.objects.create(**validated_data)
        
        # Add categories
        if category_ids:
            categories = Category.objects.filter(id__in=category_ids)
            book.category.set(categories)
            
        return book
        
    def update(self, instance, validated_data):
        category_ids = validated_data.pop('category_ids', None)
        author_id = validated_data.pop('author_id', None)
        
        if author_id:
            author = Author.objects.get(id=author_id)
            instance.author = author
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        instance.save()
        
        # Update categories if provided
        if category_ids is not None:
            categories = Category.objects.filter(id__in=category_ids)
            instance.category.set(categories)
            
        return instance