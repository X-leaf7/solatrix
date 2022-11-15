from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User

@admin.register(User)
class AllUsersAdmin(BaseUserAdmin):

    list_display = ("username", "email", "is_active", "is_deleted")
    list_filter = ("is_staff", "is_superuser", "is_active", "groups", "is_deleted")

    fieldsets = BaseUserAdmin.fieldsets + (
        ("Delete or Restore Account", {'fields': ('is_deleted',)}),
    )

    def get_queryset(self, request):
        return User.global_objects.all()