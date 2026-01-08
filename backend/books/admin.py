from django.contrib import admin
from .models import Book, UserNote


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'genre', 'published_date')
    list_filter = ('genre',)
    search_fields = ('title', 'author')


@admin.register(UserNote)
class UserNoteAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'created_at')
    list_filter = ('user', 'book')
    search_fields = ('content',)
