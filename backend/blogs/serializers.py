from rest_framework import serializers
from django.conf import settings
from .models import Category, Blog, Comment

# -------------------------
# Category Serializer
# -------------------------
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


# -------------------------
# Blog Serializer
# -------------------------
class BlogSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    is_liked = serializers.SerializerMethodField()
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Blog
        fields = [
            'id', 'title', 'slug', 'content', 'thumbnail', 'category',
            'created_at', 'updated_at', 'status', 'tags',
            'views', 'likes_count', 'is_liked', 'author',
        ]
        read_only_fields = [
            'slug', 'created_at', 'updated_at', 'views',
            'likes_count', 'is_liked', 'author',
        ]

    def get_author(self, obj):
        # Return minimal author info
        return {
            'id': obj.author.id,
            'username': obj.author.username,
        }

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False


# -------------------------
# Comment Serializer
# -------------------------
class CommentSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    blog = serializers.PrimaryKeyRelatedField(read_only=True)
    replies = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id', 'blog', 'author', 'text', 'created_at', 'parent',
            'replies', 'is_liked', 'likes_count',
        ]
        read_only_fields = [
            'blog', 'author', 'created_at', 'replies', 'is_liked', 'likes_count'
        ]

    def get_author(self, obj):
        return {
            'id': obj.author.id,
            'username': obj.author.username,
        }

    def get_replies(self, obj):
        queryset = obj.replies.all().order_by('created_at')
        return CommentSerializer(queryset, many=True, context=self.context).data

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

    def get_likes_count(self, obj):
        return obj.likes.count()
