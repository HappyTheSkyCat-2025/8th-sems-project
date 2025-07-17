from django.contrib import admin

# Register your models here.
from .models import Region, Country, TravelDeal, TravelImage, Review, Article, FAQ
from .models import TravelType, DealCategory, DealOffer
from .models import CountryOverview, CountryLearnMoreTopic, TravelDealDate, Place

admin.site.register(Region)
admin.site.register(Country)

class TravelImageInline(admin.TabularInline):
    model = TravelImage
    extra = 1

@admin.register(TravelDeal)
class TravelDealAdmin(admin.ModelAdmin):
    inlines = [TravelImageInline]
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = ('places',)  # Enables nice widget for ManyToManyField 'places'

admin.site.register(Review)
admin.site.register(Article)
admin.site.register(FAQ)
admin.site.register(TravelType)
admin.site.register(DealCategory)
admin.site.register(DealOffer)
admin.site.register(CountryOverview)
admin.site.register(CountryLearnMoreTopic)
admin.site.register(TravelDealDate)
admin.site.register(Place)  # Also register Place model in admin
