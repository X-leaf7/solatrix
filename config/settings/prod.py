from os import getenv

import requests

from .base import *

DEBUG = True

EC2_PRIVATE_IPS = []
METADATA_URI = getenv('ECS_CONTAINER_METADATA_URI_V4')

ADMINS = (
    ('Jacob', 'jacobef10@gmail.com'),
)
MANAGERS = (
    ('Jacob', 'jacobef10@gmail.com'),
)

try:
    resp = requests.get(METADATA_URI + '/task')
    data = resp.json()

    for container in data['Containers']:
        for network in container['Networks']:
            EC2_PRIVATE_IPS.extend(network['IPv4Addresses'])

except Exception as e:
    # silently fail as we may not be in an ECS environment
    print(e)
    pass

if EC2_PRIVATE_IPS:
    # Be sure your ALLOWED_HOSTS is a list NOT a tuple
    # or .append() will fail
    ALLOWED_HOSTS.extend(EC2_PRIVATE_IPS)

ALLOWED_HOSTS += ['.split-side.com', 'split-side.com']

CSRF_TRUSTED_ORIGINS = ['https://*.split-side.com']


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': getenv('DB_NAME'),
        'USER': getenv('DB_USERNAME'),
        'PASSWORD': getenv('DB_PASSWORD'),
        'HOST': getenv('DB_HOSTNAME')
    }
}

DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
STATICFILES_STORAGE = 'storages.backends.s3boto3.S3StaticStorage'
AWS_STORAGE_BUCKET_NAME = getenv('S3_BUCKET')
AWS_S3_CUSTOM_DOMAIN = DOMAIN

STATICFILES_DIRS = [
    BASE_DIR / "client/out/",
]

EMAIL_BACKEND = 'django_ses.SESBackend'
DEFAULT_FROM_EMAIL = 'accounts@split-side.com'
AWS_SES_REGION_NAME = getenv('AWS_REGION')