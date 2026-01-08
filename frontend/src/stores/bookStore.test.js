import { describe, it, expect, beforeEach } from 'vitest';
import { useBookStore } from './bookStore';

describe('bookStore', () => {
  beforeEach(() => {
    useBookStore.setState({
      filters: { search: '', author: '', genre: '', ordering: 'title', page: 1 },
    });
  });

  it('should have initial state', () => {
    const state = useBookStore.getState();
    expect(state.filters.ordering).toBe('title');
    expect(state.filters.page).toBe(1);
  });

  it('should update filters and reset page', () => {
    useBookStore.getState().setFilters({ search: 'test' });
    expect(useBookStore.getState().filters.search).toBe('test');
    expect(useBookStore.getState().filters.page).toBe(1);
  });

  it('should update page', () => {
    useBookStore.getState().setPage(2);
    expect(useBookStore.getState().filters.page).toBe(2);
  });

  it('should clear filters', () => {
    useBookStore.getState().setFilters({ search: 'test', author: 'Author' });
    useBookStore.getState().setPage(3);
    useBookStore.getState().clearFilters();
    expect(useBookStore.getState().filters.search).toBe('');
    expect(useBookStore.getState().filters.author).toBe('');
    expect(useBookStore.getState().filters.page).toBe(1);
  });
});
