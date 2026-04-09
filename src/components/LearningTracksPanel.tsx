import { learningTracks } from '../data/learningTracks';
import { domainLabels, platformLabels } from '../lib/labels';
import { QuestGlyph } from './QuestGlyph';
import { PanelCard } from './ui/PanelCard';
import { SectionHeading } from './ui/SectionHeading';
import type { QuestItem } from '../types';

interface LearningTracksPanelProps {
  quests: QuestItem[];
}

export function LearningTracksPanel({ quests }: LearningTracksPanelProps) {
  return (
    <PanelCard className="notes-panel">
      <SectionHeading
        eyebrow="Learning Tracks"
        title="Percorsi di competenza"
        description="Missioni raggruppate per abilita reali di Excel e Google Sheets, pensate per portarti da uso base a casi professionali."
      />

      <div className="track-list">
        {learningTracks.map((track) => (
          <div key={track.id} className="track-card">
            <div className="track-topline">
              <span className="meta-pill">
                <QuestGlyph type="compass" />
                {platformLabels[track.platform]}
              </span>
              <span className="meta-pill">{domainLabels[track.domain]}</span>
            </div>
            <strong>{track.title}</strong>
            <p>{track.outcome}</p>
            <small>
              {quests.filter((quest) => quest.focus === 'learning' && quest.domain === track.domain && quest.completed).length}/
              {quests.filter((quest) => quest.focus === 'learning' && quest.domain === track.domain).length || track.missions} missioni · {track.skills.join(' · ')}
            </small>
          </div>
        ))}
      </div>
    </PanelCard>
  );
}
