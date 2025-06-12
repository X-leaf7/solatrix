from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import serializers

from sports.serializers import RoundSerializer, SportSerializer, TeamSerializer, StadiumSerializer
from .models import Event, Attendee


MAX_ALLOWED_ATTENDEES = 12


class HostSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ['username', 'id']


class EventSerializer(serializers.HyperlinkedModelSerializer):
    sport = serializers.SerializerMethodField()
    home_team = TeamSerializer()
    away_team = TeamSerializer()
    host = HostSerializer()
    stadium = StadiumSerializer()
    round = RoundSerializer()

    def get_sport(self, obj):
        return SportSerializer(obj.round.season.league.sport, context=self.context).data

    class Meta:
        model = Event
        fields = [
            'name', 'sport', 'host', 'status',
            'event_start_time', 'lobby_start_time', 'banner',
            'home_team', 'away_team',
            'home_team_score', 'away_team_score',
            'stadium', 'round',
            'slug', 'id'
        ]

class EventDetailSerializer(EventSerializer):
    public_chatroom_id = serializers.SerializerMethodField()
    
    def get_public_chatroom_id(self, obj):
        """
        Get the ID of the public chatroom associated with this event.
        Returns None if no public chatroom exists.
        """
        public_chatroom = obj.created_rooms_event.filter(is_private=False).first()
        
        if public_chatroom:
            return public_chatroom.id
        return None
    
    class Meta:
        model = Event
        fields = EventSerializer.Meta.fields + ['public_chatroom_id']

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
        fields = ['user', 'event', 'chosen_team', 'id', 'ivs_participant_token']
        read_only_fields = ['ivs_participant_token']

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
