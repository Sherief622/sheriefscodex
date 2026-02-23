import { Link } from 'react-router-dom';
import type { Project } from '../data/types';

interface Props {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: Props) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className={`project-card animate-fade-in-up stagger-${Math.min(index + 1, 5)}`}
    >
      <div className="project-card__thumbnail">
        {project.thumbnail ? (
          <img src={project.thumbnail} alt={project.title} />
        ) : (
          <span className="project-card__thumbnail-placeholder">📁</span>
        )}
      </div>
      <div className="project-card__body">
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__description">{project.description}</p>
        <div className="project-card__tags">
          {project.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
