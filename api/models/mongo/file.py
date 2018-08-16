from models.mongo.entities.file_entity import FileEntity

import pymongo

import models.mongo.chunk

class File(FileEntity):
    def __init__(self, validator=None, obj=None):
        super().__init__(validator=validator, obj=obj)

    def incrementChunksUploaded(self):
        self._collection.update({ '_id': self.id }, { '$inc': { 'chunks_uploaded': 1 } })

    def getLastUploadedChunks(self, limit):
        cursor = models.mongo.chunk.Chunk._collection.find({ 'owning_file_id': self.id },{ 'chunk_id': 1 }).sort([('chunk_id', pymongo.DESCENDING)]).limit(limit)
        self._dict['last_uploaded_chunks'] = []
        for record in cursor:
            self._dict['last_uploaded_chunks'].append(record['chunk_id'])

    def startHdfsUpload(self):
        pass