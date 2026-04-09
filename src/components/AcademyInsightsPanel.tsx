import { computeAcademyInsights } from '../lib/academyInsights';
import { QuestGlyph } from './QuestGlyph';
import { PanelCard } from './ui/PanelCard';
import { SectionHeading } from './ui/SectionHeading';
import type { QuestActivityEntry, QuestItem, QuestProfile } from '../types';

interface AcademyInsightsPanelProps {
  quests: QuestItem[];
  profile: QuestProfile;
  activityLog: QuestActivityEntry[];
}

export function AcademyInsightsPanel({ quests, profile, activityLog }: AcademyInsightsPanelProps) {
  const insights = computeAcademyInsights(quests, profile, activityLog);

  return (
    <PanelCard className="notes-panel insights-panel">
      <SectionHeading
        eyebrow="Academy Insights"
        title="Next best action"
        description="Segnali sintetici per capire dove investire la prossima sessione di pratica."
      />

      <div className="insight-card">
        <span className="meta-pill">
          <QuestGlyph type="compass" />
          Next move
        </span>
        <strong>{insights.nextBestAction}</strong>
      </div>

      <div className="insight-grid">
        <div className="insight-mini-card">
          <strong>Weak area</strong>
          <small>{insights.weakArea}</small>
        </div>
        <div className="insight-mini-card">
          <strong>Momentum</strong>
          <small>{insights.momentum}</small>
        </div>
        <div className="insight-mini-card">
          <strong>Completed this week</strong>
          <small>{insights.completionThisWeek} missioni completate negli ultimi 7 giorni.</small>
        </div>
      </div>
    </PanelCard>
  );
}
