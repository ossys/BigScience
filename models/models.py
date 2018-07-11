from datetime import datetime, timedelta

from django.db import models
from django.conf import settings

from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.models import BaseUserManager

import jwt

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

    username = models.CharField(db_index=True, max_length=50, unique=True)
    email = models.EmailField(db_index=True, max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

#     def save(self, *args, **kwargs):
#         """ On save, update timestamps """
#         # If the record does not currently exist in the database
#         self.created_date = timezone.now()
#         self.updated_date = timezone.now()
# 
#         return super(UserProfile, self).save(*args, **kwargs)

    def get_full_name(self):
        """ Get a user's full name """
        return self.first_name + " " + self.last_name

    def __str__(self):
        """Convert the object to a string"""
        return self.email

    @property
    def token(self):
        """
        Allows us to get a user's token by calling `user.token` instead of
        `user.generate_jwt_token().

        The `@property` decorator above makes this possible. `token` is called
        a "dynamic property".
        """
        return self._generate_jwt_token()

    def _generate_jwt_token(self):
        """
        Generates a JSON Web Token that stores this user's ID and has an expiry
        date set to 60 days into the future.
        """
        dt = datetime.now() + timedelta(days=settings.JWT_DAYS_TO_EXPIRATION)

        token = jwt.encode({
            'id': self.pk,
            'exp': int(dt.strftime('%s'))
        }, settings.SECRET_KEY, algorithm='HS256')

        return token.decode('utf-8')


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


class File(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    sha256 = models.CharField(max_length=64, unique=True)
    last_modified_date = models.DateTimeField(auto_now=False)
    name = models.CharField(max_length=256)
    size = models.IntegerField()
    total_chunks = models.IntegerField()
    chunks_written = models.IntegerField()


class FileChunk(models.Model):
    file = models.ForeignKey(File, on_delete=models.CASCADE)
    sha256 = models.CharField(max_length=64, unique=True)
    chunk_id = models.IntegerField()
    start_byte = models.IntegerField()
    end_byte = models.IntegerField()
    data = models.BinaryField()
