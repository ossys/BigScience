from rest_framework.views import APIView
from rest_framework.response import Response

import dateutil.parser

from models import models
from hdfs import hdfs
from .tasks import add

# Create your views here.
class Upload(APIView):
    permission_classes = ()

    def post(self, request, *args, **kwargs):
        chunk = models.FileChunk(
        file = models.File.objects.get_or_create(
        sha256 = request.data['file.sha256'],
        last_modified_date = dateutil.parser.parse(request.data['file.lastModifiedDate']),
        name = request.data['file.name'],
        size = request.data['file.size'],
        total_chunks = request.data['file.totalChunks'],
        )[0],
        sha256 = request.data['chunk.sha256'],
        chunk_id = request.data['chunk.id'],
        start_byte = request.data['chunk.startByte'],
        end_byte = request.data['chunk.endByte'],
        data = request.data['chunk.data'].read(),
        )
        hdfs.writeChunk(request.user, chunk)

        return Response(
          models.Response(success=False, message='Not Yet Implemented').dict(),
          status=501,
          content_type="application/json"
        )
