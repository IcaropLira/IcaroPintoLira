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
}

export interface RepoStats {
  stars: number;
  language: string | null;
}
