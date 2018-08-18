from sanic.response import json, text

import datetime

from models.json_response import JSONResponse
from models.validator import Validator

from models.mongo.user import User

def prefix(pre):
    return pre + '/user'

async def register(request):
    if request.method == 'POST':
        validator = Validator()
        validator.hasRequiredFields([
            'email', 'username', 'first_name',
            'last_name', 'password'], request.json)

        if not validator.hasErrors():
            user = User(validator=validator)
            user.active = True
            user.last_login_date = datetime.datetime.utcnow()
            user.email = request.json['email']
            user.username = request.json['username']
            user.first_name = request.json['first_name']
            user.last_name = request.json['last_name']
            user.password = request.json['password']

            if not validator.hasErrors():
                user.insert()

        return json(JSONResponse(success =  False if validator.hasErrors() else True,
                                 data    =  None if validator.hasErrors() else {'user':user.dict(), 'token': user.token},
                                 message =  'Error Saving User' if validator.hasErrors() else 'Successfully Saved User',
                                 errors  =  validator.errors if validator.hasErrors() else None).dict())

    else:
        return text('',status=200)

async def login(request):
    if request.method == 'POST':
        validator = Validator()
        validator.hasRequiredFields([
            'email', 'password'], request.json)

        if not validator.hasErrors():
            user = User(validator)
            user.email = request.json['email']
            user.instantiate()

            if user.exists():
                if not user.authenticate(request.json['password']):
                    validator.invalidAuth(user.email)

        return json(JSONResponse(success =  False if validator.hasErrors() else True,
                                 data    =  None if validator.hasErrors() else {'user': user.dict(), 'token': user.token},
                                 message =  'Error Logging In' if validator.hasErrors() else 'Successfully Logged In',
                                 errors  =  validator.errors if validator.hasErrors() else None).dict())

    else:
        return text('',status=200)
