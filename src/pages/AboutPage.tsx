import { Link } from 'react-router-dom';

export default function AboutPage() {
  const skills = [
    {
      icon: '🧠',
      title: 'Machine Learning',
      description: 'PyTorch, TensorFlow, scikit-learn, NLP, Computer Vision',
    },
    {
      icon: '⚡',
      title: 'Backend Development',
      description: 'Python, Node.js, Go, REST APIs, GraphQL, Microservices',
    },
    {
      icon: '🎨',
      title: 'Frontend Development',
      description: 'React, TypeScript, Next.js, CSS, Responsive Design',
    },
    {
      icon: '🗄️',
      title: 'Data Engineering',
      description: 'PostgreSQL, MongoDB, Redis, Apache Airflow, ETL Pipelines',
    },
    {
      icon: '☁️',
      title: 'Cloud & DevOps',
      description: 'AWS, Docker, Kubernetes, CI/CD, Terraform',
    },
    {
      icon: '🔐',
      title: 'System Design',
      description:
        'Distributed Systems, Event-Driven Architecture, Caching Strategies',
    },
  ];

  return (
    <div className="about-page">
      <div className="container">
        <div className="section-header animate-fade-in-up">
          <span className="section-header__label">About</span>
          <h1 className="section-header__title">Sherief Gad</h1>
        </div>

        <div className="about__bio animate-fade-in-up stagger-1">
          <p>
            I'm a <strong>software engineer</strong> with a passion for building
            impactful, well-architected systems. My work spans across{' '}
            <strong>machine learning pipelines</strong>, scalable backend
            services, and polished user interfaces.
          </p>
          <br />
          <p>
            I believe in writing clean, maintainable code and designing systems
            that scale gracefully. When I'm not coding, you'll find me exploring
            new technologies, contributing to open source, or diving into
            research papers.
          </p>
        </div>

        <div className="animate-fade-in-up stagger-2">
          <div className="section-header" style={{ marginTop: '2rem' }}>
            <span className="section-header__label">Expertise</span>
            <h2 className="section-header__title">Skills & Technologies</h2>
          </div>
          <div className="skills-grid">
            {skills.map((skill) => (
              <div key={skill.title} className="skill-card">
                <div className="skill-card__icon">{skill.icon}</div>
                <h3 className="skill-card__title">{skill.title}</h3>
                <p className="skill-card__description">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-in-up stagger-3">
          <div className="section-header">
            <span className="section-header__label">Connect</span>
            <h2 className="section-header__title">Get In Touch</h2>
          </div>
          <div className="about__contact">
            <a
              href="https://github.com/Sherief622"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--secondary"
            >
              GitHub ↗
            </a>
            <a
              href="https://linkedin.com/in/sheriefkhaled"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--secondary"
            >
              LinkedIn ↗
            </a>
            <a href="mailto:sheriefkhaled@hotmail.com" className="btn btn--primary">
              Email Me →
            </a>
            <Link to="/projects" className="btn btn--secondary">
              View Projects →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
