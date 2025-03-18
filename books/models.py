from django.db import models

from categories.models import Category

# Create your models here.
class Book(models.Model):
    title = models.CharField(max_length=255, default="Default title")
    author = models.CharField(max_length=255, default="Default author")
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    publication_year = models.DateField()
    quantity = models.IntegerField(default=0)
    avaliable = models.IntegerField(default=0)
    image = models.CharField(max_length=500, default="default image")
    description = models.TextField()
    
    class Meta:
        db_table = 'Books'

    def __str__(self) -> str:
        return self.title   