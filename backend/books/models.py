from django.db import models
from django.forms import CharField, IntegerField

from categories.models import Category

# Create your models here.
class Book(models.Model):
    title = CharField(max_length=255)
    author = CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    publication_year = models.DateField()
    quantity = IntegerField()
    avaliable = IntegerField()
    image = CharField(max_length=500)
    description = models.TextField()

    def __str__(self) -> str:
        return self.name   
