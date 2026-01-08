import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BookDetailPage from './BookDetailPage';

const mockBook = {
  id: 1,
  title: '1984',
  author: 'George Orwell',
  description: 'A dystopian novel about totalitarianism.',
  genre: 'Dystopian Fiction',
  published_date: '1949-06-08',
  page_count: 328,
  isbn: '9780451524935',
  cover_image_url: 'https://example.com/cover.jpg',
  user_notes: [],
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
  };
});

vi.mock('../hooks', () => ({
  useBook: () => ({
    book: mockBook,
    isLoading: false,
    error: null,
  }),
  useAuth: () => ({
    user: { id: 1, username: 'testuser' },
  }),
}));

vi.mock('../services/api', () => ({
  noteService: {
    createNote: vi.fn(),
    updateNote: vi.fn(),
    deleteNote: vi.fn(),
  },
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

describe('BookDetailPage', () => {
  it('renders book title', () => {
    renderWithProviders(<BookDetailPage />);
    expect(screen.getByRole('heading', { name: '1984' })).toBeInTheDocument();
  });

  it('renders author name', () => {
    renderWithProviders(<BookDetailPage />);
    expect(screen.getByText(/by George Orwell/)).toBeInTheDocument();
  });

  it('renders book description', () => {
    renderWithProviders(<BookDetailPage />);
    expect(screen.getByText(/dystopian novel about totalitarianism/)).toBeInTheDocument();
  });

  it('renders book metadata', () => {
    renderWithProviders(<BookDetailPage />);
    expect(screen.getByText(/Dystopian Fiction/)).toBeInTheDocument();
    expect(screen.getByText(/328/)).toBeInTheDocument();
    expect(screen.getByText(/9780451524935/)).toBeInTheDocument();
  });

  it('renders back link', () => {
    renderWithProviders(<BookDetailPage />);
    expect(screen.getByText(/Back to Books/)).toBeInTheDocument();
  });

  it('renders notes section for authenticated user', () => {
    renderWithProviders(<BookDetailPage />);
    expect(screen.getByRole('heading', { name: 'My Notes' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/add a personal note/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add note/i })).toBeInTheDocument();
  });

  it('shows empty notes message', () => {
    renderWithProviders(<BookDetailPage />);
    expect(screen.getByText(/haven't added any notes/i)).toBeInTheDocument();
  });

  it('allows typing in note textarea', () => {
    renderWithProviders(<BookDetailPage />);
    const textarea = screen.getByPlaceholderText(/add a personal note/i);
    fireEvent.change(textarea, { target: { value: 'My note' } });
    expect(textarea.value).toBe('My note');
  });

  it('submits new note', async () => {
    const { noteService } = await import('../services/api');
    noteService.createNote.mockResolvedValue({ data: { id: 1, content: 'Test note' } });
    renderWithProviders(<BookDetailPage />);
    
    const textarea = screen.getByPlaceholderText(/add a personal note/i);
    fireEvent.change(textarea, { target: { value: 'Test note' } });
    fireEvent.click(screen.getByTestId('add-note-submit'));
    
    await waitFor(() => {
      expect(noteService.createNote).toHaveBeenCalled();
    });
  });
});
