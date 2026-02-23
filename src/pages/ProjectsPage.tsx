import { useState, useEffect, useMemo } from 'react';
import { fetchProjects } from '../data/projectStore';
import ProjectCard from '../components/ProjectCard';
import type { Project } from '../data/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchProjects().then((data) => {
      if (!cancelled) {
        setProjects(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    let result = projects;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (activeTag) {
      result = result.filter((p) => p.tags.includes(activeTag));
    }
    return result;
  }, [projects, search, activeTag]);

  return (
    <div className="projects-page">
      <div className="container">
        <div className="section-header animate-fade-in-up">
          <span className="section-header__label">Portfolio</span>
          <h1 className="section-header__title">All Projects</h1>
          <p className="section-header__subtitle">
            Browse through my work. Click any project to dive deeper.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="projects-page__search animate-fade-in-up stagger-1">
          <div className="search-bar">
            <span className="search-bar__icon">🔍</span>
            <input
              type="text"
              className="search-bar__input"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {allTags.length > 0 && (
            <div className="tag-filter">
              <button
                className={`tag-filter__chip ${!activeTag ? 'tag-filter__chip--active' : ''}`}
                onClick={() => setActiveTag(null)}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className={`tag-filter__chip ${activeTag === tag ? 'tag-filter__chip--active' : ''}`}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="empty-state">
            <p className="empty-state__description">Loading projects…</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="project-grid">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">📂</div>
            <h3 className="empty-state__title">No projects found</h3>
            <p className="empty-state__description">
              {search || activeTag
                ? 'Try adjusting your search or filter.'
                : 'No projects have been added yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
