from django.urls import path
from .views import *

urlpatterns = [
    path("prijava/", prijava.as_view(), name="prijava"),
    path("registracija/", registracija.as_view(), name="registracija"),
    path("dogadaji/", dogadajiListView.as_view(), name='dogadaji'),
    path("moji-dogadaji/<int:sifVolonter>/", mojiDogadajiListView.as_view(), name='moji-dogadaji'),
    path("kreiraj-dogadaj/", createDogadajView.as_view(), name='kreiraj-dogadaj'),
    path("tvrtke/", tvrtkeListView.as_view(), name='tvrtke_list'),
    path("napravi-ponudu/", main),
    path('ponude-susjeda/', ponudeSusjedaListView.as_view(), name='ponude_susjeda_list'),
    path('susjed/<int:sifSusjed>/', detaljiSusjedView.as_view(), name='susjed-detail'),
    path('tvrtka/<int:sifTvrtka>/', detaljiTvrtkaView.as_view(), name='tvrtka-detail'),
    path('dogadaj/<int:sifDogadaj>/', detaljiDogadajView.as_view(), name='dogadaj-detail'),
    path("home/", homeView.as_view()),
    path("odjava/", odjava.as_view(), name="odjava"),
    path("google-login/", googleLogin.as_view(), name="google_login"),
    path("search/", searchSortView.as_view(), name='search'),
    path("user-info/", userInfo.as_view(), name='user-info'),
    path("user-edit/", userEdit.as_view(), name='user-edit'),
    path("napravi-zahtjev/", napraviZahtjevView.as_view(), name="napravi-zahtjev"),
    path("unesi-komentar/", unesiKomentarView.as_view(), name="unesi-komentar"),
    path("ocjena-edit/", ocjenaEdit.as_view(), name='ocjena-edit'),
    path("", main),
]