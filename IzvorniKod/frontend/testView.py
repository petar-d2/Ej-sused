from django.test import TestCase
from api.models import Korisnik, Tvrtka, Susjed, Dogadaj, Zahtjev, Ponuda

class TestModels(TestCase):

    # ========================= Korisnik Model =========================
    
    def test_korisnik_creation(self):   ### FAIL AssertionError: ValueError not raised
        # Create an actual Korisnik instance in the test database
        korisnik = Korisnik.objects.create(
            username='testuser',
            email='testuser@example.com',
            password='password123',  # You may need to set the password correctly
            isTvrtka=False,
            isSusjed=True
        )
        
        # Verify that the instance is saved and has correct attributes
        self.assertEqual(korisnik.email, 'testuser@example.com')
        self.assertEqual(korisnik.isTvrtka, False)
        self.assertEqual(korisnik.isSusjed, True)
        self.assertTrue(korisnik.pk)  # Check that the instance has been saved
        
    def test_korisnik_creation_failed(self):
        with self.assertRaises(ValueError):
            Korisnik.objects.create(
                username='',
                email='',
                password='password123',  # Missing email and username
                isTvrtka=False,
                isSusjed=True
            )

    def test_korisnik_unique_email_constraint(self):    ### FAIL AssertionError: Exception not raised
        # Create a Korisnik instance
        Korisnik.objects.create(
            username='user1',
            email='testuser@example.com',
            password='password123',
            isTvrtka=False,
            isSusjed=True
        )
        
        # Attempt to create another Korisnik with the same email
        with self.assertRaises(Exception):  # Expecting a unique constraint error
            Korisnik.objects.create(
                username='user2',
                email='testuser@example.com',
                password='password123',
                isTvrtka=False,
                isSusjed=True
            )

    # ========================= Tvrtka Model =========================

    def test_tvrtka_creation(self):
        # Create a Korisnik instance first for the Tvrtka
        korisnik = Korisnik.objects.create(
            username='testtvrtka',
            email='tvrtka@example.com',
            password='password123',
            isTvrtka=True,
            isSusjed=False
        )
        
        # Create an actual Tvrtka instance in the test database
        tvrtka = Tvrtka.objects.create(
            sifTvrtka=korisnik,
            nazivTvrtka='Test Company',
            adresaTvrtka='Test Street 123',
            kvartTvrtka='Test Quarter',
            mjestoTvrtka='Test City'
        )
        
        # Verify the instance
        self.assertEqual(tvrtka.nazivTvrtka, 'Test Company')
        self.assertEqual(tvrtka.adresaTvrtka, 'Test Street 123')
        self.assertEqual(tvrtka.mjestoTvrtka, 'Test City')
        self.assertTrue(tvrtka.pk)  # Check that the instance has been saved

    def test_tvrtka_creation_failed(self):  ### FAIL AssertionError: ValueError not raised
        korisnik = Korisnik.objects.create(
            username='testuser2',
            email='testuser2@example.com',
            password='password123',
            isTvrtka=True,
            isSusjed=False
        )
        
        with self.assertRaises(ValueError):
            Tvrtka.objects.create(
                sifTvrtka=korisnik,
                nazivTvrtka='',
                adresaTvrtka='',
                kvartTvrtka='',
                mjestoTvrtka=''
            )

    def test_tvrtka_unique_constraint(self):
        korisnik1 = Korisnik.objects.create(
            username='user1',
            email='user1@example.com',
            password='password123',
            isTvrtka=True,
            isSusjed=False
        )

        # Create Tvrtka for the first user
        Tvrtka.objects.create(
            sifTvrtka=korisnik1,
            nazivTvrtka='Company 1',
            adresaTvrtka='Street 1',
            kvartTvrtka='Quarter 1',
            mjestoTvrtka='City 1'
        )

        # Attempt to create a second Tvrtka for the same user, which should fail due to the unique constraint
        with self.assertRaises(Exception):  # Expecting a unique constraint error
            Tvrtka.objects.create(
                sifTvrtka=korisnik1,  # Same user, should fail due to unique constraint
                nazivTvrtka='Company 2',
                adresaTvrtka='Street 2',
                kvartTvrtka='Quarter 2',
                mjestoTvrtka='City 2'
            )

    def test_tvrtka_model_relation(self):
        korisnik = Korisnik.objects.create(
            username='company_user',
            email='company_user@example.com',
            password='password123',
            isTvrtka=True,
            isSusjed=False
        )
        
        tvrtka = Tvrtka.objects.create(
            sifTvrtka=korisnik,
            nazivTvrtka='Test Corp',
            adresaTvrtka='Test Address 123',
            kvartTvrtka='Test Quarter',
            mjestoTvrtka='Test City'
        )
        
        # Test the reverse relationship
        self.assertEqual(tvrtka.sifTvrtka.email, 'company_user@example.com')

    # ========================= Susjed Model =========================

    def test_susjed_creation(self):
        # Create a Korisnik instance first for the Susjed
        korisnik = Korisnik.objects.create(
            username='john_doe',
            email='john.doe@example.com',
            password='password123',
            isTvrtka=False,
            isSusjed=True
        )
        
        # Create an actual Susjed instance in the test database
        susjed = Susjed.objects.create(
            sifSusjed=korisnik,
            ime='John',
            prezime='Doe',
            mjestoSusjed='Zagreb',
            kvartSusjed='Centar'
        )
        
        # Verify the instance
        self.assertEqual(susjed.ime, 'John')
        self.assertEqual(susjed.prezime, 'Doe')
        self.assertEqual(susjed.mjestoSusjed, 'Zagreb')
        self.assertTrue(susjed.pk)  # Check that the instance has been saved

    def test_susjed_creation_failed(self):  ### FAIL AssertionError: ValueError not raised
        korisnik = Korisnik.objects.create(
            username='susjed1',
            email='susjed1@example.com',
            password='password123',
            isTvrtka=False,
            isSusjed=True
        )

        with self.assertRaises(ValueError):
            Susjed.objects.create(
                sifSusjed=korisnik,
                ime='',
                prezime='',
                mjestoSusjed='',
                kvartSusjed=''
            )

    def test_susjed_model_relation(self):
        korisnik = Korisnik.objects.create(
            username='john_doe',
            email='john.doe@example.com',
            password='password123',
            isTvrtka=False,
            isSusjed=True
        )
        
        susjed = Susjed.objects.create(
            sifSusjed=korisnik,
            ime='John',
            prezime='Doe',
            mjestoSusjed='Zagreb',
            kvartSusjed='Centar'
        )
        
        # Check the reverse relationship
        self.assertEqual(susjed.sifSusjed.username, 'john_doe')

    # ========================= Događaj Model =========================

    def test_dogadaj_creation_failed(self):     ### ERROR TypeError: Field 'sifVolonter' expected a number but got <Korisnik: event_user2@example.com>.
        korisnik = Korisnik.objects.create(
            username='event_user2',
            email='event_user2@example.com',
            password='password123',
            isTvrtka=False,
            isSusjed=True
        )
        
        with self.assertRaises(ValueError):
            Dogadaj.objects.create(
                sifVolonter=korisnik,
                nazivDogadaj='',
                adresaDogadaj='',
                datumDogadaj=''#,
                #brojVolontera=-1    -> NE POSTOJI brojVolontera U models.py!!!
                # i falit će vrijemeDogadaj (i par drugih obaveznih još...)
            )
    
    def test_dogadaj_model_relation(self):  ### ERROR TypeError: Field 'sifVolonter' expected a number but got <Korisnik: event_user@example.com>.
        korisnik = Korisnik.objects.create(
            username='event_user',
            email='event_user@example.com',
            password='password123',
            isTvrtka=False,
            isSusjed=True
        )
        
        dogadaj = Dogadaj.objects.create(
            sifVolonter=korisnik,
            nazivDogadaj='Test Event',
            adresaDogadaj='Test Location',
            datumDogadaj='2025-01-01'#,
            #brojVolontera=10    -> NE POSTOJI brojVolontera U models.py!!!
            # i falit će vrijemeDogadaj (i par drugih obaveznih još...)
        )
        
        self.assertEqual(dogadaj.sifVolonter.email, 'event_user@example.com')  # Reverse relationship

    def test_dogadaj_edge_case(self):   ### ERROR TypeError: Field 'sifVolonter' expected a number but got <Korisnik: edge_case_event@example.com>.
        korisnik = Korisnik.objects.create(
            username='edge_case_event',
            email='edge_case_event@example.com',
            password='password123',
            isTvrtka=False,
            isSusjed=True
        )
        
        dogadaj = Dogadaj.objects.create(
            sifVolonter=korisnik,
            nazivDogadaj='A' * 255,  # Max length for the event name
            adresaDogadaj='B' * 255,
            datumDogadaj='2025-01-01'#,
            #brojVolontera=100    -> NE POSTOJI brojVolontera U models.py!!!
            # i falit će vrijemeDogadaj (i par drugih obaveznih još...)
        )
        
        self.assertEqual(dogadaj.nazivDogadaj, 'A' * 255)
        self.assertEqual(dogadaj.adresaDogadaj, 'B' * 255)
    
    # ========================= Zahtjev Model =========================

    def test_zahtjev_creation(self):    ### ERROR TypeError: Field 'sifVolonter' expected a number but got <Korisnik: event_user2@example.com>.
        korisnik = Korisnik.objects.create(
            username='request_user',
            email='request_user@example.com',
            password='password123',
            isTvrtka=False,
            isSusjed=True
        )
        
        zahtjev = Zahtjev.objects.create(
            sifSusjed=korisnik,
            nazivZahtjev='Test Request',
            #datumZahtjev='2025-01-01',    -> NE POSTOJI datumZahtjev U models.py!!!
            statusZahtjev='ČEKANJE'
        )
        
        # Verify the instance
        self.assertEqual(zahtjev.nazivZahtjev, 'Test Request')
        self.assertEqual(zahtjev.statusZahtjev, 'ČEKANJE')
        self.assertTrue(zahtjev.pk)  # Check that the instance has been saved
    
    def test_zahtjev_creation_failed(self): ### ERROR TypeError: Field 'sifVolonter' expected a number but got <Korisnik: event_user2@example.com>.
        korisnik = Korisnik.objects.create(
            username='request_user2',
            email='request_user2@example.com',
            password='password123',
            isTvrtka=False,
            isSusjed=True
        )
        
        with self.assertRaises(ValueError):
            Zahtjev.objects.create(
                sifSusjed=korisnik,
                nazivZahtjev='',
                #datumZahtjev='',    -> NE POSTOJI datumZahtjev U models.py!!!
                statusZahtjev=''
            )
    
    def test_zahtjev_unique_constraint(self):   ### ERROR TypeError: Field 'sifVolonter' expected a number but got <Korisnik: event_user2@example.com>.
        korisnik = Korisnik.objects.create(
            username='unique_request_user',
            email='unique_request_user@example.com',
            password='password123',
            isTvrtka=False,
            isSusjed=True
        )

        # Create Zahtjev for the user
        Zahtjev.objects.create(
            sifSusjed=korisnik,
            nazivZahtjev='Unique Request',
            #datumZahtjev='2025-01-01',    -> NE POSTOJI datumZahtjev U models.py!!!
            statusZahtjev='ČEKANJE'
        )
        
        # Attempt to create a second Zahtjev for the same user, which should fail due to the unique constraint
        with self.assertRaises(Exception):  # Expecting a unique constraint error
            Zahtjev.objects.create(
                sifSusjed=korisnik,  # Same user, should fail
                nazivZahtjev='Another Request',
                #datumZahtjev='2025-02-01',    -> NE POSTOJI datumZahtjev U models.py!!!
                statusZahtjev='PRIHVAĆEN'
            )

    def test_zahtjev_model_relation(self):  ### ERROR TypeError: Field 'sifVolonter' expected a number but got <Korisnik: event_user2@example.com>.
        korisnik = Korisnik.objects.create(
            username='request_user',
            email='request_user@example.com',
            password='password123',
            isTvrtka=False,
            isSusjed=True
        )
        
        zahtjev = Zahtjev.objects.create(
            sifSusjed=korisnik,
            nazivZahtjev='Test Request',
            #datumZahtjev='2025-01-01',    -> NE POSTOJI datumZahtjev U models.py!!!
            statusZahtjev='ČEKANJE'
        )
        
        self.assertEqual(zahtjev.sifSusjed.email, 'request_user@example.com')  # Reverse relationship
    
    # ========================= Ponuda Model =========================

    def test_ponuda_creation(self): ### ERROR ValueError: Cannot assign "<Korisnik: offer_user@example.com>": "Ponuda.sifTvrtka" must be a "Tvrtka" instance.
        korisnik = Korisnik.objects.create(
            username='offer_user',
            email='offer_user@example.com',
            password='password123',
            isTvrtka=True,
            isSusjed=False
        )
        
        ponuda = Ponuda.objects.create(
            sifTvrtka=korisnik,
            nazivPonude='Test Offer',
            kadZadano='2025-01-01',
            statusPonude='ČEKANJE'
        )
        
        # Verify the instance
        self.assertEqual(ponuda.nazivPonude, 'Test Offer')
        self.assertEqual(ponuda.statusPonude, 'ČEKANJE')
        self.assertTrue(ponuda.pk)  # Check that the instance has been saved

    def test_ponuda_creation_failed(self):
        korisnik = Korisnik.objects.create(
            username='offer_user2',
            email='offer_user2@example.com',
            password='password123',
            isTvrtka=True,
            isSusjed=False
        )
        
        with self.assertRaises(ValueError):
            Ponuda.objects.create(
                sifTvrtka=korisnik,
                nazivPonude='',
                kadZadano='',
                statusPonude=''
            )
    
    def test_ponuda_model_relation(self):   ### ERROR ValueError: Cannot assign "<Korisnik: offer_user@example.com>": "Ponuda.sifTvrtka" must be a "Tvrtka" instance.
        korisnik = Korisnik.objects.create(
            username='offer_user',
            email='offer_user@example.com',
            password='password123',
            isTvrtka=True,
            isSusjed=False
        )
        
        ponuda = Ponuda.objects.create(
            sifTvrtka=korisnik,
            nazivPonude='Test Offer',
            kadZadano='2025-01-01',
            statusPonude='ČEKANJE'
        )
        
        self.assertEqual(ponuda.sifTvrtka.email, 'offer_user@example.com')  # Reverse relationship