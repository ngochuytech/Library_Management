from django.urls import path
from . import views

urlpatterns = [
    path('api', views.getBook),
    path('api/random/<int:bookId>', views.getRandomBook),
    path('api/create', views.createBook),
    path('api/<int:id>', views.getDetailBook),
    path('api/edit/<int:id>', views.editBookWithId),
    path('api/delete/<int:id>', views.deleteBookWithId),
    path('api/author/<int:author_id>', views.getBooksByAuthor),
    path('api/quote', views.getBookByQuote),
    path('api/search', views.searchBookByName),
    path('api/statistics/books/total', views.getTotalBooksCount, name='total_books_count'),
    path('api/statistics/books/categories', views.getBooksByCategoryStats, name='books_by_category_stats'),
]
