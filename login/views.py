from django.contrib.auth import authenticate
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

import jwt

from models import models

class Login(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        print('SECRET: ' + settings.SECRET_KEY)
        if not request.data or not request.data['email'] or not request.data['password']:
            return Response(
              models.Response(success=False, message='Please provide an email and password.').dict(),
              status=400,
              content_type="application/json"
            )
        print(request.data['email'])
        if not self.request.version or self.request.version == settings.CONSTANTS['VERSION']['1_0']:
            if authenticate(email=request.data['email'],password=request.data['password']):
                user = models.UserProfile.objects.get(email=request.data['email'])
                payload = {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                }

                return Response(
                  models.Response(success=True, data={ 'jwt': jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256').decode('utf-8') }, message='Successfully Authenticated').dict(),
                  status=200,
                  content_type="application/json"
                )
            else:
                return Response(
                  models.Response(success=False, message='Incorrect username or password.').dict(),
                  status=401,
                  content_type="application/json"
                )
        else:
            return Response(
              models.Response(success=False, message='Unsupported API version number provided: ' + self.request.version).dict(),
              status=400,
              content_type="application/json"
            )
