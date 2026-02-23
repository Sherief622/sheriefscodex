import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProjects, deleteProject } from '../../data/projectStore';
import type { Project } from '../../data/types';

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const navigate = useNavigate();

  const loadProjects = useCallback(async () => {
    setLoading(true);
    const data = await fetchProjects();
    setProjects(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const handleDelete = (project: Project) => {
    setDeleteTarget(project);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      await deleteProject(deleteTarget.id);
      setDeleteTarget(null);
      await loadProjects();
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-dashboard__header animate-fade-in-up">
          <h1 className="admin-dashboard__title">Project Dashboard</h1>
          <Link to="/admin/projects/new" className="btn btn--primary">
            + New Project
          </Link>
        </div>

        {loading ? (
          <div className="empty-state animate-fade-in-up stagger-1">
            <p className="empty-state__description">Loading projects…</p>
          </div>
        ) : projects.length > 0 ? (
          <div className="admin-project-list animate-fade-in-up stagger-1">
            {projects.map((project) => (
              <div key={project.id} className="admin-project-item">
                <div className="admin-project-item__info">
                  <div className="admin-project-item__title">
                    {project.title || 'Untitled Project'}
                  </div>
                  <div className="admin-project-item__meta">
                    <span>{project.tags.join(', ') || 'No tags'}</span>
                    <span>
                      {project.contentBlocks.length} block
                      {project.contentBlocks.length !== 1 ? 's' : ''}
                    </span>
                    <span>{project.featured ? '★ Featured ★' : ''}</span>
                    <span>
                      Updated{' '}
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="admin-project-item__actions">
                  <Link
                    to={`/projects/${project.slug}`}
                    className="btn btn--secondary btn--small"
                  >
                    View
                  </Link>
                  <button
                    className="btn btn--secondary btn--small"
                    onClick={() =>
                      navigate(`/admin/projects/${project.id}/edit`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn--danger btn--small"
                    onClick={() => handleDelete(project)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state animate-fade-in-up stagger-1">
            <div className="empty-state__icon">📂</div>
            <h3 className="empty-state__title">No projects yet</h3>
            <p className="empty-state__description">
              Create your first project to get started.
            </p>
            <Link to="/admin/projects/new" className="btn btn--primary">
              + New Project
            </Link>
          </div>
        )}
      </div>

      {/*Delete Confirmation Dialog*/}
      {deleteTarget && (
        <div className="confirm-overlay" onClick={() => setDeleteTarget(null)}>
          <div
            className="confirm-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="confirm-dialog__title">Delete Project</h3>
            <p className="confirm-dialog__message">
              Are you sure you want to delete "
              <strong>{deleteTarget.title}</strong>"? This action cannot be
              undone.
            </p>
            <div className="confirm-dialog__actions">
              <button
                className="btn btn--secondary btn--small"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn--danger btn--small"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
