import pymongo
import datetime
import re
import bcrypt
import os
import jwt
import bson
from db.mongo import Mongo

class UserEntity:
    _collection = None
    _validator = None

    def __init__(self, validator=None, obj=None):
        self._validator = validator
        if UserEntity._collection is None:
            UserEntity._collection = Mongo().getCollection('user')
            UserEntity._collection.create_index([('email', pymongo.ASCENDING)], unique=True)
            UserEntity._collection.create_index([('username', pymongo.ASCENDING)], unique=True)
        if obj is not None:
            self.instantiate(obj=obj)
        else:
            self._dict = {}
            self._dict['email'] = None
            self._dict['username'] = None
            self._dict['first_name'] = None
            self._dict['last_name'] = None
            self._dict['password'] = None
            self._dict['active'] = None
            self._dict['created_date'] = None
            self._dict['last_login_date'] = None
            self._dict['role'] = None
            self.__exists = False
            self.__dirty_attributes = {}
            self.__atomic = True

    def instantiate(self, obj=None):
        if obj is None:
            try:
                if 'id' in self._dict and self._dict['id'] is not None and isinstance(self._dict['id'], bson.ObjectId):
                    obj=UserEntity._collection.find_one({'_id': self._dict['id']})
                if 'email' in self._dict and self._dict['email'] is not None:
                    obj=UserEntity._collection.find_one({'email': self._dict['email']})
                if 'username' in self._dict and self._dict['username'] is not None:
                    obj=UserEntity._collection.find_one({'username': self._dict['username']})
            except:
                raise
        self._dict['id'] = obj['_id']
        self._dict['email'] = obj['email']
        self._dict['username'] = obj['username']
        self._dict['first_name'] = obj['first_name']
        self._dict['last_name'] = obj['last_name']
        self._dict['password'] = obj['password']
        self._dict['active'] = obj['active']
        self._dict['created_date'] = obj['created_date']
        self._dict['last_login_date'] = obj['last_login_date']
        self._dict['role'] = obj['role']
        self.__exists = True

    @property
    def id(self):
        if 'id' in self._dict:
            return self._dict['id']
        else:
            return None

    @id.setter
    def id(self, id):
        if not self.__exists:
            if isinstance(id, str):
                self._dict['id'] = bson.ObjectId(id)
            elif isinstance(id, bson.ObjectId):
                self._dict['id'] = id

    @property
    def email(self):
        if 'email' in self._dict:
            return self._dict['email']
        else:
            return None

    @email.setter
    def email(self, email):
        if isinstance(email, str) and len(email) >= 7 and len(email) <= 128 and re.match(r'[^@]+@[^@]+\.[^@]+', email):
            self.__dirty_attributes['email'] = email
            self._dict['email'] = email
        else:
            if not isinstance(email, str):
                self._validator.invalidType('email','E-Mail must be of type str, but instead got type ' + type(email).__name__)
            if not re.match(r'[^@]+@[^@]+\.[^@]+', email):
                self._validator.addInvalidField('email','Please enter a valid E-Mail')
            elif len(email) < 7 or len(email) > 128:
                self._validator.addInvalidField('email','E-Mail must be between 7 and 128 characters')

    @property
    def username(self):
        if 'username' in self._dict:
            return self._dict['username']
        else:
            return None

    @username.setter
    def username(self, username):
        if isinstance(username, str) and len(username) >= 5 and len(username) <= 14:
            self.__dirty_attributes['username'] = username
            self._dict['username'] = username
        else:
            if not isinstance(username, str):
                self._validator.invalidType('username','Username must be of type str, but instead got type ' + type(username).__name__)
            if len(username) < 5 or len(username) > 14:
                self._validator.addInvalidField('username','Username must be between 5 and 14 characters')

    @property
    def first_name(self):
        if 'first_name' in self._dict:
            return self._dict['first_name']
        else:
            return None

    @first_name.setter
    def first_name(self, first_name):
        if isinstance(first_name, str) and len(first_name) >= 2 and len(first_name) <= 60:
            self.__dirty_attributes['first_name'] = first_name
            self._dict['first_name'] = first_name
        else:
            if not isinstance(first_name, str):
                self._validator.invalidType('first_name','First Name must be of type str, but instead got type ' + type(first_name).__name__)
            if len(first_name) < 2 or len(first_name) > 60:
                self._validator.addInvalidField('first_name','First Name must be between 2 and 60 characters')

    @property
    def last_name(self):
        if 'last_name' in self._dict:
            return self._dict['last_name']
        else:
            return None

    @last_name.setter
    def last_name(self, last_name):
        if isinstance(last_name, str) and len(last_name) >= 2 and len(last_name) <= 60:
            self.__dirty_attributes['last_name'] = last_name
            self._dict['last_name'] = last_name
        else:
            if not isinstance(last_name, str):
                self._validator.invalidType('last_name','Last Name must be of type str, but instead got type ' + type(last_name).__name__)
            if len(last_name) < 2 or len(last_name) > 60:
                self._validator.addInvalidField('last_name','Last Name must be between 2 and 60 characters')

    @property
    def password(self):
        if 'password' in self._dict:
            return self._dict['password']
        else:
            return None

    @password.setter
    def password(self, password):
        if isinstance(password, str) and len(password) >= 8 and len(password) <= 20:
            self.__dirty_attributes['password'] = password
            self._dict['password'] = str(bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(12)), 'utf-8')
        else:
            if not isinstance(password, str):
                self._validator.invalidType('password','Password must be of type str, but instead got type ' + type(password).__name__)
            if len(password) < 8 or len(password) > 20:
                self._validator.addInvalidField('password','Password must be between 8 and 20 characters')

    @property
    def active(self):
        if 'active' in self._dict:
            return self._dict['active']
        else:
            return None

    @active.setter
    def active(self, active):
        if isinstance(active, bool):
            self.__dirty_attributes['active'] = active
            self._dict['active'] = active
        else:
            if not isinstance(active, bool):
                self._validator.invalidType('active','Active must be of type bool, but instead got type ' + type(active).__name__)

    @property
    def created_date(self):
        if 'created_date' in self._dict:
            return self._dict['created_date']
        else:
            return None

    @created_date.setter
    def created_date(self, created_date):
        if isinstance(created_date, datetime.date):
            self.__dirty_attributes['created_date'] = created_date
            self._dict['created_date'] = created_date
        else:
            if not isinstance(created_date, datetime.date):
                self._validator.invalidType('created_date','Created Date must be of type date, but instead got type ' + type(created_date).__name__)

    @property
    def last_login_date(self):
        if 'last_login_date' in self._dict:
            return self._dict['last_login_date']
        else:
            return None

    @last_login_date.setter
    def last_login_date(self, last_login_date):
        if isinstance(last_login_date, datetime.date):
            self.__dirty_attributes['last_login_date'] = last_login_date
            self._dict['last_login_date'] = last_login_date
        else:
            if not isinstance(last_login_date, datetime.date):
                self._validator.invalidType('last_login_date','Last Login Date must be of type date, but instead got type ' + type(last_login_date).__name__)

    @property
    def role(self):
        if 'role' in self._dict:
            return self._dict['role']
        else:
            return None

    @role.setter
    def role(self, role):
        if isinstance(role, int):
            self.__dirty_attributes['role'] = role
            self._dict['role'] = role
        else:
            if not isinstance(role, int):
                self._validator.invalidType('role','Role must be of type int, but instead got type ' + type(role).__name__)

    @property
    def atomic(self):
        return self.__atomic

    @atomic.setter
    def atomic(self, atomic):
        if isinstance(atomic, bool):
            self.__atomic = atomic

    def getOwnedFileIds(self): pass

    def insert(self):
        if not self.__exists and 'id' not in self._dict and not self._validator.hasErrors():
            try:
                self._dict['id'] = UserEntity._collection.insert_one(self._dict).inserted_id
            except pymongo.errors.DuplicateKeyError as err:
                self._validator.addDuplicateError(err)
            except Exception as err:
                self._validator.addDatabaseError(err)
            if 'id' in self._dict and not isinstance(self._dict['id'], bson.ObjectId):
                self._validator.addDatabaseError('Error inserting User')
            else:
                self.__exists = True

    def update(self):
        if self.__exists and 'id' in self._dict and isinstance(self._dict['id'], bson.ObjectId) and not self._validator.hasErrors():
            try:
                UserEntity._collection.update_one(
                        { '_id': self._dist['id'] },
                        { '$set': self.__dirty_attributes })
                self.__dirty_attributes.clear()
            except Exception as err:
                self._validator.addDatabaseError(err)

    def dict(self):
        d = self._dict
        if 'id' in d:
            d['id'] = str(d['id'])
        if '_id' in d:
            del d['_id']
        if 'password' in d:
            del d['password']
        return d

    def exists(self):
        return self.__exists

    def emailExists(self): pass

    def usernameExists(self): pass

    @property
    def token(self):
        if self.__exists and 'id' in self._dict:
            return jwt.encode({
                'id': str(self._dict['id']),
                'exp': int((datetime.datetime.now() + datetime.timedelta(days=int(os.environ['JWT_EXP_DAYS']))).strftime('%s'))
            }, os.environ['JWT_SECRET'], algorithm=os.environ['JWT_ALGO']).decode('utf-8')
        else:
            self._validator.invalidUser('User does not exist or has not been instantiated properly.')

    def authenticate(self, password):
        if self.__exists and 'password' in self._dict:
            return self._dict['password'] == str(bcrypt.hashpw(password.encode('utf-8'), self._dict['password'].encode('utf-8')), 'utf-8')
        else:
            self._validator.invalidUser('User does not exist or Password not set.')

