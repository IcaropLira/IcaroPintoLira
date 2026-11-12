import { Link, useParams } from 'react-router-dom';
import { usePageTitle } from '../lib/usePageTitle';
import OpiPage from './OpiPage';

const TITLES: Record<string, string> = { 'opi-2026': 'Medalha de prata na OPI 2026' };

export default function ConquistaPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const title = TITLES[slug];
  usePageTitle(title ?? 'Conquista não encontrada', slug === 'opi-2026' ? {
    path: '/conquistas/opi-2026',
    description: 'Ícaro Pinto Lira conquista medalha de prata no Avançado Júnior da Olimpíada Paraibana de Informática 2026 pela UFCG. Veja a história, a equipe, o resultado oficial e a galeria de fotos.',
    image: '/assets/conquistas/opi-palco.jpg',
    imageAlt: 'Equipe da UFCG recebe medalhas e certificados na cerimônia da OPI 2026',
    structuredData: {
      '@type': 'Article',
      headline: 'Medalha de prata na OPI 2026 — Ícaro Pinto Lira',
      description: 'Relato da participação de Ícaro Pinto Lira e sua equipe na Olimpíada Paraibana de Informática 2026.',
      author: { '@id': 'https://icaropintolira.vercel.app/#person' },
      publisher: { '@id': 'https://icaropintolira.vercel.app/#person' },
      datePublished: '2026-08-08',
      image: [
        'https://icaropintolira.vercel.app/assets/conquistas/opi-palco.jpg',
        'https://icaropintolira.vercel.app/assets/conquistas/opi-palco-lateral.jpg',
        'https://icaropintolira.vercel.app/assets/conquistas/opi-equipe.jpg',
        'https://icaropintolira.vercel.app/assets/conquistas/opi-medalhistas.jpg',
        'https://icaropintolira.vercel.app/assets/conquistas/opi-medalha.jpg'
      ],
      about: [
        { '@type': 'Person', name: 'Ícaro Pinto Lira' },
        { '@type': 'Thing', name: 'Olimpíada Paraibana de Informática 2026' },
        { '@type': 'Organization', name: 'Universidade Federal de Campina Grande' }
      ]
    }
  } : { path: `/conquistas/${slug}` });

  if (slug === 'opi-2026') return <OpiPage />;
  return <div className="w proj"><h1>Conquista não encontrada</h1><Link to="/conquistas">Ver todas as conquistas</Link></div>;
}
