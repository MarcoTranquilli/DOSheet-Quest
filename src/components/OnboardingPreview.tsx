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

      <div className="onboarding-banner">
        <strong>Prima vittoria in meno di 10 minuti</strong>
        <small>Parti da una missione foundations o formulas e replica il passaggio in un foglio reale.</small>
      </div>

      <div className="onboarding-steps">
        <div className="onboarding-step">
          <span className="step-index">1</span>
          <div>
            <strong>Scegli una skill reale</strong>
            <small>Data cleaning, formule, analisi, dashboard o automazione.</small>
          </div>
        </div>
        <div className="onboarding-step">
          <span className="step-index">2</span>
          <div>
            <strong>Fai una missione breve</strong>
            <small>Ogni quest ti da teoria minima, pratica consigliata e XP mirati.</small>
          </div>
        </div>
        <div className="onboarding-step">
          <span className="step-index">3</span>
          <div>
            <strong>Consolida il gesto</strong>
            <small>Ripeti sui fogli reali: il rank cresce solo se la pratica diventa routine.</small>
          </div>
        </div>
      </div>

      <div className="onboarding-footer">
        <div className="onboarding-outcome">
          <strong>Obiettivo UX</strong>
          <small>Portare l’utente dal “cosa faccio?” al “so da dove iniziare” con un solo sguardo.</small>
        </div>
        <div className="onboarding-outcome">
          <strong>Pattern</strong>
          <small>Step chiari, testo breve, gerarchia forte e un solo messaggio chiave per blocco.</small>
        </div>
      </div>
    </PanelCard>
  );
}
