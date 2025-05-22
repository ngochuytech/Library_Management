from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from borrows.serializers import BorrowSerializer
from borrows.models import Borrow, BORROWED_STATUS
from django.db.models import Q, Count, Case, When, IntegerField
from django.db.models.functions import TruncMonth
from django.utils import timezone
import datetime
from django.db import models

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getCurrentlyBorrowedBooksCount(request):
    currently_borrowed_count = Borrow.objects.filter(
        Q(status='APPROVED') | Q(status='BORROWED'),
        return_date__isnull=True
    ).count()
    return Response({"borrowed_count": currently_borrowed_count}, status=status.HTTP_200_OK)


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
        if borrow.status in ['PENDING', 'APPROVED']:
            book = borrow.book
            book.avaliable += 1
            book.save(update_fields=['avaliable'])
        return Response("Delete book successfully!")
    except Borrow.DoesNotExist:
        return Response({"message": f"Cannot find book with id = {id}"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_admin_borrows_list(request):
    borrows_queryset = Borrow.objects.all().order_by('-borrow_date', '-exp_date')

    status_param = request.GET.get('status')
    if status_param:
        statuses = status_param.split(',')
        borrows_queryset = borrows_queryset.filter(status__in=statuses)

    status_not_equal_param = request.GET.get('status__ne')
    if status_not_equal_param:
        borrows_queryset = borrows_queryset.exclude(status=status_not_equal_param)
        
    user_query = request.GET.get('user_name__icontains')
    if user_query:
        borrows_queryset = borrows_queryset.filter(user__username__icontains=user_query)

    book_title_query = request.GET.get('book_title__icontains')
    if book_title_query:
        borrows_queryset = borrows_queryset.filter(book__title__icontains=book_title_query)

    serializer = BorrowSerializer(borrows_queryset, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancelBorrowWithId(request, id):
    try:
        borrow = Borrow.objects.get(id=id)
        if borrow.user.id != request.user.id:
            return Response({"message": "Bạn không có quyền hủy yêu cầu mượn sách này"},
                            status=status.HTTP_403_FORBIDDEN)
        
        if borrow.status != 'PENDING':
            return Response({"message": "Chỉ có thể hủy yêu cầu đang ở trạng thái chờ duyệt"},
                            status=status.HTTP_400_BAD_REQUEST)
        
        book = borrow.book
        book.avaliable += 1
        book.save(update_fields=['avaliable'])
        
        borrow.status = 'CANCELED'
        borrow.save()
        return Response({"message": "Yêu cầu mượn sách đã được hủy thành công"}, status=status.HTTP_200_OK)
    except Borrow.DoesNotExist:
        return Response({"message": f"Không tìm thấy yêu cầu mượn sách với id = {id}"},
                        status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getMonthlyBorrowReturnStats(request):
    end_date = timezone.now()
    start_date = end_date - datetime.timedelta(days=180) # Lấy 6 tháng gần nhất

    # Truy vấn chính để lấy dữ liệu mượn và trả theo tháng
    # Giữ nguyên logic này vì nó khá hiệu quả cho việc đếm trong DB
    monthly_stats = Borrow.objects.filter(
        Q(borrow_date__gte=start_date, borrow_date__lte=end_date) |
        Q(return_date__gte=start_date, return_date__lte=end_date),
        borrow_date__isnull=False # Đảm bảo borrow_date không null cho TruncMonth
    ).annotate(
        month_group=TruncMonth('borrow_date') # Nhóm theo borrow_date
    ).values('month_group').annotate(
        borrow_count=Count(
            Case(
                When(
                    Q(status='APPROVED') | Q(status='BORROWED') | Q(status='OVERDUE') | Q(status='RETURNED'),
                    then=1
                ),
                output_field=IntegerField()
            )
        ),
        return_count=Count(
            Case(
                When(
                    status='RETURNED',
                    return_date__gte=start_date, # Chỉ đếm lượt trả trong khoảng thời gian
                    return_date__lte=end_date,
                    then=1
                ),
                output_field=IntegerField()
            )
        )
    ).order_by('month_group')

    # Định dạng lại dữ liệu đơn giản hơn cho frontend
    # Không điền tháng thiếu ở đây
    # Định dạng tháng ở đây luôn là MM YYYY hoặc YYYY-MM để frontend dễ xử lý
    formatted_stats = []
    for entry in monthly_stats:
        if entry['month_group']:
            # Dùng %m/%Y (ví dụ: 01/2025) hoặc %B %Y (January 2025) nếu muốn tiếng Anh
            formatted_month_name = entry['month_group'].strftime('%m/%Y') # Dạng MM/YYYY
            # Hoặc nếu muốn tiếng Anh đầy đủ cho mapping sau này (January 2025)
            # formatted_month_name = entry['month_group'].strftime('%B %Y')

            formatted_stats.append({
                'month': formatted_month_name,
                'borrow_count': entry['borrow_count'] if entry['borrow_count'] is not None else 0,
                'return_count': entry['return_count'] if entry['return_count'] is not None else 0
            })

    return Response(formatted_stats, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getTopBorrowedBooksStats(request):
    """
    Trả về danh sách 5 cuốn sách được mượn nhiều nhất.
    """
    # Đếm số lượt mượn (bao gồm cả các trạng thái 'BORROWED', 'RETURNED', 'OVERDUE', 'APPROVED')
    # và nhóm theo sách
    top_books = Borrow.objects.filter(
        Q(status='APPROVED') | Q(status='BORROWED') | Q(status='OVERDUE') | Q(status='RETURNED')
    ).values('book__title').annotate(
        borrow_count=Count('book') # Đếm số lần book xuất hiện trong các lượt mượn
    ).order_by('-borrow_count')[:5] # Sắp xếp giảm dần và lấy 5 cuốn đầu tiên

    # Chuyển đổi định dạng để phù hợp với frontend (tên trường)
    formatted_top_books = [
        {"book_title": entry['book__title'], "borrow_count": entry['borrow_count']}
        for entry in top_books
    ]
    return Response(formatted_top_books, status=status.HTTP_200_OK)
