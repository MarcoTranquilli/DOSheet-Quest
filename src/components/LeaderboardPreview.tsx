import { PanelCard } from './ui/PanelCard';
import { SectionHeading } from './ui/SectionHeading';
import type { QuestProfile } from '../types';

interface LeaderboardPreviewProps {
  profile: QuestProfile;
}

export function LeaderboardPreview({ profile }: LeaderboardPreviewProps) {
  const entries = [
    { name: 'Marco', xp: profile.totalXp, level: profile.level, role: 'You' },
    { name: 'Ari', xp: Math.max(0, profile.totalXp - 35), level: Math.max(1, profile.level - 1), role: 'Scout' },
    { name: 'Nora', xp: profile.totalXp + 20, level: profile.level, role: 'Captain' },
  ].sort((left, right) => right.xp - left.xp);

  return (
    <PanelCard className="notes-panel">
      <SectionHeading
        eyebrow="Guild Board"
        title="Leaderboard preview"
        description="Classifica dal tono collaborativo, utile a mostrare avanzamento e rank senza dinamiche tossiche."
      />

      <div className="leaderboard-list">
        {entries.map((entry, index) => (
          <div key={`${entry.name}-${entry.role}`} className={`leaderboard-row ${entry.role === 'You' ? 'is-self' : ''}`}>
            <div className={`leaderboard-rank rank-${index + 1}`}>{index + 1}</div>
            <div className="leaderboard-copy">
              <strong>{entry.name}</strong>
              <small>{entry.role}</small>
            </div>
            <div className="leaderboard-metric">
              <strong>{entry.xp} XP</strong>
              <small>Lv {entry.level}</small>
            </div>
          </div>
        ))}
      </div>
    </PanelCard>
  );
}
