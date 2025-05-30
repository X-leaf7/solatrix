#!/bin/sh

python manage.py collectstatic --no-input

python manage.py migrate

python -m gunicorn -w 4 -b 0.0.0.0:8000 --reload config.wsgi
