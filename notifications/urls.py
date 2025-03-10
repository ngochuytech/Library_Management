from django.urls import path
from . import views

#now import the views.py file into this code

urlpatterns=[
  path('api/', views.getCreateNotification),
  path('api/<int:id>', views.getDetailNotification),
  path('api/delete/<int:id>', views.deleteNotificationWithId),
]