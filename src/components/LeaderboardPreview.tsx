import { PanelCard } from './ui/PanelCard';
import { SectionHeading } from './ui/SectionHeading';
import type { QuestProfile } from '../types';

interface LeaderboardPreviewProps {
  profile: QuestProfile;
}

export function LeaderboardPreview({ profile }: LeaderboardPreviewProps) {
  const entries = [
    { name: 'Marco', xp: profile.totalXp, level: profile.level, role: 'You', streak: profile.streakDays, delta: '+42 XP this week' },
    {
      name: 'Ari',
      xp: Math.max(0, profile.totalXp - 35),
      level: Math.max(1, profile.level - 1),
      role: 'Peer',
      streak: Math.max(1, profile.streakDays - 1),
      delta: '+28 XP this week',
    },
    {
      name: 'Nora',
      xp: profile.totalXp + 20,
      level: profile.level,
      role: 'Mentor',
      streak: profile.streakDays + 2,
      delta: '+55 XP this week',
    },
  ].sort((left, right) => right.xp - left.xp);

  return (
    <PanelCard className="notes-panel">
      <SectionHeading
        eyebrow="Learning Cohort"
        title="Leaderboard preview"
        description="Classifica dal tono collaborativo, utile a mostrare avanzamento, continuita e confronto sano tra pari."
      />

      <div className="leaderboard-banner">
        <strong>Confronto utile, non tossico</strong>
        <small>Il ranking premia costanza e progressione, non acquisti o vantaggi artificiali.</small>
      </div>

      <div className="leaderboard-list">
        {entries.map((entry, index) => (
          <div key={`${entry.name}-${entry.role}`} className={`leaderboard-row ${entry.role === 'You' ? 'is-self' : ''}`}>
            <div className={`leaderboard-rank rank-${index + 1}`}>{index + 1}</div>
            <div className="leaderboard-copy">
              <strong>{entry.name}</strong>
              <small>{entry.role} · streak {entry.streak}d</small>
            </div>
            <div className="leaderboard-metric">
              <strong>{entry.xp} XP</strong>
              <small>Lv {entry.level} · {entry.delta}</small>
            </div>
          </div>
        ))}
      </div>
    </PanelCard>
  );
}
