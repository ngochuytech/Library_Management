# Generated by Django 5.1.6 on 2025-03-18 13:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0004_book_author_book_avaliable_book_image_book_quantity_and_more'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='book',
            table='Books',
        ),
    ]
