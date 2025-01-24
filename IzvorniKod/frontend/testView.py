from django.test import TestCase
from api.models import Korisnik, Tvrtka, Susjed, Dogadaj, Zahtjev, Ponuda, Komentar
##Testiranje je namjenjeno developerima za lokalno testiranje s obzirom da bi nam jako usporilo render
#time.sleep() funkcija je koristena jer nam je baza usporena u free planu pa nemamo kako bas drugog nacina osim cekanja tj. sleep funkcije

class TestModels(TestCase):

    # ========================= Korisnik Model =========================
    
    def test_korisnik_creation(self):
        korisnik = Korisnik.objects.get_or_create(
            username='testuser',
            email='testuser@example.com',
            password='password123',
            isTvrtka=False,
            isSusjed=True,
            isNadlezna=False,
            isModerator=False
        )[0]
        
        self.assertTrue(korisnik.pk)
        self.assertEqual(korisnik.email, 'testuser@example.com')
        self.assertEqual(korisnik.isTvrtka, False)
        self.assertEqual(korisnik.isSusjed, True)
        self.assertEqual(korisnik.isNadlezna, False)
        self.assertEqual(korisnik.isModerator, False)

    def test_korisnik_creation_failed(self):
        with self.assertRaises(ValueError):
            Korisnik.objects.get_or_create(
                username='',
                email='',
                password='password123',
                isTvrtka=False,
                isSusjed=True,
                isNadlezna=False,
                isModerator=False
            )[0]


    # ========================= Tvrtka Model =========================

    def test_tvrtka_creation(self):
        korisnik = Korisnik.objects.create_user(
            username='testtvrtka',
            email='tvrtka@example.com',
            password='password123',
            isTvrtka=True,
            isSusjed=False,
            isNadlezna=False,
            isModerator=False
        )
        
        tvrtka = Tvrtka.objects.create(
            sifTvrtka=korisnik,
            nazivTvrtka='Test Company',
            adresaTvrtka='Test Street 123',
            kvartTvrtka='Test Quarter',
            mjestoTvrtka='Test City',
            opisTvrtka='This is a test company.'
        )
        
        self.assertTrue(tvrtka.pk)
        self.assertEqual(tvrtka.nazivTvrtka, 'Test Company')
        self.assertEqual(tvrtka.adresaTvrtka, 'Test Street 123')
        self.assertEqual(tvrtka.mjestoTvrtka, 'Test City')

    def test_tvrtka_creation_failed(self):
        korisnik = Korisnik.objects.create_user(
            username='testuser2',
            email='testuser2@example.com',
            password='password123',
            isTvrtka=True,
            isSusjed=False,
            isNadlezna=False,
            isModerator=False
        )
        
        with self.assertRaises(ValueError):
            Tvrtka.objects.create(
                sifTvrtka=korisnik,
                nazivTvrtka='',
                adresaTvrtka='',
                kvartTvrtka='',
                mjestoTvrtka='',
                opisTvrtka=None
            )

    def test_tvrtka_unique_constraint(self):
        korisnik1 = Korisnik.objects.create_user(
            username='user1',
            email='user1@example.com',
            password='password123',
            isTvrtka=True,
            isSusjed=False,
            isNadlezna=False,
            isModerator=False
        )

        Tvrtka.objects.create(
            sifTvrtka=korisnik1,
            nazivTvrtka='Company 1',
            adresaTvrtka='Street 1',
            kvartTvrtka='Quarter 1',
            mjestoTvrtka='City 1',
            opisTvrtka='First company.'
        )

        with self.assertRaises(Exception):
            Tvrtka.objects.create(
                sifTvrtka=korisnik1,
                nazivTvrtka='Company 2',
                adresaTvrtka='Street 2',
                kvartTvrtka='Quarter 2',
                mjestoTvrtka='City 2',
                opisTvrtka='Second company.'
            )

    def test_tvrtka_model_relation(self):
        korisnik = Korisnik.objects.create_user(
            username='company_user',
            email='company_user@example.com',
            password='password123',
            isTvrtka=True,
            isSusjed=False,
            isNadlezna=False,
            isModerator=False
        )
        
        tvrtka = Tvrtka.objects.create(
            sifTvrtka=korisnik,
            nazivTvrtka='Test Corp',
            adresaTvrtka='Test Address 123',
            kvartTvrtka='Test Quarter',
            mjestoTvrtka='Test City',
            opisTvrtka='Test description.'
        )
        
        self.assertEqual(tvrtka.sifTvrtka.email, 'company_user@example.com')

    # ========================= Susjed Model =========================

    def test_susjed_creation(self):
        korisnik = Korisnik.objects.create_user(
            username='john_doe',
            email='john.doe@example.com',
            password='password123',
            isTvrtka=False,
            isSusjed=True,
            isNadlezna=False,
            isModerator=False
        )
        
        susjed = Susjed.objects.create(
            sifSusjed=korisnik,
            ime='John',
            prezime='Doe',
            mjestoSusjed='Zagreb',
            kvartSusjed='Centar',
            bodovi=5,
            isVolonter=False,
            opisSusjed='Friendly neighbor.',
            brojOcjena=0,
            zbrojOcjena=0,
            skills='Basic skills'
        )
        
        self.assertTrue(susjed.pk)
        self.assertEqual(susjed.ime, 'John')
        self.assertEqual(susjed.prezime, 'Doe')
        self.assertEqual(susjed.mjestoSusjed, 'Zagreb')

    def test_susjed_creation_failed(self):
        korisnik = Korisnik.objects.create_user(
            username='susjed1',
            email='susjed1@example.com',
            password='password123',
            isTvrtka=False,
            isSusjed=True,
            isNadlezna=False,
            isModerator=False
        )

        with self.assertRaises(ValueError):
            Susjed.objects.create(
                sifSusjed=korisnik,
                ime='',
                prezime='',
                mjestoSusjed='',
                kvartSusjed='',
                bodovi=5,
                isVolonter=False,
                opisSusjed=None,
                brojOcjena=0,
                zbrojOcjena=0,
                skills=''
            )

    def test_susjed_model_relation(self):
        korisnik = Korisnik.objects.create_user(
            username='john_doe',
            email='john.doe@example.com',
            password='password123',
            isTvrtka=False,
            isSusjed=True,
            isNadlezna=False,
            isModerator=False
        )
        
        susjed = Susjed.objects.create(
            sifSusjed=korisnik,
            ime='John',
            prezime='Doe',
            mjestoSusjed='Zagreb',
            kvartSusjed='Centar',
            bodovi=5,
            isVolonter=False,
            opisSusjed='Friendly neighbor.',
            brojOcjena=0,
            zbrojOcjena=0,
            skills='Basic skills'
        )
        
        self.assertEqual(susjed.sifSusjed.username, 'john_doe')

    # ========================= Događaj Model =========================

    def test_dogadaj_creation_with_get_or_create(self):
        korisnik = Korisnik.objects.get_or_create(
            username='event_user',
            email='event_user@example.com',
            defaults={
                'password': 'password123',
                'isTvrtka': False,
                'isSusjed': True,
                'isNadlezna': False,
                'isModerator': False
            }
        )[0]

        # Step 2: Get or create a Susjed tied to that Korisnik
        susjed = Susjed.objects.get_or_create(
            sifSusjed=korisnik,
            defaults={
                'ime': 'Ivan',
                'prezime': 'Horvat',
                'mjestoSusjed': 'Zagreb',
                'kvartSusjed': 'Centar',
                'bodovi': 5,
                'isVolonter': True,
                'opisSusjed': 'Active volunteer.',
                'brojOcjena': 0,
                'zbrojOcjena': 0,
                'skills': 'Volunteer skills'
            }
        )[0]

        dogadaj = Dogadaj.objects.get_or_create(
            sifVolonter=susjed.sifSusjed.id,
            defaults={
                'nazivDogadaj': 'Test Event',
                'adresaDogadaj': 'Test Location',
                'datumDogadaj': '2025-01-01',
                'vrijemeDogadaj': '12:00',
                'statusDogadaj': 'Planned',
                'vrstaDogadaj': 'Community Service',
                'opisDogadaj': 'This is a test event.',
                'nagradaBod': 10
            }
        )[0] 

        self.assertEqual(dogadaj.nazivDogadaj, 'Test Event')
        self.assertEqual(dogadaj.sifVolonter, korisnik.id)
        self.assertEqual(dogadaj.nagradaBod, 10)

    def test_dogadaj_creation_failed(self):
        korisnik = Korisnik.objects.get_or_create(
            username='event_user2',
            email='event_user2@example.com',
            password='password123',
            isTvrtka=False,
            isSusjed=True,
            isNadlezna=False,
            isModerator=False
        )[0]

        susjed = Susjed.objects.get_or_create(
            sifSusjed=korisnik,
            ime='Ivan',
            prezime='Horvat',
            mjestoSusjed='Zagreb',
            kvartSusjed='Centar',
            bodovi=5,
            isVolonter=True,
            opisSusjed='Active volunteer.',
            brojOcjena=0,
            zbrojOcjena=0,
            skills='Volunteer skills'
        )[0]
        
        with self.assertRaises(ValueError):
            Dogadaj.objects.get_or_create(
                sifVolonter=susjed.sifSusjed.id,
                nazivDogadaj='',
                adresaDogadaj='',
                datumDogadaj='2025-01-01',
                vrijemeDogadaj='12:00',
                statusDogadaj='Planned',
                vrstaDogadaj='Community Service',
                opisDogadaj=None,
                nagradaBod=10
            )[0]

    # ========================= Zahtjev Model =========================

    def test_zahtjev_creation(self):
        korisnik = Korisnik.objects.get_or_create(
            username='request_user',
            email='request_user@example.com',
            password='password123',
            isTvrtka=False,
            isSusjed=True,
            isNadlezna=False,
            isModerator=False
        )[0]

        susjed = Susjed.objects.get_or_create(
            sifSusjed=korisnik,
            ime='Ivan',
            prezime='Horvat',
            mjestoSusjed='Zagreb',
            kvartSusjed='Centar',
            bodovi=5,
            isVolonter=True,
            opisSusjed='Active volunteer.',
            brojOcjena=0,
            zbrojOcjena=0,
            skills='Volunteer skills'
        )[0]
        
        zahtjev = Zahtjev.objects.get_or_create(
            sifSusjed=susjed.sifSusjed.id,
            nazivZahtjev='Test Request',
            cijenaBod=100,
            adresaZahtjev='Test Address',
            statusZahtjev='ČEKANJE',
            opisZahtjev='Test description'
        )[0]
        
        self.assertTrue(zahtjev.pk)
        self.assertEqual(zahtjev.nazivZahtjev, 'Test Request')
        self.assertEqual(zahtjev.statusZahtjev, 'ČEKANJE')

    def test_zahtjev_creation_failed(self):
        korisnik = Korisnik.objects.get_or_create(
            username='request_user2',
            email='request_user2@example.com',
            password='password123',
            isTvrtka=False,
            isSusjed=True,
            isNadlezna=False,
            isModerator=False
        )[0]

        susjed = Susjed.objects.get_or_create(
            sifSusjed=korisnik,
            ime='Ivan',
            prezime='Horvat',
            mjestoSusjed='Zagreb',
            kvartSusjed='Centar',
            bodovi=5,
            isVolonter=True,
            opisSusjed='Active volunteer.',
            brojOcjena=0,
            zbrojOcjena=0,
            skills='Volunteer skills'
        )[0]
        
        with self.assertRaises(ValueError):
            Zahtjev.objects.get_or_create(
                sifSusjed=susjed.sifSusjed.id,
                nazivZahtjev='',
                cijenaBod=0,
                adresaZahtjev='',
                statusZahtjev='',
                opisZahtjev=None
            )[0]

    

    def test_zahtjev_model_relation(self):
        korisnik = Korisnik.objects.get_or_create(
            username='request_user',
            email='request_user@example.com',
            password='password123',
            isTvrtka=False,
            isSusjed=True,
            isNadlezna=False,
            isModerator=False
        )[0]
        
        susjed = Susjed.objects.get_or_create(
            sifSusjed=korisnik,
            ime='Ivan',
            prezime='Horvat',
            mjestoSusjed='Zagreb',
            kvartSusjed='Centar',
            bodovi=5,
            isVolonter=True,
            opisSusjed='Active volunteer.',
            brojOcjena=0,
            zbrojOcjena=0,
            skills='Volunteer skills'
        )[0]

        zahtjev = Zahtjev.objects.get_or_create(
            sifSusjed=susjed.sifSusjed.id,
            nazivZahtjev='Test Request',
            cijenaBod=100,
            adresaZahtjev='Test Address',
            statusZahtjev='ČEKANJE',
            opisZahtjev='Test description'
        )[0]

        self.assertEqual(zahtjev.sifSusjed, korisnik.id)

    # ========================= Ponuda Model =========================

    def test_ponuda_creation(self):
        korisnik = Korisnik.objects.create_user(
            username='offer_user',
            email='offer_user@example.com',
            password='password123',
            isTvrtka=True,
            isSusjed=False,
            isNadlezna=False,
            isModerator=False
        )
        
        tvrtka = Tvrtka.objects.create(
            sifTvrtka=korisnik,
            nazivTvrtka='Test Tvrtka',
            adresaTvrtka='Ulica 21',
            kvartTvrtka='Maksimir',
            mjestoTvrtka='Grad',
            opisTvrtka='Test description.'
        )
        
        ponuda = Ponuda.objects.create(
            sifTvrtka=tvrtka,
            nazivPonuda='Test Offer',
            kadZadano='2025-01-01',
            opisPonuda='Opisujem ponudu ovu.',
            cijenaNovac=5,
            isAktivna=True,
            sifVrsta='Vodoinstalaterski radovi'
        )
        
        self.assertTrue(ponuda.pk)
        self.assertEqual(ponuda.nazivPonuda, 'Test Offer')
        self.assertEqual(ponuda.opisPonuda, 'Opisujem ponudu ovu.')
        self.assertEqual(ponuda.cijenaNovac, 5)

    def test_ponuda_creation_failed(self):
        korisnik = Korisnik.objects.create_user(
            username='offer_user2',
            email='offer_user2@example.com',
            password='password123',
            isTvrtka=True,
            isSusjed=False,
            isNadlezna=False,
            isModerator=False
        )

        tvrtka = Tvrtka.objects.create(
            sifTvrtka=korisnik,
            nazivTvrtka='Fail Tvrtka',
            adresaTvrtka='Prisavlje 3',
            kvartTvrtka='Žitnjak',
            mjestoTvrtka='Selo',
            opisTvrtka='Fail description.'
        )
        
        with self.assertRaises(ValueError):
            Ponuda.objects.create(
                sifTvrtka=tvrtka,
                nazivPonuda='',
                kadZadano='',
                opisPonuda='',
                cijenaNovac=0,
                isAktivna=True,
                sifVrsta='Vodoinstalaterski radovi'
            )

    def test_ponuda_model_relation(self):
        korisnik = Korisnik.objects.create_user(
            username='offer_user',
            email='offer_user@example.com',
            password='password123',
            isTvrtka=True,
            isSusjed=False,
            isNadlezna=False,
            isModerator=False
        )

        tvrtka = Tvrtka.objects.create(
            sifTvrtka=korisnik,
            nazivTvrtka='Test Tvrtka',
            adresaTvrtka='Prisavlje 3',
            kvartTvrtka='Žitnjak',
            mjestoTvrtka='Selo',
            opisTvrtka='Test description.'
        )
        
        ponuda = Ponuda.objects.create(
            sifTvrtka=tvrtka,
            nazivPonuda='Test Offer',
            kadZadano='2025-01-01',
            opisPonuda='Opis ponude',
            cijenaNovac=50,
            isAktivna=True,
            sifVrsta='Vožnja i dostava'
        )
        
        self.assertEqual(ponuda.sifTvrtka.sifTvrtka.email, 'offer_user@example.com')

        # ========================= Komentar Model =========================

    def test_komentar_creation(self):
        # korisnik (susjed) koji komentira
        korisnik1 = Korisnik.objects.get_or_create(
            username='comment_user',
            email='comment_user@example.com',
            password='password123',
            isTvrtka=False,
            isSusjed=True,
            isNadlezna=False,
            isModerator=False
        )[0]

        susjed = Susjed.objects.get_or_create(
            sifSusjed=korisnik1,
            ime='Ivan',
            prezime='Horvat',
            mjestoSusjed='Zagreb',
            kvartSusjed='Centar',
            bodovi=5,
            isVolonter=False,
            opisSusjed='Vrlo vješt.',
            brojOcjena=0,
            zbrojOcjena=0,
            skills='Osnovne vještine'
        )[0]

        # korisnik (tvrtka) koji prima komentar
        korisnik2 = Korisnik.objects.get_or_create(
            username='tvrtka_user',
            email='tvrtka_user@example.com',
            password='password123',
            isTvrtka=True,
            isSusjed=False,
            isNadlezna=False,
            isModerator=False
        )[0]

        tvrtka = Tvrtka.objects.create(
            sifTvrtka=korisnik2,
            nazivTvrtka='Test Tvrtka',
            adresaTvrtka='Ulica 21',
            kvartTvrtka='Maksimir',
            mjestoTvrtka='Grad',
            opisTvrtka='Test description.'
        )
        
        komentar = Komentar.objects.get_or_create(
            textKom='Ispitni komentar.',
            sifPrima=tvrtka,
            sifDaje=susjed.sifSusjed
        )[0]
        
        self.assertTrue(komentar.pk)
        self.assertEqual(komentar.textKom, 'Ispitni komentar.')

    def test_komentar_creation_failed(self):
        # korisnik (susjed) koji komentira
        korisnik1 = Korisnik.objects.get_or_create(
            username='comment_user',
            email='comment_user@example.com',
            password='password123',
            isTvrtka=False,
            isSusjed=True,
            isNadlezna=False,
            isModerator=False
        )[0]

        susjed = Susjed.objects.get_or_create(
            sifSusjed=korisnik1,
            ime='Ivan',
            prezime='Horvat',
            mjestoSusjed='Zagreb',
            kvartSusjed='Centar',
            bodovi=5,
            isVolonter=False,
            opisSusjed='Vrlo vješt.',
            brojOcjena=0,
            zbrojOcjena=0,
            skills='Osnovne vještine'
        )[0]

        # korisnik (tvrtka) koji prima komentar
        korisnik2 = Korisnik.objects.get_or_create(
            username='tvrtka_user',
            email='tvrtka_user@example.com',
            password='password123',
            isTvrtka=True,
            isSusjed=False,
            isNadlezna=False,
            isModerator=False
        )[0]

        tvrtka = Tvrtka.objects.create(
            sifTvrtka=korisnik2,
            nazivTvrtka='Test Tvrtka',
            adresaTvrtka='Ulica 21',
            kvartTvrtka='Maksimir',
            mjestoTvrtka='Grad',
            opisTvrtka='Test description.'
        )
        
        with self.assertRaises(ValueError):
            Komentar.objects.create(
                textKom='',
                sifPrima=tvrtka,
                sifDaje=susjed.sifSusjed
            )
        
    def test_komentar_model_relation(self):
        # korisnik (susjed) koji komentira
        korisnik1 = Korisnik.objects.get_or_create(
            username='comment_user',
            email='comment_user@example.com',
            password='password123',
            isTvrtka=False,
            isSusjed=True,
            isNadlezna=False,
            isModerator=False
        )[0]

        susjed = Susjed.objects.get_or_create(
            sifSusjed=korisnik1,
            ime='Ivan',
            prezime='Horvat',
            mjestoSusjed='Zagreb',
            kvartSusjed='Centar',
            bodovi=5,
            isVolonter=False,
            opisSusjed='Vrlo vješt.',
            brojOcjena=0,
            zbrojOcjena=0,
            skills='Osnovne vještine'
        )[0]

        # korisnik (tvrtka) koji prima komentar
        korisnik2 = Korisnik.objects.get_or_create(
            username='tvrtka_user',
            email='tvrtka_user@example.com',
            password='password123',
            isTvrtka=True,
            isSusjed=False,
            isNadlezna=False,
            isModerator=False
        )[0]

        tvrtka = Tvrtka.objects.create(
            sifTvrtka=korisnik2,
            nazivTvrtka='Test Tvrtka',
            adresaTvrtka='Ulica 21',
            kvartTvrtka='Maksimir',
            mjestoTvrtka='Grad',
            opisTvrtka='Test description.'
        )
            
        komentar = Komentar.objects.get_or_create(
            textKom='Ispitni komentar.',
            sifPrima=tvrtka,
            sifDaje=susjed.sifSusjed
        )[0]
        
        self.assertEqual(komentar.sifPrima.nazivTvrtka, 'Test Tvrtka')