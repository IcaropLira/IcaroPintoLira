import type { Category, Project } from '../types';

const projectFiles = import.meta.glob('/content/projects/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const aboutFiles = import.meta.glob('/content/about.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const CATEGORIES: readonly Category[] = ['setup', 'apps', 'competitiva', 'lib'];

export function parseFrontmatter(src: string): { data: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(src);
  if (!match) return { data: {}, body: src };
  const data: Record<string, string> = {};
  for (const line of (match[1] ?? '').split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { data, body: match[2] ?? '' };
}

function toProject(path: string, src: string): Project {
  const { data, body } = parseFrontmatter(src);
  const category = data.category as Category;
  if (!CATEGORIES.includes(category)) throw new Error(`Categoria inválida em ${path}`);
  return {
    slug: data.slug ?? path.split('/').pop()!.replace('.md', ''),
    title: data.title ?? path,
    summary: data.summary ?? '',
    category,
    repo: data.repo ?? '',
    logo: data.logo ?? '',
    featured: data.featured === 'true',
    highlight: data.highlight === 'true',
    order: Number(data.order ?? 99),
    stack: (data.stack ?? '').split(',').map((s) => s.trim()).filter(Boolean),
    body,
    website: data.website || undefined,
  };
}

export const projects: Project[] = Object.entries(projectFiles)
  .map(([path, src]) => toProject(path, src))
  .sort((a, b) => a.order - b.order);

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const about = parseFrontmatter(Object.values(aboutFiles)[0] ?? '').body;
