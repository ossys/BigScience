from sanic.response import json, text

from decorators.jwt_validator import authorized

from models.user import User

def prefix(pre):
    return pre + '/file'

@authorized(roles=None,
            validation_functions=[
                User.sayHello
            ])
async def prepare(request):
    if request.method == 'POST':
        return json({'file': 'prepare'})

    else:
        return text('',status=200)

async def uploads(request):
    if request.method == 'POST':
        return json({'file': 'uploads'})

    else:
        return text('',status=200)
