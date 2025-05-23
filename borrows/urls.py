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
  path('api/delete/<int:id>', views.deleteBorrowWithId, name='cancel-borrow'), # Dành cho user hủy yêu cầu
  path('api/cancel/<int:id>', views.cancelBorrowWithId, name='cancel-borrow'), # Dành cho user hủy yêu cầu
  path('api/check-overdue', views.check_and_notify_overdue, name='check-overdue'),
  path('api/statistics/borrows/current', views.getCurrentlyBorrowedBooksCount, name='currently_borrowed_books_count'),
  path('api/statistics/borrows/monthly', views.getMonthlyBorrowReturnStats, name='monthly_borrow_return_stats'),
  path('api/statistics/books/top_borrowed', views.getTopBorrowedBooksStats, name='top_borrowed_books_stats'),
  path('api/pending-borrows', views.get_pending_borrows, name='pending-borrows'),
]