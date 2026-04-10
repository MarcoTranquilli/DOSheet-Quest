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
            <span className="eyebrow">Spreadsheet Academy</span>
            <h1>DOSheet Quest</h1>
            <p>
              Impara Excel e Google Sheets con missioni pratiche, progressione chiara e una struttura a turni che ti
              aiuta a restare focalizzato.
            </p>

            <div className="hero-actions">
              <div className="hero-chip">
                <span className="hero-chip-dot" />
                Excel e Sheets
              </div>
              <div className="hero-chip">
                <span className="hero-chip-dot is-accent" />
                Sessioni a turni
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

            <div className="hero-highlight-grid">
              <div className="hero-highlight">
                <strong>Percorso chiaro</strong>
                <small>Ogni sessione alterna pianificazione, pratica e review.</small>
              </div>
              <div className="hero-highlight">
                <strong>Feedback immediato</strong>
                <small>XP, validazione e mastery score rendono visibile ogni progresso.</small>
              </div>
              <div className="hero-highlight">
                <strong>UI leggibile</strong>
                <small>Gerarchia e contrasto restano chiari anche su schermi piccoli.</small>
              </div>
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
        <span className="eyebrow">Urgent</span>
        <strong>{openNow}</strong>
        <p>Missioni aperte con priorita immediata nella vista corrente.</p>
      </article>

      <article className="panel stat-card">
        <span className="eyebrow">Advanced</span>
        <strong>{bossOpen}</strong>
        <p>Missioni avanzate ancora aperte nella vista corrente.</p>
      </article>
    </section>
  );
}
