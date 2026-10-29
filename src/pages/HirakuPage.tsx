import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import ReleaseDownloads from '../components/ReleaseDownloads';
import Reveal from '../components/Reveal';
import Sparkle from '../components/Sparkle';
import '../styles-hiraku.css';
import { GITHUB_USER } from '../data/profile';
import { formatSize, PLATFORM_LABEL, detectPlatform, pickRecommended, useLatestRelease } from '../lib/release';

const REPO = 'HirakuComicManager';
const REPO_URL = `https://github.com/${GITHUB_USER}/${REPO}`;
const RELEASES_URL = `${REPO_URL}/releases`;
const delay = (i: number) => ({ '--i': i }) as CSSProperties;

const SHOTS = [
  { src: 'matriz', title: 'Matriz', text: 'Quem aparece em cada capítulo e quais tramas correm em paralelo.', alt: 'Matriz de personagens e tramas por capítulo' },
  { src: 'timeline', title: 'Timeline', text: 'Capítulos por ordem de publicação ou pela cronologia interna, com elenco, tramas e a rede de cada um.', alt: 'Linha do tempo com os detalhes de um capítulo' },
  { src: 'ficha-layout', title: 'Fichas, tramas e capítulos', text: 'Editor em blocos e um modo Layout com a leitura limpa da ficha, incluindo as versões do personagem por capítulo.', alt: 'Ficha de personagem no modo Layout' },
  { src: 'roteiro-layout', title: 'Roteiros de quadrinhos', text: 'Páginas, painéis, falas, legendas e SFX, com Layout para leitura e um relatório de palavras por painel.', alt: 'Roteiro de quadrinhos no modo Layout' },
] as const;

const FEATURES = [
  { t: 'Veja a história inteira', p: 'Quem aparece em cada capítulo, quais tramas se cruzam e como os personagens se relacionam.' },
  { t: 'Escreva em blocos', p: 'Fichas, tramas, capítulos e roteiros, cada um com um modo Layout de leitura.' },
  { t: 'Trabalhe em dupla', p: 'Commit, push, pull e merge automáticos pelo GitHub, sem abrir o terminal.' },
  { t: 'Seus arquivos são seus', p: 'Tudo volta para o .md. Sem formato proprietário, e a mesma pasta abre no Obsidian.' },
  { t: 'Sempre atualizado', p: 'O app avisa quando existe versão nova e se atualiza sozinho.' },
  { t: 'Leve e nativo', p: 'Feito com Tauri 2 e Rust, com instaladores para Windows, macOS e Linux.' },
] as const;

const VAULT_TREE = `Meu Vault/
└── Nome da Série/
    ├── Fichas de Personagem/
    │   └── Família Aurelo/      ← vira o "grupo"
    │       └── Marina Aurelo.md
    ├── Capítulos/               01 - A Luz Que Apagou.md
    ├── Tramas/                  A luz que não acende.md
    ├── Locais/                  Farol de Vila Aurora.md
    └── Roteiros/                Roteiro — 01 - A Luz Que Apagou.md`;

const VAULT_NOTE = `---
tipo: personagem
versoes:
  - nome: Marina criança
    idade: 9
    caps: ["01 - A Luz Que Apagou"]
  - nome: Marina
    idade: 19
    caps: ["02 - Maré Baixa"]
---

### Relações e Conflitos
- [[Tomás Aurelo]] #rel/família
- [[Capitão Brás]] #rel/rival`;

const SYNC = [
  { w: 'Você salva uma nota', o: 'Puxa o remoto, faz o commit e envia o push.' },
  { w: 'O app abre, a cada minuto ou quando a janela volta ao foco', o: 'Consulta o remoto. Se alguém enviou alterações, avisa, faz o pull e o merge, e o Vault recarrega.' },
  { w: 'Você está com um editor aberto', o: 'O aviso espera. O app só puxa depois que você salvar e sair, para nunca sobrescrever o que está escrevendo.' },
  { w: 'Duas pessoas editam o mesmo trecho', o: 'O app desfaz o rebase, avisa quais arquivos conflitaram e deixa o Vault limpo, sem marcadores de conflito.' },
] as const;

