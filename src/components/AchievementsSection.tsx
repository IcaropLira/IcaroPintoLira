import { Link } from 'react-router-dom';
import { achievements, featuredAchievement } from '../data/achievements';
import AchievementFeature from './AchievementFeature';
import Reveal from './Reveal';
import '../styles-conquistas.css';

/** Seção "Conquistas" da Home: a conquista em destaque aparece grande e há um atalho para o hub com todas. */
export default function AchievementsSection() {
  const main = featuredAchievement();
  if (!main) return null;
  const others = achievements.length - 1;
  return (
    <section id="conquistas">
      <div className="w">
        <Reveal>
          <div className="k">01 — conquistas</div>
          <h2>Prêmios e <em>medalhas.</em></h2>
          <p className="lead">Competições, premiações e marcos que eu quero lembrar, e as pessoas que estavam comigo em cada um.</p>
          <AchievementFeature item={main} />
          <div className="ach-all">
            <Link className="btn" to="/conquistas">Ver todas as conquistas →</Link>
            {others > 0 && <span>e mais {others} {others === 1 ? 'conquista' : 'conquistas'}</span>}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
