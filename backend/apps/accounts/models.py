from django.contrib.auth.models import AbstractUser
from django.db import models

from core.mixins import TimestampMixin, UUIDMixin


class User(UUIDMixin, TimestampMixin, AbstractUser):
    email = models.EmailField(unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "first_name", "last_name"]

    class Meta:
        db_table = "users"

    def __str__(self):
        return self.email
