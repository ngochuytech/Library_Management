from django.urls import path
from . import views

urlpatterns = [
    path('api/', views.getCreateCategory),
    path('api/<str:name>', views.getDetailCategory),
    path('api/edit/<int:id>', views.editCategoryWithId),
    path('api/delete/<int:id>', views.deleteCategoryWithId)
]
