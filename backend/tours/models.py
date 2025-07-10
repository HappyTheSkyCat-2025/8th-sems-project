from django.db import models
from django.conf import settings

class Tour(models.Model):
    TOUR_TYPES = [
        ('Luxury', 'Luxury'),
        ('Premium', 'Premium'),
        ('Normal', 'Normal'),
        ('Adventure', 'Adventure'),
        ('Cultural', 'Cultural'),
    ]

    title = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    country_code = models.CharField(max_length=2, blank=True, null=True)
    days = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    image = models.ImageField(upload_to='tours/')
    type = models.CharField(max_length=50, choices=TOUR_TYPES)
    activities = models.JSONField(default=list, blank=True)
    description = models.TextField(blank=True)
    admission_fee = models.BooleanField(default=False)
    insurance_coverage = models.CharField(max_length=100, default="Not Covered")
    language = models.CharField(max_length=100, default="English")
    hotel_transfer = models.BooleanField(default=False)
    capacity = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('title', 'city', 'country')

    def __str__(self):
        return self.title

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
        ('refunded', 'Refunded'),
        ('partial_refunded', 'Partial Refunded'),
    ]
    PAYMENT_METHODS = [
        ('paypal', 'PayPal'),
        ('stripe', 'Stripe'),
        ('cash', 'Cash'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name='bookings')
    people = models.PositiveIntegerField(default=1)
    name = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    booking_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    booked_at = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, null=True, blank=True)
    payment_status = models.CharField(max_length=20, default='pending')
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_date = models.DateTimeField(null=True, blank=True)
    transaction_id = models.CharField(max_length=100, null=True, blank=True)
    refunded_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    refund_date = models.DateTimeField(null=True, blank=True)
    refund_reason = models.TextField(blank=True, null=True)
    cancellation_reason = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('user', 'tour', 'booking_date')

    def __str__(self):
        return f"{self.user.username} booked {self.tour.title} on {self.booking_date}"

    @property
    def is_fully_paid(self):
        return self.payment_status == 'paid' and self.payment_amount >= (self.tour.price * self.people)

    @property
    def is_fully_refunded(self):
        return self.refunded_amount >= self.payment_amount and self.refund_date is not None

class TourRating(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name='ratings')
    rating = models.PositiveSmallIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'tour')

    def __str__(self):
        return f"{self.user.username} rated {self.tour.title} - {self.rating}"