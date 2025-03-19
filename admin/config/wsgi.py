"""
WSGI config for config project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
from django.test.client import RequestFactory

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')

application = get_wsgi_application()

# Calling the application once to force loading before a request comes in
test_env = RequestFactory()._base_environ(
    PATH_INFO="/health/",
    CONTENT_TYPE="text/html; charset=utf-8",
    REQUEST_METHOD="GET",
    HTTP_HOST="localhost"
)
application(test_env, lambda x, y: None)