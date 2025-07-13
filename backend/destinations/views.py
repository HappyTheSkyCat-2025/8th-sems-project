from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import (
    Region, Country, TravelDeal, Review, Article, FAQ,
    TravelType, DealCategory, DealOffer,
    CountryOverview, CountryLearnMoreTopic
)
from .serializers import (
    RegionSerializer, CountrySerializer, CountryDetailSerializer,
    TravelDealSerializer, ReviewSerializer, ArticleSerializer,
    FAQSerializer, TravelTypeSerializer, DealCategorySerializer,
    CountryOverviewSerializer, CountryLearnMoreTopicSerializer
)
from .permissions import IsSuperUserOrReadOnly


# ====== Regions ======
class RegionListCreateAPIView(generics.ListCreateAPIView):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    permission_classes = [IsSuperUserOrReadOnly]


class RegionRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    permission_classes = [IsSuperUserOrReadOnly]


# ====== Countries ======
class CountryListCreateAPIView(generics.ListCreateAPIView):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    permission_classes = [IsSuperUserOrReadOnly]


class CountryRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Country.objects.all()
    serializer_class = CountryDetailSerializer
    permission_classes = [IsSuperUserOrReadOnly]
    lookup_field = 'slug'


# ====== Travel Deals ======
class TravelDealListCreateAPIView(generics.ListCreateAPIView):
    queryset = TravelDeal.objects.all()
    serializer_class = TravelDealSerializer
    permission_classes = [IsSuperUserOrReadOnly]


class TravelDealRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TravelDeal.objects.all()
    serializer_class = TravelDealSerializer
    permission_classes = [IsSuperUserOrReadOnly]


# ====== Reviews ======
class ReviewListCreateAPIView(generics.ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsSuperUserOrReadOnly]


class ReviewRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsSuperUserOrReadOnly]


# ====== Articles ======
class ArticleListCreateAPIView(generics.ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsSuperUserOrReadOnly]


class ArticleRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsSuperUserOrReadOnly]


# ====== FAQs ======
class FAQListCreateAPIView(generics.ListCreateAPIView):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = [IsSuperUserOrReadOnly]


class FAQRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = [IsSuperUserOrReadOnly]


# ====== Public Read-only Destinations API ======
class DestinationsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        regions = Region.objects.prefetch_related('countries').all()
        data = {"regions": []}
        for region in regions:
            countries = CountrySerializer(region.countries.all(), many=True).data
            data["regions"].append({
                "region_name": region.name,
                "countries": countries
            })
        return Response(data)


# ====== Travel Types ======
class TravelTypeListCreateAPIView(generics.ListCreateAPIView):
    queryset = TravelType.objects.prefetch_related('options').all()
    serializer_class = TravelTypeSerializer
    permission_classes = [IsSuperUserOrReadOnly]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        types = [t['name'] for t in serializer.data]
        options = {t['name']: [opt['name'] for opt in t['options']] for t in serializer.data}
        return Response({"types": types, "options": options})


class TravelTypeRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TravelType.objects.prefetch_related('options').all()
    serializer_class = TravelTypeSerializer
    permission_classes = [IsSuperUserOrReadOnly]


# ====== Deal Categories (Deals) ======
class DealCategoryListCreateAPIView(generics.ListCreateAPIView):
    queryset = DealCategory.objects.prefetch_related('offers').all()
    serializer_class = DealCategorySerializer
    permission_classes = [IsSuperUserOrReadOnly]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        categories = [c['name'] for c in serializer.data]
        offers = {c['name']: [offer['name'] for offer in c['offers']] for c in serializer.data}
        return Response({"categories": categories, "offers": offers})


class DealCategoryRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DealCategory.objects.prefetch_related('offers').all()
    serializer_class = DealCategorySerializer
    permission_classes = [IsSuperUserOrReadOnly]



class CountryOverviewListCreateAPIView(generics.ListCreateAPIView):
    queryset = CountryOverview.objects.all()
    serializer_class = CountryOverviewSerializer
    permission_classes = [IsSuperUserOrReadOnly]

class CountryOverviewRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CountryOverview.objects.all()
    serializer_class = CountryOverviewSerializer
    permission_classes = [IsSuperUserOrReadOnly]

class CountryLearnMoreTopicListCreateAPIView(generics.ListCreateAPIView):
    queryset = CountryLearnMoreTopic.objects.all()
    serializer_class = CountryLearnMoreTopicSerializer
    permission_classes = [IsSuperUserOrReadOnly]

class CountryLearnMoreTopicRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CountryLearnMoreTopic.objects.all()
    serializer_class = CountryLearnMoreTopicSerializer
    permission_classes = [IsSuperUserOrReadOnly]