from django.core.management.base import BaseCommand, CommandError
from django.core.files.base import ContentFile
from django.utils.dateparse import parse_datetime

from requests import get

from sports_data_api.api import get_leagues, get_teams, get_venues
from sports.models import League, Season, Round, Sport, Stadium, Team


class Command(BaseCommand):
    help = "Pulls SportsData.io Soccer Leagues into the database"

    def add_arguments(self, parser):
        parser.add_argument("season", type=int)
        parser.add_argument("leagues", nargs="+", type=str)

    def handle(self, *args, **options):
        leagues_data = get_leagues(options['leagues'])
        soccer = Sport.objects.get(name="Fútbol (Soccer)")

        countries = set()
        league_objects = []

        for league_data in leagues_data:
            league, new_league = League.objects.get_or_create(
                name=f'{league_data["Name"]} ({league_data["Key"]})',
                sport=soccer,
                sports_data_id=league_data['CompetitionId']
            )
            league_objects.append(league)

            countries.add(league_data['AreaName'])

            for season_data in league_data['Seasons']:
                if season_data['Season'] == options['season']:
                    season, new_season = Season.objects.get_or_create(
                        league=league,
                        name=season_data['Name'],
                        start_date=parse_datetime(season_data['StartDate']),
                        end_date=parse_datetime(season_data['EndDate']),
                        sports_data_id=season_data['SeasonId'],
                        sports_data_season=season_data['Season']
                    )

                    for round_data in season_data['Rounds']:
                        round, new_round = Round.objects.get_or_create(
                            season=season,
                            name=round_data['Name'],
                            start_date=parse_datetime(round_data['StartDate']),
                            end_date=parse_datetime(round_data['EndDate']),
                            sports_data_id=round_data['RoundId']
                        )

        venues_data = get_venues()
        for venue_data in venues_data:
            if venue_data['Country'] in countries:
                Stadium.objects.get_or_create(
                    name=venue_data['Name'],
                    address=venue_data['Address'] or '',
                    city=venue_data['City'] or '',
                    zip_code=venue_data['Zip'] or '',
                    country=venue_data['Country'],
                    latitude=venue_data['GeoLat'],
                    longitude=venue_data['GeoLong'],
                    sports_data_id=venue_data['VenueId']
                )

        # After loading venue data, load team data for each league
        for league in league_objects:
            teams_data = get_teams(league.sports_data_id)
            for team_data in teams_data:
                stadium, new_stadium = Stadium.objects.get_or_create(
                    sports_data_id=team_data['VenueId'],
                    defaults={
                        'name': team_data['VenueName'],
                        'address': team_data['Address'],
                        'city': team_data['City'],
                        'zip_code': team_data['Zip'],
                        'country': team_data['AreaName']
                    }
                )
                colors = [
                    color.lower().replace(' ', '') for color in
                    [team_data['ClubColor1'], team_data['ClubColor2'], team_data['ClubColor3']]
                    if color
                ]
                team, new_team = Team.objects.get_or_create(
                    name=team_data['Name'],
                    sport=soccer,
                    league=league,
                    stadium=stadium,
                    colors=colors,
                    sports_data_id=team_data['TeamId']
                )
                logo_url = team_data['WikipediaLogoUrl']
                if logo_url:
                    logo_name = logo_url.split('/')[-1]
                    if not team.logo.name or logo_name not in team.logo.name:
                        logo_request = get(logo_url)
                        if logo_request.status_code == 200:
                            logo_name = logo_url.split('/')[-1]
                            team.logo.save(logo_name, ContentFile(logo_request.content))