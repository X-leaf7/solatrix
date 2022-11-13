from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify

from config.models import SSBaseModel, SSNamedModel

from sports.models import Sport, Stadium, Team


class Event(SSNamedModel):
    sport = models.ForeignKey(Sport, on_delete=models.DO_NOTHING)
    stadium = models.ForeignKey(Stadium, on_delete=models.DO_NOTHING)
    home_team = models.ForeignKey(Team, on_delete=models.DO_NOTHING, related_name="home_events")
    away_team = models.ForeignKey(Team, on_delete=models.DO_NOTHING, related_name="away_events")
    host = models.ForeignKey(get_user_model(), on_delete=models.DO_NOTHING, related_name="hosted_events")
    is_private = models.BooleanField()
    lobby_start_time = models.DateTimeField()
    event_start_time = models.DateTimeField()

    def create_slug(self):

        return slugify(
            "-".join([
                self.home_team.name,
                "vs",
                self.away_team.name,
                str(self.event_start_time.year),
                str(self.event_start_time.month),
                str(self.event_start_time.day)
            ])
        )


class Attendee(SSBaseModel):
    user = models.ForeignKey(get_user_model(), on_delete=models.DO_NOTHING, related_name="attendance")
    event = models.ForeignKey(Event, on_delete=models.DO_NOTHING, related_name="attendees")
    chosen_team = models.ForeignKey(Team, on_delete=models.DO_NOTHING, related_name="fans")

    def __str__(self):
        return f'{self.user.username} at {self.event.name} for {self.chosen_team.name}'