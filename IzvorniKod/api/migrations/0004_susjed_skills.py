# Generated by Django 5.1.3 on 2024-11-13 13:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_susjed_ocjena_tvrtka_ocjena'),
    ]

    operations = [
        migrations.AddField(
            model_name='susjed',
            name='skills',
            field=models.TextField(default=''),
        ),
    ]
