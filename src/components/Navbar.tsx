import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { isAuthenticated, logout, onAuthChange } from '../data/authStore';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    isAuthenticated().then(setAuthed);
    const unsubscribe = onAuthChange(setAuthed);
    return unsubscribe;
  }, []);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">⟨/⟩</span>
          <span>Sherief's Dev Codex</span>
        </Link>

        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <Link
            to="/"
            className={`navbar__link ${isActive('/') && location.pathname === '/' ? 'navbar__link--active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/projects"
            className={`navbar__link ${isActive('/projects') ? 'navbar__link--active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Projects
          </Link>
          <Link
            to="/about"
            className={`navbar__link ${isActive('/about') ? 'navbar__link--active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>

          {authed ? (
            <>
              <Link
                to="/admin"
                className={`navbar__link ${isActive('/admin') ? 'navbar__link--active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                className="navbar__admin-btn"
                onClick={handleLogout}
                title="Logout"
              >
                ⏻
              </button>
            </>
          ) : (
            <Link to="/admin/login" className="navbar__admin-btn" title="Admin">
              ⚙
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
