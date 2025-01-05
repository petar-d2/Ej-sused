from django.urls import path
from .views import *

urlpatterns = [
    path("prijava/", prijava.as_view(), name="prijava"),
    path("registracija/", registracija.as_view(), name="registracija"),
    path("dogadaji/", dogadajiListView.as_view(), name='dogadaji'),
    path("tvrtke/", tvrtkeListView.as_view(), name='tvrtke_list'),
    path("napravi-ponudu/", main),
    path('ponude-susjeda/', ponudeSusjedaListView.as_view(), name='ponude_susjeda_list'),
    path('susjed/<int:sifSusjed>/', detaljiSusjedView.as_view(), name='susjed-detail'),
    path('tvrtka/<int:sifTvrtka>/', detaljiTvrtkaView.as_view(), name='tvrtka-detail'),
    path("home/", homeView.as_view()),
    path("odjava/", odjava.as_view(), name="odjava"),
    path("google-login/", googleLogin.as_view(), name="google_login"),
    path("search/", searchSortView.as_view(), name='search'),
    path("", main),
]