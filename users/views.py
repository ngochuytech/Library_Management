from django.contrib.auth import authenticate, get_user_model
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken 
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from users.serializers import UserSerializer
from users.models import User
from django.core.mail import send_mail
from django.conf import settings
from datetime import timedelta
import random
import string
import datetime
from django.utils.crypto import get_random_string
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.hashers import check_password
from users.exceptions import InvalidPhoneNumberException
from django.db.models.functions import TruncMonth
from django.db.models import Count
from django.utils import timezone

# Store OTPs temporarily (in production, use Redis or database)
otp_store = {}
User = get_user_model()

# Create your views here.
def index(request):
    return Response("This is the Users index")

class LoginClass(APIView):
    def get(self, request):
        return Response("This is login page")
    
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        my_user = User.objects.filter(email=email).first()
        if my_user and my_user.check_password(password):
            refresh = RefreshToken.for_user(my_user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            user = get_user_from_token(access_token)
            userSerializer = UserSerializer(user, many=False)

            # Tạo response với thông tin user đầy đủ bao gồm vai trò
            user_data = userSerializer.data
            is_admin = user.is_staff or user.is_superuser
            
            response = Response({
                "access_token": access_token, 
                "user": user_data,
                "is_admin": is_admin
            })
            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                max_age=timedelta(days=7).total_seconds(),
                httponly=True,
                samesite='Lax'
            )
            return response
        else:
            return Response({"error": "Kiểm tra lại email và mật khẩu!"}, status=status.HTTP_401_UNAUTHORIZED)

class ReigsterClass(APIView):
    def get(self, request):
        return Response("This is register page")
    
    def post(self, request):
        name = request.data['username']
        email = request.data['email']
        password = request.data['password']
        phone_number = request.data['phone']
        if not phone_number:
            return Response("Phone number is required", status=status.HTTP_400_BAD_REQUEST)
        my_user = User.objects.create_user(email=email, password=password, phone_number=phone_number, name=name)
        return Response("Đăng ký thành công! Vui lòng đăng nhập." if my_user else "Đăng ký thất bại! Vui lòng thử lại.")

def get_user_from_token(token):
    try:
        access_token = AccessToken(token)
        user_id = access_token["user_id"]
        user = User.objects.get(id=user_id)
        return user
    except Exception as e:
        raise AuthenticationFailed('Invalid token or user not found')

