from djoser.utils import login_user

import json
from google.oauth2 import id_token
from google.auth.transport import requests

from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response

from .models import User
from .serializers import FullUserSerializer, GoogleTokenSerializer, TokenPlusUserSerializer


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