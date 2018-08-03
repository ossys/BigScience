from models.mongo.entities.chunk_entity import ChunkEntity

class Chunk(ChunkEntity):
    def __init__(self, validator=None, obj=None):
        super().__init__(validator=validator, obj=obj)

