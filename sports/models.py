from django.db import models

from config.models import SSNamedModel


class Sport(SSNamedModel):
    pass


class League(SSNamedModel):
    sport = models.ForeignKey(Sport, on_delete=models.DO_NOTHING, related_name="leagues")


class Stadium(SSNamedModel):
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)


class Team(SSNamedModel):
    sport = models.ForeignKey(Sport, on_delete=models.DO_NOTHING)
    league = models.ForeignKey(League, on_delete=models.DO_NOTHING)
    stadium = models.ForeignKey(Stadium, on_delete=models.DO_NOTHING)