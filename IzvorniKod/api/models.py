from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class Korisnik(AbstractUser):
    isTvrtka = models.BooleanField(default=False)

    def __str__(self):
        return self.email

class Osoba(models.Model):
    ime = models.CharField(max_length=50)
    prezime = models.CharField(max_length=50)
    isNadlezna = models.BooleanField(default=False)

    sifOsoba = models.OneToOneField(
        Korisnik,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="osoba"
    )
     
    def __str__(self):
        return f"{self.ime} {self.prezime}"
     
class Tvrtka(models.Model):
    nazivTvrtka = models.CharField(max_length=50)
    adresaTvrtka = models.CharField(max_length=50)
    kvartTvrtka = models.CharField(max_length=50)
    mjestoTvrtka = models.CharField(max_length=50)
    opisTvrtka = models.CharField(max_length=300, null=True)

    sifTvrtka = models.OneToOneField(
        Korisnik,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="tvrtka"
    )

    def __str__(self):
        return self.nazivTvrtka

class Susjed(models.Model):
    bodovi = models.PositiveSmallIntegerField(default=5) 
    isVolonter = models.BooleanField(default=False)
    mjestoSusjed = models.CharField(max_length=50)
    kvartSusjed = models.CharField(max_length=50)
    opisSusjed = models.CharField(max_length=300, null=True)

    sifSusjed = models.OneToOneField(
        Osoba,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="susjed_osoba"
    )

    def __str__(self):
        return self.sifSusjed


class Nadlezna(models.Model):
    isAdmin = models.BooleanField(default=False)

    sifNadlezna = models.OneToOneField(
        Osoba,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="nadlezna_osoba"
    )

    def __str__(self):
        return self.sifNadlezna