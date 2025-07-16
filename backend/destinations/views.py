from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from .models import (
    Region, Country, TravelDeal, Review, Article, FAQ,
    TravelType, DealCategory, DealOffer,
    CountryOverview, CountryLearnMoreTopic, TravelDealDate,
    WishlistItem
)
from .serializers import (
    RegionSerializer, CountrySerializer, CountryDetailSerializer,
    TravelDealSerializer, ReviewSerializer, ArticleSerializer,
    FAQSerializer, TravelTypeSerializer, DealCategorySerializer,
    CountryOverviewSerializer, CountryLearnMoreTopicSerializer,
    TravelDealDateSerializer, WishlistItemSerializer
)
from .permissions import IsSuperUserOrReadOnly

# ====== Admin Stats View ======
class AdminStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        data = {
            "regions": Region.objects.count(),
            "countries": Country.objects.count(),
            "travel_deals": TravelDeal.objects.count(),
            "reviews": Review.objects.count(),
        }
        return Response(data)

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
    serializer_class = TravelDealSerializer
    permission_classes = [IsSuperUserOrReadOnly]

    def get_queryset(self):
        country_slug = self.kwargs.get('slug')
        return TravelDeal.objects.filter(country__slug=country_slug)

class TravelDealRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TravelDealSerializer
    permission_classes = [IsSuperUserOrReadOnly]
    lookup_field = 'slug'

    def get_queryset(self):
        country_slug = self.kwargs.get('country_slug')
        return TravelDeal.objects.filter(country__slug=country_slug)

# ====== Reviews ======
class ReviewListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        deal_slug = self.kwargs.get('deal_slug')
        if deal_slug:
            return Review.objects.filter(travel_deal__slug=deal_slug)
        return Review.objects.all()

    def perform_create(self, serializer):
        deal_slug = self.kwargs.get('deal_slug')
        deal = TravelDeal.objects.get(slug=deal_slug)
        serializer.save(travel_deal=deal)


class ReviewRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsSuperUserOrReadOnly]

    def get_queryset(self):
        return Review.objects.all()

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
    serializer_class = FAQSerializer
    permission_classes = [IsSuperUserOrReadOnly]

    def get_queryset(self):
        country_slug = self.kwargs.get('slug') or self.kwargs.get('country_slug')
        if country_slug:
            return FAQ.objects.filter(country__slug=country_slug)
        return FAQ.objects.all()

class FAQRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FAQSerializer
    permission_classes = [IsSuperUserOrReadOnly]

    def get_queryset(self):
        country_slug = self.kwargs.get('country_slug')
        if country_slug:
            return FAQ.objects.filter(country__slug=country_slug)
        return FAQ.objects.all()

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

# ====== CountryOverview ======
class CountryOverviewListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CountryOverviewSerializer
    permission_classes = [IsSuperUserOrReadOnly]

    def get_queryset(self):
        country_slug = self.kwargs.get('slug') or self.kwargs.get('country_slug')
        if country_slug:
            return CountryOverview.objects.filter(country__slug=country_slug)
        return CountryOverview.objects.all()

class CountryOverviewRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CountryOverviewSerializer
    permission_classes = [IsSuperUserOrReadOnly]

    def get_queryset(self):
        country_slug = self.kwargs.get('country_slug')
        if country_slug:
            return CountryOverview.objects.filter(country__slug=country_slug)
        return CountryOverview.objects.all()

# ====== CountryLearnMoreTopic ======
class CountryLearnMoreTopicListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CountryLearnMoreTopicSerializer
    permission_classes = [IsSuperUserOrReadOnly]

    def get_queryset(self):
        country_slug = self.kwargs.get('slug') or self.kwargs.get('country_slug')
        if country_slug:
            return CountryLearnMoreTopic.objects.filter(country__slug=country_slug)
        return CountryLearnMoreTopic.objects.all()

class CountryLearnMoreTopicRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CountryLearnMoreTopicSerializer
    permission_classes = [IsSuperUserOrReadOnly]

    def get_queryset(self):
        country_slug = self.kwargs.get('country_slug')
        if country_slug:
            return CountryLearnMoreTopic.objects.filter(country__slug=country_slug)
        return CountryLearnMoreTopic.objects.all()

class TravelDealDateListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = TravelDealDateSerializer
    permission_classes = [IsSuperUserOrReadOnly]

    def get_queryset(self):
        country_slug = self.kwargs['country_slug']
        deal_slug = self.kwargs['deal_slug']
        return TravelDealDate.objects.filter(
            travel_deal__slug=deal_slug,
            travel_deal__country__slug=country_slug
        )

    def perform_create(self, serializer):
        country_slug = self.kwargs['country_slug']
        deal_slug = self.kwargs['deal_slug']
        try:
            deal = TravelDeal.objects.get(slug=deal_slug, country__slug=country_slug)
        except TravelDeal.DoesNotExist:
            raise NotFound("Travel deal not found.")
        serializer.save(travel_deal=deal)


class TravelDealDateRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TravelDealDateSerializer
    permission_classes = [IsSuperUserOrReadOnly]
    lookup_field = 'pk'

    def get_queryset(self):
        country_slug = self.kwargs['country_slug']
        deal_slug = self.kwargs['deal_slug']
        return TravelDealDate.objects.filter(
            travel_deal__slug=deal_slug,
            travel_deal__country__slug=country_slug
        )

class WishlistItemListCreateView(generics.ListCreateAPIView):
    serializer_class = WishlistItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WishlistItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WishlistItemDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = WishlistItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WishlistItem.objects.filter(user=self.request.user)
