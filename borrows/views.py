from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from borrows.serializers import BorrowSerializer
from borrows.models import Borrow

# Create your views here.
@api_view(['GET'])
def getCreateBorrow(request):
    query = request.GET.get('query', '')
    borrows = Borrow.objects.filter(user__name__icontains=query).order_by('exp_date')
    serializer = BorrowSerializer(borrows, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
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


# @permission_classes([IsAuthenticated])
@api_view(['GET'])
def getBorrowsByUserId(request, user_id):
    try:
        borrows = Borrow.objects.filter(user__id=user_id).order_by('exp_date')
        serializer = BorrowSerializer(borrows, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {"message": "An error occurred while fetching borrows.", "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class BorrowCreateView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = BorrowSerializer(data=request.data)
        if serializer.is_valid():
            borrow = serializer.save()
            return Response(BorrowSerializer(borrow).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
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
@permission_classes([IsAdminUser])
def deleteBorrowWithId(request, id):
    try:
        borrow = Borrow.objects.get(id=id)
        borrow.delete()
        return Response("Delete book successfully!")
    except Borrow.DoesNotExist:
        return Response({"message": f"Cannot find borrow with id = {id}"}, status=status.HTTP_400_BAD_REQUEST)
