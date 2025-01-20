# Generated by Django 5.1.3 on 2025-01-19 22:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0014_remove_zahtjev_unique_kadzadan_sifsusjed_and_more"),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name="zahtjev",
            name="izvornik_unique_kadZadan_sifSusjed",
        ),
        migrations.AddConstraint(
            model_name="zahtjev",
            constraint=models.UniqueConstraint(
                fields=("sifSusjed", "nazivZahtjev"),
                name="izvornik_unique_nazivZahjev_sifSusjed",
            ),
        ),
    ]
