from django.db import models

from authors.models import Author
from categories.models import Category

# Create your models here.
class Book(models.Model):
    title = models.CharField(max_length=255, default="Default title")
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    category = models.ManyToManyField(Category)
    publication_date = models.DateField()
    quantity = models.IntegerField(default=0)
    avaliable = models.IntegerField(default=0)
    rating = models.FloatField(default=5.0)
    image = models.ImageField(default="Default.png")
    description = models.TextField(default="")
    preview = models.TextField(default="")
    class Meta:
        db_table = 'Books'

    def __str__(self) -> str:
        return self.title   