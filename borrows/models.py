import datetime
from django.utils import timezone

from django.db import models

from books.models import Book
from users.models import User


BORROWED_STATUS = (
    ("Pending", "Pending"),
    ("Approved", "Approved"),
    ("Borrowed", "Borrowed"),
    ("Overdue", "Overdue"),
    ("Returned", "Returned"),
    ("Lost", "Lost"),
    ("Canceled", "Canceled")
)
# 
def default_exp_date():
    return timezone.now() + datetime.timedelta(days=30)

# Create your models here.
class Borrow(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    borrow_date = models.DateTimeField(default=timezone.now)
    return_date = models.DateTimeField(null=True, blank=True)
    exp_date = models.DateTimeField(default=default_exp_date)
    status = models.CharField(max_length=255, choices=BORROWED_STATUS,default="PENDING")

    def __str__(self) -> str:
        return f"{self.user} - {self.book} ({self.status})"