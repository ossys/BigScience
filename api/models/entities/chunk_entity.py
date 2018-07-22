import pymongo
import re
from bson import ObjectId

from db.mongo import Mongo

class FileEntity:
    _collection = None
    _validator = None

    _id = None
    _sha256 = None
    _chunk_id = None
    _start_byte = None
    _end_byte = None
    _data = None

    _user_id = None

    def __init__(self, obj=None, validator=None):
        self._validator = validator
        if FileEntity._collection is None:
            FileEntity._collection = Mongo().getCollection('chunk')
            FileEntity._collection.create_index([('email', pymongo.ASCENDING)], unique=True)

    def instantiate(self, obj=None):
        if obj is None:
            try:
                if self._id is not None:
                    obj=FileEntity._collection.find_one({"_id": self._id})
            except:
                raise
        self._id = obj['_id']

    def exists(self):
        return self._id is not None

    @property
    def id(self):
        return self._id

    @id.setter
    def id(self, id):
        if isinstance(id, str):
            self._id = ObjectId(id)
        elif isinstance(id, ObjectId):
            self._id = id

    def insert(self):
        self._id = FileEntity._collection.insert_one(self.dict()).inserted_id
        if self._id is None:
            self._validator.addDatabaseError('Error inserting file')

    def dict(self):
        return {
        }
