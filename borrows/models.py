import datetime
from django.utils import timezone
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from books.models import Book
from users.models import User

BORROWED_STATUS = (
    ("PENDING", "PENDING"),
    ("BORROWED", "BORROWED"),
    ("OVERDUE", "OVERDUE"),
    ("RETURNED", "RETURNED"),
    ("LOST", "LOST"),
    ("CANCELED", "CANCELED")
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
        
    def check_overdue(self):
        """Kiểm tra và cập nhật trạng thái OVERDUE nếu đã quá hạn trả"""
        if (self.status == "BORROWED" and self.exp_date and 
            timezone.now() > self.exp_date and self.return_date is None):
            self.status = "OVERDUE"
            self.save(update_fields=['status'])
            return True
        return False

    def save(self, *args, **kwargs):
        """Override save method để kiểm tra trạng thái OVERDUE khi lưu"""
        if not self.pk:  # Nếu đây là bản ghi mới
            if self.borrow_date and self.borrow_days and not self.exp_date:
                self.exp_date = self.borrow_date + datetime.timedelta(days=self.borrow_days)
        else:  # Nếu đây là bản ghi đã tồn tại
            self.check_overdue()
        
        super().save(*args, **kwargs)


@receiver(post_save, sender=Borrow)
def update_borrow_status(sender, instance, **kwargs):
    """Signal để kiểm tra trạng thái OVERDUE sau khi lưu"""
    instance.check_overdue()


# Tạo một hàm quản lý để cập nhật tất cả các bản ghi quá hạn
def update_all_overdue_borrows():
    """Cập nhật tất cả các bản ghi mượn sách đã quá hạn"""
    borrowed_items = Borrow.objects.filter(
        status="BORROWED", 
        exp_date__lt=timezone.now(),
        return_date__isnull=True
    )
    
    updated_count = 0
    for item in borrowed_items:
        item.status = "OVERDUE"
        item.save(update_fields=['status'])
        updated_count += 1
    
    return updated_count