import { useEffect, useMemo, useState } from 'react';
import { getMissionLabByQuestId } from '../data/missionLabs';
import { buildBaseCells, evaluateCellFormula, getObjectiveFeedback, matchesObjective, type CellMap } from '../lib/missionLabLogic';
import { ActionButton } from './ui/ActionButton';
import { EmptyState } from './ui/EmptyState';
import { PanelCard } from './ui/PanelCard';
import { SectionHeading } from './ui/SectionHeading';
import type { MissionLabProgressState, MissionLabSessionState, QuestItem } from '../types';

interface MissionLabPanelProps {
  quest?: QuestItem;
  nextQuest?: QuestItem;
  onCompleteQuest: (questId: string) => void;
  sessionState?: MissionLabSessionState;
  onSessionChange: (questId: string, nextState: MissionLabSessionState) => void;
  onSessionReset: (questId: string) => void;
  progressState?: MissionLabProgressState;
  onProgressUpdate: (questId: string, updater: (current?: MissionLabProgressState) => MissionLabProgressState) => void;
  onRequestHint: () => boolean;
  actionPointsRemaining: number;
  onOpenNextQuest?: () => void;
}

export function MissionLabPanel({
  quest,
  nextQuest,
  onCompleteQuest,
  sessionState,
  onSessionChange,
  onSessionReset,
  progressState,
  onProgressUpdate,
  onRequestHint,
  actionPointsRemaining,
  onOpenNextQuest,
}: MissionLabPanelProps) {
  const lab = quest ? getMissionLabByQuestId(quest.id) : undefined;
  const [cells, setCells] = useState<CellMap>(() => sessionState?.cells ?? (lab ? buildBaseCells(lab) : {}));
  const [hintTier, setHintTier] = useState<0 | 1 | 2>(sessionState?.hintTier ?? 0);
  const [completionTriggered, setCompletionTriggered] = useState(false);
  const [startedAt, setStartedAt] = useState<number>(() => sessionState?.startedAt ?? Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(sessionState?.elapsedSeconds ?? 0);

  useEffect(() => {
    if (!lab) {
      setCells({});
      setHintTier(0);
      setCompletionTriggered(false);
      setStartedAt(Date.now());
      setElapsedSeconds(0);
      return;
    }

    const initialSession = sessionState ?? {
      cells: buildBaseCells(lab),
      hintTier: 0 as const,
      startedAt: Date.now(),
      elapsedSeconds: 0,
    };

    setCells(initialSession.cells);
    setHintTier(initialSession.hintTier);
    setStartedAt(initialSession.startedAt);
    setElapsedSeconds(initialSession.elapsedSeconds);
    setCompletionTriggered(false);
  }, [lab?.questId]);

  useEffect(() => {
    if (!lab || completionTriggered) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds(Math.max(0, Math.round((Date.now() - startedAt) / 1000)));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [completionTriggered, lab, startedAt]);

  const persistedElapsedSeconds = Math.floor(elapsedSeconds / 5) * 5;

  useEffect(() => {
    if (!lab || !quest) {
      return;
    }

    onSessionChange(quest.id, {
      cells,
      hintTier,
      startedAt,
      elapsedSeconds: persistedElapsedSeconds,
    });
  }, [cells, hintTier, lab, onSessionChange, quest, startedAt, Math.floor(elapsedSeconds / 5)]);

  const objectiveStates = useMemo(() => {
    if (!lab) {
      return [];
    }

    return lab.objectives.map((objective) => ({
      objective,
      isComplete: matchesObjective(objective, cells),
      feedback: getObjectiveFeedback(objective, cells),
      renderedValue: objective.expectedFormula ? evaluateCellFormula(objective.cellId, cells) : cells[objective.cellId] ?? '',
    }));
  }, [cells, lab]);

  const currentObjective = objectiveStates.find((item) => !item.isComplete) ?? null;
  const completedStepCount = objectiveStates.filter((item) => item.isComplete).length;

  const completedObjectives = objectiveStates.filter((item) => item.isComplete).length;
  const objectiveCount = lab?.objectives.length ?? 0;
  const completionRatio = objectiveCount > 0 ? Math.round((completedObjectives / objectiveCount) * 100) : 0;
  const isSolved = objectiveCount > 0 && completedObjectives === objectiveCount;
  const speedScore = elapsedSeconds <= 90 ? 100 : elapsedSeconds <= 180 ? 80 : 60;
  const autonomyScore = hintTier === 0 ? 100 : hintTier === 1 ? 82 : 64;
  const accuracyScore = isSolved ? 100 : completionRatio;
  const masteryScore = Math.round((speedScore + autonomyScore + accuracyScore) / 3);
  const masteryBand = masteryScore >= 92 ? 'Gold' : masteryScore >= 80 ? 'Strong' : 'Solid';

  useEffect(() => {
    if (!lab || !quest || quest.completed || !isSolved || completionTriggered) {
      return;
    }

    setCompletionTriggered(true);
    onProgressUpdate(quest.id, (current) => ({
      attempts: current?.attempts ?? 1,
      bestMasteryScore: Math.max(current?.bestMasteryScore ?? 0, masteryScore),
      completedRuns: (current?.completedRuns ?? 0) + 1,
      completedWithoutHints: (current?.completedWithoutHints ?? false) || hintTier === 0,
      lastCompletedAt: new Date().toISOString(),
    }));
    onCompleteQuest(quest.id);
  }, [completionTriggered, hintTier, isSolved, lab, masteryScore, onCompleteQuest, onProgressUpdate, quest]);

  if (!quest || !lab) {
    return (
      <PanelCard className="mission-lab">
        <SectionHeading
          eyebrow="Mission Lab"
          title="Laboratorio guidato"
          description="Qui svolgi gli esercizi pratici: leggi il task, modifica le celle richieste e chiudi gli obiettivi uno per uno."
        />
        <EmptyState
          title="Nessuna missione attiva nel laboratorio"
          description="Apri o crea una missione di apprendimento per lavorare nella griglia con validazione automatica."
        />
        <div className="mission-intro-grid">
          <div className="mission-intro-card">
            <strong>1. Leggi il task</strong>
            <small>Osserva titolo, descrizione e obiettivi prima di toccare la griglia.</small>
          </div>
          <div className="mission-intro-card">
            <strong>2. Completa le celle</strong>
            <small>Modifica solo i campi attivi e usa gli hint solo quando servono davvero.</small>
          </div>
          <div className="mission-intro-card">
            <strong>3. Ripeti fuori dal lab</strong>
            <small>Il vero apprendimento arriva quando rifai lo stesso passaggio in Excel o Sheets.</small>
          </div>
        </div>
      </PanelCard>
    );
  }

  return (
    <PanelCard className="mission-lab">
      <div className="mission-lab-topbar">
        <SectionHeading eyebrow={lab.eyebrow} title={lab.title} description={lab.description} />
        <div className="mission-lab-status">
          <span className="meta-pill">{completionRatio}% completato</span>
          <span className={`pill ${quest.difficulty}`}>{quest.xp} XP</span>
        </div>
      </div>

      <div className="mission-intro-grid">
        <div className="mission-intro-card">
          <strong>Obiettivo di oggi</strong>
          <small>Chiudi tutti gli obiettivi del lab e ottieni validazione automatica.</small>
        </div>
        <div className="mission-intro-card">
          <strong>Step corrente</strong>
          <small>{currentObjective ? currentObjective.objective.label : 'Tutti gli step sono completati.'}</small>
        </div>
        <div className="mission-intro-card">
          <strong>Come lavorare bene</strong>
          <small>Prova prima senza aiuti, poi usa gli hint solo se resti bloccato.</small>
        </div>
        <div className="mission-intro-card">
          <strong>Quando hai finito</strong>
          <small>Ripeti lo stesso esercizio in un foglio reale per fissare il gesto.</small>
        </div>
      </div>

      <div className="mission-lab-grid">
        <div className="spreadsheet-shell" role="table" aria-label={`Laboratorio ${lab.title}`}>
          <div className="spreadsheet-corner" aria-hidden="true" />
          {lab.columns.map((column) => (
            <div key={column} className="spreadsheet-column-header">
              {column}
            </div>
          ))}

          {lab.rows.map((row, rowIndex) => (
            <div key={`row-${rowIndex + 1}`} className="spreadsheet-row">
              <div className="spreadsheet-row-header">{rowIndex + 1}</div>
              {row.map((_, columnIndex) => {
                const cellId = `${lab.columns[columnIndex]}${rowIndex + 1}`;
                const isEditable = lab.editableCells.includes(cellId);
                const cellValue = cells[cellId] ?? '';
                const formulaOutput = cellValue.startsWith('=') ? evaluateCellFormula(cellId, cells) : null;

                return (
                  <div
                    key={cellId}
                    className={`spreadsheet-cell ${isEditable ? 'is-editable' : 'is-readonly'} ${
                      objectiveStates.some((item) => item.objective.cellId === cellId && item.isComplete) ? 'is-valid' : ''
                    }`}
                  >
                    <span className="spreadsheet-cell-id">{cellId}</span>
                    {isEditable ? (
                      <>
                        <input
                          value={cellValue}
                          onChange={(event) =>
                            setCells((current) => ({
                              ...current,
                              [cellId]: event.target.value,
                            }))
                          }
                          placeholder={cellId.startsWith('E') ? '=SUMIF(...)' : ''}
                          aria-label={`Modifica ${cellId}`}
                        />
                        {formulaOutput !== null ? <small className="formula-preview">Risultato: {formulaOutput}</small> : null}
                      </>
                    ) : (
                      <span className="spreadsheet-value">{cellValue || '-'}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mission-lab-side">
          <div className="mission-current-step">
            <strong>Passo attivo</strong>
            <small>
              {currentObjective
                ? `Step ${completedStepCount + 1} di ${objectiveCount}: ${currentObjective.objective.label}`
                : `Hai completato tutti e ${objectiveCount} gli step della missione.`}
            </small>
            {currentObjective ? (
              <div className={`mission-feedback mission-feedback-${currentObjective.feedback.state}`}>
                <span>
                  {currentObjective.feedback.label}
                  {currentObjective.feedback.category !== 'correct' ? (
                    <em className="mission-feedback-tag">{currentObjective.feedback.category.replaceAll('-', ' ')}</em>
                  ) : null}
                </span>
                <small>{currentObjective.feedback.message}</small>
              </div>
            ) : null}
          </div>

          <div className="mission-checklist">
            <strong>Checklist missione</strong>
            <div className="mission-checklist-items">
              {objectiveStates.map(({ objective, isComplete, renderedValue, feedback }) => (
                <div
                  key={objective.id}
                  className={`mission-check ${isComplete ? 'is-complete' : ''} ${currentObjective?.objective.id === objective.id ? 'is-current' : ''}`}
                >
                  <div>
                    <strong>{objective.label}</strong>
                    <small>
                      {objective.expectedFormula ? `Formula in ${objective.cellId}` : `Valore in ${objective.cellId}`}
                    </small>
                    {!isComplete ? (
                      <>
                        <small className="mission-check-feedback-tag">{feedback.category.replaceAll('-', ' ')}</small>
                        <small className="mission-check-feedback">{feedback.message}</small>
                      </>
                    ) : null}
                  </div>
                  <span>{isComplete ? 'OK' : renderedValue ? 'Verifica' : 'Da fare'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="practice-box">
            <span className="meta-pill">Da teoria a pratica</span>
            <small>{quest.practiceHint || quest.note}</small>
          </div>

          <div className="mission-rubric">
            <div className="mission-rubric-row">
              <span>Action Points</span>
              <strong>{actionPointsRemaining}</strong>
            </div>
            <div className="mission-rubric-row">
              <span>Accuracy</span>
              <strong>{accuracyScore}</strong>
            </div>
            <div className="mission-rubric-row">
              <span>Autonomy</span>
              <strong>{autonomyScore}</strong>
            </div>
            <div className="mission-rubric-row">
              <span>Speed</span>
              <strong>{speedScore}</strong>
            </div>
            <div className="mission-rubric-row is-total">
              <span>Mastery score</span>
              <strong>
                {masteryScore}
                <small>{masteryBand}</small>
              </strong>
            </div>
          </div>

          {hintTier > 0 ? (
            <div className="mission-hints">
              {objectiveStates
                .filter((item) => !item.isComplete)
                .map(({ objective }) => (
                  <div key={objective.id} className="mission-hint">
                    <strong>{objective.cellId}</strong>
                    <small>{hintTier === 1 ? objective.hintPrimary : objective.hintSecondary || objective.hintPrimary}</small>
                  </div>
                ))}
            </div>
          ) : null}

          <div className="mission-lab-actions">
            <ActionButton
              type="button"
              variant="secondary"
              onClick={() => {
                if (!onRequestHint()) {
                  return;
                }

                setHintTier((current) => (current === 0 ? 1 : current === 1 ? 2 : 2));
              }}
              disabled={hintTier === 2}
            >
              {hintTier === 0 ? 'Mostra hint 1' : hintTier === 1 ? 'Mostra hint 2' : 'Hint completi attivi'}
            </ActionButton>
            <ActionButton
              type="button"
              variant="ghost"
              onClick={() => {
                onProgressUpdate(quest.id, (current) => ({
                  attempts: (current?.attempts ?? 0) + 1,
                  bestMasteryScore: current?.bestMasteryScore ?? 0,
                  completedRuns: current?.completedRuns ?? 0,
                  completedWithoutHints: current?.completedWithoutHints ?? false,
                  lastCompletedAt: current?.lastCompletedAt,
                }));
                setCells(buildBaseCells(lab));
                setHintTier(0);
                setCompletionTriggered(false);
                setStartedAt(Date.now());
                setElapsedSeconds(0);
                onSessionReset(quest.id);
              }}
            >
              Reset lab
            </ActionButton>
          </div>

          <div className={`mission-victory ${isSolved ? 'is-visible' : ''}`}>
            <strong>{isSolved ? 'Missione risolta' : 'Completa tutti gli obiettivi'}</strong>
            <small>
              {isSolved
                ? `${lab.victoryCopy} Score finale: ${masteryScore}/100 · ${masteryBand}. Ora prova a rifare lo stesso passaggio in un foglio reale.`
                : `Timer attivo: ${elapsedSeconds}s. Ogni hint costa 1 AP e la missione si chiude quando tutti gli obiettivi risultano corretti.`}
            </small>
            {isSolved && nextQuest && onOpenNextQuest ? (
              <div className="mission-victory-actions">
                <ActionButton type="button" variant="primary" onClick={onOpenNextQuest}>
                  Apri prossima missione
                </ActionButton>
              </div>
            ) : null}
          </div>

          <div className="mission-recap">
            <strong>Recap di mastery</strong>
            <div className="mission-recap-grid">
              <div className="mission-recap-card">
                <span>Tentativi</span>
                <strong>{progressState?.attempts ?? 0}</strong>
              </div>
              <div className="mission-recap-card">
                <span>Best score</span>
                <strong>{Math.max(progressState?.bestMasteryScore ?? 0, masteryScore)}</strong>
              </div>
              <div className="mission-recap-card">
                <span>Clean run</span>
                <strong>{(progressState?.completedWithoutHints ?? false) || (isSolved && hintTier === 0) ? 'Sì' : 'No'}</strong>
              </div>
            </div>
            <small>
              {quest.domain
                ? `Skill allenata: ${quest.domain}.`
                : 'Skill allenata tramite esercizio pratico.'}{' '}
              Concetti chiave: {objectiveStates.map(({ objective }) => objective.label).join(' · ')}.
            </small>
          </div>
        </div>
      </div>
    </PanelCard>
  );
}
