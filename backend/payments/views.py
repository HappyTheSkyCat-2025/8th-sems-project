import stripe
import requests
from django.conf import settings
from django.utils import timezone
from rest_framework import status, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer

stripe.api_key = settings.STRIPE_SECRET_KEY

# --------------------------
# Booking CRUD Views
# --------------------------

class BookingCreateAPIView(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data['user'] = request.user.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class BookingRetrieveAPIView(generics.RetrieveAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)


class BookingUpdateAPIView(generics.UpdateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)


class BookingPaymentUpdateAPIView(generics.UpdateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        booking = self.get_object()
        data = request.data

        booking.payment_method = data.get("payment_method", booking.payment_method)
        booking.payment_status = "paid"
        booking.payment_date = timezone.now()
        booking.payment_amount = data.get("payment_amount", booking.payment_amount)
        booking.transaction_id = data.get("transaction_id", booking.transaction_id)
        booking.status = "confirmed"
        booking.save()

        serializer = self.get_serializer(booking)
        return Response(serializer.data)


# --------------------------
# Stripe Payment View
# --------------------------

class CreatePaymentIntentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            amount = request.data.get("amount")
            currency = request.data.get("currency", "eur")

            if not amount:
                return Response({"error": "Amount is required"}, status=status.HTTP_400_BAD_REQUEST)

            amount_in_cents = int(float(amount) * 100)

            intent = stripe.PaymentIntent.create(
                amount=amount_in_cents,
                currency=currency,
                payment_method_types=["card"],
                description="Travel Booking Payment",
                expand=["charges"],
            )

            return Response({
                "clientSecret": intent.client_secret,
                "paymentIntentId": intent.id,
            })

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# --------------------------
# PayPal Payment Verification View
# --------------------------

class VerifyPayPalPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('orderID')
        if not order_id:
            return Response({'error': 'orderID is required'}, status=status.HTTP_400_BAD_REQUEST)

        access_token_url = 'https://api-m.sandbox.paypal.com/v1/oauth2/token'
        order_url = f'https://api-m.sandbox.paypal.com/v2/checkout/orders/{order_id}'
        auth = (settings.PAYPAL_CLIENT_ID, settings.PAYPAL_SECRET)

        token_resp = requests.post(access_token_url, data={'grant_type': 'client_credentials'}, auth=auth)
        token = token_resp.json().get("access_token")

        if not token:
            return Response({'error': 'Failed to retrieve PayPal token'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        verify_resp = requests.get(order_url, headers={"Authorization": f"Bearer {token}"})
        data = verify_resp.json()

        if data.get("status") == "COMPLETED":
            return Response({"status": "success", "payer_id": data["payer"]["payer_id"]})

        return Response({"error": "Payment not completed"}, status=status.HTTP_400_BAD_REQUEST)
