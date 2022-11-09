from djoser.conf import settings
from djoser.serializers import UserSerializer
from rest_framework import serializers

from users.models import User


class TokenPlusUserSerializer(serializers.ModelSerializer):
    auth_token = serializers.CharField(source="key")
    user = UserSerializer()

    class Meta:
        model = settings.TOKEN_MODEL
        fields = ("auth_token", "user")


class FullUserSerializer(serializers.ModelSerializer):


    class Meta:
        model = User
        fields = (
            "username", "first_name", "last_name", "email",
            "city", "state", "zip_code", "about",
            "profile_image"
        )