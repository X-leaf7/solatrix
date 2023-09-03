from django.db import models
from django.utils.text import slugify
import uuid


class SSBaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract=True


class SSNamedModel(SSBaseModel):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=100, editable=False)

    class Meta:
        abstract=True

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):

        self.slug = self.create_slug()

        super().save(*args, **kwargs)

    def create_slug(self):
        return slugify(self.name)


class SportsDataModel(models.Model):
    sports_data_id = models.IntegerField()

    class Meta:
        abstract=True


class LowercaseEmailField(models.EmailField):
    """
    Override EmailField to convert emails to lowercase before saving.
    """
    def to_python(self, value):
        """
        Convert email to lowercase.
        """
        value = super(LowercaseEmailField, self).to_python(value)
        # Value can be None so check that it's a string before lowercasing.
        if isinstance(value, str):
            return value.lower()
        return value