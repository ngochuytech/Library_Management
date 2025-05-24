from django.db import models

from authors.models import Author
from categories.models import Category

class Book(models.Model):
    title = models.CharField(max_length=255, default="Default title")
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    category = models.ManyToManyField(Category)
    publication_date = models.DateField()
    quantity = models.IntegerField() 
    avaliable = models.IntegerField(default=0) 

    rating = models.FloatField(default=5.0)
    image = models.ImageField(default="Default.jpg")
    description = models.TextField(default="")
    preview = models.TextField(default="")

    class Meta:
        db_table = 'Books'

    def save(self, *args, **kwargs):
        # Nếu là tạo mới (chưa có pk) hoặc avaliable chưa được set, thì gán bằng quantity
        if self._state.adding or self.avaliable == 0:
            self.avaliable = self.quantity
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.title