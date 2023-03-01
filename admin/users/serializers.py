from djoser.conf import settings
from djoser.serializers import SendEmailResetSerializer, TokenCreateSerializer, UserCreateSerializer
from drf_recaptcha.fields import ReCaptchaV2Field
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


class ReCaptchaMixin(metaclass=serializers.SerializerMetaclass):
    recaptcha = ReCaptchaV2Field()


class LoginWithRecaptcha(TokenCreateSerializer, ReCaptchaMixin):
    pass


class PasswordResetWithRecaptcha(SendEmailResetSerializer, ReCaptchaMixin):
    pass


class SignupWithRecaptcha(UserCreateSerializer):
    recaptcha = ReCaptchaV2Field()

    class Meta:
        model = User
        fields = tuple(User.REQUIRED_FIELDS) + (
            User._meta.pk.name,
            "email",
            "password",
            "recaptcha"
        )

    def validate(self, attrs):
        attrs.pop("recaptcha")
        return super().validate(attrs)

        
class TokenPlusUserSerializer(serializers.ModelSerializer):
    auth_token = serializers.CharField(source="key")
    user = LoginUserSerializer()

    class Meta:
        model = settings.TOKEN_MODEL
        fields = ("auth_token", "user")


class GoogleTokenSerializer(serializers.Serializer):
    credential = serializers.CharField()