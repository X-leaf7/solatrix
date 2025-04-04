from datetime import date, datetime
from zoneinfo import ZoneInfo

from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_aware

from sports_data_api.nfl_api import get_schedule
from events.models import Event
from sports.models import League, Sport, Stadium, Team
from users.models import User


class Command(BaseCommand):
    help = "Pulls SportsData.io NFL Events into the database"

    def handle(self, *args, **options):
        nfl = League.objects.get(name="NFL")
        football = Sport.objects.get(name="Football")
        today = date.today()
        host = User.objects.get(email='support@split-side.com')
        active_seasons = nfl.season_set.filter(end_date__date__gte=today)
        time_zone = ZoneInfo('US/Eastern')
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
                    sport=football
                )
                home_team = Team.objects.get(sports_data_id=game['GlobalHomeTeamID'])
                away_team = Team.objects.get(sports_data_id=game['GlobalAwayTeamID'])
                event, new_event = Event.objects.get_or_create(
                    round=round,
                    stadium=stadium,
                    home_team=home_team,
                    away_team=away_team,
                    is_private=False,
                    event_start_time=make_aware(parse_datetime(game['DateTime']), time_zone),
                    defaults={
                        'lobby_start_time': make_aware(datetime.now(), time_zone),
                        'banner': 'banners/leaderboard_default_image_728px_x_90px_v2.jpg',
                        'host': host
                    }
                )
                event.status = game['Status']
                event.save()
