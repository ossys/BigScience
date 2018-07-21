import pymongo
import re
from bson import ObjectId

from db.mongo import Mongo

class FileEntity:
    _collection = None
    _validator = None
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     sha256 = models.CharField(db_index=True, max_length=64, unique=True)
#     last_modified_date = models.DateTimeField(auto_now=False)
#     new_name = models.CharField(max_length=256)
#     original_name = models.CharField(max_length=256)
#     description = models.CharField(max_length=1024)
#     size = models.IntegerField()
#     total_chunks = models.IntegerField()
#     chunks_written = models.IntegerField()
    _id = None
#     _sha256
#     _last_modified_date
#     _new_name
#     _original_name
#     _
#     _
#     _

    def __init__(self, obj=None, validator=None):
        self._validator = validator
        if FileEntity._collection is None:
            FileEntity._collection = Mongo().getCollection('file')
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
