from django.contrib import admin
from .models import Category, Blog, Comment, Story

# -------------------------
# Category Admin
# -------------------------
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)


# -------------------------
# Blog Admin
# -------------------------
@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'category', 'created_at')
    search_fields = ('title', 'content', 'tags')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('likes',)


# -------------------------
# Comment Admin
# -------------------------
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'blog', 'created_at', 'is_reply')
    search_fields = ('author__username', 'text')
    list_filter = ('created_at',)

    def is_reply(self, obj):
        return obj.is_reply()
    is_reply.boolean = True
    is_reply.short_description = 'Is a Reply?'


admin.site.register(Story)