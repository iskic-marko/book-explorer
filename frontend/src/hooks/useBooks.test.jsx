import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBooks, useBook } from './useBooks';

vi.mock('../services/api', () => ({
  bookService: {
    getBooks: vi.fn().mockResolvedValue({
      data: {
        results: [{ id: 1, title: 'Test Book', author: 'Author' }],
        count: 1,
        total_pages: 1,
      },
    }),
    getBook: vi.fn().mockResolvedValue({
      data: { id: 1, title: 'Test Book', author: 'Author' },
    }),
  },
}));

vi.mock('../stores/bookStore', () => ({
  useBookStore: () => ({
    filters: { search: '', author: '', genre: '', ordering: '', page: 1 },
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useBooks', () => {
  it('returns books data', async () => {
    const { result } = renderHook(() => useBooks(), { wrapper: createWrapper() });
    
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    expect(result.current.books).toHaveLength(1);
    expect(result.current.books[0].title).toBe('Test Book');
  });

  it('returns pagination info', async () => {
    const { result } = renderHook(() => useBooks(), { wrapper: createWrapper() });
    
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    expect(result.current.totalCount).toBe(1);
    expect(result.current.totalPages).toBe(1);
  });
});

describe('useBook', () => {
  it('returns single book data', async () => {
    const { result } = renderHook(() => useBook('1'), { wrapper: createWrapper() });
    
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    expect(result.current.book.title).toBe('Test Book');
  });
});
