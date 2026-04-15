from django.contrib.auth.models import AbstractUser

from core.mixins import UUIDMixin


class User(UUIDMixin, AbstractUser):
    class Meta:
        db_table = "users"
