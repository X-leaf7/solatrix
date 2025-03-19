from requests import Session


session = Session()
session.headers.update({'Ocp-Apim-Subscription-Key': '6bdae5d55e854863a484e3784a60d4f5'})


def get_teams():

    teams = session.get(f'https://api.sportsdata.io/v3/nfl/scores/json/Teams').json()

    return teams


def get_schedule(season):

    schedule = session.get(f'https://api.sportsdata.io/v3/nfl/scores/json/Schedules/{season}').json()

    return schedule


def get_stadiums():
    
    venues = session.get('https://api.sportsdata.io/v3/nfl/scores/json/Stadiums').json()

    return venues