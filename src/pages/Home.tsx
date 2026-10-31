import { useMemo, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import AchievementsSection from '../components/AchievementsSection';
import Markdown from '../components/Markdown';
import ProjectCard from '../components/ProjectCard';
import Reveal from '../components/Reveal';
import Sparkle from '../components/Sparkle';
import { links } from '../data/profile';
import { useRepoStats } from '../lib/github';
import { about, projects } from '../lib/content';
import { usePageTitle } from '../lib/usePageTitle';

type Filter = 'competitiva' | 'todos';
const FILTERS: Filter[] = ['competitiva', 'todos'];
const delay = (i: number) => ({ '--i': i }) as CSSProperties;

const FLOATING = [
  { size: 26, top: '16%', left: '14%', d: 0 }, { size: 14, top: '26%', left: '82%', d: 1.2 },
  { size: 20, top: '66%', left: '9%', d: 2.1 }, { size: 32, top: '72%', left: '88%', d: 0.6 },
  { size: 12, top: '12%', left: '62%', d: 1.8 },
];

function Hero() {
  return (
    <section className="hero2">
      <svg width="0" height="0" aria-hidden="true"><defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ee0f7f" /><stop offset=".5" stopColor="#ff8db8" /><stop offset="1" stopColor="#6b3fa0" />
        </linearGradient>
      </defs></svg>
      <div className="glow" />
      {FLOATING.map((f, i) => (
        <Sparkle key={i} className="float" size={f.size} style={{ top: f.top, left: f.left, animationDelay: `${f.d}s` }} />
      ))}
      <div className="hero-in">
        <div className="avatar up" style={{ '--d': 0 } as CSSProperties}>
          <div className="orbit"><Sparkle size={18} /></div>
          <img src="/assets/icaro-pinto-lira.jpg" width={400} height={400} fetchPriority="high"
            alt="Ícaro Pinto Lira, estudante de Ciência da Computação da UFCG" />
        </div>
        <div className="tag up" style={{ '--d': 1 } as CSSProperties}>~/icaro $ whoami</div>
        <h1 className="up" style={{ '--d': 2 } as CSSProperties}>Ícaro <em>Pinto Lira</em></h1>
        <div className="sub up" style={{ '--d': 3 } as CSSProperties}>Ciência da Computação · UFCG</div>
        <div className="up" style={{ '--d': 4 } as CSSProperties}><Markdown>{about}</Markdown></div>
        <div className="btns up" style={{ '--d': 5 } as CSSProperties}>
          <a className="btn p" href="#destaques">Ver projetos</a>
          {links.map((l) => <a key={l.label} className="btn" href={l.href} target="_blank" rel="noopener noreferrer">{l.label} ↗</a>)}
        </div>
        <a className="cue" href="#setup" aria-label="Rolar para baixo">↓</a>
      </div>
    </section>
  );
}

export default function Home() {
  usePageTitle('Ciência da Computação, UFCG');
  const stats = useRepoStats();
  const [filter, setFilter] = useState<Filter>('competitiva');

  const setup = useMemo(() => projects.filter((p) => p.category === 'setup'), []);
  const masterProjects = useMemo(() => projects.filter((p) => p.category === 'apps'), []);
  const competitiveProjects = useMemo(
    () => projects.filter((p) => p.category === 'competitiva' && p.slug !== 'mrcpp'),
    []
  );

  const displayedRest = useMemo(() => {
    if (filter === 'todos') {
      return projects.filter((p) => p.category !== 'setup' && p.slug !== 'mrcpp');
    }
    return competitiveProjects;
  }, [filter, competitiveProjects]);

  return (
    <>
      <Hero />

      <AchievementsSection />

      {/* 02 — SETUP */}
      <section id="setup">
        <div className="w">
          <Reveal>
            <div className="k">02 — setup</div>
            <h2>Meu ambiente, <em>do meu jeito.</em></h2>
            <p className="lead">Vim, Neovim, terminal e tmux configurados para escrever código sem tirar a mão do teclado.</p>
            <div className="setup">
              {setup.map((p, i) => (
                <div key={p.slug} className="st" style={delay(i)}>
                  <Link className={`s${p.highlight ? ' all' : ''}`} to={`/projetos/${p.slug}`}>
                    {p.highlight && <i className="badge">tudo em um</i>}
                    <img src={`/assets/${p.logo}`} alt={`Logo de ${p.title}`} />
                    <b>{p.title}</b>
                    <span>{p.repo}</span>
                  </Link>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 03 — DESTAQUES (Projetos Masters / Aplicações Complexas) */}
      <section id="destaques">
        <div className="w">
          <Reveal>
            <div className="k">03 — destaques</div>
            <h2>Projetos <em>em destaque.</em></h2>
            <p className="lead">Aplicações completas e projetos de maior complexidade desenvolvidos de ponta a ponta.</p>
            <div className="two">
              {masterProjects.map((p, i) => (
                <div key={p.slug} className="st" style={delay(i)}>
                  <ProjectCard project={p} stats={stats[p.repo]} badge="✦ Master" showStack />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 04 — BIBLIOTECA (Mr. C++) */}
      <section id="mrcpp">
        <div className="w">
          <Reveal>
            <div className="k">04 — biblioteca</div>
            <h2>Mr. C++ — <em>biblioteca de algoritmos.</em></h2>
            <p className="lead">
              Biblioteca completa de algoritmos e estruturas de dados em C++ para maratonas de programação competitiva, com documentação interativa.
            </p>

            <div className="mrcpp-banner">
              <div className="mrcpp-left">
                <div className="mrcpp-header">
                  <div className="mrcpp-logo-wrap">
                    <img src="/assets/mrcpp-logo.svg" alt="Logo Mr. C++" className="mrcpp-logo" />
                  </div>
                  <div>
                    <div className="mrcpp-badge-row">
                      <span className="badge">✦ Minha Lib</span>
                      <span className="badge badge-sub">C++17 · Programação Competitiva</span>
                    </div>
                    <h3 className="mrcpp-title">Mr. C++</h3>
                    <div className="mrcpp-repo">IcaropLira/MrCpp {stats['MrCpp'] ? `· ★ ${stats['MrCpp'].stars}` : ''}</div>
                  </div>
                </div>

                <p className="mrcpp-desc">
                  Acervo abrangente de implementações eficientes baseadas no <em>Competitive Programmer's Handbook</em>:
                  Segment Tree, Fenwick, Lazy Propagation, Grafos, Árvores (LCA, Euler Tour), Programação Dinâmica e Algoritmos de Strings (KMP, Z-algo, Aho-Corasick). Acesso rápido com busca instantânea e snippets prontos para maratonas.
                </p>

                <div className="mrcpp-tags">
                  <span>C++17</span>
                  <span>Segment Tree & Lazy</span>
                  <span>Grafos & LCA</span>
                  <span>DP Avançada</span>
                  <span>Strings (KMP/Z)</span>
                  <span>Docs Interativas</span>
                </div>

                <div className="mrcpp-actions">
                  <a
                    className="btn p"
                    href="https://mrcpp.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Entrar no Mr. C++ ↗
                  </a>
                  <a
                    className="btn"
                    href="https://github.com/IcaropLira/MrCpp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver no GitHub ↗
                  </a>
                  <Link className="btn btn-ghost" to="/projetos/mrcpp">
                    Ver detalhes →
                  </Link>
                </div>
              </div>

              <div className="mrcpp-preview">
                <div className="mrcpp-preview-header">
                  <span className="dot red" />
                  <span className="dot yellow" />
                  <span className="dot green" />
                  <span className="mrcpp-url-pill">mrcpp.vercel.app</span>
                </div>
                <div className="mrcpp-preview-body">
                  <div className="mrcpp-snippet-title">// Algoritmos & Estruturas para Maratonas</div>
                  <pre><code>{`#include <bits/stdc++.h>
using namespace std;

// Segment Tree, Fenwick, LCA, DP, Grafos & Strings
// Baseado no Competitive Programmer's Handbook
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    // Documentação completa e testada:
    // -> mrcpp.vercel.app
    return 0;
}`}</code></pre>
                  <a
                    href="https://mrcpp.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mrcpp-preview-link"
                  >
                    Acessar mrcpp.vercel.app ↗
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 05 — COMPETITIVA */}
      <section id="competitiva">
        <div id="projetos" />
        <div className="w">
          <Reveal>
            <div className="k">05 — competitiva</div>
            <h2>Programação <em>competitiva.</em></h2>
            <p className="lead">
              Extensões e utilitários criados para enriquecer o treinamento e a resolução de problemas em judges online.
            </p>
            <div className="chips">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`chip ${f === filter ? 'on' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f === 'todos' ? 'Todos os projetos' : 'Programação Competitiva'}
                </button>
              ))}
            </div>
            <div className="grid">
              {displayedRest.map((p, i) => (
                <div key={p.slug} className="st" style={delay(i)}>
                  <ProjectCard project={p} stats={stats[p.repo]} />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
