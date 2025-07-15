from django.urls import path
from .views import (
    BookingCreateAPIView,
    BookingRetrieveAPIView,
    BookingUpdateAPIView,
    BookingPaymentUpdateAPIView,
    CreatePaymentIntentView,
    VerifyPayPalPaymentView,
)

urlpatterns = [
    path("bookings/create/", BookingCreateAPIView.as_view(), name="booking-create"),
    path("bookings/<int:pk>/", BookingRetrieveAPIView.as_view(), name="booking-detail"),
    path('bookings/<int:pk>/update/', BookingUpdateAPIView.as_view(), name='booking-update'),
    path("bookings/<int:pk>/update-payment/", BookingPaymentUpdateAPIView.as_view(), name="booking-payment-update"),
    path("stripe/create-intent/", CreatePaymentIntentView.as_view(), name="create-stripe-intent"),
    path("paypal/verify/", VerifyPayPalPaymentView.as_view(), name="verify-paypal"),
]
