from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'rooms', views.ChatRoomViewSet, basename='chatroom')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/rooms/<uuid:room_id>/messages/', views.MessageViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='room-messages'),
    path('api/rooms/<uuid:room_id>/messages/mark-read/', views.MessageViewSet.as_view({
        'post': 'mark_read'
    }), name='mark-messages-read'),
    path('api/rooms/<uuid:room_id>/messages/unread/', views.MessageViewSet.as_view({
        'get': 'unread'
    }), name='unread-messages'),
    path('api/rooms/join-by-invitation/', views.ChatRoomViewSet.as_view({
        'post': 'join_by_invitation'
    }), name='join-by-invitation'),
]

