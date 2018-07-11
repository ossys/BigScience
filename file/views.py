from rest_framework.views import APIView
from rest_framework.response import Response

import dateutil.parser

from models import models
from hdfs import hdfs

# Create your views here.
class Prepare(APIView):
    def post(self, request, *args, **kwargs):
        print(request.user)
        file = models.File(
        sha256 = request.data['sha256'],
        last_modified_date = dateutil.parser.parse(request.data['last_modified_date']),
        name = request.data['name'],
        size = request.data['size'],
        total_chunks = request.data['total_chunks'],
        )
        file.save()

        return Response(
          models.JSONResponse(success=True, data={}, message='Successfully Authenticated').dict(),
          status=200,
          content_type="application/json"
        )

class Upload(APIView):
    def post(self, request, *args, **kwargs):
        chunk = models.FileChunk(
        file = models.File.objects.get(
        sha256 = request.data['file.sha256'],
        ),
        sha256 = request.data['chunk.sha256'],
        chunk_id = request.data['chunk.id'],
        start_byte = request.data['chunk.startByte'],
        end_byte = request.data['chunk.endByte'],
        data = request.data['chunk.data'].read(),
        )
        hdfs.writeChunk(request.user, chunk)

        return Response(
          models.JSONResponse(success=True, data={}, message='Successfully Uploaded').dict(),
          status=200,
          content_type="application/json"
        )
