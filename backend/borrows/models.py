from django.db import models
from django.forms import CharField, DateTimeField

from books.models import Book
from users.models import User

# Create your models here.
class Borrow(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    borrow_date = DateTimeField()
    return_date = DateTimeField()
    exp_date = DateTimeField()
    status = CharField()

    def __str__(self) -> str:
        return self.name