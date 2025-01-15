from rest_framework import serializers
from api.models import Dogadaj, Susjed, Tvrtka, Komentar, Zahtjev

class TvrtkaSerializer(serializers.ModelSerializer):
    
    email = serializers.CharField(source='sifTvrtka.email', read_only=True)
    # Adding a custom field to get the related 'Korisnik' model's id
    korisnik_id = serializers.IntegerField(source='sifTvrtka.id', read_only=True)

    class Meta:
        model = Tvrtka
        fields = ['korisnik_id', 'nazivTvrtka', 'brojOcjena', 'zbrojOcjena', 'email', 'adresaTvrtka', 'kvartTvrtka', 'opisTvrtka', 'mjestoTvrtka']
        depth = 1  # Optional: This can help with nested related fields (like 'email')

class SusjedSerializer(serializers.ModelSerializer):
    
    email = serializers.CharField(source='sifSusjed.email', read_only=True)
    
    korisnik_id = serializers.IntegerField(source='sifSusjed.id', read_only=True)

    class Meta:
        model = Susjed
        fields = ['korisnik_id', 'ime', 'prezime', 'skills', 'brojOcjena', 'zbrojOcjena', 'email', 'bodovi', 'isVolonter', 'mjestoSusjed', 'kvartSusjed', 'opisSusjed']
        depth = 1  # Optional: This can help with nested related fields (like 'email')

class DogadajSerializer(serializers.ModelSerializer):
    # Assuming 'sifVolonter' is a foreign key to 'Komentar' model
    volonter_email = serializers.CharField(source='sifVolonter.email', read_only=True)
    volonter_id = serializers.IntegerField(source='sifVolonter.id', read_only=True)

    class Meta:
        model = Dogadaj
        fields = ['id', 'kadZadano', 'sifVolonter', 'volonter_email', 'volonter_id', 
                  'datumDogadaj', 'vrijemeDogadaj', 'nazivDogadaj', 'adresaDogadaj', 
                  'statusDogadaj', 'vrstaDogadaj', 'opisDogadaj', 'nagradaBod']
        depth = 1  # This can be useful for nested relationships if you want to include related model fields

class KomentarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Komentar
        fields = ['sifKom','textKom','sifPrima','sifDaje']
        depth = 1
class ZahtjevSerializer(serializers.ModelSerializer):
    class Meta:
        model=Zahtjev
        fields= ['id', 'sifSusjed', 'sifIzvrsitelj','sifVrsta', 'statusZahtjev', 'opisZahtjev', 'cijenaBod', 'adresaZahtjev', 'nazivZahtjev']
        depth = 1