from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from models import models
from . import serializers

# Create your views here.
class HelloViewSet(viewsets.ViewSet):
    """Test API ViewSet"""
    
    def list(self, request):
        """Return a hello message"""
        a_viewset = ['one', 'two', 'three']
        
        return Response({'message':'Hello','a_viewset':a_viewset})
    
class UserProfileViewSet(viewsets.ModelViewSet):
    """Handles creating and updating UserProfile"""
    permission_classes = (AllowAny,)

    serializer_class = serializers.UserProfileSerializer
    queryset = models.UserProfile.objects.all()
    