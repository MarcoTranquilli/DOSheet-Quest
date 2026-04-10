import { PanelCard } from './ui/PanelCard';
import { SectionHeading } from './ui/SectionHeading';

export function OnboardingPreview() {
  return (
    <PanelCard className="notes-panel">
      <SectionHeading
        eyebrow="Onboarding"
        title="Come iniziare"
        description="Il percorso base per arrivare alla prima missione completata senza dover interpretare l’interfaccia."
      />

      <div className="onboarding-banner">
        <strong>Completa una missione guidata in meno di 10 minuti</strong>
        <small>Apri il lab consigliato, segui gli obiettivi e poi ripeti lo stesso passaggio in un foglio reale.</small>
      </div>

      <div className="onboarding-steps">
        <div className="onboarding-step">
          <span className="step-index">1</span>
          <div>
            <strong>Leggi il prossimo passo</strong>
            <small>Usa la teoria associata alla missione consigliata per capire subito l’obiettivo.</small>
          </div>
        </div>
        <div className="onboarding-step">
          <span className="step-index">2</span>
          <div>
            <strong>Completa il lab</strong>
            <small>Lavora nella griglia, usa hint solo se servono e chiudi gli obiettivi uno per uno.</small>
          </div>
        </div>
        <div className="onboarding-step">
          <span className="step-index">3</span>
          <div>
            <strong>Ripeti sul foglio vero</strong>
            <small>Consolida il gesto in Excel o Google Sheets prima di passare alla missione successiva.</small>
          </div>
        </div>
      </div>

      <div className="onboarding-footer">
        <div className="onboarding-outcome">
          <strong>Prima sessione</strong>
          <small>Punta a una sola missione completata e a un solo concetto ben fissato.</small>
        </div>
        <div className="onboarding-outcome">
          <strong>Quando passare oltre</strong>
          <small>Vai al track successivo solo quando riesci a rifare il passaggio senza aiuto.</small>
        </div>
      </div>
    </PanelCard>
  );
}
