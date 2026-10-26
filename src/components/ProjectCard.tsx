import { Link } from 'react-router-dom';
import type { Project, RepoStats } from '../types';

interface Props {
  project: Project;
  stats?: RepoStats;
  badge?: string;
  showStack?: boolean;
}

export default function ProjectCard({ project, stats, badge, showStack }: Props) {
  return (
    <Link className={`card${badge ? ' featured-card' : ''}`} to={`/projetos/${project.slug}`}>
      {badge && <i className="badge">{badge}</i>}
      <div className="ic">
        {project.logo
          ? <img src={`/assets/${project.logo}`} alt={`Logo de ${project.title}`} loading="lazy" />
          : <div className="ini">{project.title.charAt(0)}</div>}
        <span className="tag">→</span>
      </div>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      {showStack && project.stack && project.stack.length > 0 && (
        <div className="tags card-tags">
          {project.stack.map((t) => <span key={t}>{t}</span>)}
        </div>
      )}
      <div className="meta">
        {stats?.language && <span>{stats.language}</span>}
        {stats && <span>★ {stats.stars}</span>}
      </div>
    </Link>
  );
}
