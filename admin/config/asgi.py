"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')

import chat.routing

django_application = get_asgi_application()

application = ProtocolTypeRouter({
  "http": django_application,
  "websocket": AuthMiddlewareStack(
    URLRouter(
      chat.routing.websocket_urlpatterns
    )
  )
})

