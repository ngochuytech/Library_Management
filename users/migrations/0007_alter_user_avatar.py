# Generated by Django 5.1.6 on 2025-03-30 13:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_user_avatar'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=models.ImageField(default='icon.png', upload_to=''),
        ),
    ]
