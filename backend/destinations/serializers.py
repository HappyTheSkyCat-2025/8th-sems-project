from rest_framework import serializers
from .models import (
    Region, Country, TravelDeal, Review, Article, FAQ,
    TravelOption, TravelType, DealCategory, DealOffer
)

class RegionSerializer(serializers.ModelSerializer):
    countries = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Region
        fields = ['id', 'name', 'countries']


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name', 'slug', 'region']


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


class TravelDealSerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelDeal
        fields = "__all__"


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = "__all__"


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = "__all__"


class CountryDetailSerializer(serializers.ModelSerializer):
    deals = TravelDealSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    articles = ArticleSerializer(many=True, read_only=True)
    faqs = FAQSerializer(many=True, read_only=True)

    class Meta:
        model = Country
        fields = [
            "id", "name", "slug", "subtitle", "section_title",
            "description", "image", "video_url",
            "deals", "reviews", "articles", "faqs"
        ]
