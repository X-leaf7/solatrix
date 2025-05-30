"""config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.staticfiles import views
from django.urls import include, path, re_path

from rest_framework import routers
from rest_framework import permissions
from rest_framework.documentation import include_docs_urls

from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from config.admin import AuthAdminForm
from events.views import (
    EventViewSet,
    AttendeeViewSet,
    CopyEventView,
    EventDetailByIdView
)
from sports.views import (
    LeagueViewSet,
    SportViewSet,
    StadiumViewSet,
    TeamViewSet
)
from users.views import (
    UserViewSet,
    GoogleLoginView,
    OTPLoginView,
    OTPStartView
)
from chat.views import (
    ChatRoomViewSet,
    MessageViewSet
)

admin.autodiscover()
admin.site.login_form = AuthAdminForm
admin.site.login_template = 'admin/login.html'

schema_view = get_schema_view(
    openapi.Info(
        title="My API",
        default_version='v1',
        description="API documentation for my project",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

router = routers.DefaultRouter()
router.register(r'attendees', AttendeeViewSet)
router.register(r'events', EventViewSet, basename='events')
router.register(r'leagues', LeagueViewSet)
router.register(r'teams', TeamViewSet)
router.register(r'stadiums', StadiumViewSet)
router.register(r'sports', SportViewSet)
router.register(r'profiles', UserViewSet)
router.register(r'chatroom', ChatRoomViewSet)
# router.register(r'messages', MessageViewSet)

urlpatterns = [
    path('health/', include('health_check.urls')),
    path('admin/', admin.site.urls),
    path('api/events/<uuid:pk>/', EventDetailByIdView.as_view()),
    path('api/', include(router.urls)),
    path('api/', include('chat.urls')),
    path('api/copy-event/', CopyEventView.as_view()),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.authtoken')),
    path('api/google_login/',view=GoogleLoginView.as_view(), name='google-login'),
    path('api/otp_start/',view=OTPStartView.as_view(), name='otp-start'),
    path('api/otp_login/',view=OTPLoginView.as_view(), name='otp-login'),
    re_path(r'^cms/', include('cms.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

if settings.DEBUG:
    urlpatterns += [
        re_path(r'^static/(?P<path>.*)$', views.serve),
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
