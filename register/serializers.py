from rest_framework import serializers

from models import models

class UserProfileSerializer(serializers.ModelSerializer):
    """A Serializer for the UserProfile model object"""
    
    class Meta:
        model = models.UserProfile
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'password')
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        """Create and return a new UserProfile"""

        user = models.UserProfile(
            email=validated_data['email'],
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )
        user.set_password(validated_data['password'])
        user.save()

        return user