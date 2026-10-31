import { Link } from 'react-router-dom';
import { NEWTON_QUOTE, type Achievement } from '../data/achievements';
import Medal from './Medal';
import '../styles-conquistas.css';

/** Cartão grande de destaque, usado na Home e no topo do hub de conquistas. */
export default function AchievementFeature({ item, cta = 'Ver a conquista →' }: { item: Achievement; cta?: string }) {
  return (
    <Link className="ach-feature" to={`/conquistas/${item.slug}`}>
      <div className="ach-photo">
        <img src={`/assets/conquistas/${item.photo}`} width={1280} height={1280} loading="lazy" alt={item.photoAlt} />
      </div>
      <div className="ach-body">
        {item.medal === 'prata' && <Medal className="ach-medal" size={84} />}
        <span className="badge ach-badge">{item.badge}</span>
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        <div className="tags">{item.tags.map((t) => <span key={t}>{t}</span>)}</div>
        {item.slug === 'opi-2026' && <blockquote className="ach-mini-quote">“{NEWTON_QUOTE}”<cite>Isaac Newton</cite></blockquote>}
        <span className="btn p ach-go">{cta}</span>
      </div>
    </Link>
  );
}
