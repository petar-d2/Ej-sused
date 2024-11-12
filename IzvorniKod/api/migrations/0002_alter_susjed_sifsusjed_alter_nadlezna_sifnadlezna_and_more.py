# Generated by Django 5.1.3 on 2024-11-12 14:40

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="susjed",
            name="sifSusjed",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE,
                primary_key=True,
                related_name="susjed",
                serialize=False,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="nadlezna",
            name="sifNadlezna",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE,
                primary_key=True,
                related_name="nadlezna",
                serialize=False,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="korisnik",
            name="isNadlezna",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="korisnik",
            name="isSusjed",
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name="susjed",
            name="ime",
            field=models.CharField(default="Ime", max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="susjed",
            name="prezime",
            field=models.CharField(default="Prezime", max_length=255),
            preserve_default=False,
        ),
        migrations.DeleteModel(
            name="Osoba",
        ),
    ]