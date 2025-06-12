import uuid

from django.contrib.auth import get_user_model
from django.db import models
from django.utils.text import slugify

from config.models import SSBaseModel, SSNamedModel

from sports.models import Round, Stadium, Team


class Event(SSNamedModel):
    name = models.CharField(max_length=255, blank=True)
    round = models.ForeignKey(Round, on_delete=models.CASCADE, null=True)
    stadium = models.ForeignKey(Stadium, on_delete=models.DO_NOTHING, null=True)
    home_team = models.ForeignKey(Team, on_delete=models.DO_NOTHING, null=True, related_name="home_events")
    home_team_score = models.IntegerField(default=0)
    away_team = models.ForeignKey(Team, on_delete=models.DO_NOTHING, null=True, related_name="away_events")
    away_team_score = models.IntegerField(default=0)
    is_private = models.BooleanField()
    lobby_start_time = models.DateTimeField()
    event_start_time = models.DateTimeField()
    status = models.CharField(max_length=100, blank=True)
    banner = models.ImageField(upload_to="banners", blank=True)
    ivs_stage_arn = models.CharField(max_length=255, blank=True)
    host = models.ForeignKey(
        get_user_model(),
        on_delete=models.DO_NOTHING,
        related_name="hosted_events",
        blank=True, null=True
    )

    def __str__(self):

        if self.is_private:
            return "-".join([self.host.username, self.slug])

        return self.slug

    def create_slug(self):
        date_string = self.event_start_time.strftime("%Y-%m-%d")

        if self.is_private:
            if not self.id:
                self.id = uuid.uuid4()
            return slugify(f'{self.host.id}-{self.id}')
        else:
            return slugify(
                "-".join([
                    self.host.username if self.host else "public",
                    self.home_team.name,
                    "vs",
                    self.away_team.name,
                    date_string
                ])
            )


class Attendee(SSBaseModel):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="attendance")
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="attendees")
    chosen_team = models.ForeignKey(Team, on_delete=models.DO_NOTHING, null=True, related_name="fans")
    ivs_participant_token = models.TextField(blank=True)

    def __str__(self):
        return f'{self.user.username} at {self.event.name} for {self.chosen_team.name}'

    class Meta:
        unique_together = (('user','event'),)