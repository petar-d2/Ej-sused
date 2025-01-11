from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from django.test import LiveServerTestCase
from selenium import webdriver
import time

host_url = "http://127.0.0.1:8000/"
'''
class HostTest(LiveServerTestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()

    def test_page_title(self):
        # Open the page
        self.driver.get('http://127.0.0.1:8000/')

        # Wait for the title to change or for the body to load
        WebDriverWait(self.driver, 10).until(
            EC.title_contains("EjSused")  # Wait for the title to contain "EjSused"
        )
        # Now perform the assertion
        self.assertIn('EjSused', self.driver.title)

    def tearDown(self):
        self.driver.quit()
        '''
class LoginFormTest(LiveServerTestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()

    def test_login_successful(self):
        # Open the login page
        self.driver.get(host_url + "prijava/")
        print(self.driver.page_source)
        print(self.driver.title)
        # Wait for the email input field to be visible
        email = WebDriverWait(self.driver, 100).until(
            EC.visibility_of_element_located((By.ID, "email"))
        )

        # Wait for the password input field to be visible
        password = WebDriverWait(self.driver, 100).until(
            EC.visibility_of_element_located((By.ID, "password"))
        )

        # Wait for the submit button to be clickable
        submit = WebDriverWait(self.driver, 100).until(
            EC.element_to_be_clickable((By.ID, "submit"))
        )
        # Perform the login
        email.send_keys("admin@gmail.com") 
        password.send_keys("admin123")
        submit.send_keys(Keys.RETURN)
        time.sleep(3)
        # Wait for the title to change and verify the page content
        WebDriverWait(self.driver, 10).until(
            EC.title_contains("EjSused")
        )
        self.assertIn(host_url, self.driver.current_url)

    def tearDown(self):
        self.driver.quit()