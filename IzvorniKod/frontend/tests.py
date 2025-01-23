from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from django.test import LiveServerTestCase
from selenium import webdriver
from unittest.mock import patch
import time

#time.sleep() funkcija je koristena jer nam je baza usporena u free planu pa nemamo kako bas drugog nacina osim cekanja tj. sleep funkcije

class LoginFormTest(LiveServerTestCase):
    host_url = "http://127.0.0.1:8000/"

    def setUp(self):
        self.driver = webdriver.Chrome()  # Ensure you have the correct driver installed and in PATH

    def test_login_successful(self):
        self.driver.get(self.host_url + "prijava/")

        # Wait for elements and perform actions
        email = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "email")))
        password = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "password")))
        submit = WebDriverWait(self.driver, 10).until(EC.element_to_be_clickable((By.ID, "submit")))

        # Enter credentials
        email.send_keys("testuser@example.com")  # Ensure this user exists in the test database
        password.send_keys("password123")
        submit.send_keys(Keys.RETURN)

        # Assert redirection to a logged-in page (modify expected URL/title as needed)
        WebDriverWait(self.driver, 10).until(EC.title_contains("EjSused"))
        self.assertIn(self.host_url, self.driver.current_url)
        time.sleep(8)

    def test_login_empty_input(self):
        self.driver.get(self.host_url + "prijava/")

        # Wait for form elements to load
        email = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "email")))
        password = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "password")))
        submit = WebDriverWait(self.driver, 10).until(EC.element_to_be_clickable((By.ID, "submit")))

        # Use JavaScript to trigger form submission, bypassing the validation
        self.driver.execute_script("arguments[0].click();", submit)

        time.sleep(5)  # Give time for the validation to trigger

        
        error_message = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "error-message"))
        )

        # Validate presence of error messages
        self.assertIn("Unesite email i lozinku", error_message.text, msg="Error message is not correct.")


    def test_login_wrong_credentials(self):
        self.driver.get(self.host_url + "prijava/")

        # Enter wrong credentials
        email = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "email")))
        password = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "password")))
        submit = WebDriverWait(self.driver, 10).until(EC.element_to_be_clickable((By.ID, "submit")))

        email.send_keys("wronguser@gmail.com")
        password.send_keys("wrongpassword")
        submit.send_keys(Keys.RETURN)
        # Validate error for invalid credentials
        error_message = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "error-message"))
        )

        time.sleep(4)
        self.assertIn("Neuspješna prijava", error_message.text)

    def tearDown(self):
        self.driver.quit()

class RegistrationFormTest(LiveServerTestCase):
    host_url = "http://127.0.0.1:8000/"  # Change this if your test server runs on a different host/port

    def setUp(self):
        self.driver = webdriver.Chrome()  # Ensure you have the correct driver installed and in PATH

    def test_registration_successful(self):
        self.driver.get(self.host_url + "registracija/")

        email = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "email")))
        password = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "password1")))
        confirm_password = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "password2")))
        submit = WebDriverWait(self.driver, 10).until(EC.element_to_be_clickable((By.ID, "button_1")))
        # Enter valid registration credentials
        email.send_keys("newuser@gmail.com")
        password.send_keys("admin123")
        confirm_password.send_keys("admin123")
        submit.click()

        # Wait for redirection to another page or confirmation
        WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "h2")))  # Modify tag (e.g., h2) to reflect successful registration UI
        success_message = self.driver.find_element(By.TAG_NAME, "h2").text  # Adjust based on UI element
        time.sleep(3)
        #print(self.driver.page_source)
        self.assertIn("Vrsta registracije", success_message, "Registration was not successful or incorrect redirection occurred.")

    def test_registration_passwords_do_not_match(self):
        self.driver.get(self.host_url + "registracija/")

        # Wait for elements
        email = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "email")))
        password = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "password1")))
        confirm_password = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "password2")))
        submit = WebDriverWait(self.driver, 10).until(EC.element_to_be_clickable((By.ID, "button_1")))

        # Enter mismatched passwords
        email.send_keys("newuser@gmail.com")
        password.send_keys("password1")
        confirm_password.send_keys("password2")
        time.sleep(3)
        submit.click()

        # Wait for validation error
        alert = WebDriverWait(self.driver, 5).until(EC.alert_is_present())
        alert_text = alert.text
        time.sleep(3)

        self.assertIn("Lozinke se ne podudaraju", alert_text, "Validation message for mismatched passwords is incorrect.")

    def tearDown(self):
        self.driver.quit()
