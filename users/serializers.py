from djoser.conf import settings
from djoser.serializers import UserSerializer
from rest_framework import serializers


class TokenPlusUserSerializer(serializers.ModelSerializer):
    auth_token = serializers.CharField(source="key")
    user = UserSerializer()

    class Meta:
        model = settings.TOKEN_MODEL
        fields = ("auth_token", "user")