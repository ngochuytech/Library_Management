# Generated by Django 5.1.7 on 2025-05-18 17:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0008_book_preview_alter_book_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='book',
            name='image',
            field=models.ImageField(default='Default.jpg', upload_to=''),
        ),
    ]
