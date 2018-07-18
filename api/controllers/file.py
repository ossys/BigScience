from sanic.response import json

def prefix(pre):
    return pre + '/file'

async def prepare(request):
    return json({'file': 'prepare'})

async def uploads(request):
    return json({'file': 'uploads'})
