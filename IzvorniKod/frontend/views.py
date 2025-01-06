from EjSused.serializers import SusjedSerializer, TvrtkaSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from api.models import Dogadaj, Komentar, Korisnik, Susjed, Tvrtka
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.contrib.auth.hashers import make_password  # Import password hasher
import requests
from django.shortcuts import render, redirect
from django.db.models import Q


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
            'redirect_uri': settings.BASE_URL + "/google-login/",
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
            response = redirect("../")
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
        #Serijalization of users
        serializer = SusjedSerializer(susjedi, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class tvrtkeListView(APIView):
    def get(self, request):
        # Fetch all Tvrtka instances from the database
        tvrtke = Tvrtka.objects.all()
        
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




class searchSortView(APIView):
    modelMapping = {
        'susjed': {
            'model': Susjed,
            'serializer': SusjedSerializer,
            'fields': ['ime', 'prezime', 'skills','ocjena']
        },
        'tvrtka': {
            'model': Tvrtka,
            'serializer': TvrtkaSerializer,
            'fields': ['nazivTvrtka', 'opisTvrtka']
        },
    }
    def get(self, request):
        #string koji se pretrazuje
        searchQuery = request.GET.get('search', None)
        #iz koje tablice se pretrazuje
        modelName = request.GET.get('model', 'susjed')
        # po cemu se sortira
        sortBy = request.GET.get('sort_by', None)
         #primjer url-a: http://localhost:8000/search/?search=horvat&model=susjed&sort_by=ocjena

        if modelName not in self.modelMapping:
            return Response(
                {"error": f"Invalid model '{modelName}'."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        modelStruct = self.modelMapping[modelName]
        model = modelStruct['model']
        serializerClass = modelStruct['serializer']
        fields = modelStruct['fields']

        queryset = model.objects.all()
        if searchQuery:
            query = Q()
            words = searchQuery.split()  

            
            for word in words:
                word_query = Q()
                for field in fields:
                    word_query |= Q(**{f"{field}__icontains": word})
                query &= word_query 

            queryset = queryset.filter(query)

        if sortBy and sortBy in fields:
                queryset = queryset.order_by(f'-{sortBy}')

        serializer = serializerClass(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# API for creating a new event (Dogadaj)
class createDogadajView(APIView):
    def post(self, request):
        # Retrieve fields from the request data
        kadZadano = request.data.get('kadZadano')
        sifVolonter_id = request.data.get('sifVolonter')  # Primary key of the associated Komentar
        datumDogadaj = request.data.get('datumDogadaj')
        vrijemeDogadaj = request.data.get('vrijemeDogadaj')
        nazivDogadaj = request.data.get('nazivDogadaj')
        adresaDogadaj = request.data.get('adresaDogadaj')
        statusDogadaj = request.data.get('statusDogadaj')
        vrstaDogadaj = request.data.get('vrstaDogadaj')
        opisDogadaj = request.data.get('opisDogadaj', None)  # Optional field
        nagradaBod = request.data.get('nagradaBod')

        # Validate required fields
        if not all([kadZadano, sifVolonter_id, datumDogadaj, vrijemeDogadaj, nazivDogadaj, adresaDogadaj, statusDogadaj, vrstaDogadaj, nagradaBod]):
            return Response({"error": "All fields are required except 'opisDogadaj'."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Retrieve the related Komentar instance
            sifVolonter = Komentar.objects.get(id=sifVolonter_id)

            # Create the Dogadaj instance
            dogadaj = Dogadaj.objects.create(
                kadZadano=kadZadano,
                sifVolonter=sifVolonter,
                datumDogadaj=datumDogadaj,
                vrijemeDogadaj=vrijemeDogadaj,
                nazivDogadaj=nazivDogadaj,
                adresaDogadaj=adresaDogadaj,
                statusDogadaj=statusDogadaj,
                vrstaDogadaj=vrstaDogadaj,
                opisDogadaj=opisDogadaj,
                nagradaBod=nagradaBod
            )

            dogadaj.save()

            return Response({"message": "Event created successfully", "dogadaj_id": dogadaj.id}, status=status.HTTP_201_CREATED)

        except Komentar.DoesNotExist:
            return Response({"error": "Komentar with the given ID does not exist."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class dogadajiListView(APIView):
    def get(self, request):
        # Fetch all Dogadaj instances from the database
        dogadaji = Dogadaj.objects.all()

        # Serialize the Dogadaj instances
        serializer = DogadajSerializer(dogadaji, many=True)

        # Return serialized data with a 200 OK status
        return Response(serializer.data, status=status.HTTP_200_OK)

class homeView(APIView):
    def get(self, request):
        return render(request, "index.html")

class userInfo(APIView):
    def get(self, request):
        # Dohvati Authorization header
        authorization = request.headers.get('Authorization')
        if not authorization:
            return Response({"error": "Authorization header missing"}, status=status.HTTP_400_BAD_REQUEST)

        token = authorization.split(' ')[1]  # Uzmite token iz "Bearer <token>"

        try:
            # Dekodiraj token i dohvati korisnički ID
            token_obj = AccessToken(token)
            user_id = token_obj["user_id"]  # Provjerite da li je ovo ispravan ključ

            # Dohvati korisnika na temelju ID-a
            user = Korisnik.objects.get(id=user_id)

            # Pripremi podatke korisnika
            user_data = {
                "id": user.id,
                "email": user.email,
                "isSusjed": user.isSusjed,
                "isTvrtka": user.isTvrtka,
                "isNadlezna": user.isNadlezna,
            }

            # Dodatni podaci za Susjeda ili Tvrtku
            if user.isSusjed:
                susjed = Susjed.objects.get(sifSusjed=user)
                user_data.update({
                    "ime": susjed.ime,
                    "prezime": susjed.prezime,
                    "bodovi": susjed.bodovi,
                    "skills": susjed.skills,
                    "kvartSusjed": susjed.kvartSusjed,
                    "opisSusjed": susjed.opisSusjed,
                    "isVolonter": susjed.isVolonter
                })
            elif user.isTvrtka:
                tvrtka = Tvrtka.objects.get(sifTvrtka=user)
                user_data.update({
                    "nazivTvrtka": tvrtka.nazivTvrtka,
                    "adresaTvrtka": tvrtka.adresaTvrtka,
                    "opisTvrtka": tvrtka.opisTvrtka,
                    "kvartTvrtka": tvrtka.kvartTvrtka
                })

            return Response(user_data, status=status.HTTP_200_OK)

        except AccessToken.InvalidTokenError:
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_401_UNAUTHORIZED)
        except Korisnik.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)   

class userEdit(APIView):
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

        # Find existing user by email
        try:
            user = Korisnik.objects.get(email=email)
        except Korisnik.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Update user fields
        if password:
            user.password = make_password(password)  # Hash the new password
        user.isSusjed = isSusjed
        user.isTvrtka = isTvrtka
        user.isNadlezna = isNadlezna
        user.save()

        # If user is registering as Susjed, update the Susjed instance
        if isSusjed:
            susjed, created = Susjed.objects.get_or_create(sifSusjed=user)
            susjed.bodovi = 5  # Update default points or any other logic
            susjed.isVolonter = isVolonter
            susjed.mjestoSusjed = mjestoSusjed
            susjed.kvartSusjed = kvart
            susjed.opisSusjed = opisSusjed
            susjed.ime = ime
            susjed.prezime = prezime
            susjed.skills = skills
            susjed.ocjena = ocjena
            susjed.save()

        # If user is registering as Tvrtka, update the Tvrtka instance
        elif isTvrtka:
            tvrtka, created = Tvrtka.objects.get_or_create(sifTvrtka=user)
            tvrtka.nazivTvrtka = nazivTvrtka
            tvrtka.adresaTvrtka = adresa
            tvrtka.kvartTvrtka = kvart
            tvrtka.mjestoTvrtka = mjestoTvrtka
            tvrtka.opisTvrtka = opisTvrtka
            tvrtka.ocjena = ocjena
            tvrtka.save()

        # Return successful update response
        return Response({"message": "User updated successfully"}, status=status.HTTP_200_OK)

    def get(self, request):
        return render(request, "index.html")
