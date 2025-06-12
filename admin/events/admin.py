from django.contrib import admin

from events.models import Event, Attendee


class EventAdmin(admin.ModelAdmin):
    date_hierarchy = 'event_start_time'
    ordering = ['-event_start_time', '-lobby_start_time', 'name']
    readonly_fields = ['ivs_stage_arn']


class AttendeeAdmin(admin.ModelAdmin):
    ordering = ['-date_created']
    readonly_fields = ['ivs_participant_token']


admin.site.register(Event, EventAdmin)
admin.site.register(Attendee, AttendeeAdmin)
