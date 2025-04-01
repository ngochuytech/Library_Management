from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from authors.serializers import AuthorSerializer
from authors.models import Author

# Create your views here.
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

    