from django.urls import path
from . import views

urlpatterns = [
    path('api/', views.getAllAuthors),
    path('api/<int:id>', views.getDetailAuthor),
    path('api/delete/<int:id>', views.deleteAuthor),
    path('api/create/', views.createAuthor),
    path('api/update/<int:id>', views.updateAuthor),
]
