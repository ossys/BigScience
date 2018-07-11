from django.contrib.auth import authenticate
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from models import models
from .serializers import (RegistrationSerializer, LoginSerializer)
from .renderers import UserJSONRenderer

# Create your views here.

class RegistrationAPIView(APIView):
    """Handles creating and updating UserProfile"""
    permission_classes = (AllowAny,)
    serializer_class = RegistrationSerializer
 
    def post(self, request):
        print(request.data)
 
        if not self.request.version or self.request.version == settings.CONSTANTS['VERSION']['1_0']:
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
 
            return Response(
              models.JSONResponse(success=True, data=serializer.data, message='Successfully Created User').dict(),
              status=200,
              content_type="application/json"
            )
             
        else:
            return Response(
              models.JSONResponse(success=False, message='Unsupported API version number provided: ' + self.request.version).dict(),
              status=400,
              content_type="application/json"
            )

class LoginAPIView(APIView):
    permission_classes = (AllowAny,)
    renderer_classes = (UserJSONRenderer,)
    serializer_class = LoginSerializer

    def post(self, request):
        if (not request.data or
            not 'email' in request.data or
            not 'password' in request.data or
            not request.data['email'] or
            not request.data['password']):
            return Response(
              models.JSONResponse(success=False, message='Please provide an email and password.').dict(),
              status=400,
              content_type="application/json"
            )

        if not self.request.version or self.request.version == settings.CONSTANTS['VERSION']['1_0']:
            if authenticate(email=request.data['email'],password=request.data['password']):
                serializer = self.serializer_class(data=request.data)
                serializer.is_valid(raise_exception=True)
                return Response(
                  models.JSONResponse(success=True, data=serializer.data, message='Successfully Authenticated').dict(),
                  status=200,
                  content_type="application/json"
                )
            else:
                return Response(
                  models.JSONResponse(success=False, message='Incorrect username or password.').dict(),
                  status=401,
                  content_type="application/json"
                )
        else:
            return Response(
              models.JSONResponse(success=False, message='Unsupported API version number provided: ' + self.request.version).dict(),
              status=400,
              content_type="application/json"
            )

# class UserUpdateView(RetrieveUpdateAPIView):
#     permission_classes = (IsAuthenticated,)
#     renderer_classes = (UserJSONRenderer,)
#     serializer_class = UserSerializer
# 
#     def retrieve(self, request, *args, **kwargs):
#         # There is nothing to validate or save here. Instead, we just want the
#         # serializer to handle turning our `User` object into something that
#         # can be JSONified and sent to the client.
#         serializer = self.serializer_class(request.user)
# 
#         return Response(serializer.data, status=status.HTTP_200_OK)
# 
#     def update(self, request, *args, **kwargs):
#         serializer_data = request.data.get('user', {})
# 
#         # Here is that serialize, validate, save pattern we talked about
#         # before.
#         serializer = self.serializer_class(
#             request.user, data=serializer_data, partial=True
#         )
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
# 
#         return Response(serializer.data, status=status.HTTP_200_OK)