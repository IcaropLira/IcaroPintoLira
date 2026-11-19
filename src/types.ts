export type Category = 'setup' | 'apps' | 'competitiva' | 'lib';

export interface Project {
  slug: string;
  title: string;
  summary: string;
  category: Category;
  repo: string;
  logo: string;
  featured: boolean;
  highlight: boolean;
  order: number;
  stack: string[];
  body: string;
  website?: string;
  /** Mostra os instaladores da release mais recente do GitHub. */
  releases: boolean;
  /** Arquivo .repo do dnf (Fedora), se houver. */
  dnfRepo?: string;
  /** Nome do pacote no dnf e do binário instalado. */
  packageName?: string;
  /** Página na Chrome Web Store (extensões). */
  chrome?: string;
  /** Página no Firefox Add-ons (extensões). */
  firefox?: string;
}

export interface RepoStats {
  stars: number;
  language: string | null;
}
