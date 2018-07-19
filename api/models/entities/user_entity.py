import pymongo
import bcrypt
import re

from db.mongo import Mongo

class UserEntity:
    _collection = None
    _validator = None

    _id = None
    _email = None
    _username = None
    _first_name = None
    _last_name = None
    _password = None

    def __init__(self, validator):
        self._validator = validator
        if UserEntity._collection is None:
            UserEntity._collection = Mongo().getCollection('user')
            UserEntity._collection.create_index([('email', pymongo.ASCENDING)], unique=True)
            UserEntity._collection.create_index([('username', pymongo.ASCENDING)], unique=True)

    @property
    def id(self):
        return self._id

    @id.setter
    def id(self, id):
        self._id = id

    @property
    def email(self):
        return self._email

    @email.setter
    def email(self, email):
        if len(email) >= 7 and len(email) <= 128 and re.match('[^@]+@[^@]+\.[^@]+', email):
            self._email = email
        else:
            if len(email) < 7 or len(email) > 128:
                self._validator.addInvalidField('email','E-Mail must be between 7 and 128 characters')
            if not re.match(r'[^@]+@[^@]+\.[^@]+', email):
                self._validator.addInvalidField('email','Please enter a valid E-Mail address')

    @property
    def username(self):
        return self._username

    @username.setter
    def username(self, username):
        if len(username) >= 4 and len(username) <= 16 and re.match('^[a-zA-Z0-9_]+$', username):
            self._username = username
        else:
            if len(username) < 4 or len(username) > 16:
                self._validator.addInvalidField('username','Username must be between 4 and 16 characters')

    @property
    def first_name(self):
        return self._first_name

    @first_name.setter
    def first_name(self, first_name):
        if len(first_name) >= 1 and len(first_name) <= 64:
            self._first_name = first_name
        else:
            if len(first_name) < 1 or len(first_name) > 64:
                self._validator.addInvalidField('first_name','First Name must be between 1 and 64 characters')

    @property
    def last_name(self):
        return self._last_name

    @last_name.setter
    def last_name(self, last_name):
        if len(last_name) >= 1 and len(last_name) < 64:
            self._last_name = last_name
        else:
            if len(last_name) < 1 or len(last_name) > 64:
                self._validator.addInvalidField('last_name','Last Name must be between 1 and 64 characters')

    @property
    def password(self):
        return self._password

    @password.setter
    def password(self, password):
        if len(password) >= 8 and len(password) <= 24:
            self._password = str(bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(12)), 'ascii')
        else:
            if len(password) < 8 or len(password) > 24:
                self._validator.addInvalidField('password','Password must be between 8 and 24 characters')

    def insert(self):
        self._id = UserEntity._collection.insert_one(self.dict()).inserted_id
        if self._id is None:
            self._validator.addDatabaseError('Error inserting user')

    def dict(self):
        return {
            "email": self._email,
            "username": self._username,
            "first_name": self._first_name,
            "last_name": self._last_name,
            "password": self._password,
        }
