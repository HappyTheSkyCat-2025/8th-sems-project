from rest_framework import serializers
from accounts.models import User
from backend.contacts.models import ContactMessage
from blogs.models import Category, Blog, Comment, Story
from destinations.models import (
    Region, Country, TravelType, TravelOption, DealCategory, DealOffer,
    Place, TravelDeal, TravelImage, ItineraryDay,
    WishlistItem, Review, Article, FAQ,
    CountryOverview, CountryLearnMoreTopic, TravelDealDate
)
from payments.models import Booking, BookingLocation


# ----------------------
# User Serializer
# ----------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'phone', 'profile_image',
            'nationality', 'is_active', 'is_staff', 'is_superuser'
        ]


# ----------------------
# Blog & Related Serializers
# ----------------------
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class BlogSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=True)
    category = CategorySerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = [
            'id', 'title', 'slug', 'content', 'thumbnail', 'category', 'author',
            'created_at', 'updated_at', 'status', 'tags', 'views', 'likes_count', 'country'
        ]

    def get_likes_count(self, obj):
        return obj.likes.count()


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)  # nested user info
    likes_count = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    parent = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'blog', 'author', 'text', 'parent', 'likes_count', 'created_at', 'replies']

    def get_replies(self, obj):
        return CommentSerializer(obj.replies.all(), many=True).data

    def get_likes_count(self, obj):
        return obj.likes.count()


class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = ['id', 'name', 'location', 'message', 'photo', 'created_at']


# ----------------------
# Contact Messages Serializer
# ----------------------
class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'full_name', 'email', 'phone', 'subject', 'message', 'created_at']
        read_only_fields = ['created_at']


# ----------------------
# Destinations Serializers
# ----------------------
class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ['id', 'name']


class CountrySerializer(serializers.ModelSerializer):
    region = RegionSerializer(read_only=True)

    class Meta:
        model = Country
        fields = [
            'id', 'name', 'code', 'currency_code', 'slug', 'subtitle',
            'section_title', 'description', 'image', 'video', 'region'
        ]


class TravelTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelType
        fields = ['id', 'name']


class TravelOptionSerializer(serializers.ModelSerializer):
    travel_type = TravelTypeSerializer(read_only=True)

    class Meta:
        model = TravelOption
        fields = ['id', 'name', 'travel_type']


class DealCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DealCategory
        fields = ['id', 'name', 'discount_percent']


class DealOfferSerializer(serializers.ModelSerializer):
    category = DealCategorySerializer(read_only=True)

    class Meta:
        model = DealOffer
        fields = ['id', 'name', 'category']


class PlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Place
        fields = ['id', 'name', 'image']


class TravelImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelImage
        fields = ['id', 'image']


class ItineraryDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItineraryDay
        fields = [
            'id', 'day_number', 'location', 'description',
            'accommodation', 'activities', 'meals'
        ]


class TravelDealSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    category = DealCategorySerializer(read_only=True)
    places = PlaceSerializer(many=True, read_only=True)
    gallery = TravelImageSerializer(many=True, read_only=True)
    itinerary = ItineraryDaySerializer(many=True, read_only=True)

    class Meta:
        model = TravelDeal
        fields = [
            'id', 'title', 'subtitle', 'slug', 'days', 'price', 'image', 'themes', 'tag', 'style',
            'description', 'on_sale', 'last_minute', 'discount_percent',
            'included', 'not_included',
            'country', 'category', 'places', 'gallery', 'itinerary', 'city', 'map_zoom'
        ]


class WishlistItemSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    deal = TravelDealSerializer(read_only=True)

    class Meta:
        model = WishlistItem
        fields = ['id', 'user', 'deal', 'added_at']


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'name', 'title', 'rating', 'content', 'travel_date', 'submitted_on']


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['id', 'title', 'location', 'description', 'image', 'is_inspirational', 'is_suggested']


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer']


class CountryOverviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = CountryOverview
        fields = [
            'id', 'capital', 'population', 'currency', 'language',
            'timezone', 'calling_code', 'electricity'
        ]


class CountryLearnMoreTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = CountryLearnMoreTopic
        fields = ['id', 'title', 'description', 'image', 'order']


class TravelDealDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelDealDate
        fields = [
            'id', 'start_date', 'end_date', 'language', 'guaranteed', 'rooms',
            'original_price', 'discounted_price', 'discount_percent', 'capacity'
        ]


# ----------------------
# Booking Serializers
# ----------------------
class BookingLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingLocation
        fields = ['id', 'latitude', 'longitude', 'timestamp']


class BookingSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    travel_deal = TravelDealSerializer(read_only=True)
    date_option = TravelDealDateSerializer(read_only=True)
    locations = BookingLocationSerializer(many=True, read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'travel_deal', 'date_option', 'full_name', 'email', 'phone',
            'address_line1', 'address_line2', 'town', 'state', 'postcode', 'country',
            'travellers', 'room_option', 'add_transfer', 'add_nights', 'flight_help', 'donation',
            'payment_method', 'payment_status', 'payment_amount', 'transaction_id', 'payment_date',
            'status', 'canceled_at', 'created_at', 'locations'
        ]
