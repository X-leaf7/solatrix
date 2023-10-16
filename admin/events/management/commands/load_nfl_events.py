from datetime import date, datetime

from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_datetime

from sports_data_api.nfl_api import get_schedule
from events.models import Event
from sports.models import League, Stadium, Team
from users.models import User


class Command(BaseCommand):
    help = "Pulls SportsData.io NFL Events into the database"

    def handle(self, *args, **options):
        nfl = League.objects.get(name="NFL")
        today = date.today()
        host = User.objects.get(email='support@split-side.com')
        active_seasons = nfl.season_set.filter(end_date__date__gte=today)
        for season in active_seasons:
            season_schedule = get_schedule(season.sports_data_season)
            round = season.round_set.all()[0]
            for game in season_schedule:
                if not game['DateTime']:
                    # It hasn't been fully scheduled yet
                    continue
                stadium_details = game['StadiumDetails']
                stadium = Stadium.objects.get(
                    sports_data_id=stadium_details['StadiumID'],
                    country=stadium_details['Country']
                )
                home_team = Team.objects.get(sports_data_id=game['GlobalHomeTeamID'])
                away_team = Team.objects.get(sports_data_id=game['GlobalAwayTeamID'])
                event, new_event = Event.objects.get_or_create(
                    round=round,
                    stadium=stadium,
                    home_team=home_team,
                    away_team=away_team,
                    is_private=False,
                    event_start_time=parse_datetime(game['DateTime']),
                    defaults={
                        'lobby_start_time': datetime.now(),
                        'banner': 'banners/leaderboard_default_image_728px_x_90px_v2.jpg',
                        'host': host
                    }
                )
                event.status = game['Status']
                event.save()
