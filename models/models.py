from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.models import BaseUserManager

# Create your models here.
class UserManager(BaseUserManager):
    """Helps Django work with our custom user model."""
    
    def create_user(self, username, email, password, **extra_fields):
        """Create a new user."""

        if not username:
            raise ValueError('The username is required.')

        if not email:
            raise ValueError('The email is required.')

        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, username, email, password, **extra_fields):
        """ Create and save a new superuser """
        
        user = self.create_user(username, email, password, **extra_fields);
        
        user.is_superuser = True
        user.is_staff = True
        
        user.save(using=self._db)
        
        return user


class User(AbstractBaseUser, PermissionsMixin):
    """Represents a User."""

    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']
    
    def get_full_name(self):
        """ Get a user's full name """
        return self.first_name + " " + self.last_name

    def __str__(self):
        """Convert the object to a string"""
        return self.email


class Response:
    success = False
    data = {}
    message = ''

    def __init__(self, success=False, data={}, message=''):
        self.success = success
        self.data = data
        self.message = message

    def dict(self):
        return {
            'success': self.success,
            'data': self.data,
            'message' : self.message
        }
