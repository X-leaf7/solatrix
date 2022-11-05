from django.contrib.auth.models import AbstractUser

from config.models import SSBaseModel

class User(AbstractUser, SSBaseModel):

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']