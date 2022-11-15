from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from django_softdelete.models import SoftDeleteModel, SoftDeleteQuerySet

from config.models import SSBaseModel


class HybridUserManager(UserManager):

    def get_queryset(self):
        return SoftDeleteQuerySet(self.model, using=self._db).filter(is_deleted=False)


class User(SoftDeleteModel, AbstractUser, SSBaseModel):
    email = models.EmailField(unique=True)

    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=50, blank=True)
    zip_code = models.CharField(max_length=10, blank=True)
    about = models.CharField(max_length=255, blank=True)

    profile_image = models.ImageField(upload_to="profile_images", blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    objects = HybridUserManager()