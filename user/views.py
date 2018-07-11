from django.contrib.auth import authenticate
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from models import models
from . import serializers

# Create your views here.

class UserView(APIView):
    """Handles creating and updating UserProfile"""
    permission_classes = (AllowAny,)
    serializer_class = serializers.UserSerializer

    def post(self, request):
        print(request.data)

        if not self.request.version or self.request.version == settings.CONSTANTS['VERSION']['1_0']:
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response(
              models.Response(success=True, data=serializer.data, message='Successfully Created User').dict(),
              status=200,
              content_type="application/json"
            )
            
        else:
            return Response(
              models.Response(success=False, message='Unsupported API version number provided: ' + self.request.version).dict(),
              status=400,
              content_type="application/json"
            )

class Login(APIView):
    permission_classes = (AllowAny,)
    serializer_class = serializers.UserSerializer

    def post(self, request):
        if not request.data or not request.data['email'] or not request.data['password']:
            return Response(
              models.Response(success=False, message='Please provide an email and password.').dict(),
              status=400,
              content_type="application/json"
            )

        if not self.request.version or self.request.version == settings.CONSTANTS['VERSION']['1_0']:
            if authenticate(email=request.data['email'],password=request.data['password']):
                user = serializers.UserSerializer(models.User.objects.get(email=request.data['email']))

                return Response(
                  models.Response(success=True, data=user.data, message='Successfully Authenticated').dict(),
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
