from datetime import datetime, timedelta
import jwt
import bcrypt

from models.entities.user_entity import UserEntity

class User(UserEntity):
    def __init__(self, validator=None, obj=None):
        super().__init__(validator=validator, obj=obj)

    @property
    def token(self):
        return self._generate_jwt_token()

    def _generate_jwt_token(self):
        dt = datetime.now() + timedelta(days=30)
        token = jwt.encode({
            'id': str(self.id),
            'exp': int(dt.strftime('%s'))
        }, 'secret', algorithm='HS256')

        return token.decode('utf-8')

    def authenticate(self, password):
        return self.password == str(bcrypt.hashpw(password.encode('utf-8'), self.password.encode('utf-8')), 'utf-8')