class KreirajDogadajTest(LiveServerTestCase):
    host_url = "http://127.0.0.1:8000/"  # Update with your Django server's URL

    def setUp(self):
        self.driver = webdriver.Chrome()

    def tearDown(self):
        self.driver.quit()

    def test_create_event_successfully(self):
        # Step 1: Log in the user
        self.driver.get(self.host_url + "prijava/")

        # Locate login fields and perform login
        email = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "email"))
        )
        password = self.driver.find_element(By.ID, "password")
        submit = self.driver.find_element(By.ID, "submit")

        # Use test credentials for a valid user
        email.send_keys("testuser@example.com")  # Ensure this user exists in your test database
        password.send_keys("password123")
        submit.send_keys(Keys.RETURN)
        time.sleep(4)
        print(self.driver.current_url)
        # Step 2: Navigate to the event creation page
        self.driver.get(self.host_url + "kreiraj-dogadaj/")
        time.sleep(4)
        print(self.driver.current_url)
        # Locate the form fields
        time.sleep(3)
        # print(self.driver.page_source)
        naziv_dogadaj = WebDriverWait(self.driver, 60).until(
            EC.presence_of_element_located((By.ID, "nazivDogadaj"))
        )
        datum_dogadaj = self.driver.find_element(By.ID, "datumDogadaj")
        vrijeme_dogadaj = self.driver.find_element(By.ID, "vrijemeDogadaj")
        adresa_dogadaj = self.driver.find_element(By.ID, "adresaDogadaj")
        vrsta_dogadaj = self.driver.find_element(By.ID, "vrstaDogadaj")
        opis_dogadaj = self.driver.find_element(By.ID, "opisDogadaj")
        nagrada_bod = self.driver.find_element(By.ID, "nagradaBod")
        submit_button = self.driver.find_element(By.XPATH, "//button[@type='submit']")

        # Fill in the form fields
        naziv_dogadaj.send_keys("Testni Događaj")
        datum_dogadaj.send_keys("1.2.2025")  # Example date
        vrijeme_dogadaj.send_keys("15:30")     # Example time
        adresa_dogadaj.send_keys("Testna Adresa 123")
        vrsta_dogadaj.send_keys("Volonterski")
        opis_dogadaj.send_keys("Ovo je opis testnog događaja.")
        nagrada_bod.send_keys("50")

        # Submit the form
        submit_button.send_keys(Keys.RETURN)

        # Step 3: Assert success message is displayed
        success_message = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "alert-success"))
        )

        time.sleep(4)
        self.assertIn("Događaj uspješno kreiran!", success_message.text)

class PonudeSusjedaTest(LiveServerTestCase):
    host_url = "http://127.0.0.1:8000/"  # Update with your Django server's URL

    def setUp(self):
        self.driver = webdriver.Chrome()

    def tearDown(self):
        self.driver.quit()

    @patch("requests.post")  # Mock API requests
    def test_ponude_susjeda_and_click_card(self, mock_post):
        # Step 1: Mock API Response
        mock_response = {
            "data": [
                {
                    "korisnik_id": 1,
                    "ime": "Marko",
                    "prezime": "Horvat",
                    "email": "marko@example.com",
                    "skills": "Programiranje, Kuhanje",
                    "zbrojOcjena": 45,
                    "brojOcjena": 9,
                },
                {
                    "korisnik_id": 2,
                    "ime": "Ana",
                    "prezime": "Novak",
                    "email": "ana@example.com",
                    "skills": "Dizajn, Pisanje",
                    "zbrojOcjena": 50,
                    "brojOcjena": 10,
                },
            ]
        }
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = mock_response

        # Step 2: Navigate to the page
        self.driver.get(self.host_url + "susjedi/")
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "susjed-card-container"))
        )
        time.sleep(4)

        # Verify that the correct number of cards are displayed
        cards = self.driver.find_elements(By.CLASS_NAME, "susjed-card")
        self.assertGreaterEqual(len(cards), len(mock_response["data"]))

        # Step 3: Click on a SusjedCard
        first_card = cards[0]
        first_card.click()
        time.sleep(4)

        # Step 4: Assert redirection to the correct URL
        user_id = mock_response["data"][0]["korisnik_id"]
        expected_url = f"{self.host_url}susjed/{user_id}"
        WebDriverWait(self.driver, 10).until(EC.url_contains(expected_url))
        time.sleep(4)

        self.assertEqual(self.driver.current_url, expected_url)


