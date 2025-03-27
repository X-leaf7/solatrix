from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db import transaction
from django.db.models import Q, Count, Max, Prefetch
from django.shortcuts import get_object_or_404
import uuid

from .models import ChatRoom, ChatRoomMember, Message
from .serializers import ChatRoomSerializer, ChatRoomMemberSerializer, MessageSerializer

class MessagePagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 100

class ChatRoomViewSet(viewsets.ModelViewSet):
    """
    API endpoint for chat rooms
    """
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'updated_at', 'name']
    ordering = ['-updated_at']
    
    def get_queryset(self):
        """
        Return rooms the user is a member of by default
        """
        user = self.request.user
        queryset = ChatRoom.objects.all()
        
        # Filter by room type if specified
        room_type = self.request.query_params.get('type')
        if room_type == 'created':
            queryset = queryset.filter(creator=user)
        
        # Prefetch last message for each room
        queryset = queryset.prefetch_related(
            Prefetch(
                'messages',
                queryset=Message.objects.order_by('-timestamp')[:1],
                to_attr='last_messages'
            )
        )
        
        return queryset
    
    def perform_create(self, serializer):
        """
        Create a new chat room and add the creator as a member and admin
        """
        with transaction.atomic():
            room = serializer.save(creator=self.request.user)
            ChatRoomMember.objects.create(
                room=room,
                user=self.request.user,
                is_admin=True
            )
    
    @action(detail=False, methods=['get'])
    def all(self, request):
        """
        List all available rooms (not just the ones the user is a member of)
        """
        queryset = ChatRoom.objects.all()
        
        # Apply filters
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        
        # Apply pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        """
        Join a chat room
        """
        room = self.get_object()
        user = request.user
        
        # Check if user is already a member
        if ChatRoomMember.objects.filter(room=room, user=user).exists():
            return Response(
                {"detail": "You are already a member of this room"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Add user to room
        ChatRoomMember.objects.create(
            room=room,
            user=user,
            is_admin=False
        )
        
        return Response({"detail": "Successfully joined the room"})
    
    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        """
        Leave a chat room
        """
        room = self.get_object()
        user = request.user
        
        # Check if user is a member
        membership = ChatRoomMember.objects.filter(room=room, user=user).first()
        if not membership:
            return Response(
                {"detail": "You are not a member of this room"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # If user is the creator and the only admin, don't allow leaving
        if user == room.creator and ChatRoomMember.objects.filter(room=room, is_admin=True).count() == 1:
            return Response(
                {"detail": "You are the only admin. Make someone else an admin first."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Remove user from room
        membership.delete()
        
        return Response({"detail": "Successfully left the room"})
    
    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        """
        List members of a chat room
        """
        room = self.get_object()
        
        # Check if user is a member
        if not ChatRoomMember.objects.filter(room=room, user=request.user).exists():
            return Response(
                {"detail": "You don't have access to this room"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        members = ChatRoomMember.objects.filter(room=room)
        serializer = ChatRoomMemberSerializer(members, many=True)
        
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        """
        Add a user to a chat room (admin only)
        """
        room = self.get_object()
        user_id = request.data.get('user_id')
        
        # Check if the current user is an admin
        if not ChatRoomMember.objects.filter(room=room, user=request.user, is_admin=True).exists():
            return Response(
                {"detail": "You don't have permission to add members"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if not user_id:
            return Response(
                {"detail": "User ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if the user exists
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if the user is already a member
        if ChatRoomMember.objects.filter(room=room, user=user).exists():
            return Response(
                {"detail": "User is already a member of this room"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Add user to room
        ChatRoomMember.objects.create(
            room=room,
            user=user,
            is_admin=False
        )
        
        return Response({"detail": "User added to the room"})
    
    @action(detail=True, methods=['post'])
    def remove_member(self, request, pk=None):
        """
        Remove a user from a chat room (admin only)
        """
        room = self.get_object()
        user_id = request.data.get('user_id')
        
        # Check if the current user is an admin
        if not ChatRoomMember.objects.filter(room=room, user=request.user, is_admin=True).exists():
            return Response(
                {"detail": "You don't have permission to remove members"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if not user_id:
            return Response(
                {"detail": "User ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if the user is a member
        membership = ChatRoomMember.objects.filter(room=room, user_id=user_id).first()
        if not membership:
            return Response(
                {"detail": "User is not a member of this room"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Don't allow removing the creator if they're the only admin
        if membership.user == room.creator and ChatRoomMember.objects.filter(room=room, is_admin=True).count() == 1:
            return Response(
                {"detail": "Cannot remove the only admin from the room"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Remove user from room
        membership.delete()
        
        return Response({"detail": "User removed from the room"})
    
    @action(detail=True, methods=['post'])
    def make_admin(self, request, pk=None):
        """
        Make a user an admin of a chat room (admin only)
        """
        room = self.get_object()
        user_id = request.data.get('user_id')
        
        # Check if the current user is an admin
        if not ChatRoomMember.objects.filter(room=room, user=request.user, is_admin=True).exists():
            return Response(
                {"detail": "You don't have permission to manage admins"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if not user_id:
            return Response(
                {"detail": "User ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if the user is a member
        membership = ChatRoomMember.objects.filter(room=room, user_id=user_id).first()
        if not membership:
            return Response(
                {"detail": "User is not a member of this room"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Make user an admin
        membership.is_admin = True
        membership.save()
        
        return Response({"detail": "User is now an admin"})

    @action(detail=True, methods=['get'])
    def invitation_link(self, request, pk=None):
        """
        Get or regenerate invitation link for a private room
        """
        room = self.get_object()
        
        # Check if user is the creator or an admin
        is_admin = ChatRoomMember.objects.filter(
            room=room, 
            user=request.user, 
            is_admin=True
        ).exists()
        
        if not is_admin:
            return Response(
                {"detail": "Only room admins can manage invitation links"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if room is private
        if not room.is_private:
            return Response(
                {"detail": "Invitation links are only available for private rooms"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Regenerate invitation code if requested
        regenerate = request.query_params.get('regenerate', 'false').lower() == 'true'
        if regenerate:
            room.invitation_code = uuid.uuid4()
            room.save(update_fields=['invitation_code'])
        
        invitation_link = room.get_invitation_link(request)
        
        return Response({
            "invitation_link": invitation_link,
            "invitation_code": room.invitation_code
        })
    
    @action(detail=False, methods=['post'])
    def join_by_invitation(self, request):
        """
        Join a room using an invitation code
        """
        invitation_code = request.data.get('invitation_code')
        
        if not invitation_code:
            return Response(
                {"detail": "Invitation code is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Find the room with this invitation code
            room = ChatRoom.objects.get(invitation_code=invitation_code, is_private=True)
        except ChatRoom.DoesNotExist:
            return Response(
                {"detail": "Invalid invitation code"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if user is already a member
        if ChatRoomMember.objects.filter(room=room, user=request.user).exists():
            return Response(
                {"detail": "You are already a member of this room"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if room has reached its member limit
        if not room.can_add_more_members():
            return Response(
                {"detail": f"This room has reached its maximum capacity of {room.max_members} members"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Add user to room
        ChatRoomMember.objects.create(
            room=room,
            user=request.user,
            is_admin=False
        )
        
        serializer = self.get_serializer(room)
        return Response(serializer.data)

class MessageViewSet(viewsets.ModelViewSet):
    """
    API endpoint for messages
    """
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = MessagePagination
    http_method_names = ['get', 'post', 'patch', 'delete']
    
    def get_queryset(self):
        """
        Return messages for a specific room
        """
        room_id = self.kwargs.get('room_id')
        
        if not room_id:
            return Message.objects.none()
        
        # Check if user is a member of the room
        user = self.request.user
        is_member = ChatRoomMember.objects.filter(
            room_id=room_id,
            user=user
        ).exists()
        
        if not is_member:
            return Message.objects.none()
        
        return Message.objects.filter(room_id=room_id).order_by('-timestamp')
    
    def perform_create(self, serializer):
        """
        Create a new message
        """
        room_id = self.kwargs.get('room_id')
        room = get_object_or_404(ChatRoom, id=room_id)
        
        # Check if user is a member of the room
        is_member = ChatRoomMember.objects.filter(
            room=room,
            user=self.request.user
        ).exists()
        
        if not is_member:
            raise permissions.PermissionDenied("You are not a member of this room")
        
        # Save message and update room's updated_at timestamp
        message = serializer.save(sender=self.request.user, room=room)
        room.save(update_fields=['updated_at'])
        
        return message
    
    @action(detail=False, methods=['post'])
    def mark_read(self, request, room_id=None):
        """
        Mark messages as read
        """
        message_ids = request.data.get('message_ids', [])
        
        if not message_ids:
            return Response(
                {"detail": "No message IDs provided"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user is a member of the room
        is_member = ChatRoomMember.objects.filter(
            room_id=room_id,
            user=request.user
        ).exists()
        
        if not is_member:
            return Response(
                {"detail": "You don't have access to this room"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Mark messages as read (only if user is not the sender)
        updated = Message.objects.filter(
            id__in=message_ids,
            room_id=room_id
        ).exclude(
            sender=request.user
        )
        
        return Response({"detail": f"Marked {updated} messages as read"})
    
    @action(detail=False, methods=['get'])
    def unread(self, request, room_id=None):
        """
        Get unread messages for a room
        """
        # Check if user is a member of the room
        is_member = ChatRoomMember.objects.filter(
            room_id=room_id,
            user=request.user
        ).exists()
        
        if not is_member:
            return Response(
                {"detail": "You don't have access to this room"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get unread messages
        unread_messages = Message.objects.filter(
            room_id=room_id
        ).exclude(
            sender=request.user
        ).order_by('-timestamp')
        
        page = self.paginate_queryset(unread_messages)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(unread_messages, many=True)
        return Response(serializer.data)

