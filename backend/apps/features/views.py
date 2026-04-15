from rest_framework import filters, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import FeatureRequest, Vote
from .permissions import IsOwnerOrReadOnly
from .serializers import FeatureRequestCreateSerializer, FeatureRequestSerializer


class FeatureRequestViewSet(viewsets.ModelViewSet):
    queryset = FeatureRequest.objects.select_related("created_by").all()
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ["vote_count", "created_at"]
    ordering = ["-vote_count", "-created_at"]
    search_fields = ["title", "description"]

    def get_serializer_class(self):
        if self.action == "create":
            return FeatureRequestCreateSerializer
        return FeatureRequestSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        if self.action in ("update", "partial_update", "destroy"):
            return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        feature = serializer.save(created_by=request.user)
        return Response(
            FeatureRequestSerializer(feature, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def vote(self, request, pk=None):
        feature = self.get_object()
        vote, created = Vote.objects.get_or_create(user=request.user, feature_request=feature)
        if not created:
            vote.delete()
        feature.update_vote_count()
        feature.refresh_from_db()
        return Response(
            {
                "vote_count": feature.vote_count,
                "has_voted": created,
            }
        )
