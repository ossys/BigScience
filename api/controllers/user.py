from sanic.response import json, text

from models.user import User

def prefix(pre):
    return pre + '/user'

async def register(request):
    if request.method == 'POST':
        user = User()
        user.email = request.json['email']
        user.username = request.json['username']
        user.first_name = request.json['first_name']
        user.last_name = request.json['last_name']
        user.password = request.json['password']
        user.insert()
        return json({'user': 'register'})
    else:
        return text('',status=200)

async def login(request):
    return json({'user': 'login'})

