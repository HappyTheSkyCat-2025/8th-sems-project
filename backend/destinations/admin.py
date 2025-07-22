from django.contrib import admin
from .models import (
    Region, Country, TravelDeal, TravelImage, Review, Article, FAQ,
    TravelType, DealCategory, DealOffer,
    CountryOverview, CountryLearnMoreTopic, TravelDealDate, Place,
    ItineraryDay,
)

# -------------------------
# Region and Country Admin
# -------------------------
@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('name', 'region', 'slug')
    list_filter = ('region',)
    search_fields = ('name', 'region__name')
    prepopulated_fields = {"slug": ("name",)}


# -------------------------
# Place Admin
# -------------------------
@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


# -------------------------
# Travel Deal and Related Admin
# -------------------------
class TravelImageInline(admin.TabularInline):
    model = TravelImage
    extra = 1
    readonly_fields = ('__str__',)
    # You can add thumbnail preview here if desired


@admin.register(TravelDeal)
class TravelDealAdmin(admin.ModelAdmin):
    list_display = ('title', 'country', 'days', 'price', 'on_sale', 'last_minute')
    list_filter = ('country', 'on_sale', 'last_minute')
    search_fields = ('title', 'country__name', 'city')
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = ('places',)
    inlines = [TravelImageInline]


@admin.register(TravelDealDate)
class TravelDealDateAdmin(admin.ModelAdmin):
    list_display = ('travel_deal', 'start_date', 'end_date', 'language', 'guaranteed', 'rooms', 'discounted_price', 'discount_percent')
    list_filter = ('language', 'guaranteed')
    search_fields = ('travel_deal__title',)


@admin.register(ItineraryDay)
class ItineraryDayAdmin(admin.ModelAdmin):
    list_display = ('travel_deal', 'day_number', 'location', 'accommodation')
    list_filter = ('travel_deal',)
    ordering = ('travel_deal', 'day_number')


# -------------------------
# Review Admin
# -------------------------
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('name', 'travel_deal', 'rating', 'travel_date', 'submitted_on')
    list_filter = ('rating', 'travel_date')
    search_fields = ('name', 'travel_deal__title')


# -------------------------
# Article and FAQ Admin
# -------------------------
@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'country', 'location', 'is_inspirational', 'is_suggested')
    list_filter = ('country', 'is_inspirational', 'is_suggested')
    search_fields = ('title', 'country__name', 'location')


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('country', 'question')
    list_filter = ('country',)
    search_fields = ('question', 'country__name')


# -------------------------
# Travel Type, Deal Category & Offer Admin
# -------------------------
@admin.register(TravelType)
class TravelTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(DealCategory)
class DealCategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(DealOffer)
class DealOfferAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')
    list_filter = ('category',)
    search_fields = ('name',)


# -------------------------
# Country Overview and Learn More Topics Admin
# -------------------------
@admin.register(CountryOverview)
class CountryOverviewAdmin(admin.ModelAdmin):
    list_display = ('country', 'capital', 'population', 'currency', 'language')
    search_fields = ('country__name', 'capital')


@admin.register(CountryLearnMoreTopic)
class CountryLearnMoreTopicAdmin(admin.ModelAdmin):
    list_display = ('title', 'country', 'order')
    list_filter = ('country',)
    ordering = ('order',)
    search_fields = ('title', 'country__name')
