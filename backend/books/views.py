from django.conf import settings
from rest_framework import viewsets, status, serializers
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django_ratelimit.decorators import ratelimit
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter

from .models import Book
from .serializers import (
    BookListSerializer, BookDetailSerializer, UserNoteSerializer,
    UserSerializer, UserRegistrationSerializer
)
from .services import auth_service, note_service
from .services.auth_service import AuthenticationError, RegistrationError
from .services.note_service import NoteNotFoundError, NotePermissionError
from django.db import connection


def set_auth_cookie(response, token):
    response.set_cookie(
        settings.AUTH_COOKIE_NAME,
        token,
        max_age=settings.AUTH_COOKIE_MAX_AGE,
        httponly=settings.AUTH_COOKIE_HTTPONLY,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
    )
    return response


def clear_auth_cookie(response):
    response.delete_cookie(settings.AUTH_COOKIE_NAME)
    return response


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        user, token = auth_service.register(
            username=serializer.validated_data['username'],
            email=serializer.validated_data.get('email', ''),
            password=serializer.validated_data['password']
        )
        response = Response({'user': UserSerializer(user).data}, status=status.HTTP_201_CREATED)
        return set_auth_cookie(response, token.key)
    except RegistrationError as e:
        return Response(e.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    request={'application/json': {'type': 'object', 'properties': {'username': {'type': 'string'}, 'password': {'type': 'string'}}, 'required': ['username', 'password']}},
    responses={200: UserSerializer}
)
@ratelimit(key='ip', rate='5/5m', method='POST', block=True)
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    try:
        user, token = auth_service.login(
            username=request.data.get('username'),
            password=request.data.get('password')
        )
        response = Response({'user': UserSerializer(user).data})
        return set_auth_cookie(response, token.key)
    except AuthenticationError as e:
        return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    auth_service.logout(request.user)
    response = Response({'message': 'Successfully logged out.'})
    return clear_auth_cookie(response)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    return Response(UserSerializer(request.user).data)


from rest_framework.pagination import PageNumberPagination


class BookPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100


@extend_schema_view(
    list=extend_schema(
        parameters=[
            OpenApiParameter(name='search', description='Search by title or author', type=str),
            OpenApiParameter(name='author', description='Filter by author', type=str),
            OpenApiParameter(name='genre', description='Filter by genre', type=str),
            OpenApiParameter(name='ordering', description='Sort by field (title, author, published_date, page_count)', type=str),
            OpenApiParameter(name='page', description='Page number', type=int),
        ]
    )
)
class BookViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Book.objects.all()
    pagination_class = BookPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['author', 'genre']
    search_fields = ['title', 'author']
    ordering_fields = ['title', 'author', 'published_date', 'page_count']
    ordering = ['title']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BookDetailSerializer
        return BookListSerializer


class UserNoteViewSet(viewsets.ModelViewSet):
    serializer_class = UserNoteSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        book_id = self.request.query_params.get('book')
        return note_service.get_user_notes(self.request.user, book_id)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        try:
            note = note_service.update_note(
                user=self.request.user,
                note_id=self.kwargs['pk'],
                content=serializer.validated_data['content']
            )
            serializer.instance = note
        except (NoteNotFoundError, NotePermissionError) as e:
            raise serializers.ValidationError(str(e))

    def perform_destroy(self, instance):
        try:
            note_service.delete_note(self.request.user, instance.id)
        except (NoteNotFoundError, NotePermissionError) as e:
            raise serializers.ValidationError(str(e))


@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def health_check(request):
    try:
        connection.ensure_connection()
        db_status = 'healthy'
    except Exception:
        db_status = 'unhealthy'
    
    return Response({
        'status': 'healthy' if db_status == 'healthy' else 'unhealthy',
        'database': db_status,
    })