class DogadajiSearchAndNavigationTest(LiveServerTestCase):
    host_url = "http://127.0.0.1:8000/"  # Update with your Django server's URL

    def setUp(self):
        self.driver = webdriver.Chrome()

    def tearDown(self):
        self.driver.quit()

    def test_create_search_and_click_event_with_signin(self):
        # Step 1: Log in the user
        self.driver.get(self.host_url + "prijava/")  # Assuming this is the login URL
        email = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "email"))
        )
        password = self.driver.find_element(By.ID, "password")
        submit = self.driver.find_element(By.ID, "submit")

        # Use test credentials for a valid user
        email.send_keys("testuser@example.com")  # Ensure this user exists in your test database
        password.send_keys("password123")
        submit.send_keys(Keys.RETURN)
        time.sleep(4)  # Wait for login to complete
        self.assertEqual(self.host_url, self.driver.current_url)  # Verify successful login

        # Step 2: Navigate to the event creation page
        self.driver.get(self.host_url + "kreiraj-dogadaj/")
        time.sleep(4)
        
        # Locate the form fields for creating an event
        naziv_dogadaj = WebDriverWait(self.driver, 60).until(
            EC.presence_of_element_located((By.ID, "nazivDogadaj"))
        )
        datum_dogadaj = self.driver.find_element(By.ID, "datumDogadaj")
        vrijeme_dogadaj = self.driver.find_element(By.ID, "vrijemeDogadaj")
        adresa_dogadaj = self.driver.find_element(By.ID, "adresaDogadaj")
        vrsta_dogadaj = self.driver.find_element(By.ID, "vrstaDogadaj")
        opis_dogadaj = self.driver.find_element(By.ID, "opisDogadaj")
        nagrada_bod = self.driver.find_element(By.ID, "nagradaBod")
        submit_button = self.driver.find_element(By.XPATH, "//button[@type='submit']")

        # Fill in the form fields
        naziv_dogadaj.send_keys("test search")
        datum_dogadaj.send_keys("1.2.2025")  # Example date
        vrijeme_dogadaj.send_keys("15:30")     # Example time
        adresa_dogadaj.send_keys("Testna Adresa 123")
        vrsta_dogadaj.send_keys("Volonterski")
        opis_dogadaj.send_keys("Ovo je opis testnog događaja.")
        nagrada_bod.send_keys("50")

        # Submit the form to create the event
        submit_button.send_keys(Keys.RETURN)
        
        # Step 3: Navigate to the events page and check if the event is displayed
        self.driver.get(self.host_url + "dogadaji/")  # Navigate to the events page
        time.sleep(5)  # Wait for the page to load
        
        # Use class_name to find all dogadaj cards
        event_cards = self.driver.find_elements(By.CLASS_NAME, "dogadaj-card")
        print(f"Found {len(event_cards)} event cards before searching.")
        
        # Step 4: Enter the event name in the search box
        search_input = self.driver.find_element(By.CLASS_NAME, "search-input")
        search_input.send_keys("test search")  # Enter the name of the event to search for
        search_input.send_keys(Keys.RETURN)
        
        # Allow debounce and loading to complete
        time.sleep(5)
        
        # Check event cards again
        event_cards = self.driver.find_elements(By.CLASS_NAME, "dogadaj-card")
        print(f"Found {len(event_cards)} event cards after search.")
        
        # Step 5: Assert if the event appears in the event list
        self.assertGreater(len(event_cards), 0, "No event cards found.")  # Ensure there are event cards

        # Check if the event name exists in one of the cards
        found_event = any("test search" in card.text for card in event_cards)
        time.sleep(4)
        self.assertTrue(found_event, f"Event 'test search' was not found in the list.")  # Check if the event name is in one of the cards



