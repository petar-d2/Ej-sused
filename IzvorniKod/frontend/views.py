from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User

def main(request):
    return render(request, "index.html")

class prijava(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(username=email, email=email, password=password)
        if user:
            login(request, user)
            return Response({})
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
    def get(self, request):
        return render(request, "index.html")

class registracija(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = User.objects.filter(email=email)
        if user.exists():
            return Response({'error': 'Email već registriran'}, status=status.HTTP_401_UNAUTHORIZED)
        user = User.objects.create_user(username=email, email=email, password=password)
        user.save()
        return Response({})

    def get(self, request):
        return render(request, "index.html")



#@login_required
def home(request):
    return render(request, "index.html")