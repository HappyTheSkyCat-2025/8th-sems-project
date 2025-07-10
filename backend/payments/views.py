import stripe
import requests
from django.conf import settings
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from tours.models import Booking
from tours.serializers import BookingSerializer

stripe.api_key = settings.STRIPE_SECRET_KEY

class CreatePaymentIntentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            amount = request.data.get("amount")
            currency = request.data.get("currency", "usd")

            if not amount:
                return Response({"error": "Amount is required"}, status=400)

            amount_in_cents = int(float(amount) * 100)

            intent = stripe.PaymentIntent.create(
                amount=amount_in_cents,
                currency=currency,
                payment_method_types=["card"],
                description="Tour Booking Payment",
                expand=["charges"],
            )

            return Response({
                "clientSecret": intent.client_secret,
                "paymentIntentId": intent.id
            })
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class VerifyPayPalPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        paypal_order_id = request.data.get('orderID')
        if not paypal_order_id:
            return Response({'error': 'orderID is required'}, status=400)

        access_token_url = 'https://api-m.sandbox.paypal.com/v1/oauth2/token'
        order_detail_url = f'https://api-m.sandbox.paypal.com/v2/checkout/orders/{paypal_order_id}'

        auth = (settings.PAYPAL_CLIENT_ID, settings.PAYPAL_SECRET)
        headers = {'Accept': 'application/json', 'Accept-Language': 'en_US'}
        data = {'grant_type': 'client_credentials'}
        auth_response = requests.post(access_token_url, headers=headers, data=data, auth=auth)
        access_token = auth_response.json().get('access_token')

        if not access_token:
            return Response({'error': 'Failed to get access token'}, status=500)

        headers = {'Authorization': f'Bearer {access_token}'}
        verify_response = requests.get(order_detail_url, headers=headers)
        verify_data = verify_response.json()

        if verify_data.get('status') == 'COMPLETED':
            return Response({'status': 'success', 'payer_id': verify_data['payer']['payer_id']})
        return Response({'error': 'Payment not completed'}, status=400)

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
