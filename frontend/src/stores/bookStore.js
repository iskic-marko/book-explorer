import { create } from 'zustand';

const defaultFilters = {
  search: '',
  author: '',
  genre: '',
  ordering: 'title',
  page: 1,
};

export const useBookStore = create((set) => ({
  filters: defaultFilters,

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: newFilters.page || 1 },
    }));
  },

  setPage: (page) => {
    set((state) => ({
      filters: { ...state.filters, page },
    }));
  },

  clearFilters: () => {
    set({ filters: defaultFilters });
  },
}));