const STEPS = [
  { t: 'Escolha o Vault', p: 'Na Home, clique em Escolher pasta… e aponte para a pasta das suas notas. O app lembra da última.' },
  { t: 'Ou comece pelo exemplo', p: 'A pasta exemplo/ do repositório traz 6 personagens, 5 capítulos, 2 tramas, 2 locais e um roteiro.' },
  { t: 'Já tem a história no GitHub?', p: 'Use Clonar projeto na Home, informe a URL e escolha onde criar a pasta.' },
  { t: 'Edite à vontade', p: 'Salvar no arquivo grava o .md e deixa uma cópia .md.bak ao lado, que entra sozinha no .gitignore.' },
] as const;

const FAQ = [
  { q: 'Funciona com o Obsidian?', a: 'Sim. O Vault é uma pasta de arquivos Markdown com links [[...]]. Você pode abrir a mesma pasta nos dois.' },
  { q: 'Meus arquivos vão para a nuvem?', a: 'Não, a menos que você conecte um repositório do GitHub. As notas ficam na sua pasta. O app só usa a internet para entrar e sincronizar com o GitHub, se você usar esse recurso, e para procurar atualizações.' },
  { q: 'O login do GitHub guarda minha senha?', a: 'Não. Você autoriza pelo navegador com um código, e o token fica no gerenciador de credenciais do Git do sistema, fora do Vault. Para sair, use Sair na aba Git.' },
  { q: 'E se eu e meu amigo editarmos o mesmo arquivo?', a: 'Trechos diferentes se juntam sozinhos. No mesmo trecho, o app avisa o conflito sem mexer no seu Vault.' },
  { q: 'Por que as "Páginas" não aparecem no meu amigo?', a: 'Elas ficam só dentro do app, neste computador, e não vão para o Vault nem para o Git. Para compartilhar, use as subpáginas de uma nota.' },
  { q: 'Como o app se atualiza?', a: 'Ele procura versões novas ao abrir e a cada 6 horas. A atualização silenciosa vale para Windows, macOS e AppImage. Instalações .deb e .rpm são atualizadas pelo gerenciador de pacotes do sistema.' },
] as const;

const FLOATING = [
  { size: 22, top: '8%', left: '4%', d: 0 }, { size: 14, top: '18%', left: '56%', d: 1.4 },
  { size: 18, top: '78%', left: '2%', d: 2.2 },
];

function HeroDownload({ state }: { state: ReturnType<typeof useLatestRelease> }) {
  const mine = detectPlatform();
  if (state.status === 'ok' && mine) {
    const file = pickRecommended(state.release.files, mine);
    if (file) {
      return (
        <a className="btn p" href={file.url} rel="noopener noreferrer">
          Baixar para {PLATFORM_LABEL[mine]} · {state.release.tag} <small>({file.kind}, {formatSize(file.size)})</small>
        </a>
      );
    }
  }
  return <a className="btn p" href="#baixar">{state.status === 'ok' ? `Baixar ${state.release.tag}` : 'Baixar'}</a>;
}

