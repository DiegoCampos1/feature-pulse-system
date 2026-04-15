from rest_framework.routers import DefaultRouter

from .views import FeatureRequestViewSet

router = DefaultRouter()
router.register("", FeatureRequestViewSet, basename="feature-requests")

urlpatterns = router.urls
