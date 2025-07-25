from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from accounts.models import User
from blogs.models import Category, Blog, Comment, Story
from contacts.models import ContactMessage
from destinations.models import (
    Region, Country, TravelType, TravelOption, DealCategory, DealOffer,
    Place, TravelDeal, TravelImage, ItineraryDay,
    WishlistItem, Review, Article, FAQ,
    CountryOverview, CountryLearnMoreTopic, TravelDealDate
)
from payments.models import Booking, BookingLocation

from .serializers import (
    UserSerializer,
    CategorySerializer, BlogSerializer, CommentSerializer, StorySerializer,
    ContactMessageSerializer,
    RegionSerializer, CountrySerializer, TravelTypeSerializer, TravelOptionSerializer,
    DealCategorySerializer, DealOfferSerializer, PlaceSerializer,
    TravelDealSerializer, TravelImageSerializer, ItineraryDaySerializer,
    WishlistItemSerializer, ReviewSerializer, ArticleSerializer, FAQSerializer,
    CountryOverviewSerializer, CountryLearnMoreTopicSerializer, TravelDealDateSerializer,
    BookingSerializer, BookingLocationSerializer
)


# --------------------------
# Permission Classes
# --------------------------
class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and (request.user.is_staff or request.user.is_superuser)


# --------------------------
# User & Authentication Related
# --------------------------
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-id')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


# --------------------------
# Blog Related ViewSets
# --------------------------
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]

class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all().order_by('-created_at')
    serializer_class = BlogSerializer
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    permission_classes = [permissions.IsAdminUser]

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAdminUser]

class StoryViewSet(viewsets.ModelViewSet):
    queryset = Story.objects.all().order_by('-created_at')
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAdminUser]


# --------------------------
# Contact Messages
# --------------------------
class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all().order_by('-created_at')
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.IsAdminUser]


# --------------------------
# Destination & Travel Related ViewSets
# --------------------------
class RegionViewSet(viewsets.ModelViewSet):
    queryset = Region.objects.all().order_by('name')
    serializer_class = RegionSerializer
    permission_classes = [permissions.IsAdminUser]

class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all().order_by('name')
    serializer_class = CountrySerializer
    permission_classes = [permissions.IsAdminUser]

class TravelTypeViewSet(viewsets.ModelViewSet):
    queryset = TravelType.objects.all()
    serializer_class = TravelTypeSerializer
    permission_classes = [permissions.IsAdminUser]

class TravelOptionViewSet(viewsets.ModelViewSet):
    queryset = TravelOption.objects.all()
    serializer_class = TravelOptionSerializer
    permission_classes = [permissions.IsAdminUser]

class DealCategoryViewSet(viewsets.ModelViewSet):
    queryset = DealCategory.objects.all()
    serializer_class = DealCategorySerializer
    permission_classes = [permissions.IsAdminUser]

class DealOfferViewSet(viewsets.ModelViewSet):
    queryset = DealOffer.objects.all()
    serializer_class = DealOfferSerializer
    permission_classes = [permissions.IsAdminUser]

class PlaceViewSet(viewsets.ModelViewSet):
    queryset = Place.objects.all()
    serializer_class = PlaceSerializer
    permission_classes = [permissions.IsAdminUser]

class TravelDealViewSet(viewsets.ModelViewSet):
    queryset = TravelDeal.objects.all().order_by('-id')
    serializer_class = TravelDealSerializer
    permission_classes = [permissions.IsAdminUser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=400)
        return super().create(request, *args, **kwargs)


    def update(self, request, *args, **kwargs):
        print("DEBUG: Incoming PUT data:", request.data)  # <-- debug print input data for update
        response = super().update(request, *args, **kwargs)
        print("DEBUG: Update response data:", response.data)  # <-- debug print response
        return response

class TravelImageViewSet(viewsets.ModelViewSet):
    queryset = TravelImage.objects.all()
    serializer_class = TravelImageSerializer
    permission_classes = [permissions.IsAdminUser]

class ItineraryDayViewSet(viewsets.ModelViewSet):
    queryset = ItineraryDay.objects.all()
    serializer_class = ItineraryDaySerializer
    permission_classes = [permissions.IsAdminUser]

class WishlistItemViewSet(viewsets.ModelViewSet):
    queryset = WishlistItem.objects.all()
    serializer_class = WishlistItemSerializer
    permission_classes = [permissions.IsAdminUser]

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAdminUser]

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [permissions.IsAdminUser]

class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = [permissions.IsAdminUser]

class CountryOverviewViewSet(viewsets.ModelViewSet):
    queryset = CountryOverview.objects.all()
    serializer_class = CountryOverviewSerializer
    permission_classes = [permissions.IsAdminUser]

class CountryLearnMoreTopicViewSet(viewsets.ModelViewSet):
    queryset = CountryLearnMoreTopic.objects.all()
    serializer_class = CountryLearnMoreTopicSerializer
    permission_classes = [permissions.IsAdminUser]

class TravelDealDateViewSet(viewsets.ModelViewSet):
    queryset = TravelDealDate.objects.all()
    serializer_class = TravelDealDateSerializer
    permission_classes = [permissions.IsAdminUser]


# --------------------------
# Booking Related ViewSets
# --------------------------
class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by('-created_at')
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAdminUser]

class BookingLocationViewSet(viewsets.ModelViewSet):
    queryset = BookingLocation.objects.all().order_by('-timestamp')
    serializer_class = BookingLocationSerializer
    permission_classes = [permissions.IsAdminUser]
