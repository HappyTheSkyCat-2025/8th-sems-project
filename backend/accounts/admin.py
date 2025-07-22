from django.contrib import admin
from .models import User, UserOTP, EmergencyContact


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'username', 'nationality')
    search_fields = ('email', 'username')
    list_filter = ('nationality',)
    ordering = ('-id',)


@admin.register(UserOTP)
class UserOTPAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'otp', 'otp_type', 'created_at', 'expires_at', 'is_expired')
    list_filter = ('otp_type', 'created_at')
    search_fields = ('user__email', 'otp')
    ordering = ('-created_at',)

    def is_expired(self, obj):
        return obj.is_expired()
    is_expired.boolean = True


@admin.register(EmergencyContact)
class EmergencyContactAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'name', 'phone', 'email')
    search_fields = ('user__email', 'name', 'phone')
