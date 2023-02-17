from django.contrib import admin


class AlphabeticalOrderAdmin(admin.ModelAdmin):
    ordering = ['name']