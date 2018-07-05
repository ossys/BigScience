from rest_framework.views import APIView
from rest_framework.response import Response

from models import models

# Create your views here.
class Upload(APIView):
    permission_classes = ()

    def post(self, request, *args, **kwargs):
        print('POST UPLOAD >>> ' + request.data['file.sha256'])
        return Response(
          models.Response(success=False, message='Not Yet Implemented').dict(),
          status=501,
          content_type="application/json"
        )
