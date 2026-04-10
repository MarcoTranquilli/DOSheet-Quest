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
import { TacticalCommandPanel } from './components/TacticalCommandPanel';
import { TheorySprintPanel } from './components/TheorySprintPanel';
import { ActionButton } from './components/ui/ActionButton';
import { PanelCard } from './components/ui/PanelCard';
import { SectionHeading } from './components/ui/SectionHeading';
import { completeQuest, getQuestById, reopenQuest } from './lib/score';
import { exportBoardState, importBoardState, loadBoardState, resetBoardState, saveBoardState } from './lib/storage';
import { tacticalPhaseLabels } from './lib/tactics';
import type { QuestActivityEntry, QuestBoardState, QuestCadence, QuestFocus, QuestItem, QuestPriority, TacticalPhase } from './types';

export default function App() {
  const [boardState, setBoardState] = useState<QuestBoardState>(() => loadBoardState());
  const [activeMissionQuestId, setActiveMissionQuestId] = useState<string | null>(null);
  const [activeCadence, setActiveCadence] = useState<QuestCadence>('daily');
  const [sidebarView, setSidebarView] = useState<'learn' | 'progress' | 'tools'>('learn');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState<QuestPriority | 'all'>('all');
  const [focusFilter, setFocusFilter] = useState<QuestFocus | 'all'>('all');
  const [floatingXp, setFloatingXp] = useState<{ xp: number; questTitle: string } | null>(null);
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);
  const [tacticalNotice, setTacticalNotice] = useState<string | null>(null);

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

  useEffect(() => {
    if (!tacticalNotice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setTacticalNotice(null), 2600);
    return () => window.clearTimeout(timeoutId);
  }, [tacticalNotice]);

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

  const activeMissionQuest = useMemo(() => {
    if (activeMissionQuestId) {
      return boardState.quests.find((quest) => quest.id === activeMissionQuestId);
    }

    return recommendedLearningQuest;
  }, [activeMissionQuestId, boardState.quests, recommendedLearningQuest]);

  const nextMissionQuest = useMemo(
    () => boardState.quests.find((quest) => quest.focus === 'learning' && !quest.completed && quest.id !== activeMissionQuest?.id),
    [activeMissionQuest?.id, boardState.quests],
  );

  useEffect(() => {
    if (!activeMissionQuestId && recommendedLearningQuest) {
      setActiveMissionQuestId(recommendedLearningQuest.id);
      return;
    }

    if (activeMissionQuestId && !boardState.quests.some((quest) => quest.id === activeMissionQuestId)) {
      setActiveMissionQuestId(recommendedLearningQuest?.id ?? null);
    }
  }, [activeMissionQuestId, boardState.quests, recommendedLearningQuest]);

  function handleAddQuest(quest: QuestItem) {
    if (boardState.tacticalState.actionPoints <= 0) {
      setTacticalNotice('Nessun action point disponibile per creare nuove missioni in questo turno.');
      return;
    }

    setBoardState((current) => {
      return {
        ...current,
        quests: [quest, ...current.quests],
        tacticalState: {
          ...current.tacticalState,
          actionPoints: Math.max(0, current.tacticalState.actionPoints - 1),
          lastEvent: 'Quest forged',
        },
      };
    });
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

  function handleMissionLabProgressUpdate(
    questId: string,
    updater: (current?: QuestBoardState['missionLabProgress'][string]) => QuestBoardState['missionLabProgress'][string],
  ) {
    setBoardState((current) => ({
      ...current,
      missionLabProgress: {
        ...current.missionLabProgress,
        [questId]: updater(current.missionLabProgress[questId]),
      },
    }));
  }

  function completeQuestWithRewards(questId: string) {
    setBoardState((current) => {
      const targetQuest = getQuestById(current.quests, questId);
      if (!targetQuest || targetQuest.completed || current.tacticalState.actionPoints <= 0) {
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
        tacticalState: {
          ...current.tacticalState,
          actionPoints: Math.max(0, current.tacticalState.actionPoints - 1),
          momentum: current.tacticalState.momentum + 1,
          lastEvent: `Objective cleared: ${targetQuest.title}`,
          phase: 'review',
        },
      };
    });
  }

  function handleToggleQuest(questId: string, completed: boolean) {
    if (completed) {
      setBoardState((current) => reopenQuest(current, questId));
      return;
    }

    if (boardState.tacticalState.actionPoints <= 0) {
      setTacticalNotice('Nessun action point rimasto. Chiudi il turno per ripristinare la squadra.');
      return;
    }

    completeQuestWithRewards(questId);
  }

  function handlePhaseChange(phase: TacticalPhase) {
    setBoardState((current) => ({
      ...current,
      tacticalState: {
        ...current.tacticalState,
        phase,
        lastEvent: `Phase switched to ${tacticalPhaseLabels[phase]}`,
      },
    }));
  }

  function handleEndTurn() {
    setBoardState((current) => ({
      ...current,
      tacticalState: {
        ...current.tacticalState,
        turn: current.tacticalState.turn + 1,
        actionPoints: current.tacticalState.maxActionPoints,
        phase: 'command',
        lastEvent: `Turn ${current.tacticalState.turn + 1} started`,
      },
    }));
    setTacticalNotice('Nuovo turno attivo: action points ripristinati.');
  }

  function handleHintAction() {
    if (boardState.tacticalState.actionPoints <= 0) {
      setTacticalNotice('Nessun action point disponibile per usare altri hint.');
      return false;
    }

    setBoardState((current) => ({
      ...current,
      tacticalState: {
        ...current.tacticalState,
        actionPoints: Math.max(0, current.tacticalState.actionPoints - 1),
        lastEvent: 'Intel requested',
        phase: 'engage',
      },
    }));

    return true;
  }

  function handleResetBoard() {
    setBoardState(resetBoardState());
    setActiveCadence('daily');
  }

  function handleImport(payload: string) {
    setBoardState(importBoardState(payload));
  }

  return (
    <main className="app-shell" id="app-main">
      <a className="skip-link" href="#learning-workspace">
        Salta al workspace
      </a>
      {floatingXp ? <FloatingXpToast xp={floatingXp.xp} questTitle={floatingXp.questTitle} /> : null}
      {levelUpLevel ? <LevelUpModal level={levelUpLevel} onClose={() => setLevelUpLevel(null)} /> : null}

      <QuestHud profile={boardState.profile} quests={filteredQuests} />
      <TacticalCommandPanel
        tacticalState={boardState.tacticalState}
        onPhaseChange={handlePhaseChange}
        onEndTurn={handleEndTurn}
        notice={tacticalNotice}
      />
      <MissionLabPanel
        quest={activeMissionQuest}
        nextQuest={nextMissionQuest}
        onCompleteQuest={completeQuestWithRewards}
        sessionState={activeMissionQuest ? boardState.missionLabState[activeMissionQuest.id] : undefined}
        onSessionChange={handleMissionLabSessionChange}
        onSessionReset={handleMissionLabSessionReset}
        progressState={activeMissionQuest ? boardState.missionLabProgress[activeMissionQuest.id] : undefined}
        onProgressUpdate={handleMissionLabProgressUpdate}
        onRequestHint={handleHintAction}
        actionPointsRemaining={boardState.tacticalState.actionPoints}
        onOpenNextQuest={() => {
          if (nextMissionQuest) {
            setActiveMissionQuestId(nextMissionQuest.id);
          }
        }}
      />

      <section className="workspace-grid" id="learning-workspace" aria-label="Learning workspace">
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
          <PanelCard className="sidebar-shell">
            <SectionHeading
              eyebrow="Navigation"
              title="Percorso utente"
              description="Tre sezioni chiare per iniziare, monitorare i progressi e gestire il workspace."
            />

            <div className="sidebar-switcher" role="tablist" aria-label="Sezioni laterali">
              <button
                type="button"
                role="tab"
                aria-selected={sidebarView === 'learn'}
                className={sidebarView === 'learn' ? 'active' : ''}
                onClick={() => setSidebarView('learn')}
              >
                Inizia
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={sidebarView === 'progress'}
                className={sidebarView === 'progress' ? 'active' : ''}
                onClick={() => setSidebarView('progress')}
              >
                Progresso
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={sidebarView === 'tools'}
                className={sidebarView === 'tools' ? 'active' : ''}
                onClick={() => setSidebarView('tools')}
              >
                Strumenti
              </button>
            </div>
          </PanelCard>

          {sidebarView === 'learn' ? (
            <>
              <PanelCard className="notes-panel">
                <SectionHeading
                  eyebrow="Recommended"
                  title="Fai questo adesso"
                  description="Il percorso piu semplice per avanzare nella sessione corrente."
                />

                <div className="onboarding-steps">
                  <div className="onboarding-step">
                    <span className="step-index">1</span>
                    <div>
                      <strong>Leggi la missione consigliata</strong>
                      <small>{recommendedLearningQuest ? recommendedLearningQuest.title : 'Apri o crea una missione di apprendimento.'}</small>
                    </div>
                  </div>
                  <div className="onboarding-step">
                    <span className="step-index">2</span>
                    <div>
                      <strong>Completa il Mission Lab</strong>
                      <small>Chiudi tutti gli obiettivi prima di passare a un altro pannello.</small>
                    </div>
                  </div>
                </div>
              </PanelCard>
              <OnboardingPreview />
              <TheorySprintPanel quest={recommendedLearningQuest} />
              <LearningTracksPanel quests={boardState.quests} />
            </>
          ) : null}

          {sidebarView === 'progress' ? (
            <>
              <AcademyInsightsPanel quests={boardState.quests} profile={boardState.profile} activityLog={boardState.activityLog} />
              <AssessmentHubPanel quests={boardState.quests} profile={boardState.profile} />
              <CertificationVaultPanel quests={boardState.quests} profile={boardState.profile} />
              <RecentActivityPanel items={boardState.activityLog} />
              <LeaderboardPreview profile={boardState.profile} />
            </>
          ) : null}

          {sidebarView === 'tools' ? (
            <>
              <QuestComposer onAddQuest={handleAddQuest} />
              <QuestTemplates onUseTemplate={handleAddQuest} />
              <DataPortabilityPanel exportPayload={exportBoardState(boardState)} onImport={handleImport} />

              <PanelCard className="notes-panel">
                <SectionHeading
                  eyebrow="Workspace"
                  title="Gestione prodotto"
                  description="Azioni di supporto separate dal percorso di apprendimento principale."
                />

                <ul>
                  <li>Persistenza locale nel browser con ripresa del lab per missione.</li>
                  <li>Template rapidi e import/export JSON della board.</li>
                  <li>Base pronta per auth, backend e dashboard reali.</li>
                </ul>

                <ActionButton type="button" variant="secondary" onClick={handleResetBoard}>
                  Ripristina board iniziale
                </ActionButton>
              </PanelCard>
            </>
          ) : null}
        </aside>
      </section>
    </main>
  );
}
