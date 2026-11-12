import { Link, useParams } from 'react-router-dom';
import Markdown from '../components/Markdown';
import { categoryLabels, GITHUB_USER } from '../data/profile';
import { useRepoStats } from '../lib/github';
import { getProject } from '../lib/content';
import { usePageTitle } from '../lib/usePageTitle';
import HirakuPage from './HirakuPage';

export default function ProjectPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const project = getProject(slug);
  const stats = useRepoStats();

  const projectImage = project?.logo ? `/assets/${project.logo}` : '/assets/icaro-pinto-lira.jpg';
  usePageTitle(project?.title ?? 'Projeto não encontrado', {
    path: `/projetos/${slug}`,
    description: project?.summary ?? 'Projeto do portfólio de Ícaro Pinto Lira.',
    image: projectImage,
    imageAlt: project ? `Logo do projeto ${project.title}, desenvolvido por Ícaro Pinto Lira` : 'Ícaro Pinto Lira',
    structuredData: project ? {
      '@type': 'CreativeWork',
      name: project.title,
      description: project.summary,
      url: project.website ?? `https://icaropintolira.vercel.app/projetos/${slug}`,
      image: `https://icaropintolira.vercel.app${projectImage}`,
      author: { '@id': 'https://icaropintolira.vercel.app/#person' },
      creator: { '@id': 'https://icaropintolira.vercel.app/#person' },
      sameAs: [`https://github.com/${GITHUB_USER}/${project.repo}`, ...(project.website ? [project.website] : [])],
      keywords: project.stack.join(', ')
    } : undefined
  });

  if (slug === 'hiraku-comic-manager') return <HirakuPage />;
  if (!project) return <div className="w proj"><h1>Projeto não encontrado</h1><Link to="/">Voltar</Link></div>;
  const s = stats[project.repo];

  return (
    <article className="w proj">
      <Link className="back" to="/#projetos">← Voltar</Link>
      <div className="top">
        {project.logo && <img src={projectImage} alt={`Logo de ${project.title}`} />}
        <div>
          <div className="k">{categoryLabels[project.category]}{s ? ` · ★ ${s.stars}${s.language ? ` · ${s.language}` : ''}` : ''}</div>
          <h1>{project.title}</h1>
          <div className="tags">{project.stack.map((t) => <span key={t}>{t}</span>)}</div>
          <div className="btns">
            {project.website && <a className="btn p" href={project.website} target="_blank" rel="noopener noreferrer">Acessar projeto ↗</a>}
            <a className={`btn ${project.website ? '' : 'p'}`} href={`https://github.com/${GITHUB_USER}/${project.repo}`} target="_blank" rel="noopener noreferrer">Ver no GitHub ↗</a>
          </div>
        </div>
      </div>
      <Markdown>{project.body}</Markdown>
    </article>
  );
}
