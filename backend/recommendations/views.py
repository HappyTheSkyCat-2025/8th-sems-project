from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from destinations.models import TravelDeal


class SimilarRecommendationsAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, deal_id):
        try:
            current_deal = TravelDeal.objects.get(id=deal_id)

            # Recommend deals from same country
            recommendations = TravelDeal.objects.filter(
                country=current_deal.country
            ).exclude(id=deal_id)[:5]

            data = [
                {
                    "id": deal.id,
                    "title": deal.title,
                    "city": deal.city,
                    "country": deal.country.name,
                    "price": deal.price,
                    "image": deal.image.url if deal.image else None,
                }
                for deal in recommendations
            ]

            return Response({"recommendations": data})

        except TravelDeal.DoesNotExist:
            return Response({"recommendations": []})
