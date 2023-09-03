from django.db import models

from config.models import SSBaseModel, SSNamedModel, SportsDataModel


class Sport(SSNamedModel):
    pass


class League(SSNamedModel, SportsDataModel):
    sport = models.ForeignKey(Sport, on_delete=models.DO_NOTHING, related_name="leagues")


class Season(SSBaseModel, SportsDataModel):
    league = models.ForeignKey(League, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    sports_data_season = models.IntegerField()

    def __str__(self):
        return f'{self.league} {self.name}'


class Round(SSBaseModel, SportsDataModel):
    season = models.ForeignKey(Season, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    def __str__(self):
        return f'{self.season} {self.name}'


class Stadium(SSBaseModel, SportsDataModel):
    name = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    zip_code = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f'{self.name} ({self.country})'


class Team(SSNamedModel, SportsDataModel):
    sport = models.ForeignKey(Sport, on_delete=models.DO_NOTHING)
    league = models.ForeignKey(League, on_delete=models.DO_NOTHING)
    stadium = models.ForeignKey(Stadium, on_delete=models.DO_NOTHING)
    colors = models.JSONField()
    logo = models.ImageField(upload_to="team_logos", blank=True)