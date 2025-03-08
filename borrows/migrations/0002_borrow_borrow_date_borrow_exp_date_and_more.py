# Generated by Django 5.1.6 on 2025-03-03 16:26

import borrows.models
import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('borrows', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='borrow',
            name='borrow_date',
            field=models.DateTimeField(default=datetime.date.today),
        ),
        migrations.AddField(
            model_name='borrow',
            name='exp_date',
            field=models.DateTimeField(default=borrows.models.default_exp_date),
        ),
        migrations.AddField(
            model_name='borrow',
            name='return_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='borrow',
            name='status',
            field=models.CharField(default='PENDING', max_length=255),
        ),
    ]
