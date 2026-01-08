# Book Explorer

A full-stack web application for exploring books, built with Django REST Framework (backend) and React (frontend).

## Features

- **User Authentication**: Register, login, and logout functionality
- **Book Browsing**: View a list of books with cover images, titles, authors, and genres
- **Book Details**: Detailed view of each book including description, page count, publication date, and ISBN
- **Personal Notes**: Authenticated users can create, edit, and delete personal notes for each book
- **Search**: Search books by title or author
- **Filtering**: Filter books by author or genre
- **Sorting**: Sort books by title, author, or publication date
- **Pagination**: Browse books with paginated results (12 per page)

## Project Structure

```
further/
├── backend/              # Django REST Framework API
│   ├── config/           # Django project settings
│   ├── books/            # Books app
│   │   ├── services/     # Business logic (AuthService, NoteService)
│   │   ├── models, views, serializers, tests
│   ├── requirements.txt
│   └── manage.py
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # Reusable components (Navbar, BookCover, ErrorBoundary)
│   │   ├── pages/        # Page components (BookList, BookDetail, Login, Register)
│   │   ├── stores/       # Zustand stores (auth, books)
│   │   ├── hooks/        # Custom hooks (useBooks, useBook)
│   │   ├── services/     # API service layer
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## Quick Start with Docker

```bash
docker-compose up
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ADMIN_USERNAME` | Default admin username | `admin` |
| `ADMIN_PASSWORD` | Default admin password | `admin` |
| `ADMIN_EMAIL` | Default admin email | `admin@example.com` |

**Note:** Change `ADMIN_PASSWORD` in production!
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/v1/
- API Docs: http://localhost:8000/api/v1/docs/

## Prerequisites (Manual Setup)

- Python 3.10+
- Node.js 20+ (required for Vite 7)
- npm

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations (this will also seed the database with initial books):
   ```bash
   python manage.py migrate
   ```

5. (Optional) Create a superuser for admin access:
   ```bash
   python manage.py createsuperuser
   ```

6. Start the development server:
   ```bash
   DJANGO_SECRET_KEY=dev-secret DEBUG=true python manage.py runserver
   ```
   
   For production, generate a key once and store it securely:
   ```bash
   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```

The API will be available at `http://localhost:8000/api/v1/`

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment (optional):
   ```bash
   cp .env.example .env
   # Edit .env to change API URL if needed
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173/`

## Running Tests

### Backend Tests
```bash
cd backend
source venv/bin/activate
pytest
```

The test suite includes:
- Model tests (Book, UserNote)
- Authentication tests (register, login)
- API tests (books listing, filtering, notes CRUD)

### Frontend Tests
```bash
cd frontend
npm run test:run
```

The test suite includes:
- Store tests (authStore, bookStore)

## API Endpoints

### Authentication

The API uses HttpOnly cookie-based authentication for security (prevents XSS token theft).

**Auth Flow:**
1. App load → `GET /api/v1/auth/me/` checks if user is already authenticated (cookie exists)
2. If not authenticated → user clicks login → `POST /api/v1/auth/login/`
3. Server sets `auth_token` HttpOnly cookie, browser includes it in subsequent requests
4. `POST /api/v1/auth/logout/` → Server clears the cookie

**Endpoints:**
- `POST /api/v1/auth/register/` - Register a new user
- `POST /api/v1/auth/login/` - Login (rate limited: 5 requests/5 min)
- `POST /api/v1/auth/logout/` - Logout (requires authentication)
- `GET /api/v1/auth/me/` - Get current user info (requires authentication)

**Note:** Frontend must use `credentials: 'include'` (fetch) or `withCredentials: true` (axios).

### Health Check
- `GET /api/v1/health/` - Returns API and database status (no auth required)

### Books
- `GET /api/v1/books/` - List all books (supports filtering, searching, sorting, pagination)
- `GET /api/v1/books/{id}/` - Get book details

Query parameters for books listing:
- `search` - Search by title or author
- `author` - Filter by exact author name
- `genre` - Filter by exact genre
- `ordering` - Sort by field (e.g., `title`, `-title`, `author`, `-published_date`)

### Notes (requires authentication)
- `GET /api/v1/notes/` - List user's notes
- `GET /api/v1/notes/?book={id}` - List notes for a specific book
- `POST /api/v1/notes/` - Create a new note
- `PATCH /api/v1/notes/{id}/` - Update a note
- `DELETE /api/v1/notes/{id}/` - Delete a note

