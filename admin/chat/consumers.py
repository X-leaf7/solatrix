import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from config import settings
from .models import (
    ChatRoom,
    Message,
    ChatRoomMember
)
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'

        query_string = self.scope['query_string'].decode()
    
        if query_string:
            try:
                query_params = dict(param.split('=') for param in query_string.split('&') if '=' in param)
                user_id = query_params.get('user_id')
                print(f"User ID from query params: {user_id}")
            except Exception as e:
                print(f"Error parsing query string: {e}")
                user_id = None
        else:
            user_id = None

        if user_id:
            self.user = await self.get_user(user_id)
        else:
            self.user = None
        
        room_exists = await self.room_exists(self.room_id)
        if not room_exists:
            await self.close()
            return
        
        # Check if user is a member of the room
        is_member = await self.is_room_member(self.user.id, self.room_id)
        
        # Check if room is private
        is_private = await self.is_room_private(self.room_id)
        
        # For private rooms, only allow members to connect
        if is_private and not is_member:
            await self.close()
            return
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        # Leave room group
        if hasattr(self, 'room_group_name') and hasattr(self, 'user'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type', 'send_message')

        profile_image_url = await self.get_profile_image_url(self.user)
        
        if message_type == 'send_message':
            message = data.get('message', '')
            
            if not message.strip():
                return

            is_room_creator = await self.is_room_creator(self.user.id, self.room_id)

            selected_team = await self.get_user_selected_team(self.user.id, self.room_id)

            print(f"user selected team {selected_team}")
            
            # Save message to database
            message_obj = await self.save_message(
                self.user.id,
                self.room_id,
                message,
                is_room_creator
            )
            
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'is_host_message': message_obj.is_host_message,
                    'sender_id': str(self.user.id),
                    'first_name': str(self.user.first_name),
                    'last_name': str(self.user.last_name),
                    'username': self.user.username,
                    'timestamp': message_obj.timestamp.isoformat(),
                    'message_id': str(message_obj.id),
                    'profile_image_url': profile_image_url,
                    'selected_team': selected_team
                }
            )
    
    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'message_received',
            'message': event['message'],
            'is_host_message': event['is_host_message'],
            'sender_id': event['sender_id'],
            'first_name': event['first_name'],
            'last_name': event['last_name'],
            'username': event['username'],
            'timestamp': event['timestamp'],
            'message_id': event['message_id'],
            'profile_image_url': event['profile_image_url'],
            'selected_team': event['selected_team']
        }))
    
    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None
    
    @database_sync_to_async
    def room_exists(self, room_id):
        try:
            return ChatRoom.objects.filter(id=room_id).exists()
        except Exception:
            return False
    
    @database_sync_to_async
    def is_room_member(self, user_id, room_id):
        return ChatRoomMember.objects.filter(
            user_id=user_id,
            room_id=room_id
        ).exists()
    
    @database_sync_to_async
    def is_room_creator(self, user_id, room_id):
        print(f'is room creator {user_id} {room_id}')
        try:
            room = ChatRoom.objects.get(id=room_id)
            print(f'room retrieved: {room} {room.creator_id}')
            return str(room.creator_id) == str(user_id)
        except ChatRoom.DoesNotExist:
            return False
    
    @database_sync_to_async
    def get_user_selected_team(self, user_id, room_id):
        """Get the user's selected team for this chat room"""
        try:
            membership = ChatRoomMember.objects.get(
                user_id=user_id,
                room_id=room_id
            )
            print(f"membership check: {membership}")
            print(f"membership supported team: {membership.supported_team}")
            return membership.supported_team
        except ChatRoomMember.DoesNotExist:
            return 'neutral'
    
    @database_sync_to_async
    def save_message(self, user_id, room_id, content, is_room_creator):
        room = ChatRoom.objects.get(id=room_id)
        user = User.objects.get(id=user_id)
        
        message = Message.objects.create(
            room=room,
            sender=user,
            content=content,
            is_host_message=is_room_creator
        )
        
        # Update room's updated_at timestamp
        room.save(update_fields=['updated_at'])
        
        return message

    @database_sync_to_async
    def is_room_private(self, room_id):
        try:
            room = ChatRoom.objects.get(id=room_id)
            return room.is_private
        except ChatRoom.DoesNotExist:
            return True  # Default to private if room doesn't exist
    
    @database_sync_to_async
    def can_add_more_members(self, room_id):
        try:
            room = ChatRoom.objects.get(id=room_id)
            return room.can_add_more_members()
        except ChatRoom.DoesNotExist:
            return False
        
    @database_sync_to_async
    def get_profile_image_url(self, user):
        if user.profile_image and user.profile_image.name:
            # Check if MEDIA_URL exists in settings
            media_url = getattr(settings, 'MEDIA_URL', '/media/')
            
            # Check if it's an absolute URL
            if media_url.startswith(('http://', 'https://')):
                return user.profile_image.url
            else:
                # Get domain from settings or use a default
                domain = getattr(settings, 'SITE_URL', '') or getattr(settings, 'DOMAIN', '')
                
                # If we have a domain, construct absolute URL
                if domain:
                    if not domain.startswith(('http://', 'https://')):
                        domain = f"https://{domain}"
                    return f"{domain}{user.profile_image.url}"
                else:
                    # Fall back to relative URL if no domain is available
                    return user.profile_image.url
        return ""

