from datetime import datetime, timedelta
import jwt

from models.entities.user_entity import UserEntity

class User(UserEntity):
    def __init__(self, validator):
        super().__init__(validator)

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