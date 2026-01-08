import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar" data-testid="navbar">
      <div className="navbar-brand">
        <Link to="/">Book Explorer</Link>
      </div>
      <div className="navbar-menu">
        <Link to="/">Books</Link>
        {user ? (
          <>
            <span className="navbar-user">Welcome, {user.username}</span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
