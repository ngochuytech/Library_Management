from django.urls import path
from . import views

#now import the views.py file into this code

urlpatterns=[
  path('login', views.LoginClass.as_view()),
  path('register', views.ReigsterClass.as_view()),
  path('forgot-password/', views.ForgotPasswordView.as_view(), name='forgot-password'),
  path('verify-otp/', views.VerifyOTPView.as_view(), name='verify-otp'),
  path('reset-password/', views.ResetPasswordView.as_view(), name='reset-password'),
  path('refresh-token', views.RefreshTokenView.as_view(), name='refresh_token'),
  
  path('api/infor', views.getUser),
  path('api/update/<int:id>', views.updateUserInformation),
  path('api/change-password', views.changePassword),
  path('list/', views.list_users, name='list_users'),
  path('update/<int:id>/', views.update_user, name='update_user'),
  path('delete/<int:id>/', views.delete_user, name='delete_user'),
]