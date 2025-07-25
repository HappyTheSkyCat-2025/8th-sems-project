from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Import all viewsets
from .views import (
    UserViewSet,
    CategoryViewSet, BlogViewSet, CommentViewSet, StoryViewSet,
    ContactMessageViewSet,
    RegionViewSet, CountryViewSet, TravelTypeViewSet, TravelOptionViewSet,
    DealCategoryViewSet, DealOfferViewSet, PlaceViewSet, TravelDealViewSet,
    TravelImageViewSet, ItineraryDayViewSet, WishlistItemViewSet, ReviewViewSet,
    ArticleViewSet, FAQViewSet, CountryOverviewViewSet, CountryLearnMoreTopicViewSet,
    TravelDealDateViewSet,
    BookingViewSet, BookingLocationViewSet,
)

router = DefaultRouter()

# User & Auth
router.register(r'users', UserViewSet, basename='user')

# Blog Related
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'blogs', BlogViewSet, basename='blog')
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'stories', StoryViewSet, basename='story')

# Contact Messages
router.register(r'contact-messages', ContactMessageViewSet, basename='contactmessage')

# Destinations & Travel
router.register(r'regions', RegionViewSet)
router.register(r'countries', CountryViewSet)
router.register(r'travel-types', TravelTypeViewSet)
router.register(r'travel-options', TravelOptionViewSet)
router.register(r'deal-categories', DealCategoryViewSet)
router.register(r'deal-offers', DealOfferViewSet)
router.register(r'places', PlaceViewSet)
router.register(r'travel-deals', TravelDealViewSet)
router.register(r'travel-images', TravelImageViewSet)
router.register(r'itinerary-days', ItineraryDayViewSet)
router.register(r'wishlist-items', WishlistItemViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'articles', ArticleViewSet)
router.register(r'faqs', FAQViewSet)
router.register(r'country-overviews', CountryOverviewViewSet)
router.register(r'country-learn-more-topics', CountryLearnMoreTopicViewSet)
router.register(r'travel-deal-dates', TravelDealDateViewSet)

# Bookings
router.register(r'bookings', BookingViewSet)
router.register(r'booking-locations', BookingLocationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
