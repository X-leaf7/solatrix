from django.contrib import admin
from django.contrib.auth.forms import AuthenticationForm

from captcha.fields import ReCaptchaField
from captcha.widgets import ReCaptchaV2Invisible


class AuthAdminForm(AuthenticationForm):

    captcha = ReCaptchaField(widget=ReCaptchaV2Invisible())


class AlphabeticalOrderAdmin(admin.ModelAdmin):
    ordering = ['name']