import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Book, UserNote
from conftest import TEST_PASSWORD, TEST_PASSWORD_STRONG


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    return User.objects.create_user(username='testuser', password=TEST_PASSWORD)


@pytest.fixture
def book(db):
    return Book.objects.create(
        title='Test Book',
        author='Test Author',
        description='Test Description',
        isbn='1234567890123',
        page_count=200,
        genre='Fiction'
    )


@pytest.fixture
def note(db, user, book):
    return UserNote.objects.create(
        user=user,
        book=book,
        content='Test note content'
    )


class TestBookModel:
    def test_book_creation(self, book):
        assert book.title == 'Test Book'
        assert book.author == 'Test Author'
        assert str(book) == 'Test Book by Test Author'

    @pytest.mark.django_db
    def test_book_ordering(self):
        Book.objects.all().delete()
        Book.objects.create(title='Z Book', author='Author', isbn='1234567890125')
        Book.objects.create(title='A Book', author='Author', isbn='1234567890124')
        books = list(Book.objects.all())
        assert books[0].title == 'A Book'


class TestUserNoteModel:
    def test_note_creation(self, note, user, book):
        assert note.content == 'Test note content'
        assert note.user == user
        assert note.book == book


class TestAuthentication:
    @pytest.mark.django_db
    def test_user_registration(self, api_client):
        user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': TEST_PASSWORD_STRONG,
            'password_confirm': TEST_PASSWORD_STRONG
        }
        response = api_client.post('/api/v1/auth/register/', user_data)
        assert response.status_code == status.HTTP_201_CREATED
        assert 'auth_token' in response.cookies
        assert response.data['user']['username'] == 'testuser'

    @pytest.mark.django_db
    def test_user_registration_password_mismatch(self, api_client):
        user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': TEST_PASSWORD_STRONG,
            'password_confirm': 'wrongpassword'
        }
        response = api_client.post('/api/v1/auth/register/', user_data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    @pytest.mark.django_db
    def test_user_login(self, api_client):
        User.objects.create_user(username='testuser', password=TEST_PASSWORD)
        response = api_client.post('/api/v1/auth/login/', {
            'username': 'testuser',
            'password': TEST_PASSWORD
        })
        assert response.status_code == status.HTTP_200_OK
        assert 'auth_token' in response.cookies

    @pytest.mark.django_db
    def test_user_login_invalid_credentials(self, api_client):
        response = api_client.post('/api/v1/auth/login/', {
            'username': 'wronguser',
            'password': 'wrongpass'
        })
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestBookAPI:
    def test_list_books(self, api_client, book):
        response = api_client.get('/api/v1/books/')
        assert response.status_code == status.HTTP_200_OK

    def test_retrieve_book(self, api_client, book):
        response = api_client.get(f'/api/v1/books/{book.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == 'Test Book'

    def test_search_books(self, api_client, book):
        response = api_client.get('/api/v1/books/?search=Test')
        assert response.status_code == status.HTTP_200_OK

    def test_filter_books_by_author(self, api_client, book):
        response = api_client.get('/api/v1/books/?author=Test Author')
        assert response.status_code == status.HTTP_200_OK

    def test_filter_books_by_genre(self, api_client, book):
        response = api_client.get('/api/v1/books/?genre=Fiction')
        assert response.status_code == status.HTTP_200_OK

    @pytest.mark.django_db
    def test_combined_filters(self, api_client, book):
        Book.objects.create(title='Another Book', author='Test Author', isbn='1234567890124', genre='Sci-Fi')
        response = api_client.get('/api/v1/books/?search=Test&author=Test Author&genre=Fiction')
        assert response.status_code == status.HTTP_200_OK
        results = response.data.get('results', response.data)
        assert len(results) == 1
        assert results[0]['title'] == 'Test Book'


class TestUserNoteAPI:
    def test_create_note_unauthenticated(self, api_client, book):
        response = api_client.post('/api/v1/notes/', {
            'book': book.id,
            'content': 'Test note'
        })
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_note_authenticated(self, api_client, user, book):
        api_client.force_authenticate(user=user)
        response = api_client.post('/api/v1/notes/', {
            'book': book.id,
            'content': 'Test note'
        })
        assert response.status_code == status.HTTP_201_CREATED

    def test_list_user_notes(self, api_client, user, book):
        api_client.force_authenticate(user=user)
        UserNote.objects.create(user=user, book=book, content='Note 1')
        response = api_client.get('/api/v1/notes/')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1

    def test_update_note(self, api_client, user, book):
        api_client.force_authenticate(user=user)
        note = UserNote.objects.create(user=user, book=book, content='Original')
        response = api_client.patch(f'/api/v1/notes/{note.id}/', {'content': 'Updated'})
        assert response.status_code == status.HTTP_200_OK
        assert response.data['content'] == 'Updated'

    def test_delete_note(self, api_client, user, book):
        api_client.force_authenticate(user=user)
        note = UserNote.objects.create(user=user, book=book, content='To delete')
        response = api_client.delete(f'/api/v1/notes/{note.id}/')
        assert response.status_code == status.HTTP_204_NO_CONTENT

    @pytest.mark.django_db
    def test_user_cannot_see_other_users_notes(self, api_client, user, book):
        other_user = User.objects.create_user(username='other', password=TEST_PASSWORD)
        UserNote.objects.create(user=other_user, book=book, content='Other note')
        api_client.force_authenticate(user=user)
        response = api_client.get('/api/v1/notes/')
        assert len(response.data) == 0
