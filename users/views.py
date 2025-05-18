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

        data = {}
        if name is not None and not name.strip():
            return Response({
                "error": "Tên không được để trống"
            }, status=status.HTTP_400_BAD_REQUEST)

        if phone_number is not None and not phone_number.strip():
            raise InvalidPhoneNumberException("Số điện thoại không được để trống")
        
        data['name'] = name
        data['phone_number'] = phone_number

        serializer = UserSerializer(instance=user, data=data, partial=True)
        if not serializer.is_valid():
            print("serializer.errors = ", serializer.errors)
            raise InvalidPhoneNumberException(serializer.errors)
        
        user.name = name
        user.phone_number = phone_number
        user.save()
        serializer = UserSerializer(user)
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

