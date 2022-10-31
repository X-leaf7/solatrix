from .base import *

ALLOWED_HOSTS += ['localhost', 'django']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'postgres',
        'PASSWORD': 'localpostgrespassword',
        'HOST': 'db'
    }
}

CONSTANCE_REDIS_CONNECTION = {
    'host': 'redis',
    'port': 6379,
    'db': 0,
}