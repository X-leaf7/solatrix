# Start Redis (if not already running)
# redis-server &

# Start Celery worker
celery -A your_project worker -l INFO &

# Start Celery beat
celery -A your_project beat -l INFO --scheduler django_celery_beat.schedulers:DatabaseScheduler
