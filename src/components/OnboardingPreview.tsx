import { PanelCard } from './ui/PanelCard';
import { SectionHeading } from './ui/SectionHeading';

export function OnboardingPreview() {
  return (
    <PanelCard className="notes-panel">
      <SectionHeading
        eyebrow="Onboarding"
        title="Ingresso in 3 step"
        description="Flusso iniziale pensato per spiegare il modello mentale in meno di 30 secondi."
      />

      <div className="onboarding-steps">
        <div className="onboarding-step">
          <span className="step-index">1</span>
          <div>
            <strong>Scegli il focus</strong>
            <small>Build, Ops, Admin, Learning o Personal.</small>
          </div>
        </div>
        <div className="onboarding-step">
          <span className="step-index">2</span>
          <div>
            <strong>Attiva 3 quest chiave</strong>
            <small>Una `now`, una `next`, una di respiro.</small>
          </div>
        </div>
        <div className="onboarding-step">
          <span className="step-index">3</span>
          <div>
            <strong>Chiudi e accumula XP</strong>
            <small>Progress ring, streak e rank rendono visibile il ritmo.</small>
          </div>
        </div>
      </div>
    </PanelCard>
  );
}
