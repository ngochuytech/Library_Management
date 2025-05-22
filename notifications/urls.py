from django.urls import path
from . import views

#now import the views.py file into this code

urlpatterns=[
  path('api', views.getNotification),
  path('api/user/<int:id>', views.getNotificationWithUserId),
  path('api/create', views.createNotification),
  path('api/<int:id>', views.getDetailNotification),
  path('api/delete/<int:id>', views.deleteNotificationWithId),
]