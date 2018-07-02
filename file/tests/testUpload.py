import tempfile, os

from django.test import TestCase

from rest_framework.test import APIClient
from rest_framework import status

from models import models

# Define this after the ModelTestCase
class FileUploadApiViewTestCase(TestCase):
    """Test suite for the registration endpoint."""

    def setUp(self):
        """Define the test client and other test variables."""
        self.client = APIClient()
        
    def generate_random_binary_file(self, size=1024):
        file = tempfile.TemporaryFile()
        file.write(os.urandom(size))
        file.seek(0)
        print('FILENAME: ' + file.name)
        return file

    def test_file_is_uploaded(self):
#         self.client.force_authenticate(self.user)

        response = self.client.post(
            '/api/upload',
            {
                "name": "Test File",
                "file": generate_random_binary_file(1024)
            },
            format="multipart")
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
