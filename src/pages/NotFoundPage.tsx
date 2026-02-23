import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="not-found__code animate-fade-in-up">404</div>
        <h1 className="not-found__title animate-fade-in-up stagger-1">
          Page not found
        </h1>
        <p className="not-found__description animate-fade-in-up stagger-2">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="btn btn--primary animate-fade-in-up stagger-3"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
