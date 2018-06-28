from rest_framework import viewsets
from rest_framework import permissions

from models import models
from . import serializers

# Create your views here.

class UserProfileViewSet(viewsets.ModelViewSet):
    """Handles creating and updating UserProfile"""
#     permission_classes = (AllowAny,)

    serializer_class = serializers.UserProfileSerializer
    queryset = models.UserProfile.objects.all()

    def get_permissions(self):
        if self.action == 'create':
                permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]

        return [permission() for permission in permission_classes]
