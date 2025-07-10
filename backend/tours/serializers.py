from rest_framework import serializers
from django.conf import settings
from .models import Tour, TourRating, Booking

class TourSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    bookings_count = serializers.SerializerMethodField()

    class Meta:
        model = Tour
        fields = [
            'id', 'title', 'city', 'country', 'country_code',
            'days', 'price', 'image', 'type',
            'activities', 'description', 'admission_fee', 'insurance_coverage',
            'language', 'hotel_transfer', 'created_at',
            'average_rating', 'bookings_count',
        ]

    def get_average_rating(self, obj):
        ratings = obj.ratings.all()
        if ratings.exists():
            return round(sum(r.rating for r in ratings) / ratings.count(), 1)
        return 0

    def get_bookings_count(self, obj):
        return obj.bookings.count()

class TourRatingSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = TourRating
        fields = ['id', 'user', 'rating', 'created_at']

    def get_user(self, obj):
        return {'id': obj.user.id, 'username': obj.user.username}

class TourRatingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourRating
        fields = ['rating']

class BookingSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    tour = serializers.PrimaryKeyRelatedField(queryset=Tour.objects.all())
    tour__title = serializers.CharField(source='tour.title', read_only=True)
    tour__price = serializers.DecimalField(source='tour.price', read_only=True, max_digits=10, decimal_places=2)

    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'tour', 'people', 'name', 'email', 'phone', 'booking_date',
            'status', 'booked_at', 'tour__title', 'tour__price',
            'payment_method', 'payment_status', 'payment_amount',
            'payment_date', 'transaction_id',
            'cancellation_reason', 'refunded_amount', 'refund_date', 'refund_reason',
        ]
        read_only_fields = ['payment_status', 'payment_date', 'transaction_id', 'refund_date', 'booked_at']

    def get_user(self, obj):
        return {'id': obj.user.id, 'username': obj.user.username}
