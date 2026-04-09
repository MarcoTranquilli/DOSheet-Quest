import { focusLabels } from '../lib/labels';
import { QuestGlyph } from './QuestGlyph';
import { PanelCard } from './ui/PanelCard';
import { SectionHeading } from './ui/SectionHeading';
import type { QuestActivityEntry } from '../types';

interface RecentActivityPanelProps {
  items: QuestActivityEntry[];
}

function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function RecentActivityPanel({ items }: RecentActivityPanelProps) {
  return (
    <PanelCard className="notes-panel">
      <SectionHeading
        eyebrow="Recent Activity"
        title="Log delle ultime vittorie"
        description="Cronologia sintetica delle quest chiuse, con XP guadagnati e rank raggiunto."
      />

      {items.length === 0 ? (
        <div className="activity-empty">
          Completa una quest per popolare il log delle attivita recenti.
        </div>
      ) : (
        <div className="activity-list">
          {items.map((item) => (
            <div key={item.id} className="activity-row">
              <div className="activity-icon">
                <QuestGlyph type={item.wasLevelUp ? 'crown' : 'spark'} />
              </div>
              <div className="activity-copy">
                <strong>{item.questTitle}</strong>
                <small>
                  {focusLabels[item.focus]} · {formatTime(item.completedAt)} · Lv {item.levelAfter}
                </small>
              </div>
              <div className="activity-xp">
                <strong>+{item.xpGained}</strong>
                <small>XP</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </PanelCard>
  );
}
