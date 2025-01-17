from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class Korisnik(AbstractUser):
    isTvrtka = models.BooleanField(default=False)
    isSusjed = models.BooleanField(default=True)
    isNadlezna = models.BooleanField(default=False)
    isModerator = models.BooleanField(default=False)

    def __str__(self):
        return self.email

class Tvrtka(models.Model):
    nazivTvrtka = models.CharField(max_length=255)
    adresaTvrtka = models.CharField(max_length=255)
    kvartTvrtka = models.CharField(max_length=255)
    mjestoTvrtka = models.CharField(max_length=255)
    opisTvrtka = models.CharField(max_length=4095, null=True)
    brojOcjena = models.IntegerField(default=0)
    zbrojOcjena = models.IntegerField(default=0)

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
    mjestoSusjed = models.CharField(max_length=255)
    kvartSusjed = models.CharField(max_length=255)
    opisSusjed = models.CharField(max_length=4095, null=True)
    ime = models.CharField(max_length=255)
    prezime = models.CharField(max_length=255)
    brojOcjena = models.IntegerField(default=0)
    zbrojOcjena = models.IntegerField(default=0)
    skills = models.TextField(default="")
    
    sifSusjed = models.OneToOneField(
        Korisnik,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="susjed"
    )

    def __str__(self):
        return f"{self.ime} {self.prezime}"


class Nadlezna(models.Model):
    isAdmin = models.BooleanField(default=False)

    sifNadlezna = models.OneToOneField(
        Korisnik,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="nadlezna"
    )

    def __str__(self):
        return self.sifNadlezna
    
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

    """djangov ORM ne podrzava kompozitne ključeve pa to moramo rijesiti
    negdje drugdje, za sada samo moraju biti unique ova dva atributa
    primarni ključ je id koji django izgenerira"""
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['sifVolonter', 'kadZadano'], name='unique_volonter_event')
        ]

    def __str__(self):
        return f"Dogadaj {self.nazivDogadaj} - {self.datumDogadaj}"
    

class Komentar(models.Model):
    sifKom = models.AutoField(primary_key=True)
    ##sifKom = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    textKom = models.CharField(max_length=2047)
    sifPrima = models.ForeignKey(Tvrtka, on_delete=models.CASCADE)
    sifDaje = models.ForeignKey(Korisnik, on_delete=models.CASCADE)

    def __str__(self):
        return f"Komentar {self.sifKom}"
    

class PrijavljenNa(models.Model):
    """ovdje će isto biti generiran id, kompozitni strani ključ treba
    drukcije napraviti"""
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

class Zahtjev(models.Model):
    cijenaBod = models.IntegerField()
    nazivZahtjev = models.CharField(max_length=255)  
    adresaZahtjev = models.CharField(max_length=255) 
    statusZahtjev = models.CharField(max_length=255)  
    opisZahtjev = models.CharField(max_length=2047, null=True)  
    
    sifSusjed = models.ForeignKey('Susjed', on_delete=models.CASCADE)
    sifVrsta = models.TextField(default="")
    sifIzvrsitelj = models.ForeignKey('Susjed', on_delete=models.CASCADE, related_name='izvrsitelj_set', null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['sifSusjed'], name='unique_kadZadan_sifSusjed')
        ]

    def __str__(self):
        return f"Zahtjev {self.nazivZahtjev} - ({self.sifSusjed})"
    

class VrstaUsluga(models.Model):
    sifVrsta = models.IntegerField(primary_key=True)
    nazivVrsta = models.CharField(max_length=255)

    def __str__(self):
        return self.nazivVrsta
    
class JeSposoban(models.Model):
    sifSusjed = models.ForeignKey('Susjed', on_delete=models.CASCADE)
    sifVrsta = models.ForeignKey('VrstaUsluga', on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['sifSusjed', 'sifVrsta'], name='unique_susjed_vrsta')
        ]

    def __str__(self):
        return f"JeSposoban - Susjed: {self.sifSusjed}, Vrsta: {self.sifVrsta}"

class Prihvaca(models.Model):
    ocjenaPonuda = models.IntegerField()
    sifSusjed = models.ForeignKey('Susjed', on_delete=models.CASCADE)
    kadZadano = models.DateTimeField()
    sifTvrtka = models.ForeignKey('Tvrtka', on_delete=models.CASCADE)

    class Meta:[
            models.UniqueConstraint(fields=['sifSusjed', 'kadZadano', 'sifTvrtka'], name='unique_susjed_kadZadano_tvrtka')
        ]

    def __str__(self):
        return f"Prihvaca - Susjed: {self.sifSusjed}, KadZadano: {self.kadZadano}, Tvrtka: {self.sifTvrtka}"
class Ponuda(models.Model):
    kadZadano = models.CharField(max_length=255)
    cijenaNovac = models.FloatField(null=True, blank=True)
    nazivPonuda = models.CharField(max_length=255)
    isAktivna = models.BooleanField()
    opisPonuda = models.CharField(max_length=2048, null=True, blank=True)
    sifTvrtka = models.ForeignKey('Tvrtka', on_delete=models.CASCADE)
    sifVrsta = models.TextField(default="")
    #sifVrsta = models.ForeignKey('VrstaUsluga', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['kadZadano', 'sifTvrtka'], name='unique_kadZadano_sifTvrtka')
        ]

    def __str__(self):
        return f"Ponuda {self.nazivPonuda} - {self.kadZadano}"