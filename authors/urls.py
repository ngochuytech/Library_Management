from django.urls import path
from . import views

urlpatterns = [
    path('api/<int:id>', views.getDetailAuthor),
]
