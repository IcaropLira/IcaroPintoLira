import { Link } from 'react-router-dom';
import { CATEGORY_NAMES, MEDAL_NAMES, type Achievement } from '../data/achievements';
import '../styles-conquistas.css';

/** Cartão de uma conquista na grade do hub. */
export default function AchievementCard({ item }: { item: Achievement }) {
  return (
    <Link className="hub-card" to={`/conquistas/${item.slug}`}>
      <div className="hub-card-img">
        <img src={`/assets/conquistas/${item.photo}`} width={1280} height={1280} loading="lazy" alt={item.photoAlt} />
        {item.medal && <span className={`hub-medal ${item.medal}`}>{MEDAL_NAMES[item.medal]}</span>}
      </div>
      <div className="hub-card-body">
        <div className="hub-meta"><span>{CATEGORY_NAMES[item.category]}</span><span>{item.dateLabel}</span></div>
        <h3>{item.title}</h3>
        <p>{item.org}</p>
        <div className="tags">{item.tags.slice(0, 3).map((t) => <span key={t}>{t}</span>)}</div>
        <span className="hub-more">Abrir →</span>
      </div>
    </Link>
  );
}
