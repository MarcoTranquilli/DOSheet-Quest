import { domainLabels, platformLabels } from '../lib/labels';
import { computeAcademyAssessment } from '../lib/assessment';
import { QuestGlyph } from './QuestGlyph';
import { PanelCard } from './ui/PanelCard';
import { SectionHeading } from './ui/SectionHeading';
import type { QuestItem, QuestProfile } from '../types';

interface AssessmentHubPanelProps {
  quests: QuestItem[];
  profile: QuestProfile;
}

function statusLabel(status: 'not-started' | 'in-progress' | 'ready' | 'certified') {
  if (status === 'certified') return 'Certified';
  if (status === 'ready') return 'Ready';
  if (status === 'in-progress') return 'In Progress';
  return 'Not Started';
}

export function AssessmentHubPanel({ quests, profile }: AssessmentHubPanelProps) {
  const assessment = computeAcademyAssessment(quests, profile);

  return (
    <PanelCard className="notes-panel assessment-panel">
      <SectionHeading
        eyebrow="Assessment Hub"
        title="Mastery e certificazioni"
        description="La progressione non misura solo missioni chiuse: misura competenze consolidate per track."
      />

      <div className="assessment-overview">
        <div className="assessment-kpi">
          <span className="eyebrow">Academy Readiness</span>
          <strong>{assessment.overallRate}%</strong>
          <small>Progressione media sulle track attive.</small>
        </div>
        <div className="assessment-kpi">
          <span className="eyebrow">Current Rank</span>
          <strong>{assessment.academyRank}</strong>
          <small>{assessment.certifiedTracks} track certificate · {assessment.readyTracks} quasi pronte</small>
        </div>
      </div>

      <div className="assessment-track-list">
        {assessment.trackAssessments.map((track) => (
          <div key={track.id} className={`assessment-track assessment-${track.status}`}>
            <div className="assessment-track-head">
              <div className="assessment-track-copy">
                <strong>{track.title}</strong>
                <small>{platformLabels[track.platform]} · {domainLabels[track.domain as keyof typeof domainLabels]}</small>
              </div>
              <span className={`meta-pill assessment-status assessment-status-${track.status}`}>
                <QuestGlyph type={track.status === 'certified' ? 'crown' : track.status === 'ready' ? 'spark' : 'compass'} />
                {statusLabel(track.status)}
              </span>
            </div>

            <p>{track.summary}</p>

            <div className="assessment-progress">
              <div className="assessment-progress-bar" aria-hidden="true">
                <div className="assessment-progress-fill" style={{ width: `${Math.max(8, track.completionRate)}%` }} />
              </div>
              <small>{track.completedMissions}/{track.availableMissions} missioni disponibili completate</small>
            </div>

            <div className="assessment-badge">
              <span className="meta-pill">
                <QuestGlyph type="shield" />
                {track.badgeTitle}
              </span>
            </div>
          </div>
        ))}
      </div>
    </PanelCard>
  );
}
