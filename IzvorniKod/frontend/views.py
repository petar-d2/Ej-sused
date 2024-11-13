from EjSused.serializers import SusjedSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from api.models import Korisnik, Susjed, Tvrtka
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import render
from django.contrib.auth.hashers import make_password  # Import password hasher


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


# Google OAuth Login (JWT authentication)
class googleLoginView(APIView):
    def post(self, request):
        token = request.data.get("token")
        try:
            # Verify the token with Google
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), settings.GOOGLE_CLIENT_ID)
            email = idinfo["email"]
            
            # Get or create the user
            user, created = Korisnik.objects.get_or_create(username=email, email=email)
            
            if created:
                # Set an unusable password for Google login users
                user.set_unusable_password()
                user.save()
            
            # Issue JWT token for Google login
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            })
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

# Logout view - blacklist the refresh token
class odjava(APIView):
    def post(self, request):
        try:
            token = RefreshToken(request.data.get('refresh_token'))
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Home page view - requires a valid JWT token to access
class homeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": f"Hello, {request.user.username}!"})
