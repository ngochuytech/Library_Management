from django.urls import path
from . import views

#now import the views.py file into this code

urlpatterns=[
  path('', views.index, name="index")
]