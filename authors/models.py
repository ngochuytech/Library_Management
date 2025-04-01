from django.db import models

# Create your models here.
class Author(models.Model):
    name = models.CharField(max_length=255)
    jobs = models.CharField(max_length=255)
    avatar = models.ImageField(default="icon.png")
    biography = models.TextField()

    class Meta:
        db_table = 'Authors'
        
    def __str__(self) -> str:
        return self.name
