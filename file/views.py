from rest_framework.views import APIView
from rest_framework.response import Response

from datetime import datetime

from models import models

# Create your views here.
class Upload(APIView):
    permission_classes = ()

    def post(self, request, *args, **kwargs):
        chunk = models.FileChunk(
        chunk_sha256 = request.data['chunk.sha256'],
        chunk_id = request.data['chunk.id'],
        chunk_startByte = request.data['chunk.startByte'],
        chunk_endByte = request.data['chunk.endByte'],
        file_sha256 = request.data['file.sha256'],
        file_lastModifiedDate = datetime.strptime(request.data['file.lastModifiedDate'], 'YYYY-MM-DD HH:MM[:ss[.uuuuuu]][TZ]'),
        file_name = request.data['file.name'],
        file_size = request.data['file.size'],
        data = request.data['data']
        )
        chunk.save()

        return Response(
          models.Response(success=False, message='Not Yet Implemented').dict(),
          status=501,
          content_type="application/json"
        )
