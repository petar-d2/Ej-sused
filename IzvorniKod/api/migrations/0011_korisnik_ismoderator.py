# Generated by Django 5.1.2 on 2025-01-16 19:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_remove_zahtjev_unique_kadzadan_sifsusjed_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='korisnik',
            name='isModerator',
            field=models.BooleanField(default=False),
        ),
    ]
