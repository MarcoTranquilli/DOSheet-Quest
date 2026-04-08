import { cadenceLabels, focusLabels, priorityLabels } from '../lib/labels';
import { computeBoardMetrics } from '../lib/score';
import { QuestGlyph } from './QuestGlyph';
import { EmptyState } from './ui/EmptyState';
import { PanelCard } from './ui/PanelCard';
import { SectionHeading } from './ui/SectionHeading';
import type { QuestCadence, QuestFocus, QuestItem, QuestPriority } from '../types';

interface QuestBoardProps {
  activeCadence: QuestCadence;
  onCadenceChange: (value: QuestCadence) => void;
  quests: QuestItem[];
  onToggleQuest: (questId: string, completed: boolean) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  showCompleted: boolean;
  onShowCompletedChange: (value: boolean) => void;
  priorityFilter: QuestPriority | 'all';
  onPriorityFilterChange: (value: QuestPriority | 'all') => void;
  focusFilter: QuestFocus | 'all';
  onFocusFilterChange: (value: QuestFocus | 'all') => void;
}

export function QuestBoard({
  activeCadence,
  onCadenceChange,
  quests,
  onToggleQuest,
  searchQuery,
  onSearchQueryChange,
  showCompleted,
  onShowCompletedChange,
  priorityFilter,
  onPriorityFilterChange,
  focusFilter,
  onFocusFilterChange,
}: QuestBoardProps) {
  const { completed, openNow, bossOpen, completionRatio } = computeBoardMetrics(quests);

  return (
    <PanelCard className="board">
      <div className="board-topbar">
        <SectionHeading
          eyebrow="Mission Sheet"
          title="Vista operativa delle quest"
          description="Ordina il lavoro per cadenza, priorita e focus con una board leggibile e rapida da aggiornare."
        />

        <div className="tabs" aria-label="Filtro cadenza">
          {(Object.keys(cadenceLabels) as QuestCadence[]).map((cadence) => (
            <button
              key={cadence}
              type="button"
              className={cadence === activeCadence ? 'active' : ''}
              onClick={() => onCadenceChange(cadence)}
            >
              {cadenceLabels[cadence]}
            </button>
          ))}
        </div>
      </div>

      <div className="board-summary-strip" aria-label="Riepilogo board">
        <div className="summary-pill">
          <QuestGlyph type="compass" />
          <div>
            <strong>{cadenceLabels[activeCadence]}</strong>
            <small>Vista attiva</small>
          </div>
        </div>
        <div className="summary-pill">
          <QuestGlyph type="spark" />
          <div>
            <strong>{completionRatio}%</strong>
            <small>{completed} completate</small>
          </div>
        </div>
        <div className="summary-pill">
          <QuestGlyph type="trail" />
          <div>
            <strong>{openNow}</strong>
            <small>priorita now</small>
          </div>
        </div>
        <div className="summary-pill">
          <QuestGlyph type="crown" />
          <div>
            <strong>{bossOpen}</strong>
            <small>boss aperte</small>
          </div>
        </div>
      </div>

      <div className="board-filters">
        <label>
          Cerca
          <input
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="Titolo o nota"
          />
        </label>

        <label>
          Priorita
          <select
            value={priorityFilter}
            onChange={(event) => onPriorityFilterChange(event.target.value as QuestPriority | 'all')}
          >
            <option value="all">Tutte</option>
            {Object.entries(priorityLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Focus
          <select value={focusFilter} onChange={(event) => onFocusFilterChange(event.target.value as QuestFocus | 'all')}>
            <option value="all">Tutti</option>
            {Object.entries(focusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="toggle-inline">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={(event) => onShowCompletedChange(event.target.checked)}
          />
          Mostra completate
        </label>
      </div>

      <div className="board-table" role="table" aria-label="Lista quest">
        <div className="table-head" role="row">
          <span>Done</span>
          <span>Quest</span>
          <span>Focus</span>
          <span>Priority</span>
          <span>Tier</span>
          <span>XP</span>
        </div>

        {quests.map((quest) => (
          <label
            key={quest.id}
            className={`table-row priority-${quest.priority} ${quest.completed ? 'is-complete' : ''}`}
            role="row"
          >
            <span className="checkbox-shell">
              <input
                type="checkbox"
                checked={quest.completed}
                onChange={() => onToggleQuest(quest.id, quest.completed)}
                aria-label={`Segna ${quest.title} come completata`}
              />
            </span>
            <span className="quest-copy">
              <strong>{quest.title}</strong>
              <small>{quest.note || 'Nessuna nota operativa'}</small>
              <span className="quest-meta">
                <span className={`meta-pill focus-${quest.focus}`}>
                  <QuestGlyph type={quest.focus === 'build' ? 'spark' : quest.focus === 'learning' ? 'compass' : 'shield'} />
                  {focusLabels[quest.focus]}
                </span>
                <span className={`meta-pill priority-${quest.priority}`}>{priorityLabels[quest.priority]}</span>
              </span>
            </span>
            <span>{focusLabels[quest.focus]}</span>
            <span>{priorityLabels[quest.priority]}</span>
            <span className={`pill ${quest.difficulty}`}>{quest.difficulty}</span>
            <span className="xp-pill">{quest.xp} XP</span>
          </label>
        ))}

        {quests.length === 0 ? (
          <EmptyState
            title="Nessuna quest in questa vista"
            description="Prova a cambiare filtro oppure usa un template rapido per popolare subito la board."
          />
        ) : null}
      </div>
    </PanelCard>
  );
}