class RefreshTokenView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        print("refresh_token = ", refresh_token)
        if not refresh_token:
            return Response({'error': 'No refresh token provided'}, status=400)
        
        try:
            refresh = RefreshToken(refresh_token)
            print("refresh_token af= ", refresh)

            access_token = str(refresh.access_token)
            return Response({'access_token': access_token}, status=200)
        except Exception as e:
            print("refresh_token = ", refresh_token)
            return Response({'error': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)

class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            # Generate 6-digit OTP
            otp = ''.join(random.choices(string.digits, k=6))
            # Store OTP with expiration (15 minutes)
            otp_store[email] = {
                'otp': otp,
                'expires_at': datetime.datetime.now() + datetime.timedelta(minutes=15)
            }
            
            # Send email with OTP using your configured SMTP
            subject = 'Password Reset OTP'
            message = f'Your OTP for password reset is: {otp}. This code will expire in 15 minutes.'
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            return Response({'message': 'OTP sent to your email', 'status': 'success'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            # For security, don't reveal that the email doesn't exist
            return Response({'message': 'If this email exists, an OTP has been sent', 'status': 'success'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': f'Error sending email: {str(e)}', 'status': 'error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        
        if email not in otp_store:
            return Response({'message': 'Invalid or expired OTP session', 'status': 'error'}, status=status.HTTP_400_BAD_REQUEST)
        
        stored_data = otp_store[email]
        if datetime.datetime.now() > stored_data['expires_at']:
            del otp_store[email]
            return Response({'message': 'OTP has expired', 'status': 'error'}, status=status.HTTP_400_BAD_REQUEST)
        
        if otp != stored_data['otp']:
            return Response({'message': 'Invalid OTP', 'status': 'error'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate a reset token
        reset_token = get_random_string(64)
        otp_store[email]['reset_token'] = reset_token
        
        return Response({
            'message': 'OTP verified successfully', 
            'status': 'success',
            'reset_token': reset_token
        }, status=status.HTTP_200_OK)

class ResetPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        reset_token = request.data.get('reset_token')
        new_password = request.data.get('new_password')
        
        if email not in otp_store or 'reset_token' not in otp_store[email]:
            return Response({'message': 'Invalid or expired reset session', 'status': 'error'}, status=status.HTTP_400_BAD_REQUEST)
        
        if reset_token != otp_store[email]['reset_token']:
            return Response({'message': 'Invalid reset token', 'status': 'error'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            
            # Clear OTP data after successful reset
            del otp_store[email]
            
            return Response({'message': 'Password reset successful', 'status': 'success'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'message': 'User not found', 'status': 'error'}, status=status.HTTP_404_NOT_FOUND)

# Thêm các import cần thiết
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import UserSerializer

# API lấy danh sách người dùng (chỉ admin mới có quyền truy cập)

@api_view(['GET'])
@permission_classes([IsAdminUser]) # Chỉ cho phép Admin truy cập
def getTotalUsersCount(request):
    total_users = User.objects.filter(is_superuser=False, is_staff=False).count()
    return Response({"total_users": total_users}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUser(request):
    id = request.GET.get('id')
    try:
        user = User.objects.get(id=id)
        serializer = UserSerializer(user, many=False)

        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({
            "error": f"Cannot find user with id: {id}",
        }, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserInformation(request, id):
    try:
        user = User.objects.get(id=id)
        name = request.data.get("name")
        phone_number = request.data.get("phone_number")
        avatar = request.FILES.get('avatar')  # Get avatar file if uploaded

        data = {}
        if name is not None and not name.strip():
            return Response({
                "error": "Tên không được để trống"
            }, status=status.HTTP_400_BAD_REQUEST)

        if phone_number is not None and not phone_number.strip():
            raise InvalidPhoneNumberException("Số điện thoại không được để trống")
        
        # Add all fields that are present in the request
        data['name'] = name
        if phone_number:
            data['phone_number'] = phone_number
        if avatar:
            data['avatar'] = avatar

        # Use serializer to validate and save the data
        serializer = UserSerializer(instance=user, data=data, partial=True)
        if not serializer.is_valid():
            print("serializer.errors = ", serializer.errors)
            return Response({
                "error": serializer.errors,
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Save the validated data
        serializer.save()
        print("data = ", serializer.data)
        return Response(serializer.data)
    
    except User.DoesNotExist:
        return Response({
            "error": f"Cannot find user with id: {id}"
        }, status=status.HTTP_400_BAD_REQUEST)
    except InvalidPhoneNumberException as e:
        return Response({
            "error": e.message,
        }, status=status.HTTP_400_BAD_REQUEST)

# API cập nhật thông tin người dùng
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAdminUser])
def update_user(request, id):
    try:
        user = User.objects.get(id=id) # User là model của bạn
        # Kiểm tra request.FILES nếu bạn gửi avatar bằng FormData
        print("Request data:", request.data) 
        print("Request FILES:", request.FILES)

        # Khi có file upload, request.data sẽ chứa các trường non-file,
        # và request.FILES sẽ chứa các trường file.
        # ModelSerializer sẽ tự động xử lý việc này khi bạn truyền request.data.
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        print("Serializer errors:", serializer.errors) # Log lỗi serializer
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({"error": f"User with id {id} not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print("Exception in update_user:", str(e)) # Log lỗi chung
        return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# API xóa người dùng
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_user(request, id):
    try:
        user = User.objects.get(id=id) # User là model User của bạn

        # Cân nhắc: Bạn có thể muốn thêm logic kiểm tra xem user có đang cố tự xóa mình không,
        # hoặc không cho xóa superuser cuối cùng, v.v.
        # Ví dụ:
        # if request.user.id == user.id:
        #     return Response({"error": "You cannot delete yourself."}, status=status.HTTP_400_BAD_REQUEST)

        user.delete()
        # Theo chuẩn REST, DELETE thành công thường trả về 204 No Content và không có body.
        # Hoặc bạn có thể trả về một thông báo thành công nếu muốn.
        return Response(status=status.HTTP_204_NO_CONTENT) 
        # return Response({"message": f"User with id {id} deleted successfully"}, status=status.HTTP_200_OK) # Nếu bạn muốn có message
    except User.DoesNotExist:
        return Response({"error": f"User with id {id} not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e: # Bắt các lỗi không mong muốn khác
        print(f"Error deleting user {id}: {str(e)}")
        return Response({"error": "An error occurred while deleting the user."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def changePassword(request):
    try:
        user = request.user
        current_password = request.data.get('currentPassword')
        new_password = request.data.get('newPassword')
        confirm_password = request.data.get('confirmPassword')

        if not current_password or not new_password or not confirm_password:
            return Response({
                "error": "Vui lòng cung cấp đầy đủ mật khẩu hiện tại, mật khẩu mới và xác nhận mật khẩu."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not check_password(current_password, user.password):
            return Response({
                "error": "Mật khẩu hiện tại không đúng."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if new_password != confirm_password:
            return Response({
                "error": "Mật khẩu mới và xác nhận mật khẩu không khớp."
            }, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 6:
            return Response({
                "error": "Mật khẩu mới phải có ít nhất 6 ký tự."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save()

        return Response({
            "message": "Đổi mật khẩu thành công."
        })
    
    except Exception as e:
        return Response({
            "error": f"Đã xảy ra lỗi: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_detail(request, id):
    try:
        user = User.objects.get(id=id)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": f"User with id {id} not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getMonthlyNewUsersStats(request):
    end_date = timezone.now()
    start_date = end_date - datetime.timedelta(days=365)

    new_users_counts = User.objects.filter(
        created_at__isnull=False,
        created_at__gte=start_date,
        created_at__lte=end_date
    ).annotate(
        month=TruncMonth('created_at')
    ).values('month').annotate(
        count=Count('id')
    ).exclude(month__isnull=True).order_by('month')

    stats_list = []
    month_names_map = {
        "January": "Tháng 1", "February": "Tháng 2", "March": "Tháng 3",
        "April": "Tháng 4", "May": "Tháng 5", "June": "Tháng 6",
        "July": "Tháng 7", "August": "Tháng 8", "September": "Tháng 9",
        "October": "Tháng 10", "November": "Tháng 11", "December": "Tháng 12"
    }

    final_stats_map = {}
    current_month_iter = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    for i in range(12):
        month_key = current_month_iter.strftime('%Y-%m')
        english_month = current_month_iter.strftime('%B')
        year = current_month_iter.strftime('%Y')
        vietnamese_month = month_names_map.get(english_month, english_month)
        formatted_month = f"{vietnamese_month} {year}"
        final_stats_map[month_key] = {'month': formatted_month, 'new_users_count': 0}
        current_month_iter = (current_month_iter - datetime.timedelta(days=1)).replace(day=1)

    for entry in new_users_counts:
        month_dt = entry['month']
        if month_dt is None:
            continue
        month_key = month_dt.strftime('%Y-%m')
        if month_key in final_stats_map:
            final_stats_map[month_key]['new_users_count'] = entry['count']
        
    # --- PHẦN THAY ĐỔI LOGIC SẮP XẾP ---
    # Sắp xếp các tháng đã điền theo thứ tự thời gian tăng dần
    def sort_key_by_month_year(item):
        # Ví dụ item['month'] là "Tháng 5 2023"
        parts = item['month'].split(' ')
        
        # Lấy số tháng từ tên tiếng Việt (ví dụ: "Tháng 5" -> 5)
        # Tạo một map ngược từ tên tiếng Việt sang số tháng (1-12)
        month_number_map = {
            "Tháng 1": 1, "Tháng 2": 2, "Tháng 3": 3, "Tháng 4": 4, "Tháng 5": 5, "Tháng 6": 6,
            "Tháng 7": 7, "Tháng 8": 8, "Tháng 9": 9, "Tháng 10": 10, "Tháng 11": 11, "Tháng 12": 12
        }
        
        # Đảm bảo chúng ta chỉ lấy phần tên tháng (ví dụ "Tháng 5")
        month_name_viet = parts[0] + ' ' + parts[1] # Kết hợp "Tháng" và "5" lại
        
        month_num = month_number_map.get(month_name_viet)
        year_num = int(parts[2]) # Lấy phần năm

        if month_num is None:
            # Xử lý trường hợp không tìm thấy tháng trong map (ví dụ: nếu có tháng tiếng Anh vẫn còn)
            # Có thể thử phân tích lại bằng định dạng tiếng Anh hoặc trả về giá trị mặc định để tránh lỗi
            try:
                # Nếu không phải tháng tiếng Việt, thử phân tích như tháng tiếng Anh
                return datetime.datetime.strptime(item['month'], '%B %Y')
            except ValueError:
                # Nếu vẫn lỗi, trả về một giá trị an toàn để không crash
                return datetime.datetime.min # Giá trị ngày nhỏ nhất
        
        return datetime.datetime(year_num, month_num, 1) # Trả về một đối tượng datetime cho việc sắp xếp

    sorted_filled_stats = sorted(final_stats_map.values(), key=sort_key_by_month_year)
    # --- KẾT THÚC PHẦN THAY ĐỔI ---
    
    return Response(sorted_filled_stats, status=status.HTTP_200_OK)