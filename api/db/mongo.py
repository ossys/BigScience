import os
from pymongo import MongoClient

class Mongo:
    _client = None
    _db = None

    def __init__(self):
        if Mongo._client is None:
            Mongo._client = MongoClient(os.environ['MONGO_URI'])

        if Mongo._db is None and Mongo._client is not None:
            Mongo._db = Mongo._client[os.environ['MONGO_DATABASE']]

    def getCollection(self, name):
        return Mongo._db[name]

