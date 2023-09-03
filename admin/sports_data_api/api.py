from requests import Session


session = Session()
session.headers.update({'Ocp-Apim-Subscription-Key': '39f59b39d7404415aad0b9c1ef3dd736'})


def get_leagues(league_keys):

    all_leagues = session.get("https://api.sportsdata.io/v4/soccer/scores/json/Competitions").json()

    filtered_leagues = []
    for league in all_leagues:
        if league['Key'] in league_keys:
            filtered_leagues.append(league)

    return filtered_leagues


def get_teams(league_id):

    teams = session.get(f'https://api.sportsdata.io/v4/soccer/scores/json/Teams/{league_id}').json()

    return teams


def get_schedule(league_id, season):

    schedule = session.get(f'https://api.sportsdata.io/v4/soccer/scores/json/SchedulesBasic/{league_id}/{season}').json()

    return schedule


def get_venues():
    
    venues = session.get('https://api.sportsdata.io/v4/soccer/scores/json/Venues').json()

    return venues