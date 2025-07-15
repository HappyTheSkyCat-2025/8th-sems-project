from rest_framework import serializers
import json
from django.db.models import Avg
from .models import (
    Region, Country, TravelDeal, Review, Article, FAQ,
    TravelOption, TravelType, DealCategory, DealOffer,
    CountryOverview, CountryLearnMoreTopic
)


# Custom JSONListField to handle JSON list strings
class JSONListField(serializers.Field):
    def to_internal_value(self, data):
        if isinstance(data, list):
            return data
        if isinstance(data, str):
            try:
                parsed = json.loads(data)
                if isinstance(parsed, list):
                    return parsed
                else:
                    raise serializers.ValidationError("Expected a list of values.")
            except json.JSONDecodeError:
                raise serializers.ValidationError("Invalid JSON format.")
        raise serializers.ValidationError("Invalid data type.")

    def to_representation(self, value):
        return value


# --- TravelDeal, Review, Article, FAQ Serializers ---

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name', 'slug', 'region', 'image']


class TravelDealSerializer(serializers.ModelSerializer):
    themes = JSONListField()
    country = CountrySerializer(read_only=True)
    country_id = serializers.PrimaryKeyRelatedField(queryset=Country.objects.all(), write_only=True, source='country')
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = TravelDeal
        fields = "__all__"

    def get_average_rating(self, obj):
        # Get all reviews related to this travel deal
        reviews = obj.reviews.all()
        if reviews.exists():
            avg_rating = reviews.aggregate(avg=Avg('rating'))['avg']
            return round(avg_rating, 1) if avg_rating else 0
        return 0


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['travel_deal', 'submitted_on']


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = "__all__"


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = "__all__"


# --- Country Overview and Learn More Topic Serializers ---

class CountryOverviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = CountryOverview
        fields = [
            'id', 'capital', 'population', 'currency',
            'language', 'timezone', 'calling_code', 'electricity'
        ]


class CountryLearnMoreTopicSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = CountryLearnMoreTopic
        fields = ['id', 'title', 'description', 'image_url', 'order']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


# --- Region Serializer ---

class RegionSerializer(serializers.ModelSerializer):
    countries = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Region
        fields = ['id', 'name', 'countries']


# --- CountryDetailSerializer ---

class CountryDetailSerializer(serializers.ModelSerializer):
    deals = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()
    articles = serializers.SerializerMethodField()
    faqs = serializers.SerializerMethodField()
    overview = CountryOverviewSerializer(read_only=True)
    learn_more_topics = CountryLearnMoreTopicSerializer(many=True, read_only=True)
    region = serializers.PrimaryKeyRelatedField(queryset=Region.objects.all())

    class Meta:
        model = Country
        fields = [
            "id", "name", "slug", "subtitle", "section_title",
            "description", "image", "video_url",
            "region", "deals", "reviews", "articles", "faqs",
            "overview", "learn_more_topics",
        ]

    def get_deals(self, obj):
        return TravelDealSerializer(obj.deals.all(), many=True, context=self.context).data

    def get_reviews(self, obj):
        # Aggregate reviews from all deals of this country
        deals = obj.deals.all()
        reviews = Review.objects.filter(travel_deal__in=deals)
        return ReviewSerializer(reviews, many=True).data

    def get_articles(self, obj):
        return ArticleSerializer(obj.articles.all(), many=True).data

    def get_faqs(self, obj):
        return FAQSerializer(obj.faqs.all(), many=True).data


# --- TravelOption and TravelType Serializers ---

class TravelOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelOption
        fields = ['name']


class TravelTypeSerializer(serializers.ModelSerializer):
    options = TravelOptionSerializer(many=True)

    class Meta:
        model = TravelType
        fields = ['name', 'options']

    def create(self, validated_data):
        options_data = validated_data.pop('options', [])
        travel_type = TravelType.objects.create(**validated_data)
        for option_data in options_data:
            TravelOption.objects.create(travel_type=travel_type, **option_data)
        return travel_type

    def update(self, instance, validated_data):
        options_data = validated_data.pop('options', None)
        instance.name = validated_data.get('name', instance.name)
        instance.save()

        if options_data is not None:
            instance.options.all().delete()
            for option_data in options_data:
                TravelOption.objects.create(travel_type=instance, **option_data)

        return instance


# --- DealOffer and DealCategory Serializers ---

class DealOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = DealOffer
        fields = ['name']


class DealCategorySerializer(serializers.ModelSerializer):
    offers = DealOfferSerializer(many=True)

    class Meta:
        model = DealCategory
        fields = ['name', 'offers']

    def create(self, validated_data):
        offers_data = validated_data.pop('offers', [])
        deal_category = DealCategory.objects.create(**validated_data)
        for offer_data in offers_data:
            DealOffer.objects.create(category=deal_category, **offer_data)
        return deal_category

    def update(self, instance, validated_data):
        offers_data = validated_data.pop('offers', None)
        instance.name = validated_data.get('name', instance.name)
        instance.save()

        if offers_data is not None:
            instance.offers.all().delete()
            for offer_data in offers_data:
                DealOffer.objects.create(category=instance, **offer_data)

        return instance
