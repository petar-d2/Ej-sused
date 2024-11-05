from django.contrib import admin
from .models import Korisnik,Osoba,Tvrtka,Susjed,Nadlezna
# Register your models here.
admin.site.register(Korisnik)
admin.site.register(Osoba)
admin.site.register(Tvrtka)
admin.site.register(Susjed)
admin.site.register(Nadlezna)