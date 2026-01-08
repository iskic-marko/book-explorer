from django.conf import settings
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token


class CookieTokenAuthentication(TokenAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get(settings.AUTH_COOKIE_NAME)
        if not token:
            return None

        try:
            token_obj = Token.objects.select_related('user').get(key=token)
        except Token.DoesNotExist:
            return None

        return (token_obj.user, token_obj)

    def enforce_csrf(self, request):
        # CSRF not needed for token auth - token itself is the proof
        return
