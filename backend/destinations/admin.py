from django.contrib import admin

# Register your models here.
from .models import Region, Country, TravelDeal, Review, Article, FAQ
from .models import TravelType, DealCategory, DealOffer
from .models import CountryOverview, CountryLearnMoreTopic

admin.site.register(Region)
admin.site.register(Country)
admin.site.register(TravelDeal)
admin.site.register(Review)
admin.site.register(Article)
admin.site.register(FAQ)
admin.site.register(TravelType)
admin.site.register(DealCategory)
admin.site.register(DealOffer)
admin.site.register(CountryOverview)
admin.site.register(CountryLearnMoreTopic)