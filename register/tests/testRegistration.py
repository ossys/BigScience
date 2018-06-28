from django.test import TestCase

from rest_framework.test import APIClient
from rest_framework import status

# Define this after the ModelTestCase
class UserProfileViewSetTestCase(TestCase):
    """Test suite for the registration endpoint."""

    def setUp(self):
        """Define the test client and other test variables."""
        self.client = APIClient()

    def test_api_can_create_a_user_profile(self):
        """Test the api has bucket creation capability."""
        userprofile_data = {
            'email': 'test@example.com',
            'username': 'ccravens',
            'first_name': 'Chad',
            'last_name': 'Cravens',
            'password': 'Awesome1'
        }
        response = self.client.post(
            '/api/userprofile',
            userprofile_data,
            format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
