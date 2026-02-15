from django.urls import path
from .views import VisaCheckerAPI, WeatherForecastAPI, ExchangeRateAPIView
from .chatbot_views import TravelChatbotAPIView
from .recommendation_views import (
    TrendingDealsAPIView,
    PersonalizedRecommendationsAPIView,
    SimilarDealsAPIView,
    HighRatedDealsAPIView,
    BudgetFriendlyDealsAPIView,
    UserPreferencesAPIView,
)

urlpatterns = [
    path('visa-checker/', VisaCheckerAPI.as_view(), name='visa-checker'),
    path('weather-forecast/', WeatherForecastAPI.as_view(), name='weather-forecast'),
    path('exchange-rate/', ExchangeRateAPIView.as_view(), name='exchange-rate'),
    path('chatbot/', TravelChatbotAPIView.as_view(), name='travel-chatbot'),
    
    # Recommendations
    path('recommendations/trending/', TrendingDealsAPIView.as_view(), name='trending-deals'),
    path('recommendations/personalized/', PersonalizedRecommendationsAPIView.as_view(), name='personalized-recommendations'),
    path('recommendations/similar/<int:deal_id>/', SimilarDealsAPIView.as_view(), name='similar-deals'),
    path('recommendations/high-rated/', HighRatedDealsAPIView.as_view(), name='high-rated-deals'),
    path('recommendations/budget/', BudgetFriendlyDealsAPIView.as_view(), name='budget-deals'),
    path('recommendations/preferences/', UserPreferencesAPIView.as_view(), name='user-preferences'),
]
