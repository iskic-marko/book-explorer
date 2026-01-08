from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Book, UserNote


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class UserNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNote
        fields = ['id', 'book', 'content', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class BookListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'genre', 'published_date', 'cover_image_url']


class BookDetailSerializer(serializers.ModelSerializer):
    user_notes = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'description', 'isbn',
            'published_date', 'page_count', 'genre', 'cover_image_url',
            'created_at', 'updated_at', 'user_notes'
        ]

    def get_user_notes(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            notes = obj.notes.filter(user=request.user)
            return UserNoteSerializer(notes, many=True).data
        return []
