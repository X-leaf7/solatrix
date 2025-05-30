from datetime import date

from django.utils import timezone
from django.db import models

from rest_framework import generics
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import action

from .models import Event, Attendee
from .serializers import (
    EventSerializer,
    AttendeeSerializer,
    CopyEventSerializer,
    EventDetailSerializer
)

# Custom pagination class
class EventPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
    page_query_param = 'page'


class EventViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows events to be viewed with pagination and filtering.
    
    Query Parameters:
    - timing: Filter events by timing status ('live', 'upcoming', 'previous', 'all')
    - page: Page number for pagination
    - page_size: Number of items per page
    """
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    pagination_class = EventPagination

    def get_queryset(self):
        today = date.today()
        yesterday = today - timezone.timedelta(days=1)
        now = timezone.now()
        
        # Base queryset
        queryset = Event.objects.all().order_by('event_start_time')
        
        timing = None
        if 'timing' in self.request.query_params:
            timing = self.request.query_params.get('timing')
        elif 'timing' in self.request.GET:
            timing = self.request.GET.get('timing')
        else:
            # Try to parse it from the query string manually
            query_string = self.request.META.get('QUERY_STRING', '')
            
            import urllib.parse
            parsed_qs = urllib.parse.parse_qs(query_string)
            if 'timing' in parsed_qs:
                timing = parsed_qs['timing'][0]
        
        # Default to 'all' if timing is still None
        if timing is None:
            timing = 'all'
        
        # Apply timing filter
        if timing == 'live':
            queryset = queryset.filter(
                event_start_time__lte=now,
                status='InProgress'
            )
        elif timing == 'upcoming':
            queryset = queryset.filter(
                event_start_time__gt=now,
                status='Scheduled'
            )
        elif timing == 'previous':
            queryset = queryset.filter(
                event_start_time__lte=now,
                event_start_time__date__gte=yesterday,
                status='Final'
            )
        else:  # 'all' or any other value
            # For 'all', we still filter out very old events
            queryset = queryset.filter(
                event_start_time__date__gte=yesterday
            )
        
        # Apply authentication filters
        if self.action == 'list':
            if self.request.user.is_authenticated:
                # If authenticated, get user events
                queryset = queryset.filter(host=self.request.user, is_private=True)
            else:
                # Otherwise, only show public events
                queryset = queryset.filter(is_private=False)

            queryset = queryset.prefetch_related(
                'host',
                'home_team',
                'away_team',
                'round__season__league__sport',
                'stadium'
            )

        return queryset

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def participated(self, request):
        """
        Get events where the current user has participated in chat rooms.
        
        Query Parameters:
        - timing: Filter events by timing status ('live', 'upcoming', 'previous', 'all')
        - page: Page number for pagination
        - page_size: Number of items per page
        """
        today = date.today()
        yesterday = today - timezone.timedelta(days=1)
        now = timezone.now()
        
        # Get events where the user is a member of a chat room
        queryset = Event.objects.filter(
            created_rooms_event__members__user=request.user
        ).distinct().order_by('-event_start_time')
        
        # Apply timing filter
        timing = request.query_params.get('timing', 'all')
        
        if timing == 'live':
            queryset = queryset.filter(
                event_start_time__lte=now,
                status='InProgress'
            )
        elif timing == 'upcoming':
            queryset = queryset.filter(
                event_start_time__gt=now,
                status='Scheduled'
            )
        elif timing == 'previous':
            queryset = queryset.filter(
                event_start_time__lte=now,
                event_start_time__date__gte=yesterday,
                status='Final'
            )
        else:  # 'all' or any other value
            # For 'all', we still filter out very old events
            queryset = queryset.filter(
                event_start_time__date__gte=yesterday
            )
        
        # Prefetch related data for performance
        queryset = queryset.prefetch_related(
            'host',
            'home_team',
            'away_team',
            'round__season__league__sport',
            'stadium',
            'created_rooms_event'
        )
        
        # Apply pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = EventDetailSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = EventDetailSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def perform_destroy(self, instance):
        # Only allow the owner to delete their events
        if self.request.user.id == instance.host.id:
            instance.delete()
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

class EventDetailByIdView(generics.RetrieveAPIView):
    """
    API endpoint that allows a single event to be retrieved by its ID.
    """
    queryset = Event.objects.all()
    serializer_class = EventDetailSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = Event.objects.all()
        
        # Apply the same prefetch_related as in EventViewSet for consistency
        queryset = queryset.prefetch_related(
            'host',
            'home_team',
            'away_team',
            'round__season__league__sport',
            'stadium'
        )
        
        # Apply authentication filters
        if self.request.user.is_authenticated:
            # If authenticated, include private events owned by the user
            return queryset.filter(
                models.Q(is_private=False) | 
                models.Q(is_private=True, host=self.request.user)
            )
        else:
            # Otherwise, only show public events
            return queryset.filter(is_private=False)


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