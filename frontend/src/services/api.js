import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (data) => api.post('/auth/register/', data),
  logout: () => api.post('/auth/logout/'),
  getCurrentUser: () => api.get('/auth/me/'),
};

export const bookService = {
  getBooks: (params = {}) => api.get('/books/', { params }),
  getBook: (id) => api.get(`/books/${id}/`),
};

export const noteService = {
  getNotes: (bookId) => api.get('/notes/', { params: { book: bookId } }),
  createNote: (data) => api.post('/notes/', data),
  updateNote: (id, data) => api.patch(`/notes/${id}/`, data),
  deleteNote: (id) => api.delete(`/notes/${id}/`),
};

export default api;
