from models.mongo.entities.file_entity import FileEntity

class File(FileEntity):
    def __init__(self, validator=None, obj=None):
        super().__init__(validator=validator, obj=obj)

    def incrementChunksWritten(self):
        self._collection.update({ '_id': self.id }, { '$inc': { 'chunks_written': 1 } })
