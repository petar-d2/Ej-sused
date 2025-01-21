from EjSused.serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from api.models import Dogadaj, Komentar, Korisnik, Susjed, Tvrtka, Zahtjev, Ponuda
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.contrib.auth.hashers import make_password
import requests
from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import Q
from django.http import Http404
from django.db.models import F, FloatField, ExpressionWrapper, Case, When
from django.db.models.functions import Cast

def validate_field_types(data, field_types):
    errors = {}
    for field, expected_type in field_types.items():
        value = data.get(field)
        if not isinstance(value, expected_type) and value is not None:
            try:
                # Attempt to cast the value to the expected type (e.g., str -> int)
                expected_type(value)
            except (ValueError, TypeError):
                errors[field] = f"Expected {expected_type.__name__}, but got {type(value).__name__}"
    return errors

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
        isModerator = request.data.get('isModerator',False)
        brojOcjena = request.data.get('brojOcjena', 0)
        zbrojOcjena = request.data.get('zbrojOcjena', 0)

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
        print("ENTRY POST")
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
                brojOcjena=brojOcjena,
                zbrojOcjena=zbrojOcjena,
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
                brojOcjena=brojOcjena,
                zbrojOcjena=zbrojOcjena,
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

class susjediListView(APIView):
    def post(self, request):
        #Fetch from database
        susjedi = Susjed.objects.all()
        #Serijalization of users
        serializer = SusjedSerializer(susjedi, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def get(self, request):
        return render(request, "index.html")

class tvrtkeListView(APIView):
    def post(self, request):
        # Fetch all Tvrtka instances from the database
        tvrtke = Tvrtka.objects.all()
        
        # Serialize the Tvrtka instances
        serializer = TvrtkaSerializer(tvrtke, many=True)
        
        # Return serialized data with a 200 OK status
        return Response(serializer.data, status=status.HTTP_200_OK)
    def get(self, request):
        return render(request, "index.html")
    
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
    def post(self, request, sifSusjed):
        try:
            user = Susjed.objects.get(sifSusjed=sifSusjed)
            serializer = SusjedSerializer(user)
            return Response(serializer.data)
        except Susjed.DoesNotExist:
            return Response({"detail": "User not found"}, status=404)
    def get(self, request, sifSusjed):
        return render(request, "index.html")

class detaljiTvrtkaView(APIView):
    def post(self, request, sifTvrtka):
        try:
            user = Tvrtka.objects.get(sifTvrtka=sifTvrtka)
            serializer = TvrtkaSerializer(user)
            return Response(serializer.data)
        except Tvrtka.DoesNotExist:
            return Response({"detail": "User not found"}, status=404)
    def get(self, request, sifTvrtka):
        return render(request, "index.html")

class detaljiDogadajView(APIView):
    def post(self, request, sifDogadaj):
        try:
            user = Dogadaj.objects.get(id=sifDogadaj)
            serializer = DogadajSerializer(user)
            return Response(serializer.data)
        except Dogadaj.DoesNotExist:
            return Response({"detail": "Event not found"}, status=404)
    def get(self, request, sifDogadaj):
        return render(request, "index.html")

class detaljiZahtjevView(APIView):
    def post(self, request, sifZahtjev):
        try:
            user = Zahtjev.objects.get(id=sifZahtjev)
            serializer = ZahtjevSerializer(user)
            return Response(serializer.data)
        except Zahtjev.DoesNotExist:
            return Response({"detail": "Zahtjev not found"}, status=404)
    def get(self, request, sifZahtjev):
        return render(request, "index.html")

class detaljiPonudaView(APIView):
    def post(self, request, sifPonuda):
        try:
            user = Ponuda.objects.get(id=sifPonuda)
            serializer = PonudaSerializer(user)
            return Response(serializer.data)
        except Ponuda.DoesNotExist:
            return Response({"detail": "Ponuda not found"}, status=404)
    def get(self, request, sifPonuda):
        return render(request, "index.html")

class SkillsView(APIView):
    def get(self, request):
        skills = Susjed.objects.values_list('skills', flat=True).distinct()
        # Flatten the list of skills and remove duplicates
        all_skills = set(skill.strip() for sublist in skills for skill in sublist.split(','))
        return Response(sorted(all_skills), status=status.HTTP_200_OK)

class searchSortView(APIView):
    modelMapping = {
        'susjed': {
            'model': Susjed,
            'serializer': SusjedSerializer,
            'fields': ['ime', 'prezime', 'skills', 'brojOcjena', 'zbrojOcjena']
        },
        'tvrtka': {
            'model': Tvrtka,
            'serializer': TvrtkaSerializer,
            'fields': ['nazivTvrtka', 'opisTvrtka']
        },
        'dogadaj': {
            'model': Dogadaj,
            'serializer': DogadajSerializer,
            'fields': ['datumDogadaj', 'vrijemeDogadaj', 'nazivDogadaj', 'statusDogadaj', 'vrstaDogadaj', 'opisDogadaj', 'nagradaBod']
        },
        'zahtjev': {
            'model': Zahtjev,
            'serializer': ZahtjevSerializer,
            'fields': ['statusZahtjev', 'opisZahtjev', 'cijenaBod', 'nazivZahtjev']
        },
        'ponuda': {
            'model': Ponuda,
            'serializer': PonudaSerializer,
            'fields': ['adresaTvrtka', 'opisPonuda', 'cijenaNovac', 'nazivPonuda']
        }
    }

    def get(self, request):
        searchQuery = request.GET.get('search', None)
        modelName = request.GET.get('model', 'susjed')
        sortBy = request.GET.get('sort_by', None)
        skillsFilter = request.GET.get('skills', None)

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

        if skillsFilter:  # Filter by skills if provided
            queryset = queryset.filter(skills__icontains=skillsFilter)

        # Sorting logic
        if sortBy:
            if sortBy in ['datumDogadaj', '-datumDogadaj', 'nagradaBod', '-nagradaBod'] and modelName=='dogadaj':
                queryset = queryset.order_by(sortBy)
            elif sortBy in ['cijenaBod', '-cijenaBod'] and modelName=='zahtjev':
                queryset = queryset.order_by(sortBy)
            elif sortBy in ['cijenaNovac', '-cijenaNovac'] and modelName=='ponuda':
                queryset = queryset.order_by(sortBy)
            elif sortBy in ['ocjena', '-ocjena']:
                if modelName == 'tvrtka' or modelName=='susjed':
                    # Annotate queryset with average rating
                    queryset = queryset.annotate(
                    ocjena=ExpressionWrapper(
                        Case(
                            When(brojOcjena=0, then=0),
                            default=F('zbrojOcjena') / Cast(F('brojOcjena'), FloatField()), 
                            output_field=FloatField()
                        ),
                        output_field=FloatField()
                    )
                    )
                    # Order by the annotated field
                    queryset = queryset.order_by(sortBy)

        serializer = serializerClass(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# API for creating a new event (Dogadaj)
class createDogadajView(APIView):
    def post(self, request):
        print("ENTRY POST")
        print("Request Data:", request.data)
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
        print(kadZadano, sifVolonter_id, datumDogadaj, vrijemeDogadaj, nazivDogadaj, adresaDogadaj, statusDogadaj, vrstaDogadaj, opisDogadaj, nagradaBod)
        # Validate required fields
        if not all([kadZadano, sifVolonter_id, datumDogadaj, vrijemeDogadaj, nazivDogadaj, adresaDogadaj, statusDogadaj, vrstaDogadaj, nagradaBod]):
            return Response({"error": "All fields are required except 'opisDogadaj'."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Retrieve the related Komentar instance
            # Create the Dogadaj instance
            dogadaj = Dogadaj.objects.create(
                kadZadano=kadZadano,
                sifVolonter=sifVolonter_id,
                datumDogadaj=datumDogadaj,
                vrijemeDogadaj=vrijemeDogadaj,
                nazivDogadaj=nazivDogadaj,
                adresaDogadaj=adresaDogadaj,
                statusDogadaj=statusDogadaj,
                vrstaDogadaj=vrstaDogadaj,
                opisDogadaj=opisDogadaj,
                nagradaBod=nagradaBod
            )
            print(dogadaj)
            dogadaj.save()

            return Response({"message": "Event created successfully", "dogadaj_id": dogadaj.id, "id" : sifVolonter_id}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def get(self, request):
        return render(request, "index.html")

class dogadajiListView(APIView):
    def post(self, request):
        # Fetch all Dogadaj instances from the database
        dogadaji = Dogadaj.objects.all()

        # Serialize the Dogadaj instances
        serializer = DogadajSerializer(dogadaji, many=True)

        # Return serialized data with a 200 OK status
        return Response(serializer.data, status=status.HTTP_200_OK)
    def get(self, request):
        return render(request, "index.html")

class mojiDogadajiListView(APIView):
    def post(self, request, sifVolonter):
        # Fetch all Dogadaj instances from the database
        dogadaji = Dogadaj.objects.filter(sifVolonter=sifVolonter)

        # Serialize the Dogadaj instances
        serializer = DogadajSerializer(dogadaji, many=True)

        # Return serialized data with a 200 OK status
        return Response(serializer.data, status=status.HTTP_200_OK)
    def get(self, request, sifVolonter):
        return render(request, "index.html")

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
                "isModerator": user.isModerator
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
        id = request.data.get('id')
        email = request.data.get('email')
        password = request.data.get('password')
        adresa = request.data.get('adresa')
        kvart = request.data.get('kvart')
        isSusjed = request.data.get('isSusjed', False)
        isTvrtka = request.data.get('isTvrtka', False)
        isNadlezna = request.data.get('isNadlezna', False)
        brojOcjena = request.data.get('brojOcjena', 0)
        zbrojOcjena = request.data.get('zbrojOcjena', 0)

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
            susjed, created = Susjed.objects.get_or_create(sifSusjed=id)
            susjed.bodovi = 5  # Update default points or any other logic
            susjed.isVolonter = isVolonter
            susjed.mjestoSusjed = mjestoSusjed
            susjed.kvartSusjed = kvart
            susjed.opisSusjed = opisSusjed
            susjed.ime = ime
            susjed.prezime = prezime
            susjed.skills = skills
            susjed.brojOcjena = brojOcjena
            susjed.zbrojOcjena = zbrojOcjena
            susjed.save()

        # If user is registering as Tvrtka, update the Tvrtka instance
        elif isTvrtka:
            tvrtka, created = Tvrtka.objects.get_or_create(sifTvrtka=id)
            tvrtka.nazivTvrtka = nazivTvrtka
            tvrtka.adresaTvrtka = adresa
            tvrtka.kvartTvrtka = kvart
            tvrtka.mjestoTvrtka = mjestoTvrtka
            tvrtka.opisTvrtka = opisTvrtka
            tvrtka.brojOcjena = brojOcjena
            tvrtka.zbrojOcjena = zbrojOcjena
            tvrtka.save()

        # Return successful update response
        return Response({"message": "User updated successfully"}, status=status.HTTP_200_OK)

    def get(self, request):
        return render(request, "index.html")


class napraviZahtjevView(APIView):
    def post(self, request):
        print("ENTRY POST")
        print("Request Data:", request.data)
        # Extract and validate data
        nazivZahtjev = request.data.get('nazivZahtjev')
        adresaZahtjev = request.data.get('adresaZahtjev')
        statusZahtjev = request.data.get('statusZahtjev', 'ČEKANJE')  # Default value for status
        opisZahtjev = request.data.get('opisZahtjev', None)
        cijenaBod = request.data.get('cijenaBod')
        sifSusjed_id = request.data.get('sifSusjed')
        sifVrsta_id = request.data.get('sifVrsta')
        sifIzvrsitelj_id = -1  # Default value for sifIzvrsitelj
        print(sifIzvrsitelj_id, sifSusjed_id, sifVrsta_id, cijenaBod, nazivZahtjev, adresaZahtjev, statusZahtjev, opisZahtjev)
        print(type(sifSusjed_id), type(sifVrsta_id), type(sifIzvrsitelj_id), type(cijenaBod), type(nazivZahtjev), type(adresaZahtjev), type(statusZahtjev), type(opisZahtjev))
        try:
            # Create Zahtjev object
            zahtjev = Zahtjev.objects.create(
                nazivZahtjev=nazivZahtjev,
                adresaZahtjev=adresaZahtjev,
                statusZahtjev=statusZahtjev,
                opisZahtjev=opisZahtjev,
                cijenaBod=cijenaBod,
                sifSusjed=sifSusjed_id,
                sifVrsta=sifVrsta_id,
                sifIzvrsitelj=sifIzvrsitelj_id,
            )
            return Response({"message": "Zahtjev uspešno kreiran!", "zahtjev_id": zahtjev.id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def get(self, request):
        return render(request, "index.html")

class napraviPonuduView(APIView):
    def post(self, request):
        print("ENTRY POST")
        print("Request Data:", request.data)
        
        kadZadano = request.data.get('kadZadano')
        nazivPonuda = request.data.get('nazivPonuda')
        opisPonuda = request.data.get('opisPonuda', None)
        cijenaNovac = request.data.get('cijenaNovac')
        sifTvrtka_id = request.data.get('sifTvrtka')
        isAktivna = request.data.get('isAktivna')
        sifVrsta_id = request.data.get('sifVrsta')
        # Validacija obaveznih polja
        if not all([nazivPonuda, cijenaNovac, sifTvrtka_id]):
            return Response({"error": "Sva polja osim opisa su obavezna."}, status=status.HTTP_400_BAD_REQUEST)

        # Preuzimanje odnosa
        sifTvrtka = get_object_or_404(Tvrtka, pk=sifTvrtka_id)
        print("test2")
        try:
            # Kreiranje nove Ponude
            ponuda = Ponuda.objects.create(
                kadZadano = kadZadano,
                nazivPonuda=nazivPonuda,
                opisPonuda=opisPonuda,
                cijenaNovac=cijenaNovac,
                sifTvrtka=sifTvrtka,
                sifVrsta=sifVrsta_id,
                isAktivna=isAktivna
            )
            ponuda.save()
            return Response({"message": "Ponuda uspešno kreiran!", "ponuda_id": ponuda.id}, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        return render(request, "index.html")

    

class unesiKomentarView(APIView):
    def post(self, request):
        textKom = request.data.get('textKom')
        sifDaje = request.data.get('sifDaje')  # ID korisnika
        sifPrima = request.data.get('sifPrima')  # ID tvrtke

        if not textKom:
            return Response({"error": "Komentar ne smije biti prazan."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Log request data for debugging
            print(f"Request data: {request.data}")

            # Pretvaranje ID-ova u instance
            korisnik = get_object_or_404(Korisnik, id=sifDaje)
            tvrtka = get_object_or_404(Tvrtka, sifTvrtka=sifPrima)

            # Kreiranje komentara
            komentar = Komentar.objects.create(
                textKom=textKom,
                sifDaje=korisnik,
                sifPrima=tvrtka,
            )
            print(f"Komentar created: {komentar}")

            return Response({"message": "Komentar unesen.", "komentar_id": komentar.sifKom}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error creating Komentar: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ocjenaEdit(APIView):
    def post(self, request):
        id = request.data.get('korisnik_id')
        email = request.data.get('email')
        nazivTvrtka = request.data.get('nazivTvrtka')
        adresaTvrtka = request.data.get('adresaTvrtka')
        kvartTvrtka = request.data.get('kvartTvrtka')
        mjestoTvrtka = request.data.get('mjestoTvrtka')
        opisTvrtka = request.data.get('opisTvrtka')
        brojOcjena = request.data.get('brojOcjena')
        zbrojOcjena = request.data.get('zbrojOcjena')

        try:
            user = Korisnik.objects.get(email=email)
        except Korisnik.DoesNotExist:
            return Response({'error': 'Tvrtka not found'}, status=status.HTTP_404_NOT_FOUND)

        tvrtka, created = Tvrtka.objects.get_or_create(sifTvrtka=id)
        tvrtka.nazivTvrtka = nazivTvrtka
        tvrtka.adresaTvrtka = adresaTvrtka
        tvrtka.kvartTvrtka = kvartTvrtka
        tvrtka.mjestoTvrtka = mjestoTvrtka
        tvrtka.opisTvrtka = opisTvrtka
        tvrtka.brojOcjena = brojOcjena
        tvrtka.zbrojOcjena = zbrojOcjena
        tvrtka.save()

        # Return successful update response
        return Response({"message": "User updated successfully"}, status=status.HTTP_200_OK)


class adminDeleteView(APIView):
    ##permission_classes = [AllowAny]

    def delete(self, request, *args, **kwargs):
        if 'komentar_id' in kwargs:
            return self.delete_komentar(kwargs['komentar_id'])
        elif 'user_id' in kwargs:
            return self.delete_user(kwargs['user_id'])
        else:
            raise Http404("Object not found.")
        
    def delete_komentar(self, komentar_id):
        try:
            komentar = Komentar.objects.get(pk=komentar_id)
            komentar.delete()
            return Response({"message": "Comment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Komentar.DoesNotExist:
            return Response({"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)
    def delete_user(self, user_id):
        try:
            korisnik = Korisnik.objects.get(pk=user_id)
            korisnik.delete()
            return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Korisnik.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class pokaziKomentareView(APIView):
    def get(self, request, sifTvrtka):
        komentari = Komentar.objects.filter(sifPrima=sifTvrtka)

        # Serialize the Dogadaj instances
        serializer = KomentarSerializer(komentari, many=True)

        # Return serialized data with a 200 OK status
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class listZahtjeviView(APIView):
    def post(self, request):
        # Fetch all Zahtjevi or filter based on query params
        naziv_filter = request.query_params.get('naziv', None)  # Optional filter by naziv
        if naziv_filter:
            zahtjevi = Zahtjev.objects.filter(nazivZahtjev=naziv_filter)
        else:
            zahtjevi = Zahtjev.objects.all()
        
        serializer = ZahtjevSerializer(zahtjevi, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def get(self, request):
        return render(request, "index.html")
    
class listPonudeView(APIView):
    def post(self, request):
        # Fetch all Zahtjevi or filter based on query params
        naziv_filter = request.query_params.get('naziv', None)  # Optional filter by naziv
        if naziv_filter:
            ponude = Ponuda.objects.filter(nazivPonuda=naziv_filter)
        else:
            ponude = Ponuda.objects.all()
        
        serializer = PonudaSerializer(ponude, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def get(self, request):
        return render(request, "index.html")

class mojiZahtjeviView(APIView):
    def post(self, request, user_id):
        zahtjevi = Zahtjev.objects.filter(sifSusjed=user_id)  
        serializer = ZahtjevSerializer(zahtjevi, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def get(self, request, user_id):
        return render(request, "index.html")

class mojePonudeView(APIView):
    def post(self, request, user_id):
        ponude = Ponuda.objects.filter(sifTvrtka=user_id)  
        serializer = PonudaSerializer(ponude, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def get(self, request, user_id):
        return render(request, "index.html")
    
class adminPrikazView(APIView):
    def get(self, request):
        return render(request, "index.html")
    
class listKomentariView(APIView):
     def get(self, request):
        # Fetch all Komentar instances from the database
        komentari = Komentar.objects.all()
        
        # Serialize the Komentar instances
        serializer = KomentarSerializer(komentari, many=True)
        
        # Return serialized data with a 200 OK status
        return Response(serializer.data, status=status.HTTP_200_OK)
     
class updateZahtjevStatusView(APIView):
    def post(self, request, sifZahtjev):
        new_status = request.data.get('status')
        if not new_status:
            return Response({"error": "Status is required"}, status=status.HTTP_400_BAD_REQUEST)

        zahtjev = get_object_or_404(Zahtjev, id=sifZahtjev)

        zahtjev.statusZahtjev = new_status
        zahtjev.save()
        
        return Response({"message": "Status updated successfully"}, status=status.HTTP_200_OK)

     
class assignIzvrsiteljView(APIView):
    def post(self, request, sifZahtjev):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        zahtjev = get_object_or_404(Zahtjev, id=sifZahtjev)
        zahtjev.statusZahtjev = 'PRIHVAĆEN'
        zahtjev.sifIzvrsitelj = user_id
        zahtjev.save()

        return Response({"message": "Izvršitelj assigned successfully"}, status=status.HTTP_200_OK)
    

class izmijeniStatusDogadajaView(APIView):
    def patch(self, request, id):
        event = get_object_or_404(Dogadaj, id=id)
        
        new_status = request.data.get('statusDogadaj', None)
        
        if not new_status:
            return Response({'detail': 'Status is required'}, status=status.HTTP_400_BAD_REQUEST)

        event.statusDogadaj = new_status
        event.save()

        return Response(
            {'id': event.id, 'statusDogadaj': event.statusDogadaj},
            status=status.HTTP_200_OK
        )