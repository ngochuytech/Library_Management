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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
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
        serializer = BorrowSerializer(data=request.data) # Dữ liệu từ frontend được đưa vào đây
        if serializer.is_valid():
            borrow = serializer.save()
            return Response(BorrowSerializer(borrow).data, status=status.HTTP_201_CREATED)
        # Nếu không valid, serializer.errors sẽ chứa lỗi chi tiết
        # và đó chính là {user_id: [...], book_id: [...]} bạn thấy
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

@api_view(['GET'])
@permission_classes([IsAdminUser]) # Chỉ Admin mới được truy cập view này
def get_admin_borrows_list(request):
    borrows_queryset = Borrow.objects.all().order_by('-borrow_date', '-exp_date') # Sắp xếp mới nhất lên trước

    # Lọc theo trạng thái (status)
    status_param = request.GET.get('status')
    if status_param:
        statuses = status_param.split(',') # Cho phép lọc nhiều status, ví dụ: status=RETURNED,APPROVED
        borrows_queryset = borrows_queryset.filter(status__in=statuses)

    # Lọc theo trạng thái "không phải là" (status__ne)
    status_not_equal_param = request.GET.get('status__ne')
    if status_not_equal_param:
        borrows_queryset = borrows_queryset.exclude(status=status_not_equal_param)
        
    # Lọc theo user name (nếu admin muốn tìm kiếm)
    user_query = request.GET.get('user_name__icontains')
    if user_query:
        borrows_queryset = borrows_queryset.filter(user__username__icontains=user_query) # Giả sử user model có 'username'
                                                                                    # hoặc user__first_name__icontains, user__last_name__icontains

    # Lọc theo tiêu đề sách
    book_title_query = request.GET.get('book_title__icontains')
    if book_title_query:
        borrows_queryset = borrows_queryset.filter(book__title__icontains=book_title_query)

    # TODO: Thêm phân trang ở đây sau này

    serializer = BorrowSerializer(borrows_queryset, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancelBorrowWithId(request, id):
    try:
        borrow = Borrow.objects.get(id=id)
        # Kiểm tra xem người dùng hiện tại có phải là người tạo yêu cầu mượn sách không
        if borrow.user.id != request.user.id:
            return Response({"message": "Bạn không có quyền hủy yêu cầu mượn sách này"}, 
                            status=status.HTTP_403_FORBIDDEN)
        
        # Kiểm tra nếu trạng thái không phải là PENDING thì không cho phép hủy
        if borrow.status != 'PENDING':
            return Response({"message": "Chỉ có thể hủy yêu cầu đang ở trạng thái chờ duyệt"}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        # Cập nhật trạng thái thành CANCELED
        borrow.status = 'CANCELED'
        borrow.save()
        return Response({"message": "Yêu cầu mượn sách đã được hủy thành công"}, status=status.HTTP_200_OK)
    except Borrow.DoesNotExist:
        return Response({"message": f"Không tìm thấy yêu cầu mượn sách với id = {id}"}, 
                        status=status.HTTP_404_NOT_FOUND)

