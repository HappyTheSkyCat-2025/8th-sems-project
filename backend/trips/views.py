from rest_framework import generics, filters, permissions
from django_filters.rest_framework import DjangoFilterBackend
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from io import BytesIO
from rest_framework.views import APIView
from .models import Trip
from .serializers import TripSerializer

class TripListCreateView(generics.ListCreateAPIView):
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['start_date', 'end_date', 'budget']
    search_fields = ['title', 'destinations']
    ordering_fields = ['start_date', 'end_date', 'budget']
    ordering = ['start_date']

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TripDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user)

class ExportTripPDFView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            trip = Trip.objects.get(pk=pk, user=request.user)
        except Trip.DoesNotExist:
            return HttpResponse(status=404)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="trip_{trip.id}.pdf"'

        p = canvas.Canvas(response)
        p.setFont("Helvetica-Bold", 16)
        p.drawString(50, 800, f"Trip Title: {trip.title}")
        p.setFont("Helvetica", 12)
        p.drawString(50, 780, f"Dates: {trip.start_date} to {trip.end_date}")
        p.drawString(50, 760, f"Budget: ${trip.budget}")
        p.drawString(50, 740, "Destinations:")

        y = 720
        for dest in trip.destinations:
            city = dest.get('city', '')
            country = dest.get('country', '')
            p.drawString(70, y, f"- {city}, {country}")
            y -= 20

        p.drawString(50, y - 10, "Itinerary:")
        text = p.beginText(70, y - 30)
        for line in trip.itinerary.split('\n'):
            text.textLine(line)
        p.drawText(text)

        p.showPage()
        p.save()

        return response

class ExportTripQRView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        import qrcode
        from io import BytesIO
        try:
            trip = Trip.objects.get(pk=pk, user=request.user)
        except Trip.DoesNotExist:
            return HttpResponse(status=404)

        trip_url = request.build_absolute_uri(f'/api/trips/{trip.id}/')
        qr_img = qrcode.make(trip_url)

        buffer = BytesIO()
        qr_img.save(buffer)
        buffer.seek(0)

        return HttpResponse(buffer, content_type='image/png')
