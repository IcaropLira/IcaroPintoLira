import { useMemo, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import AchievementCard from '../components/AchievementCard';
import AchievementFeature from '../components/AchievementFeature';
import Reveal from '../components/Reveal';
import Sparkle from '../components/Sparkle';
import { achievements, CATEGORY_NAMES, featuredAchievement, type AchievementCategory } from '../data/achievements';
import { usePageTitle } from '../lib/usePageTitle';
import '../styles-conquistas.css';

type Filter = 'todas' | AchievementCategory;
const delay = (i: number) => ({ '--i': i }) as CSSProperties;

export default function ConquistasHub() {
  usePageTitle('Conquistas');
  const [filter, setFilter] = useState<Filter>('todas');

  const featured = featuredAchievement();
  const categories = useMemo(() => [...new Set(achievements.map((a) => a.category))], []);
  const medals = achievements.filter((a) => a.medal).length;
  const latest = Math.max(...achievements.map((a) => a.year));

  // Com o filtro "todas", o destaque aparece grande no topo e sai da grade.
  const showFeature = filter === 'todas' && !!featured;
  const list = achievements
    .filter((a) => (filter === 'todas' ? true : a.category === filter))
    .filter((a) => !(showFeature && a.slug === featured?.slug))
    .sort((a, b) => b.year - a.year);
  const years = [...new Set(list.map((a) => a.year))];

  return (
    <div className="hub">
      <svg width="0" height="0" aria-hidden="true"><defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ee0f7f" /><stop offset=".5" stopColor="#ff8db8" /><stop offset="1" stopColor="#6b3fa0" />
        </linearGradient>
      </defs></svg>

      <div className="hub-hero">
        <div className="glow" />
        <Sparkle className="float" size={22} style={{ top: '16%', left: '6%' }} />
        <Sparkle className="float" size={16} style={{ top: '30%', left: '90%', animationDelay: '1.2s' }} />
        <div className="w hub-hero-in">
          <Link className="back" to="/">← Início</Link>
          <div className="sub up" style={{ '--d': 0 } as CSSProperties}>Conquistas</div>
          <h1 className="up" style={{ '--d': 1 } as CSSProperties}>Prêmios, medalhas <em>e marcos.</em></h1>
          <p className="hub-lead up" style={{ '--d': 2 } as CSSProperties}>
            Tudo o que eu conquistei até aqui, com as pessoas que estavam do meu lado em cada momento.
          </p>

        </div>
      </div>

      <section className="hub-sec">
        <div className="w">
          {categories.length > 1 && (
            <div className="chips hub-chips" role="group" aria-label="Filtrar por categoria">
              {(['todas', ...categories] as Filter[]).map((f) => (
                <button key={f} type="button" className={`chip ${f === filter ? 'on' : ''}`} aria-pressed={f === filter} onClick={() => setFilter(f)}>
                  {f === 'todas' ? 'Todas' : CATEGORY_NAMES[f]}
                </button>
              ))}
            </div>
          )}

          {showFeature && featured && (
            <Reveal>
              <div className="k hub-k">Em destaque</div>
              <AchievementFeature item={featured} cta="Abrir a página da conquista →" />
            </Reveal>
          )}

          {years.map((y) => (
            <Reveal key={y}>
              <div className="hub-year"><h2>{y}</h2><span aria-hidden="true" /></div>
              <div className="hub-grid">
                {list.filter((a) => a.year === y).map((a, i) => (
                  <div key={a.slug} className="st" style={delay(i)}><AchievementCard item={a} /></div>
                ))}
              </div>
            </Reveal>
          ))}

          <Reveal>
            <div className="hub-next">
              <Sparkle size={26} />
              <div>
                <b>Voltaremos ainda mais fortes.</b>
                <p>“I was born not knowing and have had only a little time to change that here and there.” -Richard Feynman</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
