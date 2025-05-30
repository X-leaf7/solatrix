from celery import shared_task
from django.core.management import call_command

@shared_task
def run_load_soccer_leagues():
  call_command('load_soccer_leagues')
  