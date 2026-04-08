import { useEffect, useMemo, useState } from 'react';
import { DataPortabilityPanel } from './components/DataPortabilityPanel';
import { LeaderboardPreview } from './components/LeaderboardPreview';
import { OnboardingPreview } from './components/OnboardingPreview';
import { QuestBoard } from './components/QuestBoard';
import { QuestComposer } from './components/QuestComposer';
import { QuestHud } from './components/QuestHud';
import { QuestTemplates } from './components/QuestTemplates';
import { ActionButton } from './components/ui/ActionButton';
import { PanelCard } from './components/ui/PanelCard';
import { SectionHeading } from './components/ui/SectionHeading';
import { completeQuest, reopenQuest } from './lib/score';
import { exportBoardState, importBoardState, loadBoardState, resetBoardState, saveBoardState } from './lib/storage';
import type { QuestBoardState, QuestCadence, QuestFocus, QuestItem, QuestPriority } from './types';

export default function App() {
  const [boardState, setBoardState] = useState<QuestBoardState>(() => loadBoardState());
  const [activeCadence, setActiveCadence] = useState<QuestCadence>('daily');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState<QuestPriority | 'all'>('all');
  const [focusFilter, setFocusFilter] = useState<QuestFocus | 'all'>('all');

  useEffect(() => {
    saveBoardState(boardState);
  }, [boardState]);

  const filteredQuests = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return boardState.quests.filter((quest) => {
      if (quest.cadence !== activeCadence) {
        return false;
      }

      if (!showCompleted && quest.completed) {
        return false;
      }

      if (priorityFilter !== 'all' && quest.priority !== priorityFilter) {
        return false;
      }

      if (focusFilter !== 'all' && quest.focus !== focusFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return `${quest.title} ${quest.note}`.toLowerCase().includes(normalizedQuery);
    });
  }, [activeCadence, boardState.quests, focusFilter, priorityFilter, searchQuery, showCompleted]);

  function handleAddQuest(quest: QuestItem) {
    setBoardState((current) => ({
      ...current,
      quests: [quest, ...current.quests],
    }));
  }

  function handleToggleQuest(questId: string, completed: boolean) {
    setBoardState((current) => (completed ? reopenQuest(current, questId) : completeQuest(current, questId)));
  }

  function handleResetBoard() {
    setBoardState(resetBoardState());
    setActiveCadence('daily');
  }

  function handleImport(payload: string) {
    setBoardState(importBoardState(payload));
  }

  return (
    <main className="app-shell">
      <QuestHud profile={boardState.profile} quests={filteredQuests} />

      <section className="workspace-grid">
        <QuestBoard
          activeCadence={activeCadence}
          onCadenceChange={setActiveCadence}
          quests={filteredQuests}
          onToggleQuest={handleToggleQuest}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          showCompleted={showCompleted}
          onShowCompletedChange={setShowCompleted}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          focusFilter={focusFilter}
          onFocusFilterChange={setFocusFilter}
        />

        <aside className="sidebar-stack">
          <QuestComposer onAddQuest={handleAddQuest} />
          <QuestTemplates onUseTemplate={handleAddQuest} />
          <OnboardingPreview />
          <LeaderboardPreview profile={boardState.profile} />
          <DataPortabilityPanel exportPayload={exportBoardState(boardState)} onImport={handleImport} />

          <PanelCard className="notes-panel">
            <SectionHeading
              eyebrow="MVP Scope"
              title="Cosa c'e gia"
              description="Mattoni già pronti per un'evoluzione verso prodotto reale e non solo demo."
            />

            <ul>
              <li>Persistenza locale nel browser con seed iniziale.</li>
              <li>Quest giornaliere, settimanali e backlog con focus e priorita.</li>
              <li>XP, livello e metriche sulla vista attiva.</li>
              <li>Template rapidi e import/export JSON della board.</li>
              <li>Base pronta per auth, backend e dashboard reali.</li>
            </ul>

            <ActionButton type="button" variant="secondary" onClick={handleResetBoard}>
              Ripristina board iniziale
            </ActionButton>
          </PanelCard>
        </aside>
      </section>
    </main>
  );
}
