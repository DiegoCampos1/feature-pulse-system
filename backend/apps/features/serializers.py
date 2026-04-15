from rest_framework import serializers

from apps.accounts.serializers import UserSerializer

from .models import FeatureRequest


class FeatureRequestSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    has_voted = serializers.SerializerMethodField()

    class Meta:
        model = FeatureRequest
        fields = (
            "id",
            "title",
            "description",
            "created_by",
            "status",
            "vote_count",
            "has_voted",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_by", "vote_count", "created_at", "updated_at")

    def get_has_voted(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.votes.filter(user=request.user).exists()
        return False


class FeatureRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeatureRequest
        fields = ("title", "description")
