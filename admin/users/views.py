import os
from django_otp import devices_for_user
from django_otp.plugins.otp_email.models import EmailDevice
from djoser.utils import login_user

from google.oauth2 import id_token
from google.auth.transport import requests

from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.files.images import get_image_dimensions
from rest_framework.parsers import MultiPartParser, FormParser

from .models import User
from .serializers import (
    FullUserSerializer,
    GoogleTokenSerializer,
    OTPTokenSerializer,
    OTPStartSerializer,
    TokenPlusUserSerializer
)

GOOGLE_CLIENT_ID = "401041321374-gc7pa91fpmoplvoimf1t9l91vbiqteuh.apps.googleusercontent.com"

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed and edited.
    """
    queryset = User.objects.all()
    serializer_class = FullUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        """
        Get or update the current authenticated user's data
        """
        user = request.user
        
        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        
        # For PUT and PATCH methods
        serializer = self.get_serializer(user, data=request.data, partial=request.method == 'PATCH')
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_avatar(self, request):
        """
        Upload a profile picture for the current user
        """
        user = request.user
        
        if 'avatar' not in request.FILES:
            return Response(
                {"detail": "No image file provided."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        avatar = request.FILES['avatar']
        
        # Validate file type
        valid_extensions = ['.jpg', '.jpeg', '.png']
        ext = os.path.splitext(avatar.name)[1].lower()
        if ext not in valid_extensions:
            return Response(
                {"detail": "Invalid file format. Please upload a JPEG or PNG image."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Validate file size (limit to 5MB)
        if avatar.size > 5 * 1024 * 1024:  # 5MB
            return Response(
                {"detail": "Image file too large. Maximum size is 5MB."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Validate image dimensions
        try:
            width, height = get_image_dimensions(avatar)
            if width < 100 or height < 100:
                return Response(
                    {"detail": "Image dimensions too small. Minimum size is 100x100 pixels."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return Response(
                {"detail": f"Error validating image: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Save the image
        try:
            # If user already has an avatar, delete the old one
            if user.profile_image and os.path.isfile(user.profile_image.path):
                os.remove(user.profile_image.path)
                
            user.profile_image = avatar
            user.save()
            
            # Return the updated user data
            serializer = self.get_serializer(user)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {"detail": f"Error saving image: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def update(self, request, *args, **kwargs):
        """
        Override update method to ensure users can only update their own profile
        """
        user_id = kwargs.get('pk')
        if str(request.user.id) != user_id:
            return Response(
                {"detail": "You do not have permission to update this user."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().update(request, *args, **kwargs)


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