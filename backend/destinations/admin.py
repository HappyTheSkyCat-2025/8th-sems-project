from django.contrib import admin

# Register your models here.
from .models import Region, Country, TravelDeal, Review, Article, FAQ, TravelType, TravelOption, DealCategory, DealOffer

admin.site.register(Region)
admin.site.register(Country)
admin.site.register(TravelDeal)
admin.site.register(Review)
admin.site.register(Article)
admin.site.register(FAQ)
admin.site.register(TravelType)
admin.site.register(TravelOption)
admin.site.register(DealCategory)
admin.site.register(DealOffer)
