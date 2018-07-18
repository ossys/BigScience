from sanic.response import json

def prefix(pre):
    return pre + '/chunk'

async def upload(request):
    return json({'chunk': 'upload'})
