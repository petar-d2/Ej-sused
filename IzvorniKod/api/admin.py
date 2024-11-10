from django.contrib import admin
from .models import Korisnik,Tvrtka,Susjed,Nadlezna,Dogadaj,Komentar,PrijavljenNa,Zahtjev,VrstaUsluga,Prihvaca,Ponuda
# Register your models here.
admin.site.register(Korisnik)
admin.site.register(Tvrtka)
admin.site.register(Susjed)
admin.site.register(Nadlezna)
admin.site.register(Dogadaj)
admin.site.register(Komentar)
admin.site.register(PrijavljenNa)
admin.site.register(Zahtjev)
admin.site.register(VrstaUsluga)
admin.site.register(Prihvaca)
admin.site.register(Ponuda)