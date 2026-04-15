from django.conf import settings
from django.db import models

from core.mixins import TimestampMixin, UUIDMixin


class FeatureRequest(UUIDMixin, TimestampMixin, models.Model):
    STATUS_CHOICES = [
        ("open", "Open"),
        ("under_review", "Under Review"),
        ("planned", "Planned"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("declined", "Declined"),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="feature_requests",
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="open")
    vote_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-vote_count", "-created_at"]

    def __str__(self):
        return self.title

    def update_vote_count(self):
        self.vote_count = self.votes.count()
        self.save(update_fields=["vote_count"])


class Vote(UUIDMixin, TimestampMixin, models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="votes",
    )
    feature_request = models.ForeignKey(
        FeatureRequest,
        on_delete=models.CASCADE,
        related_name="votes",
    )

    class Meta:
        unique_together = ("user", "feature_request")

    def __str__(self):
        return f"{self.user} -> {self.feature_request}"
