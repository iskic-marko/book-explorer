import { Link } from 'react-router-dom';
import { useBooks } from '../hooks';
import BookCover from '../components/BookCover';

export default function BookListPage() {
  const { books, filters, authors, genres, isLoading, error, setFilters, clearFilters, totalPages, setPage } =
    useBooks();

  return (
    <div className="book-list-page">
      <h1>Explore Books</h1>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="search"
            placeholder="Search by title or author..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ search: e.target.value })}
            aria-label="Search books"
          />
        </div>

        <div className="filters">
          <select
            value={filters.author || ''}
            onChange={(e) => setFilters({ author: e.target.value })}
            aria-label="Filter by author"
          >
            <option value="">All Authors</option>
            {authors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>

          <select
            value={filters.genre || ''}
            onChange={(e) => setFilters({ genre: e.target.value })}
            aria-label="Filter by genre"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>

          <select
            value={filters.ordering || 'title'}
            onChange={(e) => setFilters({ ordering: e.target.value })}
            aria-label="Sort order"
          >
            <option value="title">Sort by Title (A-Z)</option>
            <option value="-title">Sort by Title (Z-A)</option>
            <option value="author">Sort by Author (A-Z)</option>
            <option value="-author">Sort by Author (Z-A)</option>
            <option value="-published_date">Sort by Date (Newest)</option>
            <option value="published_date">Sort by Date (Oldest)</option>
          </select>

          <button onClick={clearFilters} className="btn btn-secondary">
            Clear Filters
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div className="loading">Loading books...</div>
      ) : books.length === 0 ? (
        <div className="no-results">No books found matching your criteria.</div>
      ) : (
        <>
          <div className="book-grid" data-testid="book-grid">
            {books.map((book) => (
              <Link
                to={`/books/${book.id}`}
                key={book.id}
                className="book-card"
                aria-label={`${book.title} by ${book.author}`}
              >
                <BookCover src={book.cover_image_url} alt={book.title} />
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p className="author">{book.author}</p>
                  {book.genre && <span className="genre-tag">{book.genre}</span>}
                </div>
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(filters.page - 1)}
                disabled={filters.page <= 1}
                className="btn btn-secondary"
              >
                Previous
              </button>
              <span className="page-info">
                Page {filters.page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(filters.page + 1)}
                disabled={filters.page >= totalPages}
                className="btn btn-secondary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
