export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__text">
          © {new Date().getFullYear()} sheriefscodex.
        </p>
        <div className="footer__links">
          <a
            href="https://github.com/Sherief622"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/sheriefkhaled"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            LinkedIn
          </a>
          <a href="mailto:sheriefkhaled@hotmail.com" className="footer__link">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
