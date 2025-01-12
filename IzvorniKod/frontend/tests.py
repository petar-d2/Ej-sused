from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from django.test import LiveServerTestCase
from selenium import webdriver
import os
import time

class LoginFormTest(LiveServerTestCase):
    host_url = "http://127.0.0.1:8000/"  # Use environment variable or Django settings if possible

    def setUp(self):
        self.driver = webdriver.Chrome()  # Ensure you have the correct driver installed and in PATH

    def test_login_successful(self):
        self.driver.get(self.host_url + "prijava/")

        # Wait for elements and perform actions
        email = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "email")))
        password = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "password")))
        submit = WebDriverWait(self.driver, 10).until(EC.element_to_be_clickable((By.ID, "submit")))

        # Enter credentials
        email.send_keys("cigo@gmail.com")  # Ensure this user exists in the test database
        password.send_keys("admin123")
        submit.send_keys(Keys.RETURN)

        # Assert redirection to a logged-in page (modify expected URL/title as needed)
        WebDriverWait(self.driver, 10).until(EC.title_contains("EjSused"))
        self.assertIn(self.host_url, self.driver.current_url)

    def test_login_empty_input(self):
        self.driver.get(self.host_url + "prijava/")

        # Wait for form elements to load
        email = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "email")))
        password = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "password")))
        submit = WebDriverWait(self.driver, 10).until(EC.element_to_be_clickable((By.ID, "submit")))

        # Use JavaScript to trigger form submission, bypassing the validation
        self.driver.execute_script("arguments[0].click();", submit)

        time.sleep(5)  # Give time for the validation to trigger

        # Print page source to see if any validation message appears
        #print(self.driver.page_source)

        # Check for validation message (like "Unesite ovo polje" for empty fields)
        # We assume here that the validation message will be present as part of the form error
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
        time.sleep(3)
        # Validate error for invalid credentials
        error_message = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "error-message"))
        )
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
        time.sleep(2)
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
        submit.click()

        # Wait for validation error
        alert = WebDriverWait(self.driver, 5).until(EC.alert_is_present())
        alert_text = alert.text

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
        email.send_keys("cigo@gmail.com")  # Ensure this user exists in your test database
        password.send_keys("admin123")
        submit.send_keys(Keys.RETURN)
        time.sleep(4)
        print(self.driver.current_url)
        # Step 2: Navigate to the event creation page
        self.driver.get(self.host_url + "kreiraj-dogadaj/")
        time.sleep(4)
        print(self.driver.current_url)
        # Locate the form fields
        time.sleep(3)
        print(self.driver.page_source)
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
        self.assertIn("Događaj uspešno kreiran!", success_message.text)
import json
from unittest.mock import patch


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
        self.driver.get(self.host_url + "ponude-susjeda/")
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "susjed-card-container"))
        )

        # Verify that the correct number of cards are displayed
        cards = self.driver.find_elements(By.CLASS_NAME, "susjed-card")
        self.assertGreaterEqual(len(cards), len(mock_response["data"]))

        # Step 3: Click on a SusjedCard
        first_card = cards[0]
        first_card.click()

        # Step 4: Assert redirection to the correct URL
        user_id = mock_response["data"][0]["korisnik_id"]
        expected_url = f"{self.host_url}susjed/{user_id}"
        WebDriverWait(self.driver, 10).until(EC.url_contains(expected_url))
        self.assertEqual(self.driver.current_url, expected_url)