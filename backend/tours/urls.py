# tours/urls.py
from django.urls import path
from .views import (
    TourListAPIView,
    TourDetailAPIView,
    UserBookingsAPIView,
    BookingCreateAPIView,
    BookingDetailAPIView,
    BookingByTourAPIView,
    TourRatingCreateUpdateAPIView,
)

urlpatterns = [
    path('', TourListAPIView.as_view(), name='tour-list'),
    path('<int:pk>/', TourDetailAPIView.as_view(), name='tour-detail'),

    # Bookings
    path('bookings/', UserBookingsAPIView.as_view(), name='user-bookings'),
    path('bookings/create/', BookingCreateAPIView.as_view(), name='booking-create'),
    path('bookings/<int:pk>/', BookingDetailAPIView.as_view(), name='booking-detail'),
    path('bookings/tour/<int:tour_id>/', BookingByTourAPIView.as_view(), name='booking-by-tour'),

    # Tour rating
    path('<int:tour_id>/rate/', TourRatingCreateUpdateAPIView.as_view(), name='tour-rate'),
]
