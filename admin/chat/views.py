from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db import transaction
from django.db.models import Q, Prefetch
from django.shortcuts import get_object_or_404
import uuid

from .models import ChatRoom, ChatRoomMember, Message
from .serializers import (
    ChatRoomSerializer,
    ChatRoomMemberSerializer,
    MessageSerializer
)

class MessagePagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 100

class ChatRoomViewSet(viewsets.ModelViewSet):
    """
    API endpoint for chat rooms
    """
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = []
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
    def check_existing_membership(self, request):
        """
        Check if a user is already a member of the private chat room

        Expected request body:
        {
            "chat_room_id": "uuid-string",
        }
        """

        chat_room_id = request.data.get('chat_room_id')

        if not chat_room_id:
            return Response(
                {"valid": False, "message": "Chat room Id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            chat_room = get_object_or_404(ChatRoom, id=chat_room_id)

            existing_membership = ChatRoomMember.objects.filter(
                room=chat_room, 
                user=request.user
            ).first()

            if existing_membership:
                return Response({
                    "alreadyJoined": True,
                    "message": "You are already a member of this chat room",
                    "selectedTeam": existing_membership.supported_team,
                    "chatRoom": {
                        "id": str(chat_room.id),
                        "name": chat_room.name,
                        "isPrivate": chat_room.is_private
                    }
                })
            else:
                return Response({
                    "alreadyJoined": False,
                    "message": "You are not a member of this chat room yet",
                    "chatRoom": {
                        "id": str(chat_room.id),
                        "name": chat_room.name,
                        "isPrivate": chat_room.is_private
                    }
                })

        except Exception as e:
            return Response(
                {"valid": False, "message": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def join_public_room(self, request):
        """
        Join a public chat room.

        Expected request body:
        {
            "chat_room_id": "uuid-string",
            "supported_team": "home|away"
        }
        """

        chat_room_id = request.data.get('chat_room_id')
        supported_team = request.data.get('supported_team')
        if not chat_room_id or not supported_team:
            return Response(
                {"message": "Chat room ID and supported team is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            chat_room = get_object_or_404(ChatRoom, id=chat_room_id)

            if chat_room.is_private:
                return Response({
                    "message": "This chat room is private chat room, you need invitation code to join.",
                    "chatRoom": {
                        "id": str(chat_room.id),
                        "name": chat_room.name,
                    }
                })
            
            existing_membership = ChatRoomMember.objects.filter(
                room=chat_room, 
                user=request.user
            ).first()

            if existing_membership:
                return Response(
                    {"message": "Membership already exists for this chat room, can't create one."},
                    status=status.HTTP_403_FORBIDDEN
                )

            new_membership = ChatRoomMember.objects.create(
                room=chat_room,
                user=request.user,
                is_admin=False,
                supported_team=supported_team
            )

            return Response(
                {
                    "message": "Membership created successfully!",
                    "selectedTeam": new_membership.supported_team,
                },
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            return Response(
                {"valid": False, "message": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'])
    def join_private_room(self, request):
        """
        Join private room by invitation code.

        Expected request body:
        {
            "chat_room_id": "uuid-string",
            "invitation_code": "uuid-string",
            "supported_team": "home|away"
        }
        """

        chat_room_id = request.data.get('chat_room_id')
        invitation_code = request.data.get('invitation_code')
        supported_team = request.data.get('supported_team')

        if not chat_room_id or not invitation_code or not supported_team:
            return Response(
                {"message": "chat room id, invitation code, and supported team is required!"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Check if chat room exists
            chat_room = get_object_or_404(ChatRoom, id=chat_room_id)

            if chat_room.is_private:
                return Response(
                    {"valid": False, "message": "This is public chat room, this is not join method for public room"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if str(chat_room.invitation_code) != invitation_code:
                return Response(
                    {"valid": False, "message": "Invalid invitation code"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Check if user is already a member
            existing_membership = ChatRoomMember.objects.filter(
                room=chat_room, 
                user=request.user
            ).first()

            if existing_membership:
                return Response(
                    {"valid": False, "message": "You are already member of this room"}, 
                    status=status.HTTP_403_FORBIDDEN
                )

            if not chat_room.can_add_more_members():
                return Response(
                    {"valid": False, "message": "Chat room is full"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            new_membership = ChatRoomMember.objects.create(
                room=chat_room,
                user=request.user,
                is_admin=False,
                supported_team=supported_team
            )
            
            return Response(
                {
                    "message": "Successfully joined the chat room",
                    "selectedTeam": new_membership.supported_team,
                },
                status=status.HTTP_201_CREATED
            )
        
        except Exception as e:
            return Response(
                {"valid": False, "message": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'])
    def room_info(self, request, pk=None):
        """
        Get detailed information about a chat room including teams, score, event start time, and member count
        
        Returns:
        {
            "homeTeam": string,
            "awayTeam": string,
            "score": {
                "homeTeamScore": number,
                "awayTeamScore": number
            },
            "eventStartTime": string,
            "hostName": string,
            "roomMemberCount": number
        }
        """
        room = self.get_object()
        
        event = room.event
        
        host_name = ""
        if room.creator:
            if room.creator.first_name or room.creator.last_name:
                host_name = f"{room.creator.first_name} {room.creator.last_name}".strip()
            else:
                host_name = room.creator.username
        
        member_count = ChatRoomMember.objects.filter(room=room).count()
        
        data = {
            "homeTeam": event.home_team.name if event.home_team else "",
            "awayTeam": event.away_team.name if event.away_team else "",
            "score": {
                "homeTeamScore": event.home_team_score,
                "awayTeamScore": event.away_team_score
            },
            "eventStartTime": event.event_start_time.isoformat() if event.event_start_time else "",
            "hostName": host_name,
            "roomMemberCount": member_count
        }
        
        return Response(data)

class MessageViewSet(viewsets.ModelViewSet):
    """
    API endpoint for messages
    """
    serializer_class = MessageSerializer
    # TODO: add authentication
    permission_classes = []
    queryset = Message.objects.all()
    pagination_class = MessagePagination
    http_method_names = ['get', 'post', 'patch', 'delete']
    
    def get_queryset(self):
        """
        Return messages for a specific room
        """
        room_id = self.kwargs.get('room_id')
        
        if not room_id:
            return Message.objects.none()
        
        # Check if user is authenticated
        user = self.request.user
        if not user.is_authenticated:
            # For anonymous users, just return the messages without checking membership
            # You might want to restrict this based on your requirements
            return Message.objects.filter(room_id=room_id).order_by('-timestamp')
        
        # Check if user is a member of the room
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
        
        is_host = self.request.user == room.creator
        
        # Save message and update room's updated_at timestamp
        message = serializer.save(
            sender=self.request.user,
            room=room,
            is_host_message=is_host
        )
        room.save(update_fields=['updated_at'])
        
        return message

class HostMessageViewSet(viewsets.ModelViewSet):
    """
    API endpoint for host messages
    """
