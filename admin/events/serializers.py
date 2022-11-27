from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import serializers

from sports.serializers import SportSerializer, TeamSerializer, StadiumSerializer
from .models import Event, Attendee


MAX_ALLOWED_ATTENDEES = 12


class HostSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ['username', 'id']


class EventSerializer(serializers.HyperlinkedModelSerializer):
    sport = SportSerializer()
    home_team = TeamSerializer()
    away_team = TeamSerializer()
    host = HostSerializer()
    stadium = StadiumSerializer()

    class Meta:
        model = Event
        fields = [
            'name', 'sport', 'host',
            'event_start_time', 'lobby_start_time', 'banner',
            'home_team', 'away_team', 'stadium',
            'slug', 'id'
        ]


class CopyEventSerializer(serializers.Serializer):
    source_event_id = serializers.UUIDField()
    new_event = EventSerializer(required=False)

    def save(self, host):
        source_event_id = self.validated_data['source_event_id']
        event = Event.objects.get(pk=source_event_id)

        # Copy source event, changing a few key fields
        old_name = event.name
        event._state.adding = True
        event.id = None
        event.host = host
        event.name = old_name + f' ({host.username})'
        event.is_private = True

        event.save()

        self.validated_data['new_event'] = event


class AttendeeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Attendee
        fields = ['user', 'event', 'chosen_team', 'id']

    def validate(self, data):
        """
        Check private events for attendance threshold
        """
        event_id = data['event'].id
        event = Event.objects.get(pk=event_id)

        if event.is_private:
            # Check that private events only have allowed attendees
            non_host_attendees = event.attendees.filter(~Q(user=event.host.id)).all()
            if len(non_host_attendees) >= MAX_ALLOWED_ATTENDEES:
                raise serializers.ValidationError("MAX_ATTENDEES")

        return data
