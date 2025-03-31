import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from config import settings
from .models import ChatRoom, Message, ChatRoomMember
from django.utils import timezone
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
        
        # For public rooms, auto-join if not a member
        if not is_private and not is_member:
            # Check if room has reached max members
            can_add_more = await self.can_add_more_members(self.room_id)
            if can_add_more:
                await self.add_to_room(self.user.id, self.room_id)
            else:
                await self.close()
                return
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send user joined message to group
        # await self.channel_layer.group_send(
        #     self.room_group_name,
        #     {
        #         'type': 'user_join',
        #         'user_id': str(self.user.id),
        #         'username': self.user.username,
        #         'timestamp': timezone.now().isoformat(),
        #     }
        # )
    
    async def disconnect(self, close_code):
        # Leave room group
        if hasattr(self, 'room_group_name') and hasattr(self, 'user'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
            
            # Send user left message
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_leave',
                    'user_id': str(self.user.id),
                    'username': self.user.username,
                    'timestamp': timezone.now().isoformat(),
                }
            )
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type', 'send_message')
        
        if message_type == 'send_message':
            message = data.get('message', '')
            
            if not message.strip():
                return
            
            # Save message to database
            message_obj = await self.save_message(
                self.user.id,
                self.room_id,
                message
            )

            # Get the profile image URL
            profile_image_url = await self.get_profile_image_url(self.user)
            
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'sender_id': str(self.user.id),
                    'username': self.user.username,
                    'timestamp': message_obj.timestamp.isoformat(),
                    'message_id': str(message_obj.id),
                    'profile_image_url': profile_image_url
                }
            )
    
    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'message_received',
            'message': event['message'],
            'sender_id': event['sender_id'],
            'username': event['username'],
            'timestamp': event['timestamp'],
            'message_id': event['message_id'],
            'profile_image_url': event['profile_image_url']
        }))
    
    async def user_join(self, event):
        # Send user joined notification to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'user_join',
            'user_id': event['user_id'],
            'username': event['username'],
            'timestamp': event['timestamp'],
        }))
    
    async def user_leave(self, event):
        # Send user left notification to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'user_leave',
            'user_id': event['user_id'],
            'username': event['username'],
            'timestamp': event['timestamp'],
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
    
    # @database_sync_to_async
    # def add_to_room(self, user_id, room_id):
    #     room = ChatRoom.objects.get(id=room_id)
    #     user = User.objects.get(id=user_id)
        
    #     ChatRoomMember.objects.create(
    #         room=room,
    #         user=user,
    #         is_admin=False
    #     )
    
    @database_sync_to_async
    def save_message(self, user_id, room_id, content):
        room = ChatRoom.objects.get(id=room_id)
        user = User.objects.get(id=user_id)
        
        message = Message.objects.create(
            room=room,
            sender=user,
            content=content
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
            # Check if MEDIA_URL is already an absolute URL
            if settings.MEDIA_URL.startswith(('http://', 'https://')):
                return user.profile_image.url
            else:
                # Construct absolute URL using your site's domain
                domain = settings.SITE_URL  # You need to define this in settings
                return f"{domain}{user.profile_image.url}"
        return ""

