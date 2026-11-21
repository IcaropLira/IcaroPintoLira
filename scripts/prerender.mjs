// Roda depois do `vite build`. Para cada rota, grava dist/<rota>/index.html com
// título, descrição, canonical e og:image próprios, e um bloco com o texto principal
// e as <img> da página já no HTML. Assim o Google vê as imagens e os metadados sem
// precisar executar o JavaScript (o React substitui esse conteúdo ao carregar).
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { SITE, getRoutes } from './seo-routes.mjs';

const DIST = path.join(process.cwd(), 'dist');
const esc = (v) => String(v).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const template = await readFile(path.join(DIST, 'index.html'), 'utf8');

function setTag(html, regex, replacement) {
  if (!regex.test(html)) throw new Error(`Tag não encontrada no index.html: ${regex}`);
  return html.replace(regex, replacement);
}

for (const r of await getRoutes()) {
  const canonical = SITE + r.path;
  const cover = r.images[0] ?? { src: '/assets/icaro-pinto-lira.jpg', alt: 'Ícaro Pinto Lira' };
  const coverUrl = SITE + cover.src;
  let html = template;
  html = setTag(html, /<title>[^<]*<\/title>/, `<title>${esc(r.title)}</title>`);
  html = setTag(html, /<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${esc(canonical)}">`);
  for (const [attr, key, value] of [
    ['name', 'description', r.description],
    ['property', 'og:title', r.title],
    ['property', 'og:description', r.description],
    ['property', 'og:url', canonical],
    ['property', 'og:image', coverUrl],
    ['property', 'og:image:alt', cover.alt],
    ['name', 'twitter:title', r.title],
    ['name', 'twitter:description', r.description],
    ['name', 'twitter:image', coverUrl],
    ['name', 'twitter:image:alt', cover.alt],
  ]) {
    html = setTag(html, new RegExp(`<meta ${attr}="${key}" content="[^"]*">`), `<meta ${attr}="${key}" content="${esc(value)}">`);
  }
  if (!/\.jpe?g$/i.test(cover.src)) html = html.replace(/<meta property="og:image:type" content="[^"]*">\n?/, '');

  const content = [
    `<h1>${esc(r.heading)}</h1>`,
    `<p>${esc(r.description)}</p>`,
    ...r.images.map((img) => `<img src="${esc(img.src)}" alt="${esc(img.alt)}" loading="lazy" style="max-width:160px;height:auto;margin:8px">`),
    ...(r.links ?? []).map((l) => `<a href="${esc(l.href)}">${esc(l.text)}</a>`),
  ].join('\n');
  html = setTag(html, /<div id="root"><\/div>/, `<div id="root"><div class="prerender" style="max-width:860px;margin:40px auto;padding:0 20px">\n${content}\n</div></div>`);

  const out = r.path === '/' ? path.join(DIST, 'index.html') : path.join(DIST, r.path, 'index.html');
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, html);
}
console.log('HTML pré-renderizado para todas as rotas.');
