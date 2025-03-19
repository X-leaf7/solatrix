from django.core.management.base import BaseCommand, CommandError
from django.core.files.base import ContentFile
from django.utils.dateparse import parse_datetime

from requests import get

from sports_data_api.nfl_api import get_stadiums, get_teams
from sports.models import League, Sport, Stadium, Team


class Command(BaseCommand):
    help = "Pulls SportsData.io NFL data into the database"

    def handle(self, *args, **options):
        football, new_football = Sport.objects.get_or_create(name="Football")
        league, new_league = League.objects.get_or_create(
            name='NFL',
            sport=football,
            sports_data_id=0
        )

        stadiums = get_stadiums()

        for stadium in stadiums:
            Stadium.objects.get_or_create(
                name=stadium['Name'],
                address='',
                city=stadium['City'] or '',
                zip_code='',
                country=stadium['Country'],
                latitude=stadium['GeoLat'],
                longitude=stadium['GeoLong'],
                sports_data_id=stadium['StadiumID'],
                sport=football
            )

        # After loading venue data, load team data for each league
        teams_data = get_teams()
        for team_data in teams_data:
            stadium_data = team_data['StadiumDetails']
            stadium, new_stadium = Stadium.objects.get_or_create(
                sports_data_id=stadium_data['StadiumID'],
                sport=football,
                defaults={
                    'name': stadium_data['Name'],
                    'city': stadium_data['City'],
                    'latitude': stadium_data['GeoLat'],
                    'longitude': stadium_data['GeoLong'],
                    'country': stadium_data['Country']
                }
            )
            colors = [
                color for color in
                [team_data['PrimaryColor'], team_data['SecondaryColor'], team_data['TertiaryColor'], team_data['QuaternaryColor']]
                if color
            ]
            team, new_team = Team.objects.get_or_create(
                name=team_data['Name'],
                sport=football,
                league=league,
                stadium=stadium,
                colors=colors,
                sports_data_id=team_data['TeamID']
            )
            logo_url = team_data['WikipediaLogoUrl']
            if logo_url:
                logo_name = logo_url.split('/')[-1]
                if not team.logo.name or logo_name not in team.logo.name:
                    logo_request = get(logo_url)
                    if logo_request.status_code == 200:
                        logo_name = logo_url.split('/')[-1]
                        team.logo.save(logo_name, ContentFile(logo_request.content))