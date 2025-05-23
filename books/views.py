from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.pagination import PageNumberPagination
from books.models import Book
from books.serializers import BookSerializer
from django.db.models import Count
from django.db import models

class suggestBookPagination(PageNumberPagination):
    page_size = 6
class searchBookPagination(PageNumberPagination):
    page_size = 9

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getTotalBooksCount(request):
    total_books = Book.objects.count()
    return Response({"total_books": total_books}, status=status.HTTP_200_OK)        

@api_view(['GET'])
def getBook(request):
    books = Book.objects.all()
    paginator = suggestBookPagination()
    paginated_books = paginator.paginate_queryset(books, request)
    serializer = BookSerializer(paginated_books, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def getRandomBook(request, bookId):
    random_books = Book.objects.exclude(id=bookId).order_by('?')[:3]
    serializer = BookSerializer(random_books, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createBook(request):
    data = request.data
    print("------------------------------------")
    print("Data received in createBook view:", data)
    # Đối với FormData, các trường có nhiều giá trị được lấy bằng getlist()
    print("Categories from request.data.getlist('category'):", data.getlist('category'))
    print("Author from request.data.get('author'):", data.get('author'))
    print("Title from request.data.get('title'):", data.get('title'))
    print("Image file from request.FILES.get('image'):", request.FILES.get('image')) # File thường nằm trong request.FILES
    print("------------------------------------")
    
    # Convert form data to appropriate format
    processed_data = data.dict() if hasattr(data, 'dict') else data.copy()
    
    # Handle multivalue fields (like category)
    if hasattr(data, 'getlist'):
        category_list = data.getlist('category')
        if category_list:
            # Convert string IDs to integers
            category_ids = [int(cat_id) for cat_id in category_list if cat_id.isdigit()]
            processed_data['category_ids'] = category_ids
    
    # Handle author ID
    if 'author' in processed_data:
        author_id = processed_data.pop('author', None)
        if author_id and str(author_id).isdigit():
            processed_data['author_id'] = int(author_id)
    
    # Handle file uploads
    if 'image' in request.FILES:
        processed_data['image'] = request.FILES.get('image')
    
    serializer = BookSerializer(data=processed_data)
    if not serializer.is_valid():
        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def getDetailBook(request, id):
    try:
        book = Book.objects.get(id = id)
        serializer = BookSerializer(book, many=False)
        return Response(serializer.data)
    except Book.DoesNotExist:
        return Response(
            {"message": f"Cannot find book with id: {id}"},
            status=status.HTTP_400_BAD_REQUEST
        )
        
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def editBookWithId(request, id):
    try:
        book = Book.objects.get(id=id)
        data = request.data
        
        # Convert form data to appropriate format
        processed_data = data.dict() if hasattr(data, 'dict') else data.copy()
        
        # Handle multivalue fields (like category)
        if hasattr(data, 'getlist'):
            category_list = data.getlist('category')
            if category_list:
                # Convert string IDs to integers
                category_ids = [int(cat_id) for cat_id in category_list if cat_id.isdigit()]
                processed_data['category_ids'] = category_ids
        
        # Handle author ID
        if 'author' in processed_data:
            author_id = processed_data.pop('author', None)
            if author_id and str(author_id).isdigit():
                processed_data['author_id'] = int(author_id)
        
        # Handle file uploads
        if 'image' in request.FILES:
            processed_data['image'] = request.FILES.get('image')
            
        serializer = BookSerializer(book, data=processed_data)
        if not serializer.is_valid():
            print("Serializer errors:", serializer.errors)
            return Response(
                { "message" : "Edit book unsuccessfull!",
                  "error": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save()
        return Response(serializer.data) 
    except Book.DoesNotExist:
        return Response({"message" : f"Cannot find book with this id = {id}"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteBookWithId(request, id):
    try:
        book = Book.objects.get(id=id)
        book.delete()
        return Response("Delete book successfully!")
    except Book.DoesNotExist:
        return Response({"message": f"Cannot find book with id = {id}"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def getBooksByAuthor(request, author_id):
    books = Book.objects.filter(author__id=author_id)
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getBookByQuote(request):
    books = Book.objects.all().order_by('-id')[:5]
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def searchBookByName(request):
    query = request.GET.get('query', '')
    type = request.GET.get('type', '')
    if(type=='title'):
        books = Book.objects.filter(title__icontains=query)
    elif(type=='author'):
        books = Book.objects.filter(author__name__icontains=query)
    elif(type=='category'):
        books = Book.objects.filter(category__name__icontains=query)
    else:
        books = Book.objects.all()
    
    paginator = searchBookPagination()
    paginated_books = paginator.paginate_queryset(books, request)
    serializer = BookSerializer(paginated_books, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getBooksByCategoryStats(request):
    """
    Trả về số lượng sách theo từng thể loại.
    """
    category_stats = Book.objects.values('category__name').annotate(
        book_count=Count('id')
    ).order_by('category__name')

    # Chuyển đổi tên trường để phù hợp với frontend
    formatted_stats = [
        {"category_name": entry['category__name'], "book_count": entry['book_count']}
        for entry in category_stats
    ]
    return Response(formatted_stats, status=status.HTTP_200_OK)