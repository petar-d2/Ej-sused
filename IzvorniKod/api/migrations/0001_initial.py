# Generated by Django 5.1.3 on 2024-11-08 16:05

import django.contrib.auth.models
import django.contrib.auth.validators
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="Korisnik",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("password", models.CharField(max_length=128, verbose_name="password")),
                (
                    "last_login",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="last login"
                    ),
                ),
                (
                    "is_superuser",
                    models.BooleanField(
                        default=False,
                        help_text="Designates that this user has all permissions without explicitly assigning them.",
                        verbose_name="superuser status",
                    ),
                ),
                (
                    "username",
                    models.CharField(
                        error_messages={
                            "unique": "A user with that username already exists."
                        },
                        help_text="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.",
                        max_length=150,
                        unique=True,
                        validators=[
                            django.contrib.auth.validators.UnicodeUsernameValidator()
                        ],
                        verbose_name="username",
                    ),
                ),
                (
                    "first_name",
                    models.CharField(
                        blank=True, max_length=150, verbose_name="first name"
                    ),
                ),
                (
                    "last_name",
                    models.CharField(
                        blank=True, max_length=150, verbose_name="last name"
                    ),
                ),
                (
                    "email",
                    models.EmailField(
                        blank=True, max_length=254, verbose_name="email address"
                    ),
                ),
                (
                    "is_staff",
                    models.BooleanField(
                        default=False,
                        help_text="Designates whether the user can log into this admin site.",
                        verbose_name="staff status",
                    ),
                ),
                (
                    "is_active",
                    models.BooleanField(
                        default=True,
                        help_text="Designates whether this user should be treated as active. Unselect this instead of deleting accounts.",
                        verbose_name="active",
                    ),
                ),
                (
                    "date_joined",
                    models.DateTimeField(
                        default=django.utils.timezone.now, verbose_name="date joined"
                    ),
                ),
                ("isTvrtka", models.BooleanField(default=False)),
                (
                    "groups",
                    models.ManyToManyField(
                        blank=True,
                        help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.group",
                        verbose_name="groups",
                    ),
                ),
                (
                    "user_permissions",
                    models.ManyToManyField(
                        blank=True,
                        help_text="Specific permissions for this user.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.permission",
                        verbose_name="user permissions",
                    ),
                ),
            ],
            options={
                "verbose_name": "user",
                "verbose_name_plural": "users",
                "abstract": False,
            },
            managers=[
                ("objects", django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name="Dogadaj",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("kadZadano", models.IntegerField()),
                ("datumDogadaj", models.DateField()),
                ("vrijemeDogadaj", models.TimeField()),
                ("nazivDogadaj", models.CharField(max_length=255)),
                ("adresaDogadaj", models.CharField(max_length=255)),
                ("statusDogadaj", models.CharField(max_length=255)),
                ("vrstaDogadaj", models.CharField(max_length=255)),
                ("opisDogadaj", models.CharField(max_length=2047, null=True)),
                ("nagradaBod", models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name="PrijavljenNa",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("isNagraden", models.BooleanField(default=False)),
                ("kadZadano", models.IntegerField()),
                ("sifVolonter", models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name="VrstaUsluga",
            fields=[
                ("sifVrsta", models.IntegerField(primary_key=True, serialize=False)),
                ("nazivVrsta", models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name="Osoba",
            fields=[
                ("ime", models.CharField(max_length=255)),
                ("prezime", models.CharField(max_length=255)),
                ("isNadlezna", models.BooleanField(default=False)),
                (
                    "sifOsoba",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        primary_key=True,
                        related_name="osoba",
                        serialize=False,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Tvrtka",
            fields=[
                ("nazivTvrtka", models.CharField(max_length=255)),
                ("adresaTvrtka", models.CharField(max_length=255)),
                ("kvartTvrtka", models.CharField(max_length=255)),
                ("mjestoTvrtka", models.CharField(max_length=255)),
                ("opisTvrtka", models.CharField(max_length=4095, null=True)),
                (
                    "sifTvrtka",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        primary_key=True,
                        related_name="tvrtka",
                        serialize=False,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Komentar",
            fields=[
                ("sifKom", models.AutoField(primary_key=True, serialize=False)),
                ("textKom", models.CharField(max_length=2047)),
                (
                    "sifDaje",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.dogadaj"
                    ),
                ),
                (
                    "sifPrima",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="dogadaj",
            name="sifVolonter",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="api.komentar"
            ),
        ),
        migrations.CreateModel(
            name="JeSposoban",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "sifVrsta",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.vrstausluga",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Zahtjev",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("cijenaBod", models.IntegerField()),
                ("kadZadan", models.DateTimeField()),
                ("nazivZahtjev", models.CharField(max_length=255)),
                ("adresaZahtjev", models.CharField(max_length=255)),
                ("statusZahtjev", models.CharField(max_length=255)),
                ("opisZahtjev", models.CharField(max_length=2047, null=True)),
                ("ocjenaIzvrsitelj", models.IntegerField(blank=True, null=True)),
                (
                    "sifVrsta",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.vrstausluga",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Nadlezna",
            fields=[
                ("isAdmin", models.BooleanField(default=False)),
                (
                    "sifNadlezna",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        primary_key=True,
                        related_name="nadlezna_osoba",
                        serialize=False,
                        to="api.osoba",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Susjed",
            fields=[
                ("bodovi", models.PositiveSmallIntegerField(default=5)),
                ("isVolonter", models.BooleanField(default=False)),
                ("mjestoSusjed", models.CharField(max_length=255)),
                ("kvartSusjed", models.CharField(max_length=255)),
                ("opisSusjed", models.CharField(max_length=4095, null=True)),
                (
                    "sifSusjed",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        primary_key=True,
                        related_name="susjed_osoba",
                        serialize=False,
                        to="api.osoba",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Prihvaca",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("ocjenaPonuda", models.IntegerField()),
                ("kadZadano", models.DateTimeField()),
                (
                    "sifTvrtka",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.tvrtka"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Ponuda",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("kadZadano", models.DateTimeField()),
                ("cijenaNovac", models.FloatField(blank=True, null=True)),
                ("nazivPonuda", models.CharField(max_length=255)),
                ("isAktivna", models.BooleanField()),
                (
                    "opisPonuda",
                    models.CharField(blank=True, max_length=2048, null=True),
                ),
                (
                    "sifVrsta",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="api.vrstausluga",
                    ),
                ),
                (
                    "sifTvrtka",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.tvrtka"
                    ),
                ),
            ],
        ),
        migrations.AddConstraint(
            model_name="dogadaj",
            constraint=models.UniqueConstraint(
                fields=("sifVolonter", "kadZadano"), name="unique_volonter_event"
            ),
        ),
        migrations.AddField(
            model_name="zahtjev",
            name="sifIzvrsitelj",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="izvrsitelj_set",
                to="api.susjed",
            ),
        ),
        migrations.AddField(
            model_name="zahtjev",
            name="sifSusjed",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="api.susjed"
            ),
        ),
        migrations.AddField(
            model_name="prijavljenna",
            name="sifSusjed",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="api.susjed"
            ),
        ),
        migrations.AddField(
            model_name="prihvaca",
            name="sifSusjed",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="api.susjed"
            ),
        ),
        migrations.AddField(
            model_name="jesposoban",
            name="sifSusjed",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="api.susjed"
            ),
        ),
        migrations.AddConstraint(
            model_name="ponuda",
            constraint=models.UniqueConstraint(
                fields=("kadZadano", "sifTvrtka"), name="unique_kadZadano_sifTvrtka"
            ),
        ),
        migrations.AddConstraint(
            model_name="zahtjev",
            constraint=models.UniqueConstraint(
                fields=("kadZadan", "sifSusjed"), name="unique_kadZadan_sifSusjed"
            ),
        ),
        migrations.AddConstraint(
            model_name="prijavljenna",
            constraint=models.UniqueConstraint(
                fields=("sifSusjed", "kadZadano", "sifVolonter"),
                name="unique_prijavljen_na",
            ),
        ),
        migrations.AddConstraint(
            model_name="jesposoban",
            constraint=models.UniqueConstraint(
                fields=("sifSusjed", "sifVrsta"), name="unique_susjed_vrsta"
            ),
        ),
    ]
