# Generated by Django 5.1.6 on 2025-03-01 08:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('categories', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='name',
            field=models.CharField(default='Default category', max_length=255),
        ),
    ]
