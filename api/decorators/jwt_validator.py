import jwt
import os
from functools import wraps

from sanic.response import json

from models.json_response import JSONResponse
from models.validator import Validator
from models.user import User

ALLOW_ALL=[
    '/api/user/register',
    '/api/user/login',
]

def authorized(roles=None, validation_functions=None):
    def decorator(f):
        @wraps(f)
        async def decorated_function(request, *args, **kwargs):
            if request.path not in ALLOW_ALL and request.method != 'OPTIONS':
                validator = Validator()

                if not 'Authorization' in request.headers:
                    validator.missingToken()
                    return json(JSONResponse(success =  False,
                                             message =  'Missing Authentication Token',
                                             errors  =  validator.errors).dict(),
                                status=400)
                else:
                    token = request.headers['Authorization'].split()

                    if len(token) != 2:
                        validator.invalidToken('Invalid token format')

                    if token[0].lower() != 'Bearer'.lower() and token[0].lower() != 'JWT'.lower():
                        validator.invalidToken('Invalid token prefix')

                    if not validator.hasErrors():
                        user = User()
                        payload = {}

                        try:
                            payload = jwt.decode(token[1], os.environ['JWT_SECRET'])
                        except Exception as err:
                            validator.invalidToken('Cannot decode token: ' + str(err))

                        if not validator.hasErrors():
                            try:
                                user.id = payload['id']
                                user.instantiate()
                            except Exception as err:
                                validator.invalidToken('Invalid user id in token: ' + str(err))

                        if not validator.hasErrors() and not user.active:
                            validator.invalidUser('User inactive')

                        if roles is not None:
                            auth = False
                            for role in roles:
                                if user.role == role:
                                    auth = True
                                    break
                            if not auth:
                                validator.invalidRole()

                        if validation_functions is not None:
                            for func in validation_functions:
                                try:
                                    func(user)
                                except Exception as error:
                                    validator.permissionError(error)

                        if not validator.hasErrors():
                            request['user'] = user
                            response = await f(request, *args, **kwargs)
                            return response

                    if validator.hasErrors():
                        return json(JSONResponse(success =  False,
                                                 message =  'Invalid Authentication Token',
                                                 errors  =  validator.errors).dict(),
                                    status=403)
            else:
                response = await f(request, *args, **kwargs)
                return response
        return decorated_function
    return decorator