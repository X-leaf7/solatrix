from rest_framework import viewsets
from rest_framework import permissions

from .models import Event
from .serializers import EventSerializer


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows teams to be viewed.
    """
    queryset = Event.objects.all().order_by('-event_start_time')
    serializer_class = EventSerializer
