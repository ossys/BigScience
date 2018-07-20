import pymongo

from sanic.response import json, text

from models.json_response import JSONResponse
from models.validator import Validator

from models.user import User

def prefix(pre):
    return pre + '/user'

async def register(request):
    if request.method == 'POST':
        validator = Validator()
        validator.hasRequiredFields([
            'email', 'username', 'first_name',
            'last_name', 'password'], request.json)

        ud = {}
        user = User(validator)
        user.email = request.json['email']
        user.username = request.json['username']
        user.first_name = request.json['first_name']
        user.last_name = request.json['last_name']
        user.password = request.json['password']

        if not validator.hasErrors():
            try:
                user.insert()
                ud = user.dict()
                del ud['password']
            except pymongo.errors.DuplicateKeyError as err:
                validator.addDuplicateError(err)

        return json(JSONResponse(success =  False if validator.hasErrors() else True,
                                 data    =  None if validator.hasErrors() else {'user':ud, 'token': user.token},
                                 message =  'Error Saving User' if validator.hasErrors() else 'Successfully Saved User',
                                 errors  =  validator.errors if validator.hasErrors() else None).dict())

    else:
        return text('',status=200)

async def login(request):
    if request.method == 'POST':
        validator = Validator()
        validator.hasRequiredFields(['email', 'password'], request.json)

        user = User(validator)
        ud = {}

        if not validator.hasErrors():
            user.email = request.json['email']

        if not validator.hasErrors():
            user.instantiate()

            if user.exists():
                if not user.authenticate(request.json['password']):
                    validator.invalidAuth(user.email)
                else:
                    ud = user.dict()
                    del ud['password']

        return json(JSONResponse(success =  False if validator.hasErrors() else True,
                                 data    =  None if validator.hasErrors() else {'user': ud, 'token': user.token},
                                 message =  'Error Logging In' if validator.hasErrors() else 'Successfully Logged In',
                                 errors  =  validator.errors if validator.hasErrors() else None).dict())

    else:
        return text('',status=200)

