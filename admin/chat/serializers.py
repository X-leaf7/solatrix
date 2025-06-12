from rest_framework import serializers
from .models import ChatRoom, ChatRoomMember, Message
from users.models import User

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class ChatRoomSerializer(serializers.ModelSerializer):
    creator_details = CustomUserSerializer(source='creator', read_only=True)
    member_count = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    is_private = serializers.BooleanField(read_only=False, default=False)
    max_members = serializers.IntegerField(min_value=2, max_value=100, default=10)
    current_member_count = serializers.SerializerMethodField()
    event_id = serializers.UUIDField(write_only=True)
    ivs_playback_url = serializers.CharField(read_only=True)
    
    class Meta:
        model = ChatRoom
        fields = [
            'id', 'name', 'description', 'creator', 'creator_details',
            'created_at', 'updated_at', 'member_count', 'is_member', 'event_id', 'ivs_playback_url',
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

    def create(self, validated_data):
        # Extract event_id from validated_data
        event_id = validated_data.pop('event_id', None)
        
        # Get the Event object using the event_id
        if event_id:
            try:
                from events.models import Event
                event = Event.objects.get(id=event_id)
                # Add the event to validated_data
                validated_data['event'] = event
            except Event.DoesNotExist:
                raise serializers.ValidationError({"event_id": "Event not found"})
        else:
            raise serializers.ValidationError({"event_id": "This field is required"})
        
        # Create the ChatRoom with the event
        return super().create(validated_data)

class ChatRoomMemberSerializer(serializers.ModelSerializer):
    user_details = CustomUserSerializer(source='user', read_only=True)
    
    class Meta:
        model = ChatRoomMember
        fields = ['id', 'room', 'user', 'user_details', 'joined_at', 'is_admin']
        read_only_fields = ['joined_at']


class MessageSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source='sender.first_name', read_only=True)
    lastName = serializers.CharField(source='sender.last_name', read_only=True)
    isHostMessage = serializers.BooleanField(source='is_host_message', read_only=True)
    profileImage = serializers.SerializerMethodField()
    isCurrentUser = serializers.SerializerMethodField()
    selectedTeam = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = [
            'id',
            'room',
            'sender',
            'content',
            'firstName',
            'lastName',
            'isHostMessage',
            'profileImage',
            'isCurrentUser',
            'selectedTeam',
            'timestamp'
        ]
        read_only_fields = ['sender', 'timestamp', 'isHostMessage']
    
    def get_profileImage(self, obj):
        # Return the profile image URL if available, otherwise return a default
        if hasattr(obj.sender, 'profile_image') and obj.sender.profile_image:
            return obj.sender.profile_image.url
        return ''
    
    def get_isCurrentUser(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            return obj.sender == request.user
        return False
    
    def get_selectedTeam(self, obj):
        # Get the member's supported team for this chat room
        try:
            member = ChatRoomMember.objects.get(room=obj.room, user=obj.sender)
            return member.supported_team
        except ChatRoomMember.DoesNotExist:
            return 'neutral'
        