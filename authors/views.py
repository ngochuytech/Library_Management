from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from authors.serializers import AuthorSerializer
from authors.models import Author
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser

# Create your views here.
@api_view(['GET'])
def getAllAuthors(request):
    authors = Author.objects.all()
    serializer = AuthorSerializer(authors, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getDetailAuthor(request, id):
    try:
        author = Author.objects.get(id=id)
        serializer = AuthorSerializer(author, many=False)
        return Response(serializer.data)
    except Author.DoesNotExist:
        return Response(
            {"message": f"Cannot find author with id: {id}"},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['DELETE'])
def deleteAuthor(request, id):
    try:
        author = Author.objects.get(id=id)
        author.delete()
        return Response(
            {"message": f"Author with id {id} has been deleted."},
            status=status.HTTP_204_NO_CONTENT
        )
    except Author.DoesNotExist:
        return Response(
            {"message": f"Cannot find author with id: {id}"},
            status=status.HTTP_400_BAD_REQUEST
        )
@api_view(['POST'])
@permission_classes([IsAdminUser])
def createAuthor(request):
    serializer = AuthorSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateAuthor(request, id):
    try:
        author = Author.objects.get(id=id)
    except Author.DoesNotExist:
        return Response(
            {"message": f"Cannot find author with id: {id}"},
            status=status.HTTP_400_BAD_REQUEST
        )
    serializer = AuthorSerializer(author, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)