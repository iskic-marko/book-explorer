import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        response: { use: vi.fn() },
      },
    })),
  },
}));

describe('api services', () => {
  let api;
  let authService, bookService, noteService;

  beforeEach(async () => {
    vi.resetModules();
    const module = await import('./api.js');
    api = module.default;
    authService = module.authService;
    bookService = module.bookService;
    noteService = module.noteService;
  });

  describe('authService', () => {
    it('login calls post with credentials', () => {
      authService.login({ username: 'test', password: 'pass' });
      expect(api.post).toHaveBeenCalledWith('/auth/login/', { username: 'test', password: 'pass' });
    });

    it('register calls post with data', () => {
      authService.register({ username: 'test', email: 'test@test.com' });
      expect(api.post).toHaveBeenCalledWith('/auth/register/', { username: 'test', email: 'test@test.com' });
    });

    it('logout calls post', () => {
      authService.logout();
      expect(api.post).toHaveBeenCalledWith('/auth/logout/');
    });

    it('getCurrentUser calls get', () => {
      authService.getCurrentUser();
      expect(api.get).toHaveBeenCalledWith('/auth/me/');
    });
  });

  describe('bookService', () => {
    it('getBooks calls get with params', () => {
      bookService.getBooks({ page: 1 });
      expect(api.get).toHaveBeenCalledWith('/books/', { params: { page: 1 } });
    });

    it('getBook calls get with id', () => {
      bookService.getBook(1);
      expect(api.get).toHaveBeenCalledWith('/books/1/');
    });
  });

  describe('noteService', () => {
    it('createNote calls post', () => {
      noteService.createNote({ book: 1, content: 'test' });
      expect(api.post).toHaveBeenCalledWith('/notes/', { book: 1, content: 'test' });
    });

    it('updateNote calls patch', () => {
      noteService.updateNote(1, { content: 'updated' });
      expect(api.patch).toHaveBeenCalledWith('/notes/1/', { content: 'updated' });
    });

    it('deleteNote calls delete', () => {
      noteService.deleteNote(1);
      expect(api.delete).toHaveBeenCalledWith('/notes/1/');
    });
  });
});
