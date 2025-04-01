from django.urls import path
from . import views

#now import the views.py file into this code

urlpatterns=[
  path('login', views.LoginClass.as_view()),
  path('register', views.ReigsterClass.as_view()),
  path('forgot-password/', views.ForgotPasswordView.as_view(), name='forgot-password'),
  path('verify-otp/', views.VerifyOTPView.as_view(), name='verify-otp'),
  path('reset-password/', views.ResetPasswordView.as_view(), name='reset-password'),
  
]