from pymongo import MongoClient

class Mongo:
    _client = None
    _db = None

    def __init__(self):
        if self._client is None:
            Mongo._client = MongoClient('localhost', 27017)
        
        if self._db is None and self._client is not None:
            Mongo._db = Mongo._client['bigscience']

    def getCollection(self, name):
        return Mongo._db[name]

