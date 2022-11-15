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

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'