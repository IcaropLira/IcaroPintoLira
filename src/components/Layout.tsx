import { Link, Outlet } from 'react-router-dom';
import { links } from '../data/profile';

export default function Layout() {
  return (
    <>
      <header>
        <div className="w">
          <Link className="brand" to="/"><img src="/assets/hsm-logo.svg" alt="Logo Hiraku" />Ícaro Lira</Link>
          <nav>
            <a href="/conquistas">Conquistas</a>
            <a href="/#setup">Setup</a>
            <a href="/#destaques">Destaques</a>
            <a href="/#mrcpp">Mr. C++</a>
            <a href="/#competitiva">Competitiva</a>
            {links.map((l) => <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>)}
          </nav>
        </div>
      </header>
      <main><Outlet /></main>
      <footer><div className="w"><span>© Ícaro Pinto Lira · Campina Grande, PB</span><span>feito com <em>✦</em> e Neovim</span></div></footer>
    </>
  );
}
