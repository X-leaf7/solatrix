from django.contrib.auth import get_user_model
from rest_framework import serializers

from sports.serializers import SportSerializer, TeamSerializer
from .models import Event

class HostSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ['username']


class EventSerializer(serializers.HyperlinkedModelSerializer):
    sport = SportSerializer()
    home_team = TeamSerializer()
    away_team = TeamSerializer()
    host = HostSerializer()

    class Meta:
        model = Event
        fields = [
            'name', 'sport', 'host',
            'event_start_time', 'lobby_start_time',
            'home_team', 'away_team',
            'is_private', 'slug',
        ]