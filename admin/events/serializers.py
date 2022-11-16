from django.contrib.auth import get_user_model
from rest_framework import serializers

from sports.serializers import SportSerializer, TeamSerializer, StadiumSerializer
from .models import Event, Attendee

class HostSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ['username']


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
            'is_private', 'slug', 'id'
        ]


class AttendeeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Attendee
        fields = ['user', 'event', 'chosen_team', 'id']