import { useState } from 'react';
import { ActionButton } from './ui/ActionButton';
import { PanelCard } from './ui/PanelCard';
import { SectionHeading } from './ui/SectionHeading';

interface DataPortabilityPanelProps {
  exportPayload: string;
  onImport: (payload: string) => void;
}

export function DataPortabilityPanel({ exportPayload, onImport }: DataPortabilityPanelProps) {
  const [importText, setImportText] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  function handleDownload() {
    const blob = new Blob([exportPayload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'dosheet-quest-board.json';
    anchor.click();
    URL.revokeObjectURL(url);
    setStatusMessage('Export JSON scaricato.');
  }

  function handleImport() {
    try {
      onImport(importText);
      setImportText('');
      setStatusMessage('Board importata correttamente.');
    } catch {
      setStatusMessage('Import non valido: controlla il JSON incollato.');
    }
  }

  return (
    <PanelCard className="notes-panel">
      <SectionHeading
        eyebrow="Portability"
        title="Importa o esporta la board"
        description="Local-first non significa chiuso: i dati restano portabili e riusabili."
      />

      <p className="support-copy">
        Manteniamo il progetto local-first, ma i dati non restano intrappolati: puoi esportare la board e
        reimportarla in qualsiasi momento.
      </p>

      <div className="inline-actions">
        <ActionButton type="button" variant="secondary" onClick={handleDownload}>
          Esporta JSON
        </ActionButton>
      </div>

      <label>
        Incolla qui un export JSON
        <textarea
          rows={5}
          value={importText}
          onChange={(event) => setImportText(event.target.value)}
          placeholder='{"quests":[...],"profile":{...}}'
        />
      </label>

      <ActionButton type="button" onClick={handleImport} disabled={!importText.trim()} block>
        Importa board
      </ActionButton>

      {statusMessage ? <p className="status-message">{statusMessage}</p> : null}
    </PanelCard>
  );
}
