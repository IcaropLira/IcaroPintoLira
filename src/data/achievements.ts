export type AchievementCategory = 'competicao' | 'premio' | 'certificacao' | 'outro';
export type MedalKind = 'ouro' | 'prata' | 'bronze';

export const CATEGORY_NAMES: Record<AchievementCategory, string> = {
  competicao: 'Competições',
  premio: 'Prêmios',
  certificacao: 'Certificações',
  outro: 'Outras',
};

export const MEDAL_NAMES: Record<MedalKind, string> = { ouro: 'Ouro', prata: 'Prata', bronze: 'Bronze' };

export interface Achievement {
  slug: string;
  badge: string;
  title: string;
  summary: string;
  photo: string;
  photoAlt: string;
  tags: string[];
  year: number;
  /** Texto curto com a data, como "Edição 2026". */
  dateLabel: string;
  org: string;
  category: AchievementCategory;
  medal?: MedalKind;
  /** A conquista marcada como destaque aparece grande na Home e no topo do hub. Só uma deve ter true. */
  featured?: boolean;
}

/**
 * Para adicionar uma conquista: coloque a foto em public/assets/conquistas, inclua um item aqui
 * e crie a página dela em src/pages (depois registre o slug em ConquistaPage.tsx).
 */
export const achievements: Achievement[] = [
  {
    slug: 'opi-2026',
    badge: '✦ Conquista recente',
    title: 'Medalha de prata na OPI 2026',
    summary:
      'Em equipe com Guilherme Jales Marinho e Henrique Souza Santos, representei a UFCG no Avançado Júnior da Olimpíada Paraibana de Informática e voltei do palco com a medalha de prata.',
    photo: 'opi-palco.jpg',
    photoAlt: 'Equipe da UFCG no palco da OPI 2026, com medalhas e certificados, ao lado de dois professores',
    tags: ['OPI 2026', 'Avançado Júnior', 'Equipe de 3', 'UFCG'],
    year: 2026,
    dateLabel: 'Edição 2026',
    org: 'Olimpíada Paraibana de Informática',
    category: 'competicao',
    medal: 'prata',
    featured: true,
  },
];

export const NEWTON_QUOTE = 'Se enxerguei mais longe, foi por estar sobre os ombros de gigantes.';

export function featuredAchievement(): Achievement | undefined {
  return achievements.find((a) => a.featured) ?? achievements[0];
}
