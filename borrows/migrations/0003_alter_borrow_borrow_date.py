# Generated by Django 5.1.6 on 2025-03-03 16:33

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('borrows', '0002_borrow_borrow_date_borrow_exp_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='borrow',
            name='borrow_date',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
