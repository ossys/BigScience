import os
import jwt
import bcrypt
from datetime import datetime, timedelta

from models.entities.user_entity import UserEntity

class User(UserEntity):
    def __init__(self, validator=None, obj=None):
        super().__init__(validator=validator, obj=obj)

    @property
    def token(self):
        dt = datetime.now() + timedelta(days=30)
        token = jwt.encode({
            'id': str(self.id),
            'exp': int(dt.strftime('%s'))
        }, os.environ['JWT_SECRET'], algorithm=os.environ['JWT_ALGO'])

        return token.decode('utf-8')

    def authenticate(self, password):
        return self.password == str(bcrypt.hashpw(password.encode('utf-8'), self.password.encode('utf-8')), 'utf-8')

    def sayHello(self):
        print('>>>>>>> HELLO MY NAME IS ' + self.first_name + ' ' + self.last_name + ' >>>>>>>>>>>>>>>>')
