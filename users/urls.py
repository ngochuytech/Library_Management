from django.urls import path
from . import views

#now import the views.py file into this code

urlpatterns=[
  path('login', views.LoginClass.as_view()),
  path('register', views.ReigsterClass.as_view()),

]