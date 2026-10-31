import { Link, useParams } from 'react-router-dom';
import { usePageTitle } from '../lib/usePageTitle';
import OpiPage from './OpiPage';

const TITLES: Record<string, string> = { 'opi-2026': 'Medalha de prata na OPI 2026' };

export default function ConquistaPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const title = TITLES[slug];
  usePageTitle(title ?? 'Conquista não encontrada');

  if (slug === 'opi-2026') return <OpiPage />;
  return <div className="w proj"><h1>Conquista não encontrada</h1><Link to="/conquistas">Ver todas as conquistas</Link></div>;
}
