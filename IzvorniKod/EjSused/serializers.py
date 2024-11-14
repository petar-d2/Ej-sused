from rest_framework import serializers
from api.models import Susjed

class SusjedSerializer(serializers.ModelSerializer):
    
    email = serializers.CharField(source='sifSusjed.email', read_only=True)
    # Adding a custom field to get the related 'Korisnik' model's id
    korisnik_id = serializers.IntegerField(source='sifSusjed.id', read_only=True)

    class Meta:
        model = Susjed
        fields = ['korisnik_id', 'ime', 'prezime', 'skills', 'ocjena', 'email', 'bodovi', 'isVolonter', 'mjestoSusjed', 'kvartSusjed', 'opisSusjed']
        depth = 1  # Optional: This can help with nested related fields (like 'email')