### Error Response Format

All API errors return a consistent JSON structure:

```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Validation failed",
    "details": {
      "field_name": ["Error message"]
    }
  }
}
```

Error codes:
- `validation_error` (400) - Invalid input data
- `authentication_error` (401) - Invalid credentials or missing auth
- `permission_denied` (403) - Not authorized to access resource
- `not_found` (404) - Resource not found

## Seeded Book Data

The database is pre-populated with 13 classic books:

1. **1984** by George Orwell (Dystopian Fiction)
2. **To Kill a Mockingbird** by Harper Lee (Southern Gothic)
3. **The Great Gatsby** by F. Scott Fitzgerald (Literary Fiction)
4. **Pride and Prejudice** by Jane Austen (Romance)
5. **The Catcher in the Rye** by J.D. Salinger (Literary Fiction)
6. **One Hundred Years of Solitude** by Gabriel Garcia Marquez (Magical Realism)
7. **The Hobbit** by J.R.R. Tolkien (Fantasy)
8. **Brave New World** by Aldous Huxley (Dystopian Fiction)
9. **The Lord of the Rings** by J.R.R. Tolkien (Fantasy)
10. **Crime and Punishment** by Fyodor Dostoevsky (Psychological Fiction)
11. **The Brothers Karamazov** by Fyodor Dostoevsky (Philosophical Fiction)
12. **Don Quixote** by Miguel de Cervantes (Satire)
13. **War and Peace** by Leo Tolstoy (Historical Fiction)

## Design Decisions

### Backend

1. **Service Layer Pattern**: Business logic extracted into services (`AuthService`, `NoteService`) for better testability and reusability. Alternative approaches (fat views/models) would tightly couple logic to the HTTP layer.

2. **HttpOnly Cookie Authentication**: Prevents XSS token theft compared to localStorage. JWT was considered but unnecessary for a single-service app.

3. **Read-Only Book ViewSet**: Books are reference data managed via migrations/admin - public API is intentionally read-only.

4. **Django-Filter**: Declarative filtering vs manual query parameter parsing - cleaner and less error-prone.

### Frontend

1. **Zustand**: Chosen over Redux (too much boilerplate) and Context API (re-render issues). Offers minimal API with good scalability.

2. **Custom Hooks**: `useBooks`/`useBook` encapsulate data fetching, keeping components focused on rendering.

3. **useDeferredValue**: Built-in React 18 debouncing for search - no external dependencies needed.

### Challenges Solved

1. **CORS**: Configured django-cors-headers with `CORS_ALLOW_CREDENTIALS` for cookie-based auth.

2. **Note Ownership**: `get_queryset()` filters by `request.user` to scope all operations automatically.

3. **Seed Data**: Data migration chosen over fixtures (auto-runs with migrate, version-controlled, reversible).

4. **Error Consistency**: Custom exception handler normalizes all DRF errors to `{success, error: {code, message, details}}`.

## Dependencies

### Backend (requirements.txt)
- Django 6.0
- djangorestframework 3.16
- django-cors-headers 4.9
- django-filter 25.2

### Frontend (package.json)
- React 19
- Zustand 5.x (state management)
- react-router-dom 6.x
- axios 1.x
- Vite 7.x

## Available Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run test:run     # Run tests
npm run test:coverage # Run tests with coverage
```

## Production Considerations

- **Database**: The application uses SQLite for development. For production, switch to PostgreSQL or MySQL by updating `DATABASES` in `settings.py`.
- **Secret Key**: Set `DJANGO_SECRET_KEY` environment variable (required, app will not start without it).
- **Debug Mode**: `DEBUG` defaults to `False` (no action needed for production).
- **CORS**: Update `CORS_ALLOWED_ORIGINS` to match your production domain.
- **HTTPS**: Use HTTPS in production.
- **Cookie Settings**: Set `AUTH_COOKIE_SECURE = True` in production for HTTPS-only cookies.

## Future Improvements

### Features
- Book ratings and reviews system
- Reading list / favorites functionality
- Book cover image upload
- Social sharing

### Architecture
- **PostgreSQL**: Replace SQLite for production scalability
- **Redis**: Caching layer for book listings and session storage
- **Celery**: Background tasks (email notifications, image processing)
- **E2E Tests**: Playwright/Cypress for full user flow testing (key elements have `data-testid` attributes ready)
