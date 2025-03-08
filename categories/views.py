from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Category
from .serializers import CategorySerializer
# Create your views here.

@api_view(['GET', 'POST'])
def getCreateCategory(request):
    if request.method == 'GET':
        query = request.GET.get('query')
        if query == None:
            query = ''
        category = Category.objects.filter(name__icontains=query)
        serializer = CategorySerializer(category, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        data = request.data
        serializer = CategorySerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data, stauts=status.HTTP_201_CREATED)

@api_view(['GET'])
def getDetailCategory(request, name):
    try:
        category = Category.objects.get(name=name)
    except Category.DoesNotExist:
        return Response(message = 'Cannot find category with this name', status=status.HTTP_400_BAD_REQUEST)

    serializer = CategorySerializer(category, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
def editCategoryWithId(request, id):
    try:
        category = Category.objects.get(id=id)
        serializer = CategorySerializer(category, data=request.data)
        if not serializer.is_valid():
            return Response({"message" : "Edit category unsuccessfull!"}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data)
    except Category.DoesNotExist:
        return Response({"message" : "Cannot find category with this id"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def deleteCategoryWithId(request, id):
    category = Category.objects.get(id=id)
    category.delete()
    return Response("Delete category successfully!")

        