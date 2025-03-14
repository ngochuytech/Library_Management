from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from books.models import Book
from books.serializers import BookSerializer

# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getBook(request):
    title = request.GET.get('title', '')
    author = request.GET.get('author', '')
    category = request.GET.get('category', '')
    books = Book.objects.filter(title__icontains=title)
    books = books.filter(author__icontains=author)
    if category:
        books = books.filter(category__name__iexact=category)
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createBook(request):
    data = request.data
    serializer = BookSerializer(data=data)
    if not serializer.is_valid():
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
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
        serializer = BookSerializer(book, data=request.data)
        if not serializer.is_valid():
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




