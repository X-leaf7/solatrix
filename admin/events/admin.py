from django.contrib import admin

from events.models import Event, Attendee


class EventAdmin(admin.ModelAdmin):
    date_hierarchy = 'event_start_time'
    ordering = ['-event_start_time', '-lobby_start_time', 'name']


admin.site.register(Event, EventAdmin)
admin.site.register(Attendee)
