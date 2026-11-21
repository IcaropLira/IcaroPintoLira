// Fonte única de SEO por rota: usada pelo sitemap (generate-sitemap.mjs) e pelo
// HTML pré-renderizado (prerender.mjs). Liste aqui SÓ imagens que aparecem de fato
// na página — o Google desconfia de sitemaps que apontam imagens que não estão nela.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

export const SITE = 'https://icaropintolira.vercel.app';
const ROOT = process.cwd();
const PROJECTS = path.join(ROOT, 'content', 'projects');
const PORTRAIT = { src: '/assets/icaro-pinto-lira.jpg', alt: 'Retrato de Ícaro Pinto Lira, estudante de Ciência da Computação da UFCG' };
const OPI_COVER = { src: '/assets/conquistas/opi-palco.jpg', alt: 'Equipe Pensão de Pet II, da UFCG, no palco da premiação da Olimpíada Paraibana de Informática 2026' };

// Mantenha em sincronia com PHOTOS em src/pages/OpiPage.tsx.
const OPI_PHOTOS = [
  OPI_COVER,
  { src: '/assets/conquistas/opi-palco-lateral.jpg', alt: 'Cerimônia de premiação da Olimpíada Paraibana de Informática 2026 vista de outro ângulo' },
  { src: '/assets/conquistas/opi-equipe.jpg', alt: 'Equipe Pensão de Pet II reunida com medalhas e certificados após a OPI 2026' },
  { src: '/assets/conquistas/opi-medalhistas.jpg', alt: 'Medalhistas da Olimpíada Paraibana de Informática 2026 reunidos após a cerimônia' },
  { src: '/assets/conquistas/opi-medalha.jpg', alt: 'Participante da OPI 2026 exibindo a medalha de prata e o certificado diante do painel oficial' },
];

// Mantenha em sincronia com SHOTS em src/pages/HirakuPage.tsx.
const HIRAKU_SHOTS = [
  { src: '/assets/hiraku/grafo.png', alt: 'Grafo do app com personagens, capítulos, tramas e locais conectados' },
  { src: '/assets/hiraku/matriz.png', alt: 'Matriz de personagens e tramas por capítulo' },
  { src: '/assets/hiraku/timeline.png', alt: 'Linha do tempo com os detalhes de um capítulo' },
  { src: '/assets/hiraku/ficha-layout.png', alt: 'Ficha de personagem no modo Layout' },
  { src: '/assets/hiraku/roteiro-layout.png', alt: 'Roteiro de quadrinhos no modo Layout' },
];

function frontmatter(src) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(src);
  const data = {};
  for (const line of (m?.[1] ?? '').split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { data, body: m?.[2] ?? src };
}

export async function getRoutes() {
  const files = (await readdir(PROJECTS)).filter((f) => f.endsWith('.md')).sort();
  const projects = await Promise.all(files.map(async (file) => {
    const { data, body } = frontmatter(await readFile(path.join(PROJECTS, file), 'utf8'));
    return { slug: file.replace(/\.md$/, ''), ...data, body };
  }));
  projects.sort((a, b) => Number(a.order ?? 99) - Number(b.order ?? 99));

  const logo = (p) => (p.logo ? { src: `/assets/${p.logo}`, alt: `Logo de ${p.title}, projeto de Ícaro Pinto Lira` } : null);

  const routes = [
    {
      path: '/',
      title: 'Ícaro Pinto Lira — Ciência da Computação, UFCG',
      description: 'Portfólio oficial de Ícaro Pinto Lira, estudante de Ciência da Computação na UFCG: projetos de software, programação competitiva, medalha na OPI 2026 e ferramentas autorais.',
      heading: 'Ícaro Pinto Lira',
      images: [
        PORTRAIT,
        { src: '/assets/hsm-logo.svg', alt: 'Logo Hiraku, marca dos projetos de Ícaro Pinto Lira' },
        OPI_COVER,
        ...projects.filter((p) => p.featured === 'true').map(logo).filter(Boolean),
      ],
      links: [
        { href: '/conquistas', text: 'Conquistas' },
        ...projects.map((p) => ({ href: `/projetos/${p.slug}`, text: p.title })),
      ],
    },
    {
      path: '/conquistas',
      title: 'Conquistas — Ícaro Pinto Lira',
      description: 'Galeria de conquistas de Ícaro Pinto Lira: medalhas, competições de programação, certificados e marcos acadêmicos na UFCG.',
      heading: 'Conquistas de Ícaro Pinto Lira',
      images: [OPI_COVER],
      links: [{ href: '/conquistas/opi-2026', text: 'Medalha de prata na OPI 2026' }],
    },
    {
      path: '/conquistas/opi-2026',
      title: 'Medalha de prata na OPI 2026 — Ícaro Pinto Lira',
      description: 'Ícaro Pinto Lira conquista medalha de prata no Avançado Júnior da Olimpíada Paraibana de Informática 2026 pela UFCG. Veja a história, a equipe, o resultado oficial e a galeria de fotos.',
      heading: 'Ícaro Pinto Lira — medalha de prata na OPI 2026',
      images: OPI_PHOTOS,
    },
    ...projects.map((p) => {
      const mdImages = [...p.body.matchAll(/!\[([^\]]*)\]\(([^)\s]+)\)/g)]
        .filter((m) => m[2].startsWith('/'))
        .map((m) => ({ src: m[2], alt: m[1] || p.title }));
      return {
        path: `/projetos/${p.slug}`,
        title: `${p.title} — Ícaro Pinto Lira`,
        description: p.summary || `Projeto ${p.title}, de Ícaro Pinto Lira.`,
        heading: `${p.title}, por Ícaro Pinto Lira`,
        images: [logo(p), ...mdImages, ...(p.slug === 'hiraku-comic-manager' ? HIRAKU_SHOTS : [])].filter(Boolean),
      };
    }),
  ];

  // remove imagens repetidas dentro de cada rota
  for (const r of routes) {
    const seen = new Set();
    r.images = r.images.filter((img) => !seen.has(img.src) && seen.add(img.src));
  }
  return routes;
}
