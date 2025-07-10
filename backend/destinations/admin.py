from django.contrib import admin

# Register your models here.
from .models import Region, Country, TravelDeal, Review, Article, FAQ

admin.site.register(Region)
admin.site.register(Country)
admin.site.register(TravelDeal)
admin.site.register(Review)
admin.site.register(Article)
admin.site.register(FAQ)