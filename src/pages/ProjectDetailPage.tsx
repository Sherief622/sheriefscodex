import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProjectBySlug } from '../data/projectStore';
import ContentRenderer from '../components/ContentRenderer';
import type { Project } from '../data/types';

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(!!slug);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    fetchProjectBySlug(slug).then((p) => {
      if (!cancelled) {
        setProject(p ?? null);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="project-detail">
        <div className="container container--narrow">
          <p style={{ color: 'var(--text-secondary)', padding: 'var(--space-20) 0' }}>
            Loading project…
          </p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail">
        <div className="container container--narrow">
          <div className="empty-state">
            <div className="empty-state__icon">🔍</div>
            <h3 className="empty-state__title">Project not found</h3>
            <p className="empty-state__description">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/projects" className="btn btn--primary">
              ← Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail">
      <div className="container container--narrow">
        <Link to="/projects" className="project-detail__back animate-fade-in">
          ← Back to Projects
        </Link>

        <header className="project-detail__header animate-fade-in-up">
          <h1 className="project-detail__title">{project.title}</h1>
          <p className="project-detail__description">{project.description}</p>
          <div className="project-detail__tags">
            {project.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
          <p className="project-detail__meta">
            Updated{' '}
            {new Date(project.updatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </header>

        <div className="animate-fade-in-up stagger-2">
          <ContentRenderer blocks={project.contentBlocks} />
        </div>
      </div>
    </div>
  );
}
