from rest_framework import serializers

from .models import League, Sport, Stadium, Team


class LeagueSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = League
        fields = ['id', 'name', 'sport']


class SportSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Sport
        fields = ['id', 'name', 'slug', 'leagues']


class StadiumSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Stadium
        lookup_field = 'slug'
        fields = ['id', 'name', 'latitude', 'longitude']


class TeamSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Team
        lookup_field = 'slug'
        fields = ['id', 'name', 'sport', 'stadium']