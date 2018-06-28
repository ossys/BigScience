from django.test import TestCase

from ..models import UserProfile

# Create your tests here.
class UserProfileTestCase(TestCase):
    """Test Suite for the UserProfile model."""

    def setUp(self):
        """Define the test client and other test variables."""
        self.email = "test@example.com"
        self.username = "testcase"
        self.first_name = "Test"
        self.last_name = "Case"
        self.password = "Awesome1"
        self.userprofile = UserProfile(email=self.email, username=self.username, 
                                              first_name=self.first_name, last_name=self.last_name, 
                                              password=self.password)

    def test_model_can_create_a_userprofile(self):
        """Test the bucketlist model can create a bucketlist."""
        old_count = UserProfile.objects.count()
        self.userprofile.save()
        new_count = UserProfile.objects.count()
        self.assertNotEqual(old_count, new_count)
