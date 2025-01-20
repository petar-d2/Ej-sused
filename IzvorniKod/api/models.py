from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

# Custom User model
class Korisnik(AbstractUser):
    isTvrtka = models.BooleanField(default=False)
    isSusjed = models.BooleanField(default=True)
    isNadlezna = models.BooleanField(default=False)
    isModerator = models.BooleanField(default=False)

    def __str__(self):
        return self.email


# Tvrtka model (Company)
class Tvrtka(models.Model):
    nazivTvrtka = models.CharField(max_length=255)
    adresaTvrtka = models.CharField(max_length=255)
    kvartTvrtka = models.CharField(max_length=255)
    mjestoTvrtka = models.CharField(max_length=255)
    opisTvrtka = models.CharField(max_length=4095, null=True)
    brojOcjena = models.IntegerField(default=0)
    zbrojOcjena = models.IntegerField(default=0)

    sifTvrtka = models.OneToOneField(
        settings.AUTH_USER_MODEL,  # Reference to the custom user model
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="tvrtka_account"  # Ensure unique related_name
    )

    def __str__(self):
        return self.nazivTvrtka


# Susjed model (Neighbor)
class Susjed(models.Model):
    bodovi = models.PositiveSmallIntegerField(default=5)
    isVolonter = models.BooleanField(default=False)
    mjestoSusjed = models.CharField(max_length=255)
    kvartSusjed = models.CharField(max_length=255)
    opisSusjed = models.CharField(max_length=4095, null=True)
    ime = models.CharField(max_length=255)
    prezime = models.CharField(max_length=255)
    brojOcjena = models.IntegerField(default=0)
    zbrojOcjena = models.IntegerField(default=0)
    skills = models.TextField(default="")

    sifSusjed = models.OneToOneField(
        settings.AUTH_USER_MODEL,  # Reference to the custom user model
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="susjed_account"  # Ensure unique related_name
    )

    def __str__(self):
        return f"{self.ime} {self.prezime}"


# Nadlezna model (Responsible entity)
class Nadlezna(models.Model):
    isAdmin = models.BooleanField(default=False)

    sifNadlezna = models.OneToOneField(
        settings.AUTH_USER_MODEL,  # Reference to the custom user model
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="nadlezna_account"  # Ensure unique related_name
    )

    def __str__(self):
        return self.sifNadlezna


# Dogadaj model (Event)
class Dogadaj(models.Model):
    kadZadano = models.CharField(max_length=255)
    sifVolonter = models.IntegerField()
    datumDogadaj = models.DateField()
    vrijemeDogadaj = models.TimeField()
    nazivDogadaj = models.CharField(max_length=255)
    adresaDogadaj = models.CharField(max_length=255)
    statusDogadaj = models.CharField(max_length=255)
    vrstaDogadaj = models.CharField(max_length=255)
    opisDogadaj = models.CharField(max_length=2047, null=True)
    nagradaBod = models.IntegerField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['sifVolonter', 'kadZadano'], name='unique_volonter_event')
        ]

    def __str__(self):
        return f"Dogadaj {self.nazivDogadaj} - {self.datumDogadaj}"


# Komentar model (Comment)
class Komentar(models.Model):
    sifKom = models.AutoField(primary_key=True)
    textKom = models.CharField(max_length=2047)
    sifPrima = models.ForeignKey(Tvrtka, on_delete=models.CASCADE)
    sifDaje = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Reference to custom user model

    def __str__(self):
        return f"Komentar {self.sifKom}"


# PrijavljenNa model (Volunteer registration)
class PrijavljenNa(models.Model):
    isNagraden = models.BooleanField(default=False)
    sifSusjed = models.ForeignKey('Susjed', on_delete=models.CASCADE)
    kadZadano = models.IntegerField()
    sifVolonter = models.IntegerField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['sifSusjed', 'kadZadano', 'sifVolonter'], name='unique_prijavljen_na')
        ]

    def __str__(self):
        return f"PrijavljenNa {self.sifSusjed} - {self.kadZadano} - {self.sifVolonter}"


# Zahtjev model (Request)
class Zahtjev(models.Model):
    cijenaBod = models.IntegerField()
    nazivZahtjev = models.CharField(max_length=255)
    adresaZahtjev = models.CharField(max_length=255)
    statusZahtjev = models.CharField(max_length=255)
    opisZahtjev = models.CharField(max_length=2047, null=True)

    sifSusjed =  models.IntegerField()
    sifVrsta = models.TextField(default="")
    sifIzvrsitelj =  models.IntegerField(default=-1)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['sifSusjed', 'nazivZahtjev'], name='izvornik_unique_nazivZahjev_sifSusjed')  # Updated name
        ]

    def __str__(self):
        return f"Zahtjev {self.nazivZahtjev} - ({self.sifSusjed})"


# VrstaUsluga model (Service type)
class VrstaUsluga(models.Model):
    sifVrsta = models.IntegerField(primary_key=True)
    nazivVrsta = models.CharField(max_length=255)

    def __str__(self):
        return self.nazivVrsta


# JeSposoban model (Is capable)
class JeSposoban(models.Model):
    sifSusjed = models.ForeignKey('Susjed', on_delete=models.CASCADE)
    sifVrsta = models.ForeignKey('VrstaUsluga', on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['sifSusjed', 'sifVrsta'], name='unique_susjed_vrsta')
        ]

    def __str__(self):
        return f"JeSposoban - Susjed: {self.sifSusjed}, Vrsta: {self.sifVrsta}"


# Prihvaca model (Acceptance)
class Prihvaca(models.Model):
    ocjenaPonuda = models.IntegerField()
    sifSusjed = models.ForeignKey('Susjed', on_delete=models.CASCADE)
    kadZadano = models.DateTimeField()
    sifTvrtka = models.ForeignKey('Tvrtka', on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['sifSusjed', 'kadZadano', 'sifTvrtka'], name='unique_susjed_kadZadano_tvrtka')
        ]

    def __str__(self):
        return f"Prihvaca - Susjed: {self.sifSusjed}, KadZadano: {self.kadZadano}, Tvrtka: {self.sifTvrtka}"


# Ponuda model (Offer)
class Ponuda(models.Model):
    kadZadano = models.CharField(max_length=255)
    cijenaNovac = models.FloatField(null=True, blank=True)
    nazivPonuda = models.CharField(max_length=255)
    isAktivna = models.BooleanField()
    opisPonuda = models.CharField(max_length=2048, null=True, blank=True)
    sifTvrtka = models.ForeignKey('Tvrtka', on_delete=models.CASCADE)
    sifVrsta = models.TextField(default="")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['kadZadano', 'sifTvrtka'], name='unique_kadZadano_sifTvrtka')
        ]

    def __str__(self):
        return f"Ponuda {self.nazivPonuda} - {self.kadZadano}"
