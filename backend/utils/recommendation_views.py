"""
API Views for Recommendations
Expose recommendation engine via REST endpoints
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from destinations.models import TravelDeal
from destinations.serializers import TravelDealSerializer
from utils.recommendations import (
    RecommendationEngine,
    UserBasedRecommendations,
    CollaborativeFiltering
)


class TrendingDealsAPIView(APIView):
    """Get trending deals (most wishlisted & reviewed)"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        limit = int(request.query_params.get('limit', 10))
        deals = RecommendationEngine.get_trending_deals(limit=limit)
        serializer = TravelDealSerializer(deals, many=True)
        return Response({
            'count': len(serializer.data),
            'results': serializer.data
        })


class PersonalizedRecommendationsAPIView(APIView):
    """Get personalized recommendations for logged-in user"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        limit = int(request.query_params.get('limit', 10))
        deals = UserBasedRecommendations.get_user_recommendations(
            user=request.user,
            limit=limit
        )
        serializer = TravelDealSerializer(deals, many=True)
        return Response({
            'count': len(serializer.data),
            'results': serializer.data,
            'message': 'Recommendations based on your preferences'
        })


class SimilarDealsAPIView(APIView):
    """Get deals similar to a specific deal"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, deal_id):
        limit = int(request.query_params.get('limit', 5))
        try:
            similar_deals = RecommendationEngine.get_similar_deals(
                deal_id=deal_id,
                limit=limit
            )
            serializer = TravelDealSerializer(similar_deals, many=True)
            return Response({
                'count': len(serializer.data),
                'results': serializer.data
            })
        except TravelDeal.DoesNotExist:
            return Response(
                {'error': 'Deal not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class HighRatedDealsAPIView(APIView):
    """Get highly-rated deals"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        min_rating = float(request.query_params.get('min_rating', 4.0))
        limit = int(request.query_params.get('limit', 10))
        deals = RecommendationEngine.get_high_rated_deals(
            min_rating=min_rating,
            limit=limit
        )
        serializer = TravelDealSerializer(deals, many=True)
        return Response({
            'count': len(serializer.data),
            'results': serializer.data
        })


class BudgetFriendlyDealsAPIView(APIView):
    """Get deals within budget"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        max_price = float(request.query_params.get('max_price', 5000))
        limit = int(request.query_params.get('limit', 10))
        deals = RecommendationEngine.get_budget_friendly_deals(
            max_price=max_price,
            limit=limit
        )
        serializer = TravelDealSerializer(deals, many=True)
        return Response({
            'count': len(serializer.data),
            'results': serializer.data
        })


class UserPreferencesAPIView(APIView):
    """Get user's category preferences & recommendations from similar users"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        preferences = UserBasedRecommendations.get_category_preferences(request.user)
        similar_user_recs = CollaborativeFiltering.get_recommendations_from_similar_users(
            user=request.user,
            limit=10
        )
        serializer = TravelDealSerializer(similar_user_recs, many=True)
        
        return Response({
            'preferences': preferences,
            'recommendations_from_similar_users': {
                'count': len(serializer.data),
                'results': serializer.data
            }
        })