class TvrtkaSortSearchTest(LiveServerTestCase):
    host_url = "http://127.0.0.1:8000/"  # Update with your Django server's URL

    def setUp(self):
        self.driver = webdriver.Chrome()

    def tearDown(self):
        self.driver.quit()

    @patch("requests.post")
    def test_tvrtke_create_search_sort_and_navigation(self, mock_post):
        mock_post.return_value.status_code = 201  # Mocking the 201 Created response
        mock_response = {   # ne koristi se nigdje???
            "data":
                {
                    'email': 'newcompany@example.com',
                    'password': 'password123',
                    'adresa': 'Company Address 123',
                    'kvart': 'Some Quarter',
                    'isTvrtka': True,
                    'nazivTvrtka': 'Test Tvrtka',
                    'mjestoTvrtka': 'Test City',
                    'opisTvrtka': 'Test description for the new company.',
                    'brojOcjena': 0,
                    'zbrojOcjena': 0,
                },
        },
        
        # Step 2: Log in to the application (using Selenium)
        self.driver.get(self.host_url + "prijava/")  # Navigate to the login page
        email = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "email"))
        )
        password = self.driver.find_element(By.ID, "password")
        submit = self.driver.find_element(By.ID, "submit")

        email.send_keys("testuser@example.com")  # Test credentials
        password.send_keys("password123")
        submit.send_keys(Keys.RETURN)

        time.sleep(6)  # Wait for the login to complete
        self.assertEqual(self.driver.current_url, self.host_url)

        # Step 3: Navigate to the Tvrtke page and check if the new Tvrtka is present
        self.driver.get(self.host_url + "tvrtke/")
        time.sleep(5)

        tvrtka_cards = self.driver.find_elements(By.CLASS_NAME, "tvrtka-card")
        print(f"Found {len(tvrtka_cards)} tvrtka cards before search.")
        time.sleep(4)

        # Step 4: Perform the search for the newly created Tvrtka
        search_input = self.driver.find_element(By.ID, "search1")
        search_input.send_keys("Test")  # Search for the created Tvrtka
        search_input.send_keys(Keys.RETURN)

        time.sleep(5)  # Allow debounce and loading to complete

        # Verify search results
        tvrtka_cards = self.driver.find_elements(By.CLASS_NAME, "tvrtka-card")
        print(f"Found {len(tvrtka_cards)} tvrtka cards after search.")
        time.sleep(5)
        self.assertGreater(len(tvrtka_cards), 0, "No results found for the search.")
        
        found_tvrtka = any("Test" in card.text for card in tvrtka_cards)
        time.sleep(5)
        self.assertTrue(found_tvrtka, "Searched tvrtka not found in the results.")

        # Step 5: Test sorting functionality
        sort_dropdown = self.driver.find_element(By.ID, "sort_tvrtke")
        sort_dropdown.click()
        sort_option = self.driver.find_element(By.XPATH, "//option[@value='ocjena']")
        sort_option.click()

        time.sleep(5)  # Allow sorting to apply

        # Re-fetch and verify the sorted results
        tvrtka_cards = self.driver.find_elements(By.CLASS_NAME, "tvrtka-card")
        self.assertGreater(len(tvrtka_cards), 0, "No tvrtka cards found after sorting.")

        # Step 6: Click on a TvrtkaCard and verify navigation
        tvrtka_cards[0].click()  # Click the first card
        time.sleep(6)

        # Verify that the user is redirected to the tvrtka details page
        self.assertTrue(
            "/tvrtka/" in self.driver.current_url,
            "Navigation to the tvrtka details page failed.",
        )