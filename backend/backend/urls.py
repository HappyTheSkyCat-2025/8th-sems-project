from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/accounts/', include('accounts.urls')),
    path('api/destinations/', include('destinations.urls')),

    path('api/contacts/', include('contacts.urls')),
    path('api/trips/', include('trips.urls')),
    path('api/blogs/', include('blogs.urls')),
    path('api/tours/', include('tours.urls')),
    path('api/utils/', include('utils.urls')),
    path('api/payments/', include('payments.urls')),
]
