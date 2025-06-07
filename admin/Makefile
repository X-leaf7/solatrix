pip-install-base:
	pip3 install -r requirements/base.txt

pip-install-local:
	pip3 install -r requirements/local.txt

run-postgres:
	docker run --name postgres15 -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=secret -d postgres:15-alpine

start-postgres:
	docker start postgres15

stop-postgres:
	docker stop postgres15

remove-postgres:
	docker rm -f postgres15

createdb:
	docker exec -it postgres15 createdb --username=root --owner=root splite

dropdb:
	docker exec -it postgres15 dropdb splite

enterdb:
	docker exec -it postgres15 psql -U root -d splite

migrations:
	python3 manage.py makemigrations

migrate:
	python3 manage.py migrate

delete-migrations:
	find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
	find . -path "*/migrations/*.pyc" -delete

loadsoccerleague:
	python3 manage.py load_soccer_leagues 2025 MLS --verbose

loadsoccerevents:
	python3 manage.py load_soccer_events --verbose

run-redis:
	docker run -d --name redis7 -p 6379:6379 redis:7.4-alpine

run:
	python3 manage.py runserver 0.0.0.0:8000

run-celery-worker:
	DJANGO_SETTINGS_MODULE=config.settings.base celery -A config worker -l INFO

run-celery-beat:
	DJANGO_SETTINGS_MODULE=config.settings.base celery -A config beat -l INFO --scheduler django_celery_beat.schedulers:DatabaseScheduler
