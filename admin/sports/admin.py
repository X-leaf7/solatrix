from django.contrib import admin

from config.admin import AlphabeticalOrderAdmin
from .models import League, Round, Season, Sport, Stadium, Team


admin.site.register(League, AlphabeticalOrderAdmin)
admin.site.register(Round, AlphabeticalOrderAdmin)
admin.site.register(Season, AlphabeticalOrderAdmin)
admin.site.register(Sport, AlphabeticalOrderAdmin)
admin.site.register(Stadium, AlphabeticalOrderAdmin)
admin.site.register(Team, AlphabeticalOrderAdmin)
