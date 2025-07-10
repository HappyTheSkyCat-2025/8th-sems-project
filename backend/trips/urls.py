from django.urls import path
from .views import (
    TripListCreateView,
    TripDetailView,
    ExportTripPDFView,
    ExportTripQRView,
)

urlpatterns = [
    path('', TripListCreateView.as_view(), name='trip-list-create'),
    path('<int:pk>/', TripDetailView.as_view(), name='trip-detail'),
    path('<int:pk>/export/pdf/', ExportTripPDFView.as_view(), name='export-trip-pdf'),
    path('<int:pk>/export/qr/', ExportTripQRView.as_view(), name='export-trip-qr'),
]
