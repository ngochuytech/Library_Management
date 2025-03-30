from django.urls import path
from . import views

#now import the views.py file into this code

urlpatterns=[
  path('api', views.getCreateBorrow),
  path('api/<int:id>', views.getDetailBorrow),
  path('api/create', views.createBorrow),
  path('api/edit/<int:id>', views.editBorrowWithId),
  path('api/delete/<int:id>', views.deleteBorrowWithId),

]