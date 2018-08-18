from sanic.response import json, text

from models.json_response import JSONResponse
from models.validator import Validator
from decorators.jwt_validator import authorized

from models.mongo.file import File
from models.mongo.chunk import Chunk

def prefix(pre):
    return pre + '/chunk'

@authorized(roles=None, validation_functions=None)
async def upload(request):
    if request.method == 'POST':
        validator = Validator()
        validator.hasRequiredFields([
            'file.sha256', 'chunk.sha256', 'chunk.id',
            'chunk.startByte', 'chunk.endByte'], request.form)
        validator.hasRequiredFields(['chunk.data'], request.files)

        if not validator.hasErrors():
            try:
                chunk = Chunk(validator=validator)
                chunk.sha256 = request.form.get('chunk.sha256')
                chunk.chunk_id = int(request.form.get('chunk.id'))
                chunk.start_byte = int(request.form.get('chunk.startByte'))
                chunk.end_byte = int(request.form.get('chunk.endByte'))
                chunk.data = request.files.get('chunk.data').body

                file = File(validator=validator)
                file.sha256 = request.form.get('file.sha256')
                file.instantiate()
                chunk.setOwningFile(file)
            except Exception as err:
                validator.addException(err)

            if not validator.hasErrors():
                try:
                    chunk.insert()
                    file.incrementChunksUploaded()

                    if chunk.chunk_id == 0:
                        file.startHdfsUpload.delay()

                except Exception as err:
                    validator.addException(err)

        return json(JSONResponse(success =  False if validator.hasErrors() else True,
                                 data    =  None if validator.hasErrors() else { 'chunk': chunk.dict() },
                                 message =  'Error Uploading Chunk' if validator.hasErrors() else 'Successfully Uploaded Chunk',
                                 errors  =  validator.errors if validator.hasErrors() else None).dict())

    else:
        return text('',status=200)
