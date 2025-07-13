from django.db import models
from django.utils.text import slugify

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
    image = models.URLField(blank=True)
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

class TravelDeal(models.Model):
    country = models.ForeignKey(Country, related_name="deals", on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    days = models.PositiveIntegerField()
    price = models.CharField(max_length=20)
    image = models.URLField(blank=True)
    themes = models.JSONField(default=list, blank=True)
    tag = models.CharField(max_length=50, blank=True)
    style = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"{self.title} - {self.country.name}"

class Review(models.Model):
    country = models.ForeignKey(Country, related_name="reviews", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    rating = models.IntegerField()
    content = models.TextField()
    travel_date = models.CharField(max_length=50)
    submitted_on = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.name} on {self.country.name} - {self.rating}/5"

class Article(models.Model):
    country = models.ForeignKey(Country, related_name="articles", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    description = models.TextField()
    image = models.URLField(blank=True)

    def __str__(self):
        return f"{self.title} ({self.country.name})"

class FAQ(models.Model):
    country = models.ForeignKey(Country, related_name="faqs", on_delete=models.CASCADE)
    question = models.TextField()
    answer = models.TextField()

    def __str__(self):
        return f"FAQ for {self.country.name}: {self.question[:50]}{'...' if len(self.question) > 50 else ''}"