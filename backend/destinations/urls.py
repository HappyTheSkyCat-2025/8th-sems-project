from django.urls import path
from . import views

urlpatterns = [
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
    path('travel-deals/', views.TravelDealListCreateAPIView.as_view(), name='travel-deal-list'),
    path('travel-deals/<int:pk>/', views.TravelDealRetrieveUpdateDestroyAPIView.as_view(), name='travel-deal-detail'),

    # === Reviews CRUD ===
    path('reviews/', views.ReviewListCreateAPIView.as_view(), name='review-list'),
    path('reviews/<int:pk>/', views.ReviewRetrieveUpdateDestroyAPIView.as_view(), name='review-detail'),

    # === Articles CRUD ===
    path('articles/', views.ArticleListCreateAPIView.as_view(), name='article-list'),
    path('articles/<int:pk>/', views.ArticleRetrieveUpdateDestroyAPIView.as_view(), name='article-detail'),

    # === FAQs CRUD ===
    path('faqs/', views.FAQListCreateAPIView.as_view(), name='faq-list'),
    path('faqs/<int:pk>/', views.FAQRetrieveUpdateDestroyAPIView.as_view(), name='faq-detail'),

    # === Public Read-Only Destinations API ===
    path("", views.DestinationsAPIView.as_view(), name="destinations-api"),

    
    path('country-overview/', views.CountryOverviewListCreateAPIView.as_view(), name='countryoverview-listcreate'),
    path('country-overview/<int:pk>/', views.CountryOverviewRetrieveUpdateDestroyAPIView.as_view(), name='countryoverview-detail'),

    path('learn-more-topic/', views.CountryLearnMoreTopicListCreateAPIView.as_view(), name='learnmoretopic-listcreate'),
    path('learn-more-topic/<int:pk>/', views.CountryLearnMoreTopicRetrieveUpdateDestroyAPIView.as_view(), name='learnmoretopic-detail'),
]
