from django.urls import path
from .views import (
    BlogListCreateView,
    BlogDetailView,
    CommentListCreateByBlogView,
    CommentRetrieveUpdateDestroyView,
    toggle_like,
    toggle_comment_like,
    CategoryListView,
)

urlpatterns = [
    path('', BlogListCreateView.as_view(), name='blog-list-create'),
    path('<slug:slug>/', BlogDetailView.as_view(), name='blog-detail'),

    path('<int:blog_id>/comments/', CommentListCreateByBlogView.as_view(), name='blog-comments'),
    path('comments/<int:pk>/', CommentRetrieveUpdateDestroyView.as_view(), name='comment-detail'),

    path('<int:blog_id>/toggle-like/', toggle_like, name='toggle-blog-like'),
    path('comments/<int:comment_id>/toggle-like/', toggle_comment_like, name='toggle-comment-like'),

    path('categories/', CategoryListView.as_view(), name='category-list'),
]
