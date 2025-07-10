# payments/urls.py
from django.urls import path
from .views import (
    CreatePaymentIntentView,
    VerifyPayPalPaymentView,
    BookingPaymentUpdateAPIView,
)

urlpatterns = [
    path('stripe/create-intent/', CreatePaymentIntentView.as_view(), name='create-payment-intent'),
    path('paypal/verify/', VerifyPayPalPaymentView.as_view(), name='verify-paypal-payment'),
    path('bookings/<int:pk>/update/', BookingPaymentUpdateAPIView.as_view(), name='booking-payment-update'),
]
