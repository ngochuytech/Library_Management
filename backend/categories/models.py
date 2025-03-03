from django.db import models
from django.forms import CharField

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.name