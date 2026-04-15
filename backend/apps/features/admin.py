from django.contrib import admin

from .models import FeatureRequest, Vote


@admin.register(FeatureRequest)
class FeatureRequestAdmin(admin.ModelAdmin):
    list_display = ("title", "created_by", "status", "vote_count", "created_at")
    list_filter = ("status",)
    search_fields = ("title", "description")
    readonly_fields = ("vote_count",)


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ("user", "feature_request", "created_at")
