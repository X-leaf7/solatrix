from rest_framework import viewsets
from rest_framework import permissions

from .models import User
from .serializers import FullUserSerializer


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows leaguess to be viewed.
    """
    queryset = User.objects.all()
    serializer_class = FullUserSerializer

    permission_classes = [permissions.IsAuthenticated]