from celery import shared_task, chain
from sports.tasks import run_load_soccer_leagues
from events.tasks import run_load_soccer_events

@shared_task
def run_soccer_data_update():
    """
    Task to run both soccer data update commands in sequence.
    First loads leagues, then loads events.
    """
    # Using chain to ensure tasks run in sequence
    result = chain(
        run_load_soccer_leagues.s(),
        run_load_soccer_events.s()
    )()
    return result
