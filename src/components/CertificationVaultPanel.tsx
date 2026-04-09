import { computeAcademyAssessment } from '../lib/assessment';
import { QuestGlyph } from './QuestGlyph';
import { PanelCard } from './ui/PanelCard';
import { SectionHeading } from './ui/SectionHeading';
import type { QuestItem, QuestProfile } from '../types';

interface CertificationVaultPanelProps {
  quests: QuestItem[];
  profile: QuestProfile;
}

export function CertificationVaultPanel({ quests, profile }: CertificationVaultPanelProps) {
  const assessment = computeAcademyAssessment(quests, profile);
  const unlocked = assessment.trackAssessments.filter((track) => track.status === 'certified');
  const pending = assessment.trackAssessments.filter((track) => track.status !== 'certified');

  return (
    <PanelCard className="notes-panel certification-panel">
      <SectionHeading
        eyebrow="Certification Vault"
        title="Badge e certificazioni"
        description="Riconoscimenti sbloccati e certificazioni ancora in costruzione."
      />

      <div className="certification-list">
        {unlocked.length > 0 ? (
          unlocked.map((track) => (
            <div key={track.id} className="certification-card is-earned">
              <div className="certification-icon">
                <QuestGlyph type="crown" />
              </div>
              <div className="certification-copy">
                <strong>{track.badgeTitle}</strong>
                <small>{track.title} · certificazione ottenuta</small>
              </div>
            </div>
          ))
        ) : (
          <div className="activity-empty">Completa una track intera per sbloccare la prima certificazione.</div>
        )}
      </div>

      <div className="certification-pending">
        {pending.slice(0, 2).map((track) => (
          <div key={track.id} className="certification-card">
            <div className="certification-icon">
              <QuestGlyph type="shield" />
            </div>
            <div className="certification-copy">
              <strong>{track.badgeTitle}</strong>
              <small>{track.completionRate}% completato · stato {track.status}</small>
            </div>
          </div>
        ))}
      </div>
    </PanelCard>
  );
}
