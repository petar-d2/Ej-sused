# Generated by Django 5.1.4 on 2025-01-12 13:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_remove_susjed_ocjena_remove_tvrtka_ocjena_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='susjed',
            name='brojOcjena',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='susjed',
            name='zbrojOcjena',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='tvrtka',
            name='brojOcjena',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='tvrtka',
            name='zbrojOcjena',
            field=models.IntegerField(default=0),
        ),
    ]
