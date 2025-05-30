from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatRoomViewSet, MessageViewSet

router = DefaultRouter()
router.register(r'chatroom', ChatRoomViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('chatroom/<uuid:room_id>/messages/', MessageViewSet.as_view({
        'get': 'list',
        'post': 'create'
    })),
]
