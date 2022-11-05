from django.db import models
from django.contrib.auth.models import AbstractUser

from config.models import SSBaseModel

class User(AbstractUser, SSBaseModel):
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']