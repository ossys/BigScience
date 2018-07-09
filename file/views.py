from rest_framework.views import APIView
from rest_framework.response import Response

import dateutil.parser

from models import models
from hdfs import hdfs

# Create your views here.
class Upload(APIView):
    permission_classes = ()

    def post(self, request, *args, **kwargs):
        chunk = models.FileChunk(
        chunk_sha256 = request.data['chunk.sha256'],
        chunk_id = request.data['chunk.id'],
        chunk_startByte = request.data['chunk.startByte'],
        chunk_endByte = request.data['chunk.endByte'],
        chunk_data = request.data['chunk.data'].read(),
        file_sha256 = request.data['file.sha256'],
        file_lastModifiedDate = dateutil.parser.parse(request.data['file.lastModifiedDate']),
        file_name = request.data['file.name'],
        file_size = request.data['file.size'],
        )
        chunk.save()
#         hdfs.writeChunk(request.user, chunk)

        return Response(
          models.Response(success=False, message='Not Yet Implemented').dict(),
          status=501,
          content_type="application/json"
        )
