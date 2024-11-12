from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from api.models import Korisnik
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import render

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
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
    def get(self, request):
        return render(request, "index.html")


# Registration endpoint (optional for traditional login)
class registracija(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        # Check if email already exists in the system
        user = Korisnik.objects.filter(email=email)
        if user.exists():
            return Response({'error': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create the user
        user = Korisnik.objects.create_user(username=email, email=email, password=password)
        user.save()
        
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
            
            # Get or create the user (this could be a custom model like Korisnik if you're using it)
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

class odjava(APIView):
    def post(self, request):
        try:
            token = RefreshToken(request.data.get('refresh_token'))
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    

# Home page (to be accessed with valid JWT)
class homeView(APIView):
    permission_classes = [IsAuthenticated]  # JWT token required to access

    def get(self, request):
        return Response({"message": f"Hello, {request.user.username}!"})
