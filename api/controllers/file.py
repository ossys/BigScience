from sanic.response import json, text

import dateutil.parser

from models.json_response import JSONResponse
from models.validator import Validator
from decorators.jwt_validator import authorized

from models.mongo.user import User
from models.mongo.file import File


def prefix(pre):
    return pre + '/file'

# /api/file
@authorized(roles=None,
            validation_functions=[
                User.sayHello
            ])
async def prepare(request):
    if request.method == 'POST':
        validator = Validator()
        validator.hasRequiredFields([
            'description', 'last_modified_date', 'new_name',
            'original_name', 'sha256', 'size', 'total_chunks'], request.json)

        if not validator.hasErrors():
            file = File(validator=validator)
            file.sha256 = request.json['sha256']
            file.instantiate()

            if not file.exists():
                file.description = request.json['description']
                file.last_modified_date = dateutil.parser.parse(request.json['last_modified_date'])
                file.new_name = request.json['new_name']
                file.original_name = request.json['original_name']
                file.size = request.json['size']
                file.total_chunks = request.json['total_chunks']
                file.chunks_written = 0
                file.setOwningUser(request['user'])

                if not validator.hasErrors():
                    file.insert()
            else:
                try:
                    file.getLastWrittenChunks(int(request.json['limit']))
                except Exception as err:
                    validator.addException(err)

        return json(JSONResponse(success =  False if validator.hasErrors() else True,
                                 data    =  None if validator.hasErrors() else { 'file': file.dict() },
                                 message =  'Error Preparing File' if validator.hasErrors() else 'Successfully Prepared File',
                                 errors  =  validator.errors if validator.hasErrors() else None).dict())

    elif request.method == 'GET': pass

    else:
        return text('',status=200)
