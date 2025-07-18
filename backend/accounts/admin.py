from django.contrib import admin

# Register your models here.
from .models import User, EmergencyContact, UserOTP

admin.site.register(User)
admin.site.register(UserOTP)
admin.site.register(EmergencyContact)
