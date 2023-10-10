from datetime import date, datetime

from django.core.management.base import BaseCommand, CommandError
from django.utils.dateparse import parse_datetime

from sports_data_api.soccer_api import get_schedule
from events.models import Event
from sports.models import Round, Sport, Stadium, Team
from users.models import User


class Command(BaseCommand):
    help = "Pulls SportsData.io Soccer Events into the database"

    def handle(self, *args, **options):
        soccer = Sport.objects.get(name="Fútbol (Soccer)")
        today = date.today()
        host = User.objects.get(email='support@split-side.com')
        leagues = soccer.leagues.filter(sports_data_id__gt=0)
        for league in leagues:
            active_seasons = league.season_set.filter(end_date__date__gte=today)
            for season in active_seasons:
                season_schedule = get_schedule(league.sports_data_id, season.sports_data_season)

                for game in season_schedule:
                    if not game['DateTime']:
                        # It hasn't been fully scheduled yet
                        continue

                    round = Round.objects.get(sports_data_id=game['RoundId'], season=season)
                    stadium = Stadium.objects.get(sports_data_id=game['VenueId'])
                    home_team = Team.objects.get(sports_data_id=game['HomeTeamId'])
                    away_team = Team.objects.get(sports_data_id=game['AwayTeamId'])
                    event, new_event = Event.objects.get_or_create(
                        round=round,
                        stadium=stadium,
                        home_team=home_team,
                        away_team=away_team,
                        is_private=False,
                        event_start_time=parse_datetime(game['DateTime']),
                        banner='banners/leaderboard_default_image_728px_x_90px_v2.jpg',
                        host=host,
                        defaults={
                            'lobby_start_time': datetime.now()
                        }
                    )

                    event.status = game['Status']
                    event.save()
