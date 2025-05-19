import datetime
from django.utils import timezone

from django.db import models

from books.models import Book
from users.models import User

BORROWED_STATUS = (
    ("PENDING", "PENDING"),
    ("APPROVED", "APPROVED"),
    ("BORROWED", "BORROWED"),
    ("OVERDUE", "OVERDUE"),
    ("RETURNED", "RETURNED"),
    ("LOST", "LOST"),
    ("CANCELED", "RETURNED")
)
# 
def default_exp_date():
    return timezone.now() + datetime.timedelta(days=30)
def default_require_date():
    return timezone.now()
# Create your models here.
class Borrow(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    require_date = models.DateTimeField(default=default_require_date)
    borrow_days = models.IntegerField(default=7)
    borrow_date = models.DateTimeField(null=True, blank=True)
    return_date = models.DateTimeField(null=True, blank=True)
    exp_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=255, choices=BORROWED_STATUS,default="PENDING")

    class Meta:
        db_table = 'Borrows'

    def __str__(self) -> str:
        return f"{self.user} - {self.book} ({self.status})"