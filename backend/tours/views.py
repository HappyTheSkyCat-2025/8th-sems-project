from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Tour, TourRating, Booking
from .serializers import TourSerializer, TourRatingSerializer, BookingSerializer

class TourListAPIView(generics.ListAPIView):
    queryset = Tour.objects.all().order_by('id')
    serializer_class = TourSerializer

    def get_serializer_context(self):
        return {'request': self.request}

class TourDetailAPIView(generics.RetrieveAPIView):
    queryset = Tour.objects.all()
    serializer_class = TourSerializer

    def get_serializer_context(self):
        return {'request': self.request}

class UserBookingsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        bookings = Booking.objects.filter(user=request.user).select_related('tour')
        serializer = BookingSerializer(bookings, many=True, context={"request": request})
        return Response(serializer.data)

class BookingCreateAPIView(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BookingDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        booking = self.get_object()
        booking.status = 'cancelled'
        booking.cancellation_reason = request.data.get('cancellation_reason', '')
        booking.save()
        return Response({"detail": "Booking cancelled successfully."}, status=200)

class BookingByTourAPIView(generics.GenericAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, tour_id):
        try:
            booking = Booking.objects.get(user=request.user, tour__id=tour_id)
            serializer = self.get_serializer(booking)
            return Response(serializer.data)
        except Booking.DoesNotExist:
            return Response({"detail": "Booking not found."}, status=404)

class TourRatingCreateUpdateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, tour_id):
        user = request.user
        rating_value = request.data.get('rating')

        if not rating_value or not (1 <= int(rating_value) <= 5):
            return Response({'error': 'Rating must be between 1 and 5.'}, status=400)

        tour = get_object_or_404(Tour, id=tour_id)

        rating_obj, created = TourRating.objects.update_or_create(
            user=user, tour=tour,
            defaults={'rating': rating_value}
        )
        serializer = TourRatingSerializer(rating_obj)
        return Response(serializer.data, status=201)
