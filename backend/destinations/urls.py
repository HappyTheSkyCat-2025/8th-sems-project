from django.urls import path
from . import views

urlpatterns = [
    # Region CRUD
    path('regions/', views.RegionListCreateAPIView.as_view(), name='region-list'),
    path('regions/<int:pk>/', views.RegionRetrieveUpdateDestroyAPIView.as_view(), name='region-detail'),

    # Country CRUD
    path('countries/', views.CountryListCreateAPIView.as_view(), name='country-list'),
    path('countries/<slug:slug>/', views.CountryRetrieveUpdateDestroyAPIView.as_view(), name='country-detail'),

    # Travel Deal CRUD
    path('deals/', views.TravelDealListCreateAPIView.as_view(), name='deal-list'),
    path('deals/<int:pk>/', views.TravelDealRetrieveUpdateDestroyAPIView.as_view(), name='deal-detail'),

    # Review CRUD
    path('reviews/', views.ReviewListCreateAPIView.as_view(), name='review-list'),
    path('reviews/<int:pk>/', views.ReviewRetrieveUpdateDestroyAPIView.as_view(), name='review-detail'),

    # Article CRUD
    path('articles/', views.ArticleListCreateAPIView.as_view(), name='article-list'),
    path('articles/<int:pk>/', views.ArticleRetrieveUpdateDestroyAPIView.as_view(), name='article-detail'),

    # FAQ CRUD
    path('faqs/', views.FAQListCreateAPIView.as_view(), name='faq-list'),
    path('faqs/<int:pk>/', views.FAQRetrieveUpdateDestroyAPIView.as_view(), name='faq-detail'),

    # Public read-only destinations API
    path("", views.DestinationsAPIView.as_view(), name="destinations-api"),
]
