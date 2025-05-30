from celery import shared_task
from django.core.management import call_command


@shared_task
def run_load_soccer_events():
    """Task to run the load_soccer_events management command."""
    call_command('load_soccer_events')
    return "Soccer events loaded successfully"
