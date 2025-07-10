from rest_framework import serializers
from .models import Region, Country, TravelDeal, Review, Article, FAQ

class RegionSerializer(serializers.ModelSerializer):
    countries = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Region
        fields = ['id', 'name', 'countries']

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name', 'region']

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
            "id",
            "name",
            "slug",
            "subtitle",
            "section_title",
            "description",
            "image",
            "video_url",
            "deals",
            "reviews",
            "articles",
            "faqs"
        ]
