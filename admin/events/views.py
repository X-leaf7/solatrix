from datetime import date

import boto3

from django.conf import settings
from django.utils import timezone

from rest_framework import generics
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response

from .models import Event, Attendee
from .serializers import EventSerializer, AttendeeSerializer, CopyEventSerializer


class EventViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows teams to be viewed.
    """

    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

    def get_queryset(self):
        today = date.today()
        yesterday = today - timezone.timedelta(days=1)
        queryset = Event.objects.all()\
            .order_by('event_start_time')\
            .filter(
                event_start_time__date__gte=yesterday
            )

        if self.action == 'list':
            if self.request.user.is_authenticated:
                # If authenticated, get user events
                queryset = queryset.filter(host=self.request.user, is_private=True)
            else:
                # Otherwise, only show public events
                queryset = queryset.filter(is_private=False)

            queryset = queryset.prefetch_related('host', 'home_team', 'away_team', 'round__season__league__sport', 'stadium')

        return queryset

    def perform_destroy(self, instance):
        # Only allow the owner to delete their events
        if self.request.user.id == instance.host.id:
            instance.delete()
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


class CopyEventView(generics.CreateAPIView):

    serializer_class = CopyEventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(host=self.request.user)


class AttendeeViewSet(viewsets.ModelViewSet):
    """
    API endpoints to allow people to join events
    """
    queryset = Attendee.objects.all()

    serializer_class = AttendeeSerializer

    permission_classes = [permissions.IsAuthenticated]

    filterset_fields = ['user', 'event']