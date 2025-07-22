from rest_framework import serializers
from .models import Booking, TravelDeal, TravelDealDate
from destinations.serializers import TravelDealSerializer, TravelDealDateSerializer


class BookingSerializer(serializers.ModelSerializer):
    # Nested serializers for read operations (frontend display)
    travel_deal = TravelDealSerializer(read_only=True)
    date_option = TravelDealDateSerializer(read_only=True)

    # Accept foreign keys as IDs for write operations
    travel_deal_id = serializers.PrimaryKeyRelatedField(
        queryset=TravelDeal.objects.all(),
        write_only=True,
        source='travel_deal'
    )
    date_option_id = serializers.PrimaryKeyRelatedField(
        queryset=TravelDealDate.objects.all(),
        write_only=True,
        source='date_option'
    )

    class Meta:
        model = Booking
        fields = [
            'id',
            'user',

            # Nested read-only fields
            'travel_deal',
            'date_option',

            # Write-only foreign key IDs
            'travel_deal_id',
            'date_option_id',

            # Personal details
            'full_name',
            'email',
            'phone',
            'address_line1',
            'address_line2',
            'town',
            'state',
            'postcode',
            'country',

            # Booking specifics
            'travellers',
            'room_option',
            'add_transfer',
            'add_nights',
            'flight_help',
            'donation',

            # Payment info
            'payment_method',
            'payment_status',
            'payment_amount',
            'transaction_id',
            'payment_date',

            # Booking status and timestamps
            'status',
            'created_at',
        ]
        read_only_fields = [
            'id',
            'created_at',
            'payment_date',
            'transaction_id',
            'payment_status',
        ]
