import pymongo
import re
from models.mongo.file import File
import bson
from db.mongo import Mongo

class ChunkEntity:
    _collection = None
    _validator = None

    def __init__(self, validator=None, obj=None):
        self._validator = validator
        if ChunkEntity._collection is None:
            ChunkEntity._collection = Mongo().getCollection('chunk')
            ChunkEntity._collection.create_index([('sha256', pymongo.TEXT)], unique=True)
        if obj is not None:
            self.instantiate(obj=obj)
        else:
            self._dict = {}
            self._dict['sha256'] = None
            self._dict['chunk_id'] = None
            self._dict['start_byte'] = None
            self._dict['end_byte'] = None
            self._dict['data'] = None
            self._dict['owning_file_id'] = None
            self.__exists = False
            self.__dirty_attributes = {}
            self.__atomic = True

    def instantiate(self, obj=None):
        if obj is None:
            try:
                if 'id' in self._dict and self._dict['id'] is not None and isinstance(self._dict['id'], bson.ObjectId):
                    obj=ChunkEntity._collection.find_one({'_id': self._dict['id']})
                if 'sha256' in self._dict and self._dict['sha256'] is not None:
                    obj=ChunkEntity._collection.find_one({'sha256': self._dict['sha256']})
            except:
                raise
        self._dict['id'] = obj['_id']
        self._dict['sha256'] = obj['sha256']
        self._dict['chunk_id'] = obj['chunk_id']
        self._dict['start_byte'] = obj['start_byte']
        self._dict['end_byte'] = obj['end_byte']
        self._dict['data'] = obj['data']
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
    def chunk_id(self):
        if 'chunk_id' in self._dict:
            return self._dict['chunk_id']
        else:
            return None

    @chunk_id.setter
    def chunk_id(self, chunk_id):
        if isinstance(chunk_id, int) and chunk_id >= 1:
            self.__dirty_attributes['chunk_id'] = chunk_id
            self._dict['chunk_id'] = chunk_id
        else:
            if not isinstance(chunk_id, int):
                self._validator.invalidType('chunk_id','Chunk Id must be of type int, but instead got type ' + type(chunk_id).__name__)

    @property
    def start_byte(self):
        if 'start_byte' in self._dict:
            return self._dict['start_byte']
        else:
            return None

    @start_byte.setter
    def start_byte(self, start_byte):
        if isinstance(start_byte, int) and start_byte >= 0:
            self.__dirty_attributes['start_byte'] = start_byte
            self._dict['start_byte'] = start_byte
        else:
            if not isinstance(start_byte, int):
                self._validator.invalidType('start_byte','Start Byte must be of type int, but instead got type ' + type(start_byte).__name__)

    @property
    def end_byte(self):
        if 'end_byte' in self._dict:
            return self._dict['end_byte']
        else:
            return None

    @end_byte.setter
    def end_byte(self, end_byte):
        if isinstance(end_byte, int) and end_byte >= 0:
            self.__dirty_attributes['end_byte'] = end_byte
            self._dict['end_byte'] = end_byte
        else:
            if not isinstance(end_byte, int):
                self._validator.invalidType('end_byte','End Byte must be of type int, but instead got type ' + type(end_byte).__name__)

    @property
    def data(self):
        if 'data' in self._dict:
            return self._dict['data']
        else:
            return None

    @data.setter
    def data(self, data):
        if isinstance(data, bytes):
            self.__dirty_attributes['data'] = data
            self._dict['data'] = data
        else:
            if not isinstance(data, bytes):
                self._validator.invalidType('data','Data must be of type bytes, but instead got type ' + type(data).__name__)

    @property
    def atomic(self):
        return self.__atomic

    @atomic.setter
    def atomic(self, atomic):
        if isinstance(atomic, bool):
            self.__atomic = atomic

    def getOwningFileId(self):
        return self._dict['owning_file_id']

    def getOwningFile(self): pass

    def setOwningFileId(self, owning_file_id):
        if isinstance(owning_file_id, str):
            try:
                owning_file_id = bson.ObjectId(owning_file_id)
            except bson.errors.InvalidId as err:
                self._validator.addInvalidField('owning_file_id', err.args[0])
        if isinstance(owning_file_id, bson.ObjectId):
            self.__dirty_attributes['owning_file_id'] = owning_file_id
            self._dict['owning_file_id'] = owning_file_id
        else:
            self._validator.invalidType('owning_file_id', 'Owning File Id must be of type str or ObjectId, but instead got type ' + type(owning_file_id).__name__)

    def setOwningFile(self, owning_file):
        if isinstance(owning_file, File) and owning_file.exists():
            self.__dirty_attributes['owning_file_id'] = owning_file.id
            self._dict['owning_file_id'] = owning_file.id

    def insert(self):
        if not self.__exists and 'id' not in self._dict and not self._validator.hasErrors():
            try:
                self._dict['id'] = ChunkEntity._collection.insert_one(self._dict).inserted_id
            except pymongo.errors.DuplicateKeyError as err:
                self._validator.addDuplicateError(err)
            except Exception as err:
                self._validator.addDatabaseError(err)
            if 'id' in self._dict and not isinstance(self._dict['id'], bson.ObjectId):
                self._validator.addDatabaseError('Error inserting Chunk')
            else:
                self.__exists = True

    def update(self):
        if self.__exists and 'id' in self._dict and isinstance(self._dict['id'], bson.ObjectId) and not self._validator.hasErrors():
            try:
                ChunkEntity._collection.update_one(
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

