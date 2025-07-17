from django.conf import settings
from django.db import models
from django.utils.text import slugify
from django.core.exceptions import ValidationError

class Region(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Country(models.Model):
    region = models.ForeignKey(Region, related_name="countries", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    subtitle = models.CharField(max_length=200, blank=True)
    section_title = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='countries/', blank=True, null=True)
    video_url = models.URLField(blank=True)

    class Meta:
        unique_together = ('region', 'name')

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.region.name})"

class TravelType(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class TravelOption(models.Model):
    travel_type = models.ForeignKey(TravelType, related_name="options", on_delete=models.CASCADE)
    name = models.CharField(max_length=150)

    def __str__(self):
        return self.name

class DealCategory(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class DealOffer(models.Model):
    category = models.ForeignKey(DealCategory, related_name="offers", on_delete=models.CASCADE)
    name = models.CharField(max_length=150)

    def __str__(self):
        return self.name

class Place(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to="places/", blank=True, null=True)

    def __str__(self):
        return self.name

class TravelDeal(models.Model):
    country = models.ForeignKey(Country, related_name="deals", on_delete=models.CASCADE)
    places = models.ManyToManyField(Place, related_name="deals", blank=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    map_zoom = models.PositiveIntegerField(default=5)
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=255, blank=True, null=True)
    slug = models.SlugField(unique=True, blank=True)
    days = models.PositiveIntegerField()
    price = models.CharField(max_length=20)
    image = models.ImageField(upload_to="deals/cover/", null=True, blank=True)
    themes = models.JSONField(default=list, blank=True)
    tag = models.CharField(max_length=50, blank=True)
    style = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True, null=True)
    on_sale = models.BooleanField(default=False)
    last_minute = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} - {self.country.name}"


class TravelImage(models.Model):
    deal = models.ForeignKey(TravelDeal, related_name="gallery", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="deals/gallery/")

    def __str__(self):
        return f"Image for {self.deal.title}"



class WishlistItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wishlist_items')
    deal = models.ForeignKey('TravelDeal', on_delete=models.CASCADE, related_name='wishlisted_by')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'deal')

    def __str__(self):
        return f"{self.user.email} → {self.deal.title}"

class Review(models.Model):
    travel_deal = models.ForeignKey("TravelDeal", related_name="reviews", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    rating = models.IntegerField()
    content = models.TextField()
    travel_date = models.CharField(max_length=50)
    submitted_on = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.name} on {self.travel_deal.title} - {self.rating}/5"

class Article(models.Model):
    country = models.ForeignKey(Country, related_name="articles", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='articles/', blank=True, null=True)

    # NEW FIELDS
    is_inspirational = models.BooleanField(default=False)  # for "Get inspired"
    is_suggested = models.BooleanField(default=False)      # for "You might also like"

    def __str__(self):
        return f"{self.title} ({self.country.name})"

class FAQ(models.Model):
    country = models.ForeignKey(Country, related_name="faqs", on_delete=models.CASCADE)
    question = models.TextField()
    answer = models.TextField()

    def __str__(self):
        return f"FAQ for {self.country.name}: {self.question[:50]}{'...' if len(self.question) > 50 else ''}"

class CountryOverview(models.Model):
    country = models.OneToOneField(Country, related_name="overview", on_delete=models.CASCADE)
    capital = models.CharField(max_length=100)
    population = models.CharField(max_length=100)
    currency = models.CharField(max_length=50)
    language = models.CharField(max_length=100)
    timezone = models.CharField(max_length=50)
    calling_code = models.CharField(max_length=20)
    electricity = models.TextField()

    def __str__(self):
        return f"Overview of {self.country.name}"

class CountryLearnMoreTopic(models.Model):
    country = models.ForeignKey(Country, related_name="learn_more_topics", on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to="learn_more_images/", blank=True, null=True)
    order = models.PositiveIntegerField(default=0)  # for ordering topics

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.title} - {self.country.name}"
    

class TravelDealDate(models.Model):
    travel_deal = models.ForeignKey(TravelDeal, related_name="dates", on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    language = models.CharField(max_length=100)
    guaranteed = models.BooleanField(default=False)
    rooms = models.CharField(max_length=100)
    original_price = models.CharField(max_length=50, blank=True, null=True)  # in €
    discounted_price = models.CharField(max_length=50)  # in €
    discount_percent = models.CharField(max_length=10, blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.original_price and self.discounted_price:
            try:
                original = float(self.original_price.replace(",", "").replace("€", "").strip())
                discounted = float(self.discounted_price.replace(",", "").replace("€", "").strip())
                if original > 0 and discounted < original:
                    percent = round((original - discounted) / original * 100)
                    self.discount_percent = f"{percent}%"
                else:
                    self.discount_percent = None
            except ValueError:
                raise ValidationError("Prices must be numeric.")
        else:
            self.discount_percent = None

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.travel_deal.title} ({self.start_date} → {self.end_date})"