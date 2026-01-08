import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BookListPage from './BookListPage';

const mockSetPage = vi.fn();

vi.mock('../hooks', () => ({
  useBooks: () => ({
    books: [
      { id: 1, title: '1984', author: 'George Orwell', genre: 'Dystopian' },
      { id: 2, title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy' },
    ],
    filters: { search: '', author: '', genre: '', ordering: 'title', page: 1 },
    authors: ['George Orwell', 'J.R.R. Tolkien'],
    genres: ['Dystopian', 'Fantasy'],
    isLoading: false,
    error: null,
    totalPages: 3,
    setFilters: vi.fn(),
    setPage: mockSetPage,
    clearFilters: vi.fn(),
  }),
}));

const renderWithProviders = (component) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('BookListPage', () => {
  it('renders page title', () => {
    renderWithProviders(<BookListPage />);
    expect(screen.getByText('Explore Books')).toBeInTheDocument();
  });

  it('renders book cards', () => {
    renderWithProviders(<BookListPage />);
    expect(screen.getByText('1984')).toBeInTheDocument();
    expect(screen.getByText('The Hobbit')).toBeInTheDocument();
  });

  it('renders author names', () => {
    renderWithProviders(<BookListPage />);
    expect(screen.getAllByText('George Orwell').length).toBeGreaterThan(0);
    expect(screen.getAllByText('J.R.R. Tolkien').length).toBeGreaterThan(0);
  });

  it('renders filter controls', () => {
    renderWithProviders(<BookListPage />);
    expect(screen.getByLabelText('Search books')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by author')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by genre')).toBeInTheDocument();
  });

  it('renders clear filters button', () => {
    renderWithProviders(<BookListPage />);
    expect(screen.getByText('Clear Filters')).toBeInTheDocument();
  });

  it('renders sorting dropdown', () => {
    renderWithProviders(<BookListPage />);
    expect(screen.getByLabelText('Sort order')).toBeInTheDocument();
  });

  it('renders book grid', () => {
    renderWithProviders(<BookListPage />);
    expect(screen.getByTestId('book-grid')).toBeInTheDocument();
  });

  it('renders genre tags', () => {
    renderWithProviders(<BookListPage />);
    expect(screen.getAllByText('Dystopian').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Fantasy').length).toBeGreaterThan(0);
  });

  it('renders book links with correct aria-label', () => {
    renderWithProviders(<BookListPage />);
    expect(screen.getByLabelText('1984 by George Orwell')).toBeInTheDocument();
  });

  it('renders pagination controls', () => {
    renderWithProviders(<BookListPage />);
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('calls setPage on Next click', () => {
    renderWithProviders(<BookListPage />);
    fireEvent.click(screen.getByText('Next'));
    expect(mockSetPage).toHaveBeenCalledWith(2);
  });
});