export default function HirakuPage() {
  const state = useLatestRelease(REPO);

  return (
    <article className="hk">
      <svg width="0" height="0" aria-hidden="true"><defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ee0f7f" /><stop offset=".5" stopColor="#ff8db8" /><stop offset="1" stopColor="#6b3fa0" />
        </linearGradient>
      </defs></svg>

      <div className="hk-hero">
        <div className="glow" />
        {FLOATING.map((f, i) => <Sparkle key={i} className="float" size={f.size} style={{ top: f.top, left: f.left, animationDelay: `${f.d}s` }} />)}
        <div className="w hk-hero-in">
          <div className="hk-copy">
            <Link className="back" to="/#projetos">← Voltar</Link>
            <div className="hk-title up" style={{ '--d': 0 } as CSSProperties}>
              <img src="/assets/hiraku-comic-manager.png" width={84} height={84} alt="Logo do Hiraku Comics Manager" />
              <div className="k">Apps · app desktop</div>
            </div>
            <h1 className="up" style={{ '--d': 1 } as CSSProperties}>Hiraku <em>Comics</em> Manager</h1>
            <p className="hk-lead up" style={{ '--d': 2 } as CSSProperties}>
              Organize personagens, tramas, capítulos e roteiros da sua história num só lugar. Seus arquivos continuam sendo Markdown comum, e a colaboração por GitHub acontece sozinha.
            </p>
            <div className="btns up" style={{ '--d': 3 } as CSSProperties}>
              <HeroDownload state={state} />
              <a className="btn" href={REPO_URL} target="_blank" rel="noopener noreferrer">Ver no GitHub ↗</a>
            </div>
            <div className="tags up" style={{ '--d': 4 } as CSSProperties}>
              {['Tauri 2', 'Rust', 'JavaScript', 'Windows · macOS · Linux'].map((t) => <span key={t}>{t}</span>)}
            </div>
          </div>
          <div className="hk-shot up" style={{ '--d': 2 } as CSSProperties}>
            <div className="mrcpp-preview-header">
              <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
              <span className="mrcpp-url-pill">Farol de Vila Aurora · Grafo</span>
            </div>
            <img src="/assets/hiraku/grafo.png" width={1400} height={860} fetchPriority="high"
              alt="Grafo do app com personagens, capítulos, tramas e locais conectados" />
          </div>
        </div>
      </div>

      <section id="baixar" className="hk-sec">
        <div className="w">
          <Reveal>
            <div className="k">Download</div>
            <h2>Baixe a <em>versão mais recente</em></h2>
            <p className="lead">Os instaladores vêm direto da release mais nova do GitHub. Depois da primeira instalação, o app se atualiza sozinho.</p>
            <ReleaseDownloads state={state} releasesUrl={`${RELEASES_URL}/latest`} />
            <p className="hk-note">No Linux, o AppImage é portátil: dê permissão de execução ao arquivo e abra. O <code>.deb</code> e o <code>.rpm</code> registram o app no menu do sistema.</p>
          </Reveal>
        </div>
      </section>

      <section className="hk-sec">
        <div className="w">
          <Reveal>
            <div className="k">Para que serve</div>
            <h2>Uma história longa, <em>tudo à mão</em></h2>
            <p className="lead">Quem escreve uma história longa acaba com dezenas de fichas, capítulos e anotações espalhados. O Hiraku lê uma pasta de notas em Markdown, o Vault, e transforma os links <code>[[entre notas]]</code> em mapas, tabelas e linhas do tempo.</p>
            <div className="grid hk-features">
              {FEATURES.map((f, i) => (
                <div key={f.t} className="st" style={delay(i)}>
                  <div className="card"><h3>{f.t}</h3><p>{f.p}</p></div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="recursos" className="hk-sec">
        <div className="w">
          <Reveal>
            <div className="k">Recursos</div>
            <h2>Visualizar e <em>escrever</em></h2>
            <p className="lead">Além do Grafo, há Cartões de capítulos e uma Ficha rápida de cada personagem, com rede de relações e versões. As capturas abaixo usam o Vault de exemplo incluído no repositório, uma história fictícia chamada <i>O Farol de Vila Aurora</i>.</p>
            <div className="hk-shots">
              {SHOTS.map((s, i) => (
                <figure key={s.src} className="st" style={delay(i)}>
                  <div className="hk-frame">
                    <img src={`/assets/hiraku/${s.src}.png`} width={1400} height={860} loading="lazy" alt={s.alt} />
                  </div>
                  <figcaption><b>{s.title}</b><span>{s.text}</span></figcaption>
                </figure>
              ))}
            </div>
            <div className="two hk-extra">
              <div className="card"><h3>Subpáginas</h3><p>Qualquer nota pode ter páginas dentro dela. No disco, a nota <code>X.md</code> é a página-pai das notas que estão na pasta <code>X/</code>.</p></div>
              <div className="card"><h3>Páginas</h3><p>Um bloco de notas livre, com páginas dentro de páginas, para rascunhos. Ficam só dentro do app, neste computador, e não vão para o Vault nem para o Git.</p></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="hk-sec">
        <div className="w">
          <Reveal>
            <div className="k">O Vault</div>
            <h2>Notas comuns, <em>conexões automáticas</em></h2>
            <p className="lead">O app reconhece as notas pela pasta e pelo campo <code>tipo</code> no começo do arquivo. Para ligar notas, escreva <code>[[Nome da nota]]</code>: é isso que forma o grafo, a matriz e o &quot;Aparece em&quot;.</p>
            <div className="hk-code">
              <div className="mrcpp-preview"><div className="mrcpp-snippet-title">Estrutura de pastas</div><pre><code>{VAULT_TREE}</code></pre></div>
              <div className="mrcpp-preview"><div className="mrcpp-snippet-title">Marina Aurelo.md</div><pre><code>{VAULT_NOTE}</code></pre></div>
            </div>
            <p className="hk-note">Tipos aceitos: <code>personagem</code>, <code>trama</code>, <code>capitulo</code>, <code>roteiro</code>, <code>local</code>, <code>org</code> e <code>sub</code>. Relações (<code>#rel/...</code>): aliado, rival, família, mentor, antagonista e amor.</p>
          </Reveal>
        </div>
      </section>

      <section className="hk-sec">
        <div className="w">
          <Reveal>
            <div className="k">GitHub</div>
            <h2>Em dupla, <em>sem terminal</em></h2>
            <p className="lead">Na aba Git, clique em Entrar com GitHub: o app mostra um código, abre o navegador e você autoriza. Depois é só conectar o repositório. Com o modo Automático ligado, que já vem ativado, ele faz sozinho o que você faria no GitHub Desktop.</p>
            <div className="two">
              {SYNC.map((s, i) => (
                <div key={s.w} className="st" style={delay(i)}><div className="card"><h3>{s.w}</h3><p>{s.o}</p></div></div>
              ))}
            </div>
            <p className="hk-note">Cada pessoa que for sincronizar precisa ser colaboradora do repositório. Para evitar conflitos, evitem editar a mesma nota ao mesmo tempo.</p>
          </Reveal>
        </div>
      </section>

      <section className="hk-sec">
        <div className="w">
          <Reveal>
            <div className="k">Primeiros passos</div>
            <h2>Do download à <em>primeira nota</em></h2>
            <ol className="hk-steps">
              {STEPS.map((s, i) => (
                <li key={s.t} className="st" style={delay(i)}>
                  <span className="hk-n">{i + 1}</span>
                  <div><b>{s.t}</b><p>{s.p}</p></div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="hk-sec">
        <div className="w hk-faq-w">
          <Reveal>
            <div className="k">Dúvidas</div>
            <h2>Perguntas <em>frequentes</em></h2>
            <div className="hk-faq">
              {FAQ.map((f) => (
                <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="hk-sec hk-end">
        <div className="w">
          <div className="hk-cta">
            <img src="/assets/hiraku-comic-manager.png" width={64} height={64} alt="" />
            <h2>Comece a <em>organizar</em> a sua história</h2>
            <div className="btns">
              <a className="btn p" href="#baixar">Ir para os downloads</a>
              <a className="btn" href={REPO_URL} target="_blank" rel="noopener noreferrer">Código no GitHub ↗</a>
              <a className="btn btn-ghost" href={`${REPO_URL}/issues`} target="_blank" rel="noopener noreferrer">Reportar um problema ↗</a>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
