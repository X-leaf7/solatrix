# Generated by Django 4.2.19 on 2025-06-07 02:14

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='League',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_updated', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=255, unique=True)),
                ('slug', models.SlugField(editable=False, max_length=100)),
                ('sports_data_id', models.IntegerField()),
                ('short_name', models.CharField(blank=True, default='', max_length=15)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Sport',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_updated', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=255, unique=True)),
                ('slug', models.SlugField(editable=False, max_length=100)),
                ('icon_name', models.CharField(max_length=100)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Stadium',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_updated', models.DateTimeField(auto_now=True)),
                ('sports_data_id', models.IntegerField()),
                ('name', models.CharField(max_length=255)),
                ('latitude', models.DecimalField(decimal_places=6, max_digits=9, null=True)),
                ('longitude', models.DecimalField(decimal_places=6, max_digits=9, null=True)),
                ('address', models.CharField(blank=True, max_length=255)),
                ('city', models.CharField(blank=True, max_length=100)),
                ('country', models.CharField(blank=True, max_length=100)),
                ('zip_code', models.CharField(blank=True, max_length=20)),
                ('sport', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='sports.sport')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_updated', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=255, unique=True)),
                ('slug', models.SlugField(editable=False, max_length=100)),
                ('sports_data_id', models.IntegerField()),
                ('colors', models.JSONField()),
                ('logo', models.ImageField(blank=True, upload_to='team_logos')),
                ('league', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sports.league')),
                ('sport', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sports.sport')),
                ('stadium', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='sports.stadium')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Season',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_updated', models.DateTimeField(auto_now=True)),
                ('sports_data_id', models.IntegerField()),
                ('name', models.CharField(max_length=100)),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
                ('sports_data_season', models.IntegerField()),
                ('league', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sports.league')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Round',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_updated', models.DateTimeField(auto_now=True)),
                ('sports_data_id', models.IntegerField()),
                ('name', models.CharField(max_length=100)),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
                ('season', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sports.season')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='league',
            name='sport',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='leagues', to='sports.sport'),
        ),
    ]
