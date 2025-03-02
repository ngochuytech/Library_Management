from django.db import models

from users.models import User

# Create your models here.
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete= models.CASCADE)
    message = models.TextField()
    date = models.DateTimeField()

    def __str__(self) -> str:
        return self.name