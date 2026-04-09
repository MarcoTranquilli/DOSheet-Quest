import { useEffect, useMemo, useState } from 'react';
import { AcademyInsightsPanel } from './components/AcademyInsightsPanel';
import { AssessmentHubPanel } from './components/AssessmentHubPanel';
import { CertificationVaultPanel } from './components/CertificationVaultPanel';
import { DataPortabilityPanel } from './components/DataPortabilityPanel';
import { FloatingXpToast } from './components/FloatingXpToast';
import { LeaderboardPreview } from './components/LeaderboardPreview';
import { LearningTracksPanel } from './components/LearningTracksPanel';
import { LevelUpModal } from './components/LevelUpModal';
import { MissionLabPanel } from './components/MissionLabPanel';
import { OnboardingPreview } from './components/OnboardingPreview';
import { QuestBoard } from './components/QuestBoard';
import { QuestComposer } from './components/QuestComposer';
import { QuestHud } from './components/QuestHud';
import { QuestTemplates } from './components/QuestTemplates';
import { RecentActivityPanel } from './components/RecentActivityPanel';
import { TheorySprintPanel } from './components/TheorySprintPanel';
import { ActionButton } from './components/ui/ActionButton';
import { PanelCard } from './components/ui/PanelCard';
import { SectionHeading } from './components/ui/SectionHeading';
import { completeQuest, getQuestById, reopenQuest } from './lib/score';
import { exportBoardState, importBoardState, loadBoardState, resetBoardState, saveBoardState } from './lib/storage';
import type { QuestActivityEntry, QuestBoardState, QuestCadence, QuestFocus, QuestItem, QuestPriority } from './types';

export default function App() {
  const [boardState, setBoardState] = useState<QuestBoardState>(() => loadBoardState());
  const [activeCadence, setActiveCadence] = useState<QuestCadence>('daily');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState<QuestPriority | 'all'>('all');
  const [focusFilter, setFocusFilter] = useState<QuestFocus | 'all'>('all');
  const [floatingXp, setFloatingXp] = useState<{ xp: number; questTitle: string } | null>(null);
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);

  useEffect(() => {
    saveBoardState(boardState);
  }, [boardState]);

  useEffect(() => {
    if (!floatingXp) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setFloatingXp(null), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [floatingXp]);

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

  const recommendedLearningQuest = useMemo(
    () => boardState.quests.find((quest) => quest.focus === 'learning' && !quest.completed),
    [boardState.quests],
  );

  function handleAddQuest(quest: QuestItem) {
    setBoardState((current) => ({
      ...current,
      quests: [quest, ...current.quests],
    }));
  }

  function handleMissionLabSessionChange(questId: string, nextSessionState: QuestBoardState['missionLabState'][string]) {
    setBoardState((current) => ({
      ...current,
      missionLabState: {
        ...current.missionLabState,
        [questId]: nextSessionState,
      },
    }));
  }

  function handleMissionLabSessionReset(questId: string) {
    setBoardState((current) => {
      const nextMissionLabState = { ...current.missionLabState };
      delete nextMissionLabState[questId];

      return {
        ...current,
        missionLabState: nextMissionLabState,
      };
    });
  }

  function completeQuestWithRewards(questId: string) {
    setBoardState((current) => {
      const targetQuest = getQuestById(current.quests, questId);
      if (!targetQuest || targetQuest.completed) {
        return current;
      }

      const nextState = completeQuest(current, questId);

      const activityEntry: QuestActivityEntry = {
        id: crypto.randomUUID(),
        questId: targetQuest.id,
        questTitle: targetQuest.title,
        xpGained: targetQuest.xp,
        focus: targetQuest.focus,
        difficulty: targetQuest.difficulty,
        cadence: targetQuest.cadence,
        completedAt: new Date().toISOString(),
        levelAfter: nextState.profile.level,
        wasLevelUp: nextState.profile.level > current.profile.level,
      };

      setFloatingXp({
        xp: targetQuest.xp,
        questTitle: targetQuest.title,
      });

      if (activityEntry.wasLevelUp) {
        setLevelUpLevel(nextState.profile.level);
      }

      const nextMissionLabState = { ...current.missionLabState };
      delete nextMissionLabState[questId];

      return {
        ...nextState,
        activityLog: [activityEntry, ...current.activityLog].slice(0, 8),
        missionLabState: nextMissionLabState,
      };
    });
  }

  function handleToggleQuest(questId: string, completed: boolean) {
    if (completed) {
      setBoardState((current) => reopenQuest(current, questId));
      return;
    }

    completeQuestWithRewards(questId);
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
      {floatingXp ? <FloatingXpToast xp={floatingXp.xp} questTitle={floatingXp.questTitle} /> : null}
      {levelUpLevel ? <LevelUpModal level={levelUpLevel} onClose={() => setLevelUpLevel(null)} /> : null}

      <QuestHud profile={boardState.profile} quests={filteredQuests} />
      <MissionLabPanel
        quest={recommendedLearningQuest}
        onCompleteQuest={completeQuestWithRewards}
        sessionState={recommendedLearningQuest ? boardState.missionLabState[recommendedLearningQuest.id] : undefined}
        onSessionChange={handleMissionLabSessionChange}
        onSessionReset={handleMissionLabSessionReset}
      />

      <section className="workspace-grid">
        <QuestBoard
          activeCadence={activeCadence}
          onCadenceChange={setActiveCadence}
          quests={filteredQuests}
          spotlightQuest={recommendedLearningQuest}
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
          <TheorySprintPanel quest={recommendedLearningQuest} />
          <AcademyInsightsPanel quests={boardState.quests} profile={boardState.profile} activityLog={boardState.activityLog} />
          <AssessmentHubPanel quests={boardState.quests} profile={boardState.profile} />
          <CertificationVaultPanel quests={boardState.quests} profile={boardState.profile} />
          <LearningTracksPanel quests={boardState.quests} />
          <RecentActivityPanel items={boardState.activityLog} />
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
