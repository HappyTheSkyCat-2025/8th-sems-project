from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Region, Country, TravelDeal, Review, Article, FAQ
from .serializers import (
    RegionSerializer,
    CountrySerializer,
    CountryDetailSerializer,  # Import the detailed serializer
    TravelDealSerializer,
    ReviewSerializer,
    ArticleSerializer,
    FAQSerializer,
)
from .permissions import IsSuperUserOrReadOnly


# Regions
class RegionListCreateAPIView(generics.ListCreateAPIView):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    permission_classes = [IsSuperUserOrReadOnly]


class RegionRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    permission_classes = [IsSuperUserOrReadOnly]


# Countries
class CountryListCreateAPIView(generics.ListCreateAPIView):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    permission_classes = [IsSuperUserOrReadOnly]


class CountryRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Country.objects.all()
    serializer_class = CountryDetailSerializer  # Use detailed serializer here
    permission_classes = [IsSuperUserOrReadOnly]
    lookup_field = 'slug'  # Using slug for lookups


# Travel Deals
class TravelDealListCreateAPIView(generics.ListCreateAPIView):
    queryset = TravelDeal.objects.all()
    serializer_class = TravelDealSerializer
    permission_classes = [IsSuperUserOrReadOnly]


class TravelDealRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TravelDeal.objects.all()
    serializer_class = TravelDealSerializer
    permission_classes = [IsSuperUserOrReadOnly]


# Reviews
class ReviewListCreateAPIView(generics.ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsSuperUserOrReadOnly]


class ReviewRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsSuperUserOrReadOnly]


# Articles
class ArticleListCreateAPIView(generics.ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsSuperUserOrReadOnly]


class ArticleRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsSuperUserOrReadOnly]


# FAQs
class FAQListCreateAPIView(generics.ListCreateAPIView):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = [IsSuperUserOrReadOnly]


class FAQRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = [IsSuperUserOrReadOnly]


# Public read-only API to get regions and countries grouped
class DestinationsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        regions = Region.objects.prefetch_related('countries').all()
        data = {
            "regions": []
        }
        for region in regions:
            countries = CountrySerializer(region.countries.all(), many=True).data
            data["regions"].append({
                "region_name": region.name,
                "countries": countries
            })
        return Response(data)
