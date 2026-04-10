import { tacticalPhaseLabels } from '../lib/tactics';
import { ActionButton } from './ui/ActionButton';
import { PanelCard } from './ui/PanelCard';
import { SectionHeading } from './ui/SectionHeading';
import type { TacticalPhase, TacticalState } from '../types';

interface TacticalCommandPanelProps {
  tacticalState: TacticalState;
  onPhaseChange: (phase: TacticalPhase) => void;
  onEndTurn: () => void;
  notice?: string | null;
}

export function TacticalCommandPanel({
  tacticalState,
  onPhaseChange,
  onEndTurn,
  notice,
}: TacticalCommandPanelProps) {
  return (
    <PanelCard className="tactical-panel">
      <div className="tactical-topbar">
        <SectionHeading
          eyebrow="Session Control"
          title={`Turn ${tacticalState.turn}`}
          description="Gestisci il ritmo della sessione: scegli la fase attiva, usa gli AP con attenzione e chiudi il turno quando hai finito."
        />
        <div className="tactical-ap" aria-label="Action points disponibili">
          <strong>{tacticalState.actionPoints}/{tacticalState.maxActionPoints} AP</strong>
          <div className="tactical-ap-pips" aria-hidden="true">
            {Array.from({ length: tacticalState.maxActionPoints }).map((_, index) => (
              <span key={index} className={index < tacticalState.actionPoints ? 'is-filled' : ''} />
            ))}
          </div>
        </div>
      </div>

      <div className="tactical-phase-switch" role="tablist" aria-label="Fasi del turno">
        {(['command', 'engage', 'review'] as TacticalPhase[]).map((phase) => (
          <button
            key={phase}
            type="button"
            role="tab"
            className={tacticalState.phase === phase ? 'active' : ''}
            aria-selected={tacticalState.phase === phase}
            onClick={() => onPhaseChange(phase)}
          >
            {tacticalPhaseLabels[phase]}
          </button>
        ))}
      </div>

      <div className="tactical-summary-grid">
        <div className="tactical-summary-card">
          <span className="eyebrow">Phase</span>
          <strong>{tacticalPhaseLabels[tacticalState.phase]}</strong>
          <small>{tacticalState.lastEvent}</small>
        </div>
        <div className="tactical-summary-card">
          <span className="eyebrow">Momentum</span>
          <strong>{tacticalState.momentum}</strong>
          <small>Cresce quando porti avanti missioni con continuita.</small>
        </div>
      </div>

      {notice ? <div className="tactical-notice" role="status">{notice}</div> : null}

      <div className="tactical-actions">
        <ActionButton type="button" variant="primary" onClick={onEndTurn}>
          Chiudi turno
        </ActionButton>
      </div>
    </PanelCard>
  );
}
