import { useState } from 'react';
import { focusLabels, priorityLabels } from '../lib/labels';
import { XP_BY_DIFFICULTY } from '../lib/score';
import { ActionButton } from './ui/ActionButton';
import { PanelCard } from './ui/PanelCard';
import { SectionHeading } from './ui/SectionHeading';
import type { QuestCadence, QuestDifficulty, QuestFocus, QuestItem, QuestPriority } from '../types';

interface QuestComposerProps {
  onAddQuest: (quest: QuestItem) => void;
}

export function QuestComposer({ onAddQuest }: QuestComposerProps) {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [cadence, setCadence] = useState<QuestCadence>('daily');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('core');
  const [focus, setFocus] = useState<QuestFocus>('build');
  const [priority, setPriority] = useState<QuestPriority>('next');

  const canSubmit = title.trim().length >= 3;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    onAddQuest({
      id: crypto.randomUUID(),
      title: title.trim(),
      note: note.trim(),
      cadence,
      difficulty,
      focus,
      priority,
      xp: XP_BY_DIFFICULTY[difficulty],
      completed: false,
      createdAt: new Date().toISOString(),
    });

    setTitle('');
    setNote('');
    setCadence('daily');
    setDifficulty('core');
    setFocus('build');
    setPriority('next');
  }

  return (
    <PanelCard as="form" className="composer" onSubmit={handleSubmit}>
      <SectionHeading
        eyebrow="Quest Forge"
        title="Crea una missione subito eseguibile"
        description="Un editor minimale: pochi campi, priorita esplicita e ricompensa chiara."
      />

      <label>
        Titolo
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Esempio: chiudere il report clienti"
        />
      </label>

      <label>
        Nota operativa
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Descrivi il next step o il criterio di completamento."
          rows={3}
        />
      </label>

      <div className="composer-grid">
        <label>
          Cadenza
          <select value={cadence} onChange={(event) => setCadence(event.target.value as QuestCadence)}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="backlog">Backlog</option>
          </select>
        </label>

        <label>
          Difficolta
          <select
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value as QuestDifficulty)}
          >
            <option value="light">Light</option>
            <option value="core">Core</option>
            <option value="boss">Boss</option>
          </select>
        </label>
      </div>

      <div className="composer-grid">
        <label>
          Focus
          <select value={focus} onChange={(event) => setFocus(event.target.value as QuestFocus)}>
            {Object.entries(focusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Priorita
          <select value={priority} onChange={(event) => setPriority(event.target.value as QuestPriority)}>
            {Object.entries(priorityLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ActionButton type="submit" disabled={!canSubmit} block>
        Aggiungi quest da {XP_BY_DIFFICULTY[difficulty]} XP
      </ActionButton>
    </PanelCard>
  );
}
