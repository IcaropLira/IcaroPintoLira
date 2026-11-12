import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SITE = 'https://icaropintolira.vercel.app';
const ROOT = process.cwd();
const ASSETS = path.join(ROOT, 'public', 'assets');
const PROJECTS = path.join(ROOT, 'content', 'projects');
const IMAGE_EXT = /\.(?:avif|gif|jpe?g|png|svg|webp)$/i;
const xml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const today = new Date().toISOString().slice(0, 10);

async function walk(dir, prefix = '') {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === '.idea' || entry.name === '.DS_Store') continue;
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute, relative));
    else if (IMAGE_EXT.test(entry.name)) files.push(relative);
  }
  return files;
}

const imageFiles = (await walk(ASSETS)).sort();
const projectFiles = (await readdir(PROJECTS)).filter((name) => name.endsWith('.md'));
const projectSlugs = projectFiles.map((name) => name.replace(/\.md$/, ''));

const pageImages = new Map();
const add = (url, images) => {
  const current = pageImages.get(url) ?? new Set();
  for (const image of images) current.add(image);
  pageImages.set(url, current);
};

const homepageImages = imageFiles.filter((file) =>
  !file.startsWith('hiraku/') &&
  (!file.startsWith('conquistas/') || file === 'conquistas/opi-palco.jpg')
);
add('/', homepageImages);
add('/conquistas', ['conquistas/opi-palco.jpg']);
add('/conquistas/opi-2026', imageFiles.filter((file) => file.startsWith('conquistas/')));

const logoToProject = {
  'hiraku-comic-manager.png': 'hiraku-comic-manager',
  'hmideas-icon.svg': 'hmideas',
  'hmideas-logo.svg': 'hmideas',
  'mrcpp-icon.svg': 'mrcpp',
  'mrcpp-logo.svg': 'mrcpp',
  'neovim-icon.svg': 'neovim',
  'neovim-logo.svg': 'neovim',
  'terminal-icon.svg': 'terminal',
  'terminal-logo.svg': 'terminal',
  'tmux-icon.svg': 'tmux',
  'tmux-logo.svg': 'tmux',
  'vim-icon.svg': 'vim',
  'vim-logo.svg': 'vim'
};

for (const image of imageFiles) {
  if (image.startsWith('hiraku/')) add('/projetos/hiraku-comic-manager', [image]);
  else {
    const slug = logoToProject[path.posix.basename(image)];
    if (slug) add(`/projetos/${slug}`, [image]);
  }
}

for (const slug of projectSlugs) {
  const file = path.join(PROJECTS, `${slug}.md`);
  const source = await readFile(file, 'utf8');
  const logo = /^logo:\s*(.+)$/m.exec(source)?.[1]?.trim();
  if (logo) add(`/projetos/${slug}`, [logo]);
}

const urls = [
  '/',
  '/conquistas',
  '/conquistas/opi-2026',
  ...projectSlugs.map((slug) => `/projetos/${slug}`)
];

const body = urls.map((url) => {
  const images = [...(pageImages.get(url) ?? [])]
    .filter((file) => imageFiles.includes(file))
    .map((file) => {
      const basename = path.posix.basename(file, path.posix.extname(file));
      const caption = basename.replace(/[-_]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
      return `    <image:image><image:loc>${xml(`${SITE}/assets/${file.split('/').map(encodeURIComponent).join('/')}`)}</image:loc><image:caption>${xml(caption)}</image:caption></image:image>`;
    }).join('\n');
  return `  <url>\n    <loc>${SITE}${url}</loc>\n    <lastmod>${today}</lastmod>\n${images ? images + '\n' : ''}  </url>`;
}).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${body}\n</urlset>\n`;
await writeFile(path.join(ROOT, 'public', 'sitemap.xml'), sitemap);
console.log(`Sitemap gerado: ${urls.length} páginas e ${imageFiles.length} imagens disponíveis.`);