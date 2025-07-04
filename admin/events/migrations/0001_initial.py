# Generated by Django 4.2.19 on 2025-06-07 02:14

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('sports', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Attendee',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_updated', models.DateTimeField(auto_now=True)),
                ('ivs_participant_token', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_updated', models.DateTimeField(auto_now=True)),
                ('slug', models.SlugField(editable=False, max_length=100)),
                ('name', models.CharField(blank=True, max_length=255)),
                ('home_team_score', models.IntegerField(default=0)),
                ('away_team_score', models.IntegerField(default=0)),
                ('is_private', models.BooleanField()),
                ('lobby_start_time', models.DateTimeField()),
                ('event_start_time', models.DateTimeField()),
                ('status', models.CharField(blank=True, max_length=100)),
                ('banner', models.ImageField(blank=True, upload_to='banners')),
                ('ivs_stage_arn', models.CharField(blank=True, max_length=255)),
                ('away_team', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='away_events', to='sports.team')),
                ('home_team', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='home_events', to='sports.team')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
