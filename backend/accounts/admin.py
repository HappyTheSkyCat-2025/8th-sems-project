from django.contrib import admin

# Register your models here.
from .models import User, EmergencyContact

admin.site.register(User)
admin.site.register(EmergencyContact)
