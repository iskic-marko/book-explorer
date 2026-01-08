import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks';

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validateUsername = (username) => {
  const regex = /^[a-zA-Z0-9_]+$/;
  return regex.test(username);
};

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
  });
  const [validationError, setValidationError] = useState('');
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setValidationError('');

    if (!validateUsername(formData.username)) {
      setValidationError('Username can only contain letters, numbers, and underscores.');
      return;
    }

    if (formData.username.length < 3) {
      setValidationError('Username must be at least 3 characters long.');
      return;
    }

    if (!validateEmail(formData.email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.password_confirm) {
      setValidationError('Passwords do not match.');
      return;
    }

    try {
      await register(formData);
      navigate('/');
    } catch {
      // Error handled by store
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        {(validationError || error) && (
          <div className="error-message">{validationError || error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              minLength={8}
              required
            />
            <small className="form-hint">Min. 8 characters with uppercase, lowercase, and special character.</small>
          </div>
          <div className="form-group">
            <label htmlFor="password_confirm">Confirm Password</label>
            <input
              type="password"
              id="password_confirm"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              minLength={8}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isLoading} data-testid="register-submit">
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
