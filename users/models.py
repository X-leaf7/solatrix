from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django_softdelete.models import SoftDeleteModel, SoftDeleteManager

from config.models import SSBaseModel


class HybridUserManager(BaseUserManager, SoftDeleteManager):
    pass


class User(SoftDeleteModel, AbstractUser, SSBaseModel):
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    objects = HybridUserManager()