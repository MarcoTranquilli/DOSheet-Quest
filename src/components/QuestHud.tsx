import { computeBoardMetrics } from '../lib/score';
import { LevelAvatar } from './LevelAvatar';
import type { QuestProfile, QuestItem } from '../types';

interface QuestHudProps {
  profile: QuestProfile;
  quests: QuestItem[];
}

export function QuestHud({ profile, quests }: QuestHudProps) {
  const { completed, completionRatio, openNow, bossOpen } = computeBoardMetrics(quests);
  const nextLevelXp = profile.level * 100;
  const currentLevelProgress = profile.totalXp % 100;
  const progressToNextLevel = Math.max(8, Math.min(100, currentLevelProgress));

  return (
    <section className="hud-grid">
      <article className="panel hero-card">
        <div className="hero-layout">
          <div className="hero-copy">
            <span className="eyebrow">Guild Expedition</span>
            <h1>DOSheet Quest</h1>
            <p>
              Pianificazione operativa con linguaggio da spedizione: meno rumore, piu gerarchia,
              progressione leggibile e una rotta chiara verso la prossima consegna.
            </p>

            <div className="hero-actions">
              <div className="hero-chip">
                <span className="hero-chip-dot" />
                320x568 ready
              </div>
              <div className="hero-chip">
                <span className="hero-chip-dot is-accent" />
                Contrast target 4.5:1
              </div>
            </div>

            <div className="level-progress">
              <div className="level-progress-header">
                <strong>Avanzamento livello</strong>
                <span>{currentLevelProgress}/100 XP</span>
              </div>
              <div className="level-progress-track" aria-hidden="true">
                <div className="level-progress-fill" style={{ width: `${progressToNextLevel}%` }} />
              </div>
              <small>{nextLevelXp - currentLevelProgress} XP al prossimo rank</small>
            </div>
          </div>

          <LevelAvatar level={profile.level} />
        </div>
      </article>

      <article className="panel stat-card">
        <span className="eyebrow">Progress</span>
        <strong>{completionRatio}%</strong>
        <p>{completed} quest completate nella vista attiva.</p>
      </article>

      <article className="panel stat-card">
        <span className="eyebrow">Level</span>
        <strong>{profile.level}</strong>
        <p>
          {profile.totalXp} XP totali. Ne mancano {nextLevelXp - currentLevelProgress} al prossimo livello.
        </p>
      </article>

      <article className="panel stat-card">
        <span className="eyebrow">Focus Load</span>
        <strong>{openNow}</strong>
        <p>Quest aperte con priorita `now` che chiedono attenzione immediata.</p>
      </article>

      <article className="panel stat-card">
        <span className="eyebrow">Boss Queue</span>
        <strong>{bossOpen}</strong>
        <p>Missioni ad alta intensita ancora aperte nella vista corrente.</p>
      </article>
    </section>
  );
}
