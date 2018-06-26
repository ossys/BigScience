from django.contrib.auth import authenticate

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

import jwt

from models import models

class Login(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        if not request.data:
            return Response({'Error': "Please provide a username and password"}, status="400")

        if authenticate(username=request.data['username'],password=request.data['password']):
            user = models.User.objects.get(username=request.data['username'])
            payload = {
                'id': user.id,
                'username': user.username,
            }
            return Response(
              models.Response(success=True, data={ 'jwt': jwt.encode(payload, "SECRET_KEY").decode('utf-8') }, message='Successfully Authenticated').dict(),
              status=200,
              content_type="application/json"
            )
        else:
            return Response(
              models.Response(success=False, message='Incorrect username or password.').dict(),
              status=401,
              content_type="application/json"
            )
