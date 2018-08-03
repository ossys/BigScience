import pymongo
import datetime
import re
from models.mongo.user import User
import bson
from db.mongo import Mongo

class FileEntity:
    _collection = None
    _validator = None

    def __init__(self, validator=None, obj=None):
        self._validator = validator
        if FileEntity._collection is None:
            FileEntity._collection = Mongo().getCollection('file')
            FileEntity._collection.create_index([('sha256', pymongo.TEXT)], unique=True)
        if obj is not None:
            self.instantiate(obj=obj)
        else:
            self._dict = {}
            self._dict['sha256'] = None
            self._dict['last_modified_date'] = None
            self._dict['new_name'] = None
            self._dict['original_name'] = None
            self._dict['description'] = None
            self._dict['size'] = None
            self._dict['total_chunks'] = None
            self._dict['chunks_written'] = None
            self._dict['owning_user_id'] = None
            self.__exists = False
            self.__dirty_attributes = {}
            self.__atomic = True

    def instantiate(self, obj=None):
        if obj is None:
            try:
                if 'id' in self._dict and self._dict['id'] is not None and isinstance(self._dict['id'], bson.ObjectId):
                    obj=FileEntity._collection.find_one({'_id': self._dict['id']})
                if 'sha256' in self._dict and self._dict['sha256'] is not None:
                    obj=FileEntity._collection.find_one({'sha256': self._dict['sha256']})
            except:
                raise
        self._dict['id'] = obj['_id']
        self._dict['sha256'] = obj['sha256']
        self._dict['last_modified_date'] = obj['last_modified_date']
        self._dict['new_name'] = obj['new_name']
        self._dict['original_name'] = obj['original_name']
        self._dict['description'] = obj['description']
        self._dict['size'] = obj['size']
        self._dict['total_chunks'] = obj['total_chunks']
        self._dict['chunks_written'] = obj['chunks_written']
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
    def sha256(self):
        if 'sha256' in self._dict:
            return self._dict['sha256']
        else:
            return None

    @sha256.setter
    def sha256(self, sha256):
        if isinstance(sha256, str) and len(sha256) == 64 and re.match(r'[0-9a-fA-F]+', sha256):
            self.__dirty_attributes['sha256'] = sha256
            self._dict['sha256'] = sha256
        else:
            if not isinstance(sha256, str):
                self._validator.invalidType('sha256','SHA256 must be of type str, but instead got type ' + type(sha256).__name__)
            if not re.match(r'[0-9a-fA-F]+', sha256):
                self._validator.addInvalidField('sha256','Please enter a valid SHA256')
            elif len(sha256) < 64 or len(sha256) > 64:
                self._validator.addInvalidField('sha256','SHA256 must be between 64 and 64 characters')

    @property
    def last_modified_date(self):
        if 'last_modified_date' in self._dict:
            return self._dict['last_modified_date']
        else:
            return None

    @last_modified_date.setter
    def last_modified_date(self, last_modified_date):
        if isinstance(last_modified_date, datetime.date):
            self.__dirty_attributes['last_modified_date'] = last_modified_date
            self._dict['last_modified_date'] = last_modified_date
        else:
            if not isinstance(last_modified_date, datetime.date):
                self._validator.invalidType('last_modified_date','Last Modified Date must be of type date, but instead got type ' + type(last_modified_date).__name__)

    @property
    def new_name(self):
        if 'new_name' in self._dict:
            return self._dict['new_name']
        else:
            return None

    @new_name.setter
    def new_name(self, new_name):
        if isinstance(new_name, str) and len(new_name) >= 1 and len(new_name) <= 512:
            self.__dirty_attributes['new_name'] = new_name
            self._dict['new_name'] = new_name
        else:
            if not isinstance(new_name, str):
                self._validator.invalidType('new_name','New Name must be of type str, but instead got type ' + type(new_name).__name__)
            if len(new_name) < 1 or len(new_name) > 512:
                self._validator.addInvalidField('new_name','New Name must be between 1 and 512 characters')

    @property
    def original_name(self):
        if 'original_name' in self._dict:
            return self._dict['original_name']
        else:
            return None

    @original_name.setter
    def original_name(self, original_name):
        if isinstance(original_name, str) and len(original_name) >= 1 and len(original_name) <= 512:
            self.__dirty_attributes['original_name'] = original_name
            self._dict['original_name'] = original_name
        else:
            if not isinstance(original_name, str):
                self._validator.invalidType('original_name','Original Name must be of type str, but instead got type ' + type(original_name).__name__)
            if len(original_name) < 1 or len(original_name) > 512:
                self._validator.addInvalidField('original_name','Original Name must be between 1 and 512 characters')

    @property
    def description(self):
        if 'description' in self._dict:
            return self._dict['description']
        else:
            return None

    @description.setter
    def description(self, description):
        if isinstance(description, str) and len(description) >= 0 and len(description) <= 1024:
            self.__dirty_attributes['description'] = description
            self._dict['description'] = description
        else:
            if not isinstance(description, str):
                self._validator.invalidType('description','Description must be of type str, but instead got type ' + type(description).__name__)
            if len(description) < 0 or len(description) > 1024:
                self._validator.addInvalidField('description','Description must be between 0 and 1024 characters')

    @property
    def size(self):
        if 'size' in self._dict:
            return self._dict['size']
        else:
            return None

    @size.setter
    def size(self, size):
        if isinstance(size, int) and size >= 1:
            self.__dirty_attributes['size'] = size
            self._dict['size'] = size
        else:
            if not isinstance(size, int):
                self._validator.invalidType('size','Size must be of type int, but instead got type ' + type(size).__name__)

    @property
    def total_chunks(self):
        if 'total_chunks' in self._dict:
            return self._dict['total_chunks']
        else:
            return None

    @total_chunks.setter
    def total_chunks(self, total_chunks):
        if isinstance(total_chunks, int) and total_chunks >= 0:
            self.__dirty_attributes['total_chunks'] = total_chunks
            self._dict['total_chunks'] = total_chunks
        else:
            if not isinstance(total_chunks, int):
                self._validator.invalidType('total_chunks','Total Chunks must be of type int, but instead got type ' + type(total_chunks).__name__)

    @property
    def chunks_written(self):
        if 'chunks_written' in self._dict:
            return self._dict['chunks_written']
        else:
            return None

    @chunks_written.setter
    def chunks_written(self, chunks_written):
        if isinstance(chunks_written, int) and chunks_written >= 0:
            self.__dirty_attributes['chunks_written'] = chunks_written
            self._dict['chunks_written'] = chunks_written
        else:
            if not isinstance(chunks_written, int):
                self._validator.invalidType('chunks_written','Chunks Written must be of type int, but instead got type ' + type(chunks_written).__name__)

    @property
    def atomic(self):
        return self.__atomic

    @atomic.setter
    def atomic(self, atomic):
        if isinstance(atomic, bool):
            self.__atomic = atomic

    def getOwningUserId(self):
        return self._dict['owning_user_id']

    def getOwningUser(self): pass

    def setOwningUserId(self, owning_user_id):
        if isinstance(owning_user_id, str):
            try:
                owning_user_id = bson.ObjectId(owning_user_id)
            except bson.errors.InvalidId as err:
                self._validator.addInvalidField('owning_user_id', err.args[0])
        if isinstance(owning_user_id, bson.ObjectId):
            self.__dirty_attributes['owning_user_id'] = owning_user_id
            self._dict['owning_user_id'] = owning_user_id
        else:
            self._validator.invalidType('owning_user_id', 'Owning User Id must be of type str or ObjectId, but instead got type ' + type(owning_user_id).__name__)

    def setOwningUser(self, owning_user):
        if isinstance(owning_user, User) and owning_user.exists():
            self.__dirty_attributes['owning_user_id'] = owning_user.id
            self._dict['owning_user_id'] = owning_user.id

    def getOwnedChunkIds(self): pass

    def insert(self):
        if not self.__exists and 'id' not in self._dict and not self._validator.hasErrors():
            try:
                self._dict['id'] = FileEntity._collection.insert_one(self._dict).inserted_id
            except pymongo.errors.DuplicateKeyError as err:
                self._validator.addDuplicateError(err)
            except Exception as err:
                self._validator.addDatabaseError(err)
            if 'id' in self._dict and not isinstance(self._dict['id'], bson.ObjectId):
                self._validator.addDatabaseError('Error inserting File')
            else:
                self.__exists = True

    def update(self):
        if self.__exists and 'id' in self._dict and isinstance(self._dict['id'], bson.ObjectId) and not self._validator.hasErrors():
            try:
                FileEntity._collection.update_one(
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
        return d

    def exists(self):
        return self.__exists

    def sha256Exists(self): pass

