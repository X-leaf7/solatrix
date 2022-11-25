from djoser.conf import settings
from rest_framework import serializers

from users.models import User


class LoginUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            "username", "first_name", "last_name", "email",
            "is_staff", "id"
        )

class FullUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            "username", "first_name", "last_name", "email",
            "city", "state", "zip_code", "about",
            "profile_image", "id"
        )

        
class TokenPlusUserSerializer(serializers.ModelSerializer):
    auth_token = serializers.CharField(source="key")
    user = LoginUserSerializer()

    class Meta:
        model = settings.TOKEN_MODEL
        fields = ("auth_token", "user")