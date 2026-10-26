import { Link, useParams } from 'react-router-dom';
import Markdown from '../components/Markdown';
import { categoryLabels, GITHUB_USER } from '../data/profile';
import { useRepoStats } from '../lib/github';
import { getProject } from '../lib/content';
import { usePageTitle } from '../lib/usePageTitle';

export default function ProjectPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const project = getProject(slug);
  const stats = useRepoStats();
  usePageTitle(project?.title ?? 'Projeto não encontrado');

  if (!project) return <div className="w proj"><h1>Projeto não encontrado</h1><Link to="/">Voltar</Link></div>;
  const s = stats[project.repo];

  return (
    <article className="w proj">
      <Link className="back" to="/#projetos">← Voltar</Link>
      <div className="top">
        {project.logo && <img src={`/assets/${project.logo}`} alt={`Logo de ${project.title}`} />}
        <div>
          <div className="k">{categoryLabels[project.category]}{s ? ` · ★ ${s.stars}${s.language ? ` · ${s.language}` : ''}` : ''}</div>
          <h1>{project.title}</h1>
          <div className="tags">{project.stack.map((t) => <span key={t}>{t}</span>)}</div>
          <div className="btns">
            {project.website && (
              <a className="btn p" href={project.website} target="_blank" rel="noopener noreferrer">
                Acessar projeto ↗
              </a>
            )}
            <a className={`btn ${project.website ? '' : 'p'}`} href={`https://github.com/${GITHUB_USER}/${project.repo}`} target="_blank" rel="noopener noreferrer">
              Ver no GitHub ↗
            </a>
          </div>
        </div>
      </div>
      <Markdown>{project.body}</Markdown>
    </article>
  );
}
