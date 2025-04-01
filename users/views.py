from django.contrib.auth import authenticate, get_user_model
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.core.mail import send_mail
from django.conf import settings
import random
import string
import datetime
from django.utils.crypto import get_random_string

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
        my_user = authenticate(username=email, password=password)

        if my_user is None:
            return Response("Login Unsuccessful")
        else:
            return Response("Login Successful!")

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