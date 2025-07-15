from django.urls import path
from . import views

urlpatterns = [
    # Admin Stats View
    path('admin/stats/', views.AdminStatsView.as_view(), name='admin-stats'),

    # === Regions CRUD ===
    path('regions/', views.RegionListCreateAPIView.as_view(), name='region-list'),
    path('regions/<int:pk>/', views.RegionRetrieveUpdateDestroyAPIView.as_view(), name='region-detail'),

    # === Countries CRUD ===
    path('countries/', views.CountryListCreateAPIView.as_view(), name='country-list'),
    path('countries/<slug:slug>/', views.CountryRetrieveUpdateDestroyAPIView.as_view(), name='country-detail'),

    # === Travel Types CRUD ===
    path('travel-types/', views.TravelTypeListCreateAPIView.as_view(), name='travel-type-list'),
    path('travel-types/<int:pk>/', views.TravelTypeRetrieveUpdateDestroyAPIView.as_view(), name='travel-type-detail'),

    # === Deal Categories (Deals) CRUD ===
    path('deals/', views.DealCategoryListCreateAPIView.as_view(), name='deal-category-list'),
    path('deals/<int:pk>/', views.DealCategoryRetrieveUpdateDestroyAPIView.as_view(), name='deal-category-detail'),

    # === Travel Deals CRUD ===
    path('countries/<slug:slug>/travel-deals/', views.TravelDealListCreateAPIView.as_view(), name='travel-deal-list'),
    path('countries/<slug:country_slug>/travel-deals/<slug:slug>/', views.TravelDealRetrieveUpdateDestroyAPIView.as_view(), name='travel-deal-detail'),

    # === Reviews CRUD ===
    path('countries/<slug:country_slug>/travel-deals/<slug:deal_slug>/reviews/', views.ReviewListCreateAPIView.as_view(), name='review-list'),
    path('countries/<slug:country_slug>/travel-deals/<slug:deal_slug>/reviews/<int:pk>/', views.ReviewRetrieveUpdateDestroyAPIView.as_view(), name='review-detail'),

    # === Articles CRUD ===
    path('articles/', views.ArticleListCreateAPIView.as_view(), name='article-list'),
    path('articles/<int:pk>/', views.ArticleRetrieveUpdateDestroyAPIView.as_view(), name='article-detail'),

    # === FAQs CRUD ===
    path('countries/<slug:slug>/faqs/', views.FAQListCreateAPIView.as_view(), name='faq-list'),
    path('countries/<slug:country_slug>/faqs/<int:pk>/', views.FAQRetrieveUpdateDestroyAPIView.as_view(), name='faq-detail'),

    # === Public Read-Only Destinations API ===
    path("", views.DestinationsAPIView.as_view(), name="destinations-api"),

    
    path('countries/<slug:country_slug>/overview/', views.CountryOverviewListCreateAPIView.as_view(), name='countryoverview-listcreate'),
    path('countries/<slug:country_slug>/overview/<int:pk>/', views.CountryOverviewRetrieveUpdateDestroyAPIView.as_view(), name='countryoverview-detail'),

    path('countries/<slug:country_slug>/learn-more-topics/', views.CountryLearnMoreTopicListCreateAPIView.as_view(), name='learnmoretopic-listcreate'),
    path('countries/<slug:country_slug>/learn-more-topics/<int:pk>/', views.CountryLearnMoreTopicRetrieveUpdateDestroyAPIView.as_view(), name='learnmoretopic-detail'),
]
