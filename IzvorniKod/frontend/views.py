from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from django.contrib.auth import authenticate
from api.models import Korisnik 
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication

def main(request):
    return render(request, "index.html")

class prijava(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(username=email, email=email, password=password)
        if user:
            token = RefreshToken.for_user(user)
            return Response({"access": str(token.access_token), "refresh": str(token)})
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
    def get(self, request):
        return render(request, "index.html")

class registracija(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = Korisnik.objects.filter(email=email)
        if user.exists():
            return Response({'error': 'Email već registriran'}, status=status.HTTP_401_UNAUTHORIZED)
        user = Korisnik.objects.create_user(username=email, email=email, password=password)
        user.save()
        return Response({})

    def get(self, request):
        return render(request, "index.html")

class odjava(APIView):
    def post(self, request):
        try:
            token = RefreshToken(request.data.get('refresh_token'))
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    

def home(request):
    return render(request, "index.html")