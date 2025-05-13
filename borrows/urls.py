from django.urls import path
from . import views

urlpatterns=[
  path('api', views.getCreateBorrow),
  path('api/<int:id>', views.getDetailBorrow),
  path('api/create', views.BorrowCreateView.as_view(), name='borrow-create'),
  path('api/edit/<int:id>', views.editBorrowWithId),
  path('api/delete/<int:id>', views.deleteBorrowWithId),

]