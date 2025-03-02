from django.db import models

from roles.models import Role

# Create your models here.
class User(models.Model):
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=500)
    role = models.ForeignKey(Role, on_delete= models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True) 
    phone_number = models.CharField(max_length=15, unique=True)
    is_activate = models.BooleanField(default = True)

    def __str__(self) -> str:
        return self.name