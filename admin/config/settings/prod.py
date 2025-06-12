from os import getenv
from urllib.parse import urlparse

import requests
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

from .base import *

STAGE = 'prod'

EC2_PRIVATE_IPS = []
METADATA_URI = getenv('ECS_CONTAINER_METADATA_URI_V4')

ADMINS = (
    ('Jacob', 'jacobef10@gmail.com'),
)
MANAGERS = (
    ('Jacob', 'jacobef10@gmail.com'),
)


def filter_transactions(event, hint):
    url_string = event["request"]["url"]
    parsed_url = urlparse(url_string)

    if "/health" in parsed_url.path:
        return None

    return event


sentry_sdk.init(
    dsn="https://ef83eec5b9a492daad36e7d4ba89841f@o4505767321272320.ingest.sentry.io/4505836030001152",
    integrations=[DjangoIntegration()],
    # If you wish to associate users to errors (assuming you are using
    # django.contrib.auth) you may enable sending PII data.
    send_default_pii=True,
    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    # We recommend adjusting this value in production.
    traces_sample_rate=1.0,
    # Set profiles_sample_rate to 1.0 to profile 100%
    # of sampled transactions.
    # We recommend adjusting this value in production.
    profiles_sample_rate=1.0,
    # Filter out health checks or any other unwanted transactions
    before_send_transaction=filter_transactions,
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


CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://\w+\.split-side\.com$",
]