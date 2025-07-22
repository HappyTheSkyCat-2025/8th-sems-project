from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user', 'travel_deal', 'date_option', 'full_name', 'email',
        'payment_status', 'payment_method', 'payment_amount', 'status', 'created_at'
    )
    list_filter = ('payment_status', 'payment_method', 'status', 'created_at')
    search_fields = ('full_name', 'email', 'phone', 'user__username', 'travel_deal__title')
    ordering = ('-created_at',)

