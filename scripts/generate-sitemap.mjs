import { access, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { SITE, getRoutes } from './seo-routes.mjs';

const ROOT = process.cwd();
const xml = (v) => String(v).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const url = (p) => `${SITE}${p.split('/').map(encodeURIComponent).join('/')}`;

const routes = await getRoutes();
let count = 0;
const body = [];
for (const r of routes) {
  const images = [];
  for (const img of r.images) {
    try { await access(path.join(ROOT, 'public', img.src)); } catch { console.warn(`Imagem ausente, ignorada: ${img.src}`); continue; }
    images.push(`    <image:image><image:loc>${xml(url(img.src))}</image:loc></image:image>`);
    count++;
  }
  body.push(`  <url>\n    <loc>${xml(SITE + r.path)}</loc>\n${images.length ? images.join('\n') + '\n' : ''}  </url>`);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${body.join('\n')}\n</urlset>\n`;
await writeFile(path.join(ROOT, 'public', 'sitemap.xml'), sitemap);
console.log(`Sitemap gerado: ${routes.length} páginas e ${count} imagens.`);
