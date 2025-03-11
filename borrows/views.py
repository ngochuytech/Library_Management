from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from borrows.serializers import BorrowSerializer
from borrows.models import Borrow

# Create your views here.
@api_view(['GET', 'POST'])
def getCreateBorrow(request):
    if request.method == 'GET':
        query = request.GET.get('query', '')
        borrows = Borrow.objects.filter(user__name__icontains=query).order_by('exp_date')
        serializer = BorrowSerializer(borrows, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        data = request.data
        serializer = BorrowSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def getDetailBorrow(request, id):
    try:
        borrow = Borrow.objects.get(id=id)
        serializer = BorrowSerializer(borrow, many=False)
        return Response(serializer.data)
    except Borrow.DoesNotExist:
        return Response(
            {"message": f"Cannot find borrow with id: {id}"},
            status=status.HTTP_400_BAD_REQUEST
        ) 

@api_view(['PUT'])
def editBorrowWithId(request, id):
    try:
        borrow = Borrow.objects.get(id=id)
        serializer = BorrowSerializer(borrow, data=request.data)
        if not serializer.is_valid():
            return Response(
                { "message" : "Edit book unsuccessfull!",
                  "error": serializer.errors
                },
            status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data)
    except Borrow.DoesNotExist:
        return Response({"message" : f"Cannot find borrow with this id = {id}"}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
def deleteBorrowWithId(request, id):
    try:
        borrow = Borrow.objects.get(id=id)
        borrow.delete()
        return Response("Delete book successfully!")
    except Borrow.DoesNotExist:
        return Response({"message": f"Cannot find borrow with id = {id}"}, status=status.HTTP_400_BAD_REQUEST)
