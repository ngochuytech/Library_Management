from django.db import models

# Create your models here.
class Role(models.Model):
    name = models.CharField(max_length=255)
    
    def __str__(self) -> str:
        return self.name