from datetime import date, datetime, timezone

from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_aware

from sports_data_api.soccer_api import get_schedule
from events.models import Event
from sports.models import Round, Sport, Stadium, Team
from users.models import User
from chat.models import ChatRoom


class Command(BaseCommand):
    help = "Pulls SportsData.io Soccer Events into the database"

    def add_arguments(self, parser):
        # Optional argument to specify verbosity
        parser.add_argument(
            '--verbose',
            action='store_true',
            help='Increase output verbosity',
        )
        # Add a flag to skip chat room creation
        parser.add_argument(
            '--no-chatrooms',
            action='store_true',
            help='Skip creating chat rooms for events',
        )

    def handle(self, *args, **options):
        verbose = options.get('verbose', False)
        skip_chatrooms = options.get('no_chatrooms', False)
        
        try:
            soccer = Sport.objects.get(name="Soccer")
        except Sport.DoesNotExist:
            self.stderr.write(self.style.ERROR('Sport "Soccer" not found in database'))
            return
            
        today = date.today()
        leagues = soccer.leagues.filter(sports_data_id__gt=0)
        
        if not leagues.exists():
            self.stdout.write(self.style.WARNING('No active leagues found with sports_data_id'))
            return
            
        for league in leagues:
            active_seasons = league.season_set.filter(end_date__date__gte=today)
            
            if not active_seasons.exists():
                if verbose:
                    self.stdout.write(self.style.WARNING(f'No active seasons found for league {league.name}'))
                continue
                
            for season in active_seasons:
                try:
                    season_schedule = get_schedule(league.sports_data_id, season.sports_data_season)
                except Exception as e:
                    self.stderr.write(self.style.ERROR(
                        f'Error fetching schedule for league {league.name}, season {season.name}: {str(e)}'
                    ))
                    continue
                
                if not season_schedule:
                    if verbose:
                        self.stdout.write(self.style.WARNING(
                            f'No schedule data found for league {league.name}, season {season.name}'
                        ))
                    continue
                
                games_processed = 0
                games_skipped = 0
                chatrooms_created = 0  # Initialize the counter here
                
                for game in season_schedule:
                    if not game.get('DateTime'):
                        # It hasn't been fully scheduled yet
                        games_skipped += 1
                        continue
                    
                    # Find the round or skip this game
                    try:
                        round_obj = Round.objects.get(sports_data_id=game.get('RoundId'), season=season)
                    except Round.DoesNotExist:
                        if verbose:
                            self.stdout.write(self.style.WARNING(
                                f'Round with ID {game.get("RoundId")} not found for season {season.name}'
                            ))
                        games_skipped += 1
                        continue
                    
                    # Find the stadium or skip this game
                    try:
                        stadium = Stadium.objects.get(sports_data_id=game.get('VenueId'), sport=soccer)
                    except Stadium.DoesNotExist:
                        if verbose:
                            self.stdout.write(self.style.WARNING(
                                f'Stadium with ID {game.get("VenueId")} not found'
                            ))
                        games_skipped += 1
                        continue
                    
                    # Find the home team or skip this game
                    try:
                        home_team = Team.objects.get(sports_data_id=game.get('HomeTeamId'))
                    except Team.DoesNotExist:
                        if verbose:
                            self.stdout.write(self.style.WARNING(
                                f'Home team with ID {game.get("HomeTeamId")} not found'
                            ))
                        games_skipped += 1
                        continue
                    
                    # Find the away team or skip this game
                    try:
                        away_team = Team.objects.get(sports_data_id=game.get('AwayTeamId'))
                    except Team.DoesNotExist:
                        if verbose:
                            self.stdout.write(self.style.WARNING(
                                f'Away team with ID {game.get("AwayTeamId")} not found'
                            ))
                        games_skipped += 1
                        continue
                    
                    # Parse the datetime safely
                    try:
                        event_datetime = parse_datetime(game['DateTime'])
                        if not event_datetime:
                            raise ValueError("Invalid datetime format")
                        event_datetime = make_aware(event_datetime, timezone.utc)
                    except (ValueError, TypeError) as e:
                        if verbose:
                            self.stdout.write(self.style.WARNING(
                                f'Invalid datetime format: {game.get("DateTime")}'
                            ))
                        games_skipped += 1
                        continue
                    
                    # Create or update the event
                    try:
                        event, new_event = Event.objects.update_or_create(
                            round=round_obj,
                            stadium=stadium,
                            home_team=home_team,
                            away_team=away_team,
                            event_start_time=event_datetime,
                            defaults={
                                'is_private': False,
                                'lobby_start_time': make_aware(datetime.now(), timezone.utc),
                                'banner': 'banners/leaderboard_default_image_728px_x_90px_v2.jpg',
                                'status': game.get('Status', ''),
                                'away_team_score': (
                                    game.get('AwayTeamScore') or game.get('AwayTeamScoreExtraTime') or
                                    game.get('AwayTeamScorePeriod2') or game.get('AwayTeamScorePeriod1') or 0
                                ),
                                'home_team_score': (
                                    game.get('HomeTeamScore') or game.get('HomeTeamScoreExtraTime') or
                                    game.get('HomeTeamScorePeriod2') or game.get('HomeTeamScorePeriod1') or 0
                                )
                            }
                        )
                        
                        games_processed += 1
                        
                        # Skip chat room creation if --no-chatrooms flag is set
                        if skip_chatrooms:
                            continue
                            
                        # Try to create a ChatRoom for this event if it doesn't already have one
                        try:
                            if new_event or not ChatRoom.objects.filter(event=event).exists():
                                # Create a descriptive name for the chat room
                                room_name = f"{home_team.name} vs {away_team.name} - {event_datetime.strftime('%Y-%m-%d')}"
                                
                                # Create the chat room
                                chat_room = ChatRoom.objects.create(
                                    name=room_name,
                                    description=f"Match discussion for {home_team.name} vs {away_team.name}",
                                    is_private=False,  # Public chat room for the event
                                    event=event,
                                    # creator remains null as it's system-created
                                )
                                
                                chatrooms_created += 1
                                
                                if verbose:
                                    self.stdout.write(self.style.SUCCESS(
                                        f'Created chat room: {room_name}'
                                    ))
                        except Exception as chat_error:
                            self.stderr.write(self.style.ERROR(
                                f'Error creating chat room for event {event.id}: {str(chat_error)}'
                            ))
                        
                        if verbose and new_event:
                            self.stdout.write(self.style.SUCCESS(
                                f'Created new event: {home_team.name} vs {away_team.name}'
                            ))
                    except Exception as e:
                        self.stderr.write(self.style.ERROR(
                            f'Error creating/updating event: {str(e)}'
                        ))
                        games_skipped += 1
                
                self.stdout.write(self.style.SUCCESS(
                    f'League {league.name}, Season {season.name}: '
                    f'Processed {games_processed} games, Skipped {games_skipped} games, '
                    f'Created {chatrooms_created} chat rooms'
                ))
