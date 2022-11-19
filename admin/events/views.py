from datetime import date

from rest_framework import viewsets
from rest_framework import permissions

from .models import Event, Attendee
from .serializers import EventSerializer, AttendeeSerializer


class EventViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows teams to be viewed.
    """
    queryset = Event.objects.all()\
        .order_by('-lobby_start_time')\
        .filter(lobby_start_time__date__gte=date.today())

    serializer_class = EventSerializer

    lookup_field = 'slug'

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class AttendeeViewSet(viewsets.ModelViewSet):
    """
    API endpoints to allow people to join events
    """
    queryset = Attendee.objects.all()

    serializer_class = AttendeeSerializer

    permission_classes = [permissions.IsAuthenticated]

    filterset_fields = ['user', 'event']
