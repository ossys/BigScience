from django.test import TestCase

from rest_framework.test import APIClient
from rest_framework import status

from models import models

# Define this after the ModelTestCase
class UserProfileViewSetTestCase(TestCase):
    """Test suite for the registration endpoint."""

    def setUp(self):
        """Define the test client and other test variables."""
        self.client = APIClient()

    def test_api_denies_incorrect_login(self):
        """Test the api has bucket creation capability."""
        login_data = {
            'email': 'nouser@example.com',
            'password': 'nopassword'
        }
        response = self.client.post(
            '/api/login',
            login_data,
            format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_api_allows_correct_login(self):
        """Test the api has bucket creation capability."""
        user = models.UserProfile.objects.create_user(email='test@example.com',username='test',password='Awesome1')
        login_data = {
            'email': 'test@example.com',
            'password': 'Awesome1'
        }
        response = self.client.post(
            '/api/login',
            login_data,
            format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
