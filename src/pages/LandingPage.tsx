import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjects } from '../data/projectStore';
import ProjectCard from '../components/ProjectCard';
import type { Project } from '../data/types';

export default function LandingPage() {
  const [featured, setFeatured] = useState<Project[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchProjects().then((data) => {
      if (!cancelled) {
        setFeatured(data.filter((p) => p.featured).slice(0, 3));
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__orb hero__orb--3" />
        </div>
        <div className="container hero__content">
          <div className="hero__badge animate-fade-in-up">
            <span className="hero__badge-dot" />
            Open to opportunities
          </div>
          <h1 className="hero__title animate-fade-in-up stagger-1">
            Building things that{' '}
            <span className="hero__title-accent">matter.</span>
          </h1>
          <p className="hero__description animate-fade-in-up stagger-2">
            Software engineer passionate about machine learning, distributed
            systems, and crafting solutions to complex problems. Explore
            my work below.
          </p>
          <div className="hero__cta animate-fade-in-up stagger-3">
            <Link to="/projects" className="btn btn--primary">
              View Projects →
            </Link>
            <Link to="/about" className="btn btn--secondary">
              About Me
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featured.length > 0 && (
        <section className="featured-section">
          <div className="container">
            <div className="section-header">
              <span className="section-header__label">Featured Work</span>
              <h2 className="section-header__title">Selected Projects</h2>
              <p className="section-header__subtitle">
                A curated collection of my most impactful and interesting
                projects.
              </p>
            </div>
            <div className="project-grid">
              {featured.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
              <Link to="/projects" className="btn btn--secondary">
                View All Projects →
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
