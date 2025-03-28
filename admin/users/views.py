from django_otp import devices_for_user
from django_otp.plugins.otp_email.models import EmailDevice
from djoser.utils import login_user

import json
from google.oauth2 import id_token
from google.auth.transport import requests

from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response

from .models import User
from .serializers import FullUserSerializer, GoogleTokenSerializer, OTPTokenSerializer, OTPStartSerializer, TokenPlusUserSerializer


GOOGLE_CLIENT_ID = "401041321374-gc7pa91fpmoplvoimf1t9l91vbiqteuh.apps.googleusercontent.com"


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows leaguess to be viewed.
    """
    queryset = User.objects.all()
    serializer_class = FullUserSerializer

    permission_classes = [permissions.IsAuthenticated]


class GoogleLoginView(generics.GenericAPIView):

    serializer_class = GoogleTokenSerializer

    def post(self, request, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_info = id_token.verify_oauth2_token(request.data['credential'], requests.Request(), GOOGLE_CLIENT_ID)

        user, created = User.objects.get_or_create(
            email=user_info['email'],
            defaults={
                'username': user_info['email'].split('@')[0],
                'first_name': user_info.get('given_name', "").strip(),
                'last_name': user_info.get('family_name', "").strip(),
            }
        )

        token = login_user(request, user)
        return Response(
            data=TokenPlusUserSerializer(token).data, status=status.HTTP_200_OK
        )


class OTPLoginView(generics.GenericAPIView):

    serializer_class = OTPTokenSerializer

    def post(self, request, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.get(email=request.data['email'])
        devices = list(devices_for_user(user))

        if not devices:
            return Response(
                data={"detail": "No devices found for user"}, status=status.HTTP_400_BAD_REQUEST
            )

        device = devices[0]
        code_verified = device.verify_token(request.data['code'])

        if code_verified:
            token = login_user(request, user)
            return Response(
                data=TokenPlusUserSerializer(token).data, status=status.HTTP_200_OK
            )
        else:
            return Response(
                data={"detail": "Invalid code"}, status=status.HTTP_400_BAD_REQUEST
            )


class OTPStartView(generics.GenericAPIView):
    serializer_class = OTPStartSerializer

    def post(self, request, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            email = serializer.validated_data['email']
            
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0]
                }
            )
            
            devices = list(devices_for_user(user))

            if devices:
                device = devices[0]
            else:
                device = EmailDevice(email=user.email, user=user)
                device.save()

            try:
                device.generate_challenge()
            except Exception as e:
                print(f"Error generating challenge: {str(e)}")
                return Response(
                    data={"detail": f"Error generating challenge: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            return Response(
                data={"detail": "Challenge sent", "success": True},
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return Response(
                data={"detail": "An unexpected error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )