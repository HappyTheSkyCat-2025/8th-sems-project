from django.conf import settings
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.contrib.auth import get_user_model
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.contrib.auth.password_validation import validate_password
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import UserOTP
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    ChangePasswordSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
)

User = get_user_model()

class GoogleLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response({"error": "Token missing"}, status=status.HTTP_400_BAD_REQUEST)

        # verify with Google
        try:
            idinfo = id_token.verify_oauth2_token(
                token, google_requests.Request(), settings.GOOGLE_CLIENT_ID
            )
        except ValueError:
            return Response({"error": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)

        email = idinfo["email"]
        username = idinfo.get("name", email.split("@")[0])

        user, created = User.objects.get_or_create(
            email=email,
            defaults={"username": username, "is_active": True},
        )
        if created:
            user.set_unusable_password()
            user.save()

        # issue JWTs
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {"id": user.id, "email": user.email, "username": user.username},
        })

# -------------------------------
# 🔐 Registration with OTP Email Verification
# -------------------------------


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            otp = get_random_string(length=6, allowed_chars='0123456789')
            UserOTP.objects.create(user=user, otp=otp, otp_type='email_verification')

            subject = "Your OTP Code"
            message = f"Hello {user.username},\n\nYour OTP code is: {otp}\n\nThank you!"
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [user.email]

            try:
                send_mail(subject, message, from_email, recipient_list, fail_silently=False)
            except Exception as e:
                user.delete()  # Remove user if email fails
                return Response(
                    {"error": f"Failed to send email: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            return Response({"message": "OTP sent to email"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------------
# OTP verification for email activation
# -------------------------------

class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        if not email or not otp:
            return Response({"error": "Email and OTP are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        otp_qs = UserOTP.objects.filter(user=user, otp=otp, otp_type='email_verification').order_by('-created_at')
        if not otp_qs.exists():
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        otp_obj = otp_qs.first()
        if otp_obj.is_expired():
            return Response({"error": "OTP expired"}, status=status.HTTP_400_BAD_REQUEST)

        if user.is_active:
            return Response({"message": "Account already activated"}, status=status.HTTP_200_OK)

        user.is_active = True
        user.is_email_verified = True  # Optional, if you track it separately
        user.save()

        UserOTP.objects.filter(user=user, otp_type='email_verification').delete()

        return Response({"message": "Account activated"}, status=status.HTTP_200_OK)


# -------------------------------
# 👤 User Profile (Get/Update)Email verified, account
# -------------------------------

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# -------------------------------
# 🔄 Change Password
# -------------------------------

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            if not user.check_password(old_password):
                return Response({"error": "Incorrect old password"}, status=status.HTTP_400_BAD_REQUEST)

            # Validate the new password strength
            try:
                validate_password(new_password, user=user)
            except Exception as e:
                return Response({"error": list(e)}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()

            return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------------
# 🔐 Password Reset via OTP
# -------------------------------

class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                # Prevent email enumeration by always responding success
                return Response({"message": "If that email is registered, an OTP has been sent."})

            otp = get_random_string(length=6, allowed_chars='0123456789')
            UserOTP.objects.create(user=user, otp=otp, otp_type='password_reset')

            subject = "Password Reset OTP"
            message = (
                f"Hello {user.username},\n\n"
                f"Your password reset OTP is: {otp}\nIt expires in 10 minutes.\n\n"
                f"If you didn't request this, please ignore this email."
            )
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [user.email]

            try:
                send_mail(subject, message, from_email, recipient_list, fail_silently=False)
            except Exception as e:
                return Response(
                    {"error": f"Failed to send email: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            return Response({"message": "If that email is registered, an OTP has been sent."})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']
            new_password = serializer.validated_data['new_password']

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"error": "Invalid email or OTP"}, status=status.HTTP_400_BAD_REQUEST)

            otp_qs = UserOTP.objects.filter(user=user, otp=otp, otp_type='password_reset').order_by('-created_at')
            if not otp_qs.exists():
                return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

            otp_obj = otp_qs.first()
            if otp_obj.is_expired():
                return Response({"error": "OTP expired"}, status=status.HTTP_400_BAD_REQUEST)

            # Validate new password strength
            try:
                validate_password(new_password, user=user)
            except Exception as e:
                return Response({"error": list(e)}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()

            UserOTP.objects.filter(user=user, otp_type='password_reset').delete()

            return Response({"message": "Password has been reset successfully."})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
