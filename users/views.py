from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken 
from rest_framework.exceptions import AuthenticationFailed
from users.serializers import UserSerializer
from users.models import User

# Create your views here.

def index(request):
    return Response("This is the Users index")

class LoginClass(APIView):
    def get(self, request):
        return Response("This is login page")
    
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        # my_user = authenticate(username=email, password=password)
        my_user = User.objects.filter(email=email).first()
        if my_user and my_user.check_password(password):
            refresh = RefreshToken.for_user(my_user)
            access_token = str(refresh.access_token)
            user = get_user_from_token(access_token)
            userSerializer = UserSerializer(user, many=False)
            return Response({"access_token": access_token, "user": userSerializer.data})
        else:
            return Response({"detail": "Invalid credentials"}, status=400)

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