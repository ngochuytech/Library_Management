from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

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
        my_user = authenticate(username=email, password=password)

        if my_user is None:
            return Response("Login Unsuccessful")
        else:
            return Response("Login Successful!")

class ReigsterClass(APIView):
    def get(self, request):
        return Response("This is register page")
    
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        phone_number = request.data['phone_number']
        if not phone_number:
            return Response("Phone number is required", status=status.HTTP_400_BAD_REQUEST)
        my_user = User.objects.create_user(email=email, password=password, phone_number=phone_number)
        return Response("Register Successful!" if my_user else "Register Unsuccessful")
