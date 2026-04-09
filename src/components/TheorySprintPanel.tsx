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
        eyebrow="Theory Sprint"
        title="Teoria associata alla prossima missione"
        description="Una pillola didattica breve, pensata per accompagnare subito la pratica senza interrompere il flusso."
      />

      {quest ? (
        <div className="theory-card">
          <div className="track-topline">
            {quest.platform ? <span className="meta-pill">{platformLabels[quest.platform]}</span> : null}
            {quest.domain ? <span className="meta-pill">{domainLabels[quest.domain]}</span> : null}
          </div>
          <strong>{quest.title}</strong>
          <p>{quest.theorySnippet || quest.note}</p>
          <div className="practice-box">
            <span className="meta-pill">
              <QuestGlyph type="spark" />
              Practice Prompt
            </span>
            <small>{quest.practiceHint || 'Prova a riprodurre questa quest in un foglio reale con dati semplici ma coerenti.'}</small>
          </div>
        </div>
      ) : (
        <div className="activity-empty">
          Nessuna missione didattica aperta: completa o crea una quest di apprendimento per ottenere teoria e pratica guidata.
        </div>
      )}
    </PanelCard>
  );
}
