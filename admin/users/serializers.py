from djoser.conf import settings
from djoser.serializers import SendEmailResetSerializer, TokenCreateSerializer, UserCreateSerializer
from drf_recaptcha.fields import ReCaptchaV2Field
from rest_framework import serializers

from users.models import User


class LoginUserSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = (
            "username", "first_name", "last_name", "email",
            "is_staff", "id", "profile_image_url"
        )
    
    def get_profile_image_url(self, obj):
        if obj.profile_image:
            return obj.profile_image.url
        return None

class FullUserSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    avatar = serializers.ImageField(source='profile_image', required=False)
    
    class Meta:
        model = User
        fields = (
            "id", "username", "firstName", "lastName", "email",
            "city", "state", "zip_code", "about", "avatar"
        )
        read_only_fields = ("id", "username")  # Prevent these fields from being updated
        
    def to_representation(self, instance):
        """
        Convert snake_case to camelCase for frontend
        """
        ret = super().to_representation(instance)
        # If there are any additional snake_case fields that need conversion, add them here
        return ret
        
    def update(self, instance, validated_data):
        """
        Handle nested fields like profile_image
        """
        profile_image = validated_data.pop('profile_image', None)
        if profile_image:
            instance.profile_image = profile_image
            
        return super().update(instance, validated_data)

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

class OTPTokenSerializer(serializers.Serializer):
    email = serializers.CharField()
    code = serializers.CharField()

class OTPStartSerializer(serializers.Serializer):
    email = serializers.CharField()
