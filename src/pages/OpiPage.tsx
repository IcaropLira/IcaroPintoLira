import { useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import Lightbox, { type Photo } from '../components/Lightbox';
import Medal from '../components/Medal';
import Reveal from '../components/Reveal';
import Sparkle from '../components/Sparkle';
import { NEWTON_QUOTE } from '../data/achievements';
import '../styles-conquistas.css';

const OPI_SITE = 'https://www.dsc.ufcg.edu.br/~opi/';
const RESULT_PDF = 'https://dsc.ufcg.edu.br/~opi/resultados/2026/resultado-avancado-junior-2026.pdf';
const delay = (i: number) => ({ '--i': i }) as CSSProperties;

const STATS = [
  { n: '5 h', l: 'de prova' },
  { n: '3', l: 'pessoas por equipe' },
  { n: '≈10', l: 'problemas' },
  { n: '4', l: 'linguagens: C, C++, Java e Python' },
] as const;

const TEAM = [
  { name: 'Ícaro Pinto Lira', note: 'Pensão de Pet II, Ciência da Computação, UFCG' },
  { name: 'Guilherme Jales Marinho', note: 'Pensão de Pet II, Ciência da Computação, UFCG' },
  { name: 'Henrique Souza Santos', note: 'Pensão de Pet II, Ciência da Computação, UFCG' },
] as const;

const CATEGORIES = [
  { t: 'Iniciação 1 e 2', p: 'Do 1º ao 8º ano do fundamental, com questões de múltipla escolha de raciocínio lógico.' },
  { t: 'Programação', p: '9º ano e ensino médio. Cerca de 5 problemas, em laboratório, com correção offline.' },
  { t: 'Torneio Feminino', p: 'Categorias Júnior (fundamental e médio) e Sênior (superior).' },
  { t: 'Avançado Júnior', p: 'Para quem ainda não cursou Estrutura de Dados no ensino superior. Equipes de 3, estilo ICPC.', mine: true },
  { t: 'Avançado Sênior', p: 'Estudantes do ensino superior, no mesmo formato do Avançado Júnior.' },
] as const;

const PHOTOS: Photo[] = [
  { src: 'opi-palco.jpg', w: 1280, h: 1280, alt: 'Equipe da UFCG no palco da OPI, com medalhas e certificados, ao lado de dois professores', caption: 'Recebendo a medalha no palco, com os certificados nas mãos' },
  { src: 'opi-palco-lateral.jpg', w: 854, h: 1280, alt: 'A mesma cena do palco, vista de outro ângulo, com o painel de premiação ao fundo', caption: 'A cerimônia de premiação vista de outro ângulo' },
  { src: 'opi-equipe.jpg', w: 886, h: 1182, alt: 'Três integrantes da equipe com medalhas e certificados, em frente a uma parede clara', caption: 'A equipe com as medalhas e os certificados' },
  { src: 'opi-medalhistas.jpg', w: 1280, h: 720, alt: 'Oito medalhistas lado a lado, cada um com medalha no pescoço e certificado nas mãos', caption: 'Medalhistas reunidos depois da cerimônia' },
  { src: 'opi-medalha.jpg', w: 852, h: 1280, alt: 'Retrato de um participante mostrando a medalha e o certificado, em frente ao painel da OPI', caption: 'Medalha e certificado, em frente ao painel da OPI' },
];

export default function OpiPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <article className="opi">
      <svg width="0" height="0" aria-hidden="true"><defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ee0f7f" /><stop offset=".5" stopColor="#ff8db8" /><stop offset="1" stopColor="#6b3fa0" />
        </linearGradient>
      </defs></svg>

      {/* Abertura */}
      <div className="opi-hero">
        <div className="glow" />
        <Sparkle className="float" size={22} style={{ top: '10%', left: '5%' }} />
        <Sparkle className="float" size={14} style={{ top: '88%', left: '44%', animationDelay: '1.6s' }} />
        <Sparkle className="float" size={18} style={{ top: '14%', left: '92%', animationDelay: '.8s' }} />
        <div className="w opi-hero-in">
          <div className="opi-copy">
            <Link className="back" to="/conquistas">← Todas as conquistas</Link>
            <div className="sub up" style={{ '--d': 0 } as CSSProperties}>OPI 2026 · Avançado Júnior</div>
            <h1 className="up" style={{ '--d': 1 } as CSSProperties}>Medalha de <em>prata</em> na OPI</h1>
            <p className="opi-lead up" style={{ '--d': 2 } as CSSProperties}>
              Em equipe com Guilherme Jales Marinho e Henrique Souza Santos, representei a equipe Pensão de Pet II, da UFCG, na Olimpíada Paraibana de Informática e subi ao palco para receber a medalha de prata das mãos dos professores.
            </p>
            <div className="btns up" style={{ '--d': 3 } as CSSProperties}>
              <a className="btn p" href={RESULT_PDF} target="_blank" rel="noopener noreferrer">Resultado oficial ↗</a>
              <a className="btn" href={OPI_SITE} target="_blank" rel="noopener noreferrer">Site da OPI ↗</a>
            </div>
          </div>
          <div className="opi-main up" style={{ '--d': 2 } as CSSProperties}>
            <button type="button" className="opi-main-btn" onClick={() => setOpen(0)} aria-label="Ampliar a foto do palco">
              <img src="/assets/conquistas/opi-palco.jpg" width={1280} height={1280} fetchPriority="high"
                alt={PHOTOS[0]?.alt} />
            </button>
            <Medal className="opi-main-medal" size={132} />
            <span className="opi-chip">Cerimônia de premiação</span>
          </div>
        </div>
      </div>

      {/* Números da prova */}
      <section className="opi-sec opi-stats-sec">
        <div className="w">
          <Reveal>
            <div className="opi-stats">
              {STATS.map((s, i) => (
                <div key={s.l} className="st" style={delay(i)}><b>{s.n}</b><span>{s.l}</span></div>
              ))}
            </div>
            <p className="opi-src">Formato da prova do Avançado, conforme o site da OPI. Vence a equipe que resolve mais problemas, em menos tempo e com menos erros.</p>
          </Reveal>
        </div>
      </section>

      {/* Equipe */}
      <section className="opi-sec">
        <div className="w opi-team">
          <Reveal>
            <div className="k">A equipe</div>
            <h2>Uma equipe, <em>cinco horas.</em></h2>
            <p className="lead">O Avançado é por equipes de três, no estilo das maratonas ICPC: problemas de algoritmos, tempo contado e nada de internet. Ninguém resolve tudo sozinho.</p>
            <ul className="opi-people">
              {TEAM.map((m, i) => (
                <li key={m.name} className="st" style={delay(i)}>
                  <span className="opi-av" aria-hidden="true">{m.name.charAt(0)}</span>
                  <div><b>{m.name}</b><span>{m.note}</span></div>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <button type="button" className="opi-team-photo" onClick={() => setOpen(2)} aria-label="Ampliar a foto da equipe">
              <img src="/assets/conquistas/opi-equipe.jpg" width={886} height={1182} loading="lazy" alt={PHOTOS[2]?.alt} />
            </button>
          </Reveal>
        </div>
      </section>

      {/* Citação */}
      <section className="opi-sec opi-quote-sec">
        <div className="w">
          <Reveal>
            <figure className="opi-quote">
              <span className="opi-qmark" aria-hidden="true">“</span>
              <blockquote>{NEWTON_QUOTE}</blockquote>
              <figcaption>Isaac Newton <span>em carta a Robert Hooke, 1675</span></figcaption>
            </figure>
            <div className="opi-reflect">
              <div className="k">Do meu post sobre a conquista</div>
              <p>
                Existe uma frase atribuída a Isaac Newton que diz: “{NEWTON_QUOTE}” Acredito que ela representa muito do que significa aprender e construir conhecimento: ninguém chega longe sozinho. Cada descoberta é fruto de muitas outras que vieram antes, e cada conquista também carrega um pouco das pessoas que caminharam ao nosso lado.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Sobre a OPI */}
      <section className="opi-sec">
        <div className="w">
          <Reveal>
            <div className="k">A competição</div>
            <h2>Olimpíada Paraibana <em>de Informática.</em></h2>
            <p className="lead">
              Um projeto olímpico do curso de Ciência da Computação da UFCG. A OPI quer despertar o interesse de estudantes por computação, preparar paraibanos para a OBI, a OBI Internacional e o ICPC, e estimular quem está no ensino superior a se aprofundar em programação e algoritmos. A tabela de resultados no site da prova vai de 2008 a 2026.
            </p>
            <div className="opi-cats">
              {CATEGORIES.map((c, i) => (
                <div key={c.t} className={`st${'mine' in c ? ' mine' : ''}`} style={delay(i)}>
                  <div className="card">
                    {'mine' in c && <span className="badge">minha categoria</span>}
                    <h3>{c.t}</h3>
                    <p>{c.p}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="two opi-facts">
              <div className="card">
                <h3>Como foi a prova</h3>
                <p>A fase do Avançado em 2026 foi no dia 08/08, com aquecimento às 08:00 e prova às 13:00. Material impresso pode ser consultado. Materiais digitais, aparelhos eletrônicos e a internet, exceto o ambiente da prova, ficam de fora.</p>
              </div>
              <div className="card">
                <h3>Quem faz acontecer</h3>
                <p>A OPI é organizada pelo curso de Ciência da Computação da UFCG, em Campina Grande, com o apoio do Virtus e do Brain. Os resultados de cada edição ficam publicados em PDF no site da prova.</p>
              </div>
            </div>
            <div className="btns opi-links">
              <a className="btn" href={OPI_SITE} target="_blank" rel="noopener noreferrer">Site da OPI ↗</a>
              <a className="btn" href={RESULT_PDF} target="_blank" rel="noopener noreferrer">Resultado do Avançado Júnior ↗</a>
              <a className="btn" href="https://instagram.com/olimp_pb" target="_blank" rel="noopener noreferrer">@olimp_pb no Instagram ↗</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Galeria */}
      <section className="opi-sec">
        <div className="w">
          <Reveal>
            <div className="k">Galeria</div>
            <h2>O dia, <em>em fotos.</em></h2>
            <p className="lead">Clique em uma foto para ampliar. Dá para trocar de foto com as setas do teclado.</p>
            <div className="opi-gallery">
              {PHOTOS.map((p, i) => (
                <figure key={p.src} className="st" style={{ ...delay(i), '--ar': (p.w / p.h).toFixed(3) } as CSSProperties}>
                  <button type="button" onClick={() => setOpen(i)} aria-label={`Ampliar: ${p.caption}`}>
                    <img src={`/assets/conquistas/${p.src}`} width={p.w} height={p.h} loading="lazy" alt={p.alt} />
                  </button>
                  <figcaption>{p.caption}</figcaption>
                </figure>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="opi-sec opi-end">
        <div className="w">
          <div className="opi-cta">
            <Medal size={84} />
            <h2>Obrigado a quem <em>caminhou junto.</em></h2>
            <p>Aos professores, à UFCG, à organização da OPI e, principalmente, aos meus dois companheiros de equipe.</p>
            <div className="btns">
              <Link className="btn p" to="/conquistas">Ver todas as conquistas</Link>
              <Link className="btn" to="/#competitiva">Ver projetos de competitiva</Link>
            </div>
          </div>
        </div>
      </section>

      <Lightbox photos={PHOTOS} index={open} onChange={setOpen} />
    </article>
  );
}
