from django.urls import path
from . import views

urlpatterns=[
  path('api', views.getCreateBorrow),
  path('api/admin/all', views.get_admin_borrows_list, name='admin-borrows-list'), # URL mới cho admin
  path('api/<int:id>', views.getDetailBorrow),
  path('api/create', views.BorrowCreateView.as_view(), name='borrow-create'), # Dành cho user tạo yêu cầu
  path('api/edit/<int:id>', views.editBorrowWithId), # Dùng để admin duyệt/từ chối
  path('api/delete/<int:id>', views.deleteBorrowWithId),
  path('api/user/<int:user_id>', views.getBorrowsByUserId, name='get-borrows-by-user-id'),
]