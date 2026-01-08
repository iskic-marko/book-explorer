from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'books', views.BookViewSet, basename='book')
router.register(r'notes', views.UserNoteViewSet, basename='note')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', views.register_user, name='register'),
    path('auth/login/', views.login_user, name='login'),
    path('auth/logout/', views.logout_user, name='logout'),
    path('auth/me/', views.current_user, name='current_user'),
    path('health/', views.health_check, name='health_check'),
]
