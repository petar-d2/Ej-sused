from django.urls import path
from .views import *

urlpatterns = [
    path("prijava/", main),
    path("registracija/", main),
    path("dogadaji/", main),
    path("ponude/", main),
    path("napravi-ponudu/", main),
    path("", main),
]