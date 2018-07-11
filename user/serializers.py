from rest_framework import serializers

from models import models

class UserSerializer(serializers.ModelSerializer):
    """A Serializer for the UserProfile model object"""

    password = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True
    )
    token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = models.User
        fields = ['email', 'username', 'first_name', 'last_name', 'password', 'token']

    def create(self, validated_data):
        """Create and return a new UserProfile"""

        user = models.User(
            email=validated_data['email'],
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )
        user.set_password(validated_data['password'])
        user.save()

        return user
