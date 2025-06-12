from rest_framework import viewsets

from .models import League, Sport, Stadium, Team
from .serializers import LeagueSerializer, SportSerializer, StadiumSerializer, TeamSerializer


class LeagueViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows leagues to be viewed.
    """
    queryset = League.objects.all().order_by('name')
    serializer_class = LeagueSerializer


class SportViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows sports to be viewed.
    """
    queryset = Sport.objects.all().order_by('name')
    serializer_class = SportSerializer


class StadiumViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows stadiums to be viewed.
    """
    queryset = Stadium.objects.all().order_by('name')
    serializer_class = StadiumSerializer


class TeamViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows teams to be viewed.
    """
    queryset = Team.objects.all().order_by('name')
    serializer_class = TeamSerializer