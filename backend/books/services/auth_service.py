import logging
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework.authtoken.models import Token

logger = logging.getLogger(__name__)


class AuthenticationError(Exception):
    pass


class RegistrationError(Exception):
    def __init__(self, errors):
        self.errors = errors


class AuthService:
    def register(self, username: str, email: str, password: str) -> tuple[User, Token]:
        try:
            validate_password(password)
        except ValidationError as e:
            raise RegistrationError({'password': list(e.messages)})

        if User.objects.filter(username=username).exists():
            raise RegistrationError({'username': ['Username already exists.']})

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        token, _ = Token.objects.get_or_create(user=user)
        logger.info(f"User registered: {username}")
        return user, token

    def login(self, username: str, password: str) -> tuple[User, Token]:
        if not username or not password:
            raise AuthenticationError('Please provide both username and password.')

        user = authenticate(username=username, password=password)
        if not user:
            logger.warning(f"Login failed for user: {username}")
            raise AuthenticationError('Invalid credentials.')

        token, _ = Token.objects.get_or_create(user=user)
        logger.info(f"User logged in: {username}")
        return user, token

    def logout(self, user: User) -> None:
        if hasattr(user, 'auth_token'):
            user.auth_token.delete()
            logger.info(f"User logged out: {user.username}")
