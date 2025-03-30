# Generated by Django 5.1.6 on 2025-03-02 17:54

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0003_alter_book_category'),
        ('categories', '0003_alter_category_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='book',
            name='author',
            field=models.CharField(default='Default author', max_length=255),
        ),
        migrations.AddField(
            model_name='book',
            name='avaliable',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='book',
            name='image',
            field=models.CharField(default='default image', max_length=500),
        ),
        migrations.AddField(
            model_name='book',
            name='quantity',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='book',
            name='title',
            field=models.CharField(default='Default title', max_length=255),
        ),
        migrations.AlterField(
            model_name='book',
            name='category',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='categories.category'),
        ),
    ]
