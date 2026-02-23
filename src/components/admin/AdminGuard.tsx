import { useState, useEffect, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, onAuthChange } from '../../data/authStore';

interface Props {
  children: ReactNode;
}

export default function AdminGuard({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    // Check initial session
    isAuthenticated().then((result) => {
      setAuthed(result);
      setLoading(false);
    });

    // Listen for auth changes (e.g. token refresh, logout in another tab)
    const unsubscribe = onAuthChange((loggedIn) => {
      setAuthed(loggedIn);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="container">
          <p style={{ color: 'var(--text-secondary)', padding: 'var(--space-20) 0' }}>
            Checking authentication…
          </p>
        </div>
      </div>
    );
  }

  if (!authed) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
