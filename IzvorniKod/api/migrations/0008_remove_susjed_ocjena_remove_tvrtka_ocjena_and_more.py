# Generated by Django 5.1.4 on 2025-01-12 11:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_alter_komentar_sifdaje_alter_komentar_sifprima'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='susjed',
            name='ocjena',
        ),
        migrations.RemoveField(
            model_name='tvrtka',
            name='ocjena',
        ),
        migrations.AddField(
            model_name='susjed',
            name='brojOcjena',
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name='susjed',
            name='zbrojOcjena',
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name='tvrtka',
            name='brojOcjena',
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name='tvrtka',
            name='zbrojOcjena',
            field=models.FloatField(default=0),
        ),
    ]
