import { useDeferredValue, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookService } from '../services/api';
import { useBookStore } from '../stores/bookStore';

export function useBooks() {
  const { filters, setFilters, setPage, clearFilters } = useBookStore();
  const deferredSearch = useDeferredValue(filters.search);

  const queryParams = useMemo(() => {
    const params = { ordering: filters.ordering, page: filters.page };
    if (deferredSearch) params.search = deferredSearch;
    if (filters.author) params.author = filters.author;
    if (filters.genre) params.genre = filters.genre;
    return params;
  }, [deferredSearch, filters.author, filters.genre, filters.ordering, filters.page]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['books', queryParams],
    queryFn: () => bookService.getBooks(queryParams),
    select: (response) => {
      const booksData = Array.isArray(response.data) ? response.data : response.data.results;
      const totalCount = response.data.count || booksData.length;
      return { books: booksData, totalCount, totalPages: Math.ceil(totalCount / 12) };
    },
  });

  const { data: allBooksData } = useQuery({
    queryKey: ['books', 'all'],
    queryFn: () => bookService.getBooks({ page_size: 100 }),
    staleTime: 10 * 60 * 1000,
    select: (response) => {
      const books = Array.isArray(response.data) ? response.data : response.data.results;
      return {
        authors: [...new Set(books.map((b) => b.author))].sort(),
        genres: [...new Set(books.map((b) => b.genre).filter(Boolean))].sort(),
      };
    },
  });

  return {
    books: data?.books || [],
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    authors: allBooksData?.authors || [],
    genres: allBooksData?.genres || [],
    filters,
    isLoading,
    error: error?.message || null,
    setFilters,
    setPage,
    clearFilters,
  };
}

export function useBook(id) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['book', id],
    queryFn: () => bookService.getBook(id),
    enabled: !!id,
    select: (response) => response.data,
  });

  return { book: data || null, isLoading, error: error?.message || null };
}
