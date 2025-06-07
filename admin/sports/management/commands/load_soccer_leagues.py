from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.utils.dateparse import parse_datetime

from requests import get
import os
from urllib.parse import urlparse

from sports_data_api.soccer_api import get_leagues, get_teams, get_venues
from sports.models import League, Season, Round, Sport, Stadium, Team


class Command(BaseCommand):
    help = "Pulls SportsData.io Soccer Leagues into the database"

    def add_arguments(self, parser):
        parser.add_argument("season", type=int)
        parser.add_argument("leagues", nargs="+", type=str)
        parser.add_argument(
            '--verbose',
            action='store_true',
            help='Increase output verbosity',
        )

    def handle(self, *args, **options):
        verbose = options.get('verbose', False)
        
        try:
            soccer = Sport.objects.get(name="Soccer")
            created = False
        except Sport.DoesNotExist:
            soccer = Sport.objects.create(name="Soccer")
            created = True
        
        try:
            leagues_data = get_leagues(options['leagues'])
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Error fetching leagues data: {str(e)}'))
            return

        countries = set()
        league_objects = []

        for league_data in leagues_data:
            try:
                league, new_league = League.objects.get_or_create(
                    name=f'{league_data["Name"]} ({league_data["Key"]})',
                    sport=soccer,
                    sports_data_id=league_data['CompetitionId']
                )
                league_objects.append(league)

                countries.add(league_data['AreaName'])

                for season_data in league_data['Seasons']:
                    if season_data['Season'] == options['season']:
                        try:
                            season, new_season = Season.objects.get_or_create(
                                league=league,
                                name=season_data['Name'],
                                start_date=parse_datetime(season_data['StartDate']),
                                end_date=parse_datetime(season_data['EndDate']),
                                sports_data_id=season_data['SeasonId'],
                                sports_data_season=season_data['Season']
                            )

                            for round_data in season_data['Rounds']:
                                try:
                                    round_obj, new_round = Round.objects.get_or_create(
                                        season=season,
                                        name=round_data['Name'],
                                        start_date=parse_datetime(round_data['StartDate']),
                                        end_date=parse_datetime(round_data['EndDate']),
                                        sports_data_id=round_data['RoundId']
                                    )
                                except Exception as e:
                                    self.stderr.write(self.style.ERROR(
                                        f'Error processing round {round_data.get("Name", "Unknown")}: {str(e)}'
                                    ))
                        except Exception as e:
                            self.stderr.write(self.style.ERROR(
                                f'Error processing season {season_data.get("Name", "Unknown")}: {str(e)}'
                            ))
            except Exception as e:
                self.stderr.write(self.style.ERROR(
                    f'Error processing league {league_data.get("Name", "Unknown")}: {str(e)}'
                ))

        try:
            venues_data = get_venues()
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Error fetching venues data: {str(e)}'))
            venues_data = []
        
        for venue_data in venues_data:
            try:
                if venue_data['Country'] in countries:
                    Stadium.objects.get_or_create(
                        sports_data_id=venue_data['VenueId'],
                        sport=soccer,
                        defaults={
                            'name': venue_data['Name'],
                            'address': venue_data['Address'] or '',
                            'city': venue_data['City'] or '',
                            'zip_code': venue_data['Zip'] or '',
                            'country': venue_data['Country'],
                            'latitude': venue_data['GeoLat'],
                            'longitude': venue_data['GeoLong']
                        }
                    )
            except Exception as e:
                self.stderr.write(self.style.ERROR(
                    f'Error processing venue {venue_data.get("Name", "Unknown")}: {str(e)}'
                ))

        # After loading venue data, load team data for each league
        teams_processed = 0
        logos_processed = 0
        
        for league in league_objects:
            try:
                teams_data = get_teams(league.sports_data_id)
            except Exception as e:
                self.stderr.write(self.style.ERROR(f'Error fetching teams data for league {league.name}: {str(e)}'))
                continue
            
            for team_data in teams_data:
                try:
                    # Create or get stadium
                    try:
                        stadium, new_stadium = Stadium.objects.get_or_create(
                            sports_data_id=team_data['VenueId'],
                            sport=soccer,
                            defaults={
                                'name': team_data['VenueName'],
                                'address': team_data['Address'] or '',
                                'city': team_data['City'] or '',
                                'zip_code': team_data['Zip'] or '',
                                'country': team_data['AreaName'] or ''
                            }
                        )
                    except Exception as e:
                        self.stderr.write(self.style.ERROR(
                            f'Error creating stadium for team {team_data.get("Name", "Unknown")}: {str(e)}'
                        ))
                        continue
                    
                    # Process team colors
                    colors = [
                        color.lower().replace(' ', '') for color in
                        [team_data.get('ClubColor1'), team_data.get('ClubColor2'), team_data.get('ClubColor3')]
                        if color
                    ]
                    
                    # Create or get team
                    try:
                        team, new_team = Team.objects.get_or_create(
                            sports_data_id=team_data['TeamId'],
                            sport=soccer,
                            defaults={
                                'name': team_data['Name'],
                                'league': league,
                                'stadium': stadium,
                                'colors': colors
                            }
                        )
                        
                        if not new_team:
                            # Keep the existing team up to date
                            team.stadium = stadium
                            team.colors = colors
                            team.save()
                        
                        teams_processed += 1
                    except Exception as e:
                        self.stderr.write(self.style.ERROR(
                            f'Error creating/updating team {team_data.get("Name", "Unknown")}: {str(e)}'
                        ))
                        continue
                    
                    # Process team logo
                    logo_url = team_data.get('WikipediaLogoUrl')
                    if logo_url:
                        try:
                            # Parse the URL to get the file extension
                            parsed_url = urlparse(logo_url)
                            path = parsed_url.path
                            file_extension = os.path.splitext(path)[1].lower()
                            
                            # Create a more reliable filename
                            logo_name = f"{team.sports_data_id}{file_extension}"
                            
                            # Check if we need to download the logo
                            if not team.logo.name or logo_name not in team.logo.name:
                                # Add timeout and headers for better reliability
                                headers = {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                                }
                                logo_request = get(logo_url, headers=headers, timeout=10)
                                
                                if logo_request.status_code == 200:
                                    # Save the file
                                    try:
                                        team.logo.save(logo_name, ContentFile(logo_request.content), save=True)
                                        logos_processed += 1
                                    except Exception as e:
                                        self.stderr.write(self.style.ERROR(
                                            f"Failed saving logo for {team.name} ({logo_name}): {e}"
                                        ))
                                    
                                    if verbose:
                                        self.stdout.write(self.style.SUCCESS(f"Downloaded logo for {team.name}"))
                                else:
                                    self.stderr.write(self.style.WARNING(
                                        f"Failed to download logo for {team.name}: HTTP {logo_request.status_code}"
                                    ))
                        except Exception as e:
                            self.stderr.write(self.style.ERROR(f"Error downloading logo for {team.name}: {str(e)}"))
                except Exception as e:
                    self.stderr.write(self.style.ERROR(
                        f'Error processing team {team_data.get("Name", "Unknown")}: {str(e)}'
                    ))
        
        self.stdout.write(self.style.SUCCESS(
            f'Successfully processed {len(league_objects)} leagues, {teams_processed} teams, and {logos_processed} logos'
        ))
        