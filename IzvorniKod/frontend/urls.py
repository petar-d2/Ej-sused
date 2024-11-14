from django.urls import path
from .views import *

urlpatterns = [
    path("prijava/", prijava.as_view(), name="prijava"),
    path("registracija/", registracija.as_view(), name="registracija"),
    path("dogadaji/", main),
    path("ponude/", main),
    path("napravi-ponudu/", main),
    path('ponude-susjeda/', ponudeSusjedaListView.as_view(), name='ponude_susjeda_list'),
    path('susjed/<int:sifSusjed>/', detaljiSusjedView.as_view(), name='susjed-detail'),
    path("", homeView.as_view()),
    path("odjava/", odjava.as_view(), name="odjava"),
    path("google-login/", googleLogin.as_view(), name="google_login"),
    path("", main),
]