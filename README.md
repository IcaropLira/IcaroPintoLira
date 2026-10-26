# Hiraku Portfolio

Site pessoal em React + TypeScript (Vite). O conteúdo vive em arquivos Markdown.

## Rodar

    npm install
    npm run dev
    npm run build

## Conteúdo

- `content/about.md`: texto do topo.
- `content/projects/*.md`: um arquivo por projeto; o corpo vira a página completa em `/projetos/<slug>`.

Frontmatter: `title`, `summary`, `category` (setup | apps | competitiva), `repo`, `logo` (arquivo em `public/assets`), `featured` (true/false), `order`, `stack`.
Para tirar um projeto da home, use `featured: false`. Para criar um novo, crie um `.md`; nenhum código muda.

## Deploy

Vercel (Vite, build `npm run build`, saída `dist`). O `vercel.json` já faz o rewrite das rotas.
Troque `SEU-DOMINIO.vercel.app` no `index.html`.
# IcaroPintoLira
