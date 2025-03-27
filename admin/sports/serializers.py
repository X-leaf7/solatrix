from rest_framework import serializers

from .models import League, Round, Season, Sport, Stadium, Team


class LeagueSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = League
        fields = ['id', 'name', 'short_name', 'sport']


class SeasonSerializer(serializers.ModelSerializer):
    league = LeagueSerializer()

    class Meta:
        model = Season
        fields = ['id', 'name', 'league', 'start_date', 'end_date']


class RoundSerializer(serializers.ModelSerializer):
    season = SeasonSerializer()

    class Meta:
        model = Round
        fields = ['id', 'name', 'season', 'start_date', 'end_date']


class SportSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Sport
        fields = ['id', 'name', 'slug']


class StadiumSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Stadium
        lookup_field = 'slug'
        fields = ['id', 'name', 'latitude', 'longitude']


class TeamSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Team
        lookup_field = 'slug'
        fields = ['id', 'name', 'sport', 'stadium', 'logo']