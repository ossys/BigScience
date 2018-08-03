from models.mongo.entities.user_entity import UserEntity

class User(UserEntity):
    def __init__(self, validator=None, obj=None):
        super().__init__(validator=validator, obj=obj)

    def sayHello(self):
        print('>>>> HELLO ' + self.first_name + '!!! >>>>>>>')
