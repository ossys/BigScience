from models.mongo.entities.file_entity import FileEntity

import pymongo

import models.mongo.chunk

class File(FileEntity):
    def __init__(self, validator=None, obj=None):
        super().__init__(validator=validator, obj=obj)

    def incrementChunksWritten(self):
        self._collection.update({ '_id': self.id }, { '$inc': { 'chunks_written': 1 } })

    def getLastWrittenChunks(self, limit):
        cursor = models.mongo.chunk.Chunk._collection.find({ 'owning_file_id': self.id },{ 'chunk_id': 1 }).sort([('chunk_id', pymongo.ASCENDING)]).limit(limit)
        self._dict['last_written_chunks'] = []
        for record in cursor:
            self._dict['last_written_chunks'].append(record['chunk_id'])
