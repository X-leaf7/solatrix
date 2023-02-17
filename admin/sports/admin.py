from django.contrib import admin

from config.admin import AlphabeticalOrderAdmin
from .models import League, Sport, Stadium, Team


admin.site.register(League, AlphabeticalOrderAdmin)
admin.site.register(Sport, AlphabeticalOrderAdmin)
admin.site.register(Stadium, AlphabeticalOrderAdmin)
admin.site.register(Team, AlphabeticalOrderAdmin)
