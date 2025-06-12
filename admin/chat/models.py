from django.db import models
from django.db.models import Q, UniqueConstraint
from django.utils.translation import gettext_lazy as _
from users.models import User
from events.models import Event
import uuid

class ChatRoom(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(_('Room Name'), max_length=255)
    description = models.TextField(_('Description'), blank=True, null=True)
    is_private = models.BooleanField(_('Private Room'), default=True)
    invitation_code = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    max_members = models.PositiveIntegerField(_('Maximum Members'), default=24)
    creator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_rooms',
        null=True,
        blank=True
    )
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        # TODO: update the related name
        related_name='created_rooms_event'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['-updated_at']

    def get_invitation_link(self, request=None):
        """Generate an invitation link for this room"""
        if request:
            base_url = f"{request.scheme}://{request.get_host()}"
            return f"{base_url}/chat/join/{self.invitation_code}"
        return f"/chat/join/{self.invitation_code}"
    
    def can_add_more_members(self):
        """Check if the room has reached its member limit"""
        return self.members.count() < self.max_members

class ChatRoomMember(models.Model):
    TEAM_CHOICES = (
        ('home', 'Home Team'),
        ('away', 'Away Team'),
        ('neutral', 'Neutral'),
    )
    room = models.ForeignKey(
        ChatRoom,
        on_delete=models.CASCADE,
        related_name='members'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='chat_rooms'
    )
    joined_at = models.DateTimeField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)

    supported_team = models.CharField(
        _('Supported Team'),
        max_length=10,
        choices=TEAM_CHOICES,
        default='neutral',
        help_text=_('The team this user is supporting or betting on')
    )
    
    class Meta:
        constraints = [
            UniqueConstraint(fields=['room', 'user'], name='unique_room_member')
        ]
    
    def __str__(self):
        team_support = ""
        if self.supported_team == 'home':
            team_support = f" (Supporting: {self.room.event.home_team.name})"
        elif self.supported_team == 'away':
            team_support = f" (Supporting: {self.room.event.away_team.name})"
        
        return f"{self.user.username} in {self.room.name}{team_support}"
    
    def get_supported_team_object(self):
        """Returns the actual Team object that the user is supporting"""
        if self.supported_team == 'home':
            return self.room.event.home_team
        elif self.supported_team == 'away':
            return self.room.event.away_team
        return None

class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room = models.ForeignKey(
        ChatRoom,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sent_messages'
    )
    is_host_message = models.BooleanField(null=False, blank=False)
    content = models.TextField(_('Message Content'))
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['timestamp']
    
    def __str__(self):
        return f"{self.sender.username}: {self.content[:20]}"

class HostMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room = models.ForeignKey(
        ChatRoom,
        on_delete=models.CASCADE,
        related_name='host_message'
    )
    content = models.TextField(_('Host Message Content'))
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.content[:20]}"
