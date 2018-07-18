import bcrypt
import re

from db.mongo import Mongo

class UserEntity:
    _collection = None

    _id = None
    _email = None
    _username = None
    _first_name = None
    _last_name = None
    _password = None

    def __init__(self):
        if UserEntity._collection is None:
            UserEntity._collection = Mongo().getCollection('user')

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
        if len(email) >= 7 and len(email) < 128 and re.match('[^@]+@[^@]+\.[^@]+', email):
            self._email = email

    @property
    def username(self):
        return self._username

    @username.setter
    def username(self, username):
        if len(username) >= 4 and len(username) < 16 and re.match('^[a-zA-Z0-9_]+$', username):
            self._username = username

    @property
    def first_name(self):
        return self._first_name

    @first_name.setter
    def first_name(self, first_name):
        if len(first_name) >= 1 and len(first_name) < 64:
            self._first_name = first_name

    @property
    def last_name(self):
        return self._last_name

    @last_name.setter
    def last_name(self, last_name):
        if len(last_name) >= 1 and len(last_name) < 64:
            self._last_name = last_name

    @property
    def password(self):
        return self._password

    @password.setter
    def password(self, password):
        if len(password) >= 8 and len(password) < 24:
            self._password = str(bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(12)), 'ascii')

    def insert(self):
        self._id = UserEntity._collection.insert_one(self._dict()).inserted_id

    def _dict(self):
        return {
            "email": self._email,
            "username": self._username,
            "first_name": self._first_name,
            "last_name": self._last_name,
            "password": self._password,
        }