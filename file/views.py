from rest_framework.views import APIView
from rest_framework.response import Response

import dateutil.parser
import time
import random

from models import models
from .serializers import FileChunkSerializer
from hdfs import hdfs

# Create your views here.
class Prepare(APIView):
    def post(self, request, *args, **kwargs):
        file = models.File(
        user = request.user,
        sha256 = request.data['sha256'],
        last_modified_date = dateutil.parser.parse(request.data['last_modified_date']),
        original_name = request.data['original_name'],
        size = request.data['size'],
        total_chunks = request.data['total_chunks'],
        new_name = request.data['new_name'] if 'new_name' in request.data else None,
        description = request.data['description'] if 'description' in request.data else None,
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
        chunk.save()
        hdfs.writeChunk(chunk)
        time.sleep(random.uniform(.1, 1))

        return Response(
          models.JSONResponse(success=True, data=FileChunkSerializer(chunk).data, message='Successfully Uploaded').dict(),
          status=200,
          content_type="application/json"
        )

class Uploads(APIView):
    def get(self, request, *args, **kwargs):

        return Response(
          models.JSONResponse(success=True, data={}, message='Successfully Uploaded').dict(),
          status=200,
          content_type="application/json"
        )

