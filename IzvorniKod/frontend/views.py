from EjSused.serializers import SusjedSerializer, TvrtkaSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from api.models import Korisnik, Susjed, Tvrtka
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password  # Import password hasher
import requests
from django.shortcuts import render, redirect


# Render the main page
def main(request):
    return render(request, "index.html")


# Traditional login using username/email and password
class prijava(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        # Authenticate user via Django's built-in authenticate method
        user = authenticate(username=email, password=password)

        if user:
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
    def get(self, request):
        return render(request, "index.html")
    
#registracija handlanje - izrada u bazi susjeda i tvrtki
class registracija(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        adresa = request.data.get('adresa')
        kvart = request.data.get('kvart')
        isSusjed = request.data.get('isSusjed', False)
        isTvrtka = request.data.get('isTvrtka', False)
        isNadlezna = request.data.get('isNadlezna', False)
        ocjena = request.data.get('ocjena', 0.0)

        # New fields for Tvrtka registration
        nazivTvrtka = request.data.get('nazivTvrtka', '')
        mjestoTvrtka = request.data.get('mjestoTvrtka', '')
        opisTvrtka = request.data.get('opisTvrtka', '')

        # New fields for Susjed registration
        ime = request.data.get('ime', '')
        prezime = request.data.get('prezime', '')
        isVolonter = request.data.get('isVolonter', False)
        mjestoSusjed = request.data.get('mjestoSusjed', '')
        opisSusjed = request.data.get('opisSusjed', '')
        skills = request.data.get('skills', [])

        # Check if email already exists
        if Korisnik.objects.filter(email=email).exists():
            return Response({'error': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the user with hashed password and role attributes (minimal fields for Korisnik)
        user = Korisnik.objects.create(
            username=email,
            email=email,
            password=make_password(password),  # Hashed password
            isSusjed=isSusjed,
            isTvrtka=isTvrtka,
            isNadlezna=isNadlezna
        )
        user.save() 
        # If user is registering as Susjed, set additional fields in Susjed instance, but not in Korisnik
        if isSusjed:
            
            # Create Susjed instance
            susjed = Susjed.objects.create(
                bodovi=5, 
                isVolonter=isVolonter,
                mjestoSusjed=mjestoSusjed,
                kvartSusjed=kvart,
                opisSusjed=opisSusjed,
                ime=ime,
                prezime=prezime,
                skills=skills, 
                ocjena=ocjena,
                sifSusjed=user  # Foreign key to the Korisnik instance (user)
            )
            susjed.save()

        # If user is registering as Tvrtka, set additional fields in Tvrtka instance, but not in Korisnik
        elif isTvrtka:
            
            
            # Create Tvrtka instance with all the necessary fields
            tvrtka = Tvrtka.objects.create(
                nazivTvrtka=nazivTvrtka,
                adresaTvrtka=adresa,
                kvartTvrtka=kvart,
                mjestoTvrtka=mjestoTvrtka,
                opisTvrtka=opisTvrtka,
                ocjena=ocjena,
                sifTvrtka=user  # Foreign key to the Korisnik instance (user)
            )
            tvrtka.save()

        # Return successful registration response
        return Response({"message": "Registration successful"}, status=status.HTTP_201_CREATED)

    def get(self, request):
        return render(request, "index.html")


# Google OAuth Login (sa JWT)"
class googleLogin(APIView):
    def get(self, request):
        code = request.GET.get("code")
        response = requests.post("https://oauth2.googleapis.com/token", data={
            'code': code,
            'client_id': settings.GOOGLE_CLIENT_ID,
            'client_secret': settings.GOOGLE_CLIENT_SECRET,
            'redirect_uri': "http://localhost:8000/google-login/",
            'grant_type': 'authorization_code'
        })
        if not response.ok:
            return Response({"error": "Could not get access token from Google.", "response": response}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        token = response.json()['access_token']
        
        try:
            # Verify the token with Google
            response = requests.get("https://www.googleapis.com/oauth2/v3/userinfo", params={'access_token': token}).json()
            email = response["email"]
            
            # Get or create the user
            user, created = Korisnik.objects.get_or_create(username=email, email=email)
            
            if created:
                user.set_unusable_password()
                user.save()
            
            # Issue JWT token for Google login
            refresh = RefreshToken.for_user(user)
            response = redirect("../home/")
            response.set_cookie(key="refresh", value=str(refresh))
            response.set_cookie(key="access", value=str(refresh.access_token))
            response.set_cookie(key="google", value=str(token))
            return response
        except ValueError:
            return Response({"error": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)

class ponudeSusjedaListView(APIView):
    def get(self, request):
        #Fetch from database
        susjedi = Susjed.objects.all()  
        print(len(susjedi))
        #Serijalization of users
        serializer = SusjedSerializer(susjedi, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class tvrtkeListView(APIView):
    def get(self, request):
        # Fetch all Tvrtka instances from the database
        tvrtke = Tvrtka.objects.all()
        print(len(tvrtke))
        
        # Serialize the Tvrtka instances
        serializer = TvrtkaSerializer(tvrtke, many=True)
        
        # Return serialized data with a 200 OK status
        return Response(serializer.data, status=status.HTTP_200_OK)
    
# Logout view - blacklist the refresh token
class odjava(APIView):
    def post(self, request):
        try:
            token = RefreshToken(request.data.get('refresh_token'))
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

#API za detaljan prikaz susjeda
class detaljiSusjedView(APIView):
    def get(self, request, sifSusjed):
        try:
            user = Susjed.objects.get(sifSusjed=sifSusjed)
            serializer = SusjedSerializer(user)
            return Response(serializer.data)
        except Susjed.DoesNotExist:
            return Response({"detail": "User not found"}, status=404)

class detaljiTvrtkaView(APIView):
    def get(self, request, sifTvrtka):
        try:
            user = Tvrtka.objects.get(sifTvrtka=sifTvrtka)
            serializer = TvrtkaSerializer(user)
            return Response(serializer.data)
        except Tvrtka.DoesNotExist:
            return Response({"detail": "User not found"}, status=404)

class homeView(APIView):
    def get(self, request):
        return render(request, "index.html")
