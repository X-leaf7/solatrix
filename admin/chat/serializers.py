from rest_framework import serializers
from .models import ChatRoom, ChatRoomMember, Message
from users.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class ChatRoomSerializer(serializers.ModelSerializer):
    creator_details = UserSerializer(source='creator', read_only=True)
    member_count = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    is_private = serializers.BooleanField(read_only=False, default=False)
    max_members = serializers.IntegerField(min_value=2, max_value=100, default=10)
    current_member_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatRoom
        fields = [
            'id', 'name', 'description', 'creator', 'creator_details',
            'created_at', 'updated_at', 'member_count', 'is_member',
            'last_message', 'is_private', 'max_members', 'invitation_code', 'current_member_count'
        ]
        read_only_fields = ['creator', 'created_at', 'updated_at', 'current_member_count']
    
    def get_member_count(self, obj):
        return obj.members.count()
    
    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            return obj.members.filter(user=request.user).exists()
        return False
    
    def get_last_message(self, obj):
        last_message = obj.messages.order_by('-timestamp').first()
        if last_message:
            return {
                'id': str(last_message.id),
                'content': last_message.content[:50],
                'sender': last_message.sender.username,
                'timestamp': last_message.timestamp.isoformat()
            }
        return None
    
    def get_current_member_count(self, obj):
        return obj.members.count()

class ChatRoomMemberSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = ChatRoomMember
        fields = ['id', 'room', 'user', 'user_details', 'joined_at', 'is_admin']
        read_only_fields = ['joined_at']

class MessageSerializer(serializers.ModelSerializer):
    sender_details = UserSerializer(source='sender', read_only=True)
    
    class Meta:
        model = Message
        fields = [
            'id',
            'room',
            'sender',
            'sender_details',
            'content',
            'timestamp'
        ]
        read_only_fields = ['sender', 'timestamp']

