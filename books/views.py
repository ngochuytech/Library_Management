from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from books.models import Book
from books.serializers import BookSerializer

# Create your views here.
@api_view(['GET', 'POST'])
def getCreateBook(request):
    if request.method == 'GET':
        query = request.GET.get('query', '')
        books = Book.objects.filter(title__icontains=query)
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
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
def editBookWithId(request, id):
    try:
        book = Book.objects.get(id=id)
        serializer = BookSerializer(book, data=request.data)
        print("Rq = ", request.data)
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
def deleteBookWithId(request, id):
    book = Book.objects.get(id=id)
    book.delete()
    return Response("Delete book successfully!")


