from models.entities.file_entity import FileEntity

class User(FileEntity):
    def __init__(self, validator=None, obj=None):
        super().__init__(validator=validator, obj=obj)
