import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RegisterPage from './RegisterPage';

const mockRegister = vi.fn();
const mockClearError = vi.fn();

vi.mock('../hooks', () => ({
  useAuth: () => ({
    register: mockRegister,
    isLoading: false,
    error: null,
    clearError: mockClearError,
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

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders register form', () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('renders login link', () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('allows typing in form fields', () => {
    renderWithProviders(<RegisterPage />);
    
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'Password123!' } });

    expect(screen.getByLabelText('Username').value).toBe('testuser');
    expect(screen.getByLabelText('Email').value).toBe('test@example.com');
  });

  it('shows validation error for invalid username', async () => {
    renderWithProviders(<RegisterPage />);
    
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'test@user' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/username can only contain/i)).toBeInTheDocument();
  });

  it('shows validation error for password mismatch', async () => {
    renderWithProviders(<RegisterPage />);
    
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'Different123!' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it('calls register on valid form submit', async () => {
    mockRegister.mockResolvedValue({});
    renderWithProviders(<RegisterPage />);
    
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(mockRegister).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123!',
      password_confirm: 'Password123!',
    });
  });
});
