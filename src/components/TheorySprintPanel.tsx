import { domainLabels, platformLabels } from '../lib/labels';
import { QuestGlyph } from './QuestGlyph';
import { PanelCard } from './ui/PanelCard';
import { SectionHeading } from './ui/SectionHeading';
import type { QuestItem } from '../types';

interface TheorySprintPanelProps {
  quest?: QuestItem;
}

export function TheorySprintPanel({ quest }: TheorySprintPanelProps) {
  return (
    <PanelCard className="notes-panel">
      <SectionHeading
        eyebrow="Next Step"
        title="Prossima missione consigliata"
        description="Leggi il concetto chiave, poi apri il lab e applicalo subito."
      />

      {quest ? (
        <div className="theory-card">
          <div className="track-topline">
            {quest.platform ? <span className="meta-pill">{platformLabels[quest.platform]}</span> : null}
            {quest.domain ? <span className="meta-pill">{domainLabels[quest.domain]}</span> : null}
          </div>
          <strong>{quest.title}</strong>
          <p>{quest.theorySnippet || quest.note}</p>
          <div className="theory-checklist" aria-label="Passi consigliati">
            <small>1. Leggi la teoria</small>
            <small>2. Completa il lab</small>
            <small>3. Ripeti sul foglio reale</small>
          </div>
          <div className="practice-box">
            <span className="meta-pill">
              <QuestGlyph type="spark" />
              Prompt di pratica
            </span>
            <small>{quest.practiceHint || 'Prova a riprodurre questa quest in un foglio reale con dati semplici ma coerenti.'}</small>
          </div>
        </div>
      ) : (
        <div className="activity-empty">
          Nessuna missione didattica aperta. Crea o riapri una missione di apprendimento per ottenere teoria e pratica guidata.
        </div>
      )}
    </PanelCard>
  );
}
