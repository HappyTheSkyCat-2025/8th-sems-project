

from django.urls import path
from .views import SimilarRecommendationsAPIView

urlpatterns = [
    path("similar/<int:deal_id>/", SimilarRecommendationsAPIView.as_view()),
]
