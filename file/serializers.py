from django.contrib.auth import authenticate

from rest_framework import serializers

from models import models

class FileChunkSerializer(serializers.Serializer):
    chunk_id = serializers.IntegerField()
