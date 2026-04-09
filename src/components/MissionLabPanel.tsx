import { useEffect, useMemo, useState } from 'react';
import { getMissionLabByQuestId } from '../data/missionLabs';
import { buildBaseCells, evaluateCellFormula, matchesObjective, type CellMap } from '../lib/missionLabLogic';
import { ActionButton } from './ui/ActionButton';
import { PanelCard } from './ui/PanelCard';
import { SectionHeading } from './ui/SectionHeading';
import type { MissionLabSessionState, QuestItem } from '../types';

interface MissionLabPanelProps {
  quest?: QuestItem;
  onCompleteQuest: (questId: string) => void;
  sessionState?: MissionLabSessionState;
  onSessionChange: (questId: string, nextState: MissionLabSessionState) => void;
  onSessionReset: (questId: string) => void;
}

export function MissionLabPanel({ quest, onCompleteQuest, sessionState, onSessionChange, onSessionReset }: MissionLabPanelProps) {
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

    if (sessionState) {
      setCells(sessionState.cells);
      setHintTier(sessionState.hintTier);
      setStartedAt(sessionState.startedAt);
      setElapsedSeconds(sessionState.elapsedSeconds);
      setCompletionTriggered(false);
      return;
    }

    setCells(buildBaseCells(lab));
    setHintTier(0);
    setCompletionTriggered(false);
    setStartedAt(Date.now());
    setElapsedSeconds(0);
  }, [lab?.questId, sessionState]);

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
      renderedValue: objective.expectedFormula ? evaluateCellFormula(objective.cellId, cells) : cells[objective.cellId] ?? '',
    }));
  }, [cells, lab]);

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
    onCompleteQuest(quest.id);
  }, [completionTriggered, isSolved, lab, onCompleteQuest, quest]);

  if (!quest || !lab) {
    return (
      <PanelCard className="mission-lab">
        <SectionHeading
          eyebrow="Mission Lab"
          title="Playground interattivo in arrivo"
          description="Le missioni guidate compariranno qui con griglia, verifica automatica e feedback immediato."
        />
        <div className="activity-empty">
          Seleziona o crea una missione di apprendimento supportata per vedere il laboratorio attivo.
        </div>
      </PanelCard>
    );
  }

  return (
    <PanelCard className="mission-lab">
      <div className="mission-lab-topbar">
        <SectionHeading eyebrow={lab.eyebrow} title={lab.title} description={lab.description} />
        <div className="mission-lab-status">
          <span className="meta-pill">{completionRatio}% complete</span>
          <span className={`pill ${quest.difficulty}`}>{quest.xp} XP</span>
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
                        {formulaOutput !== null ? <small className="formula-preview">Result: {formulaOutput}</small> : null}
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
          <div className="mission-checklist">
            <strong>Obiettivi della missione</strong>
            <div className="mission-checklist-items">
              {objectiveStates.map(({ objective, isComplete, renderedValue }) => (
                <div key={objective.id} className={`mission-check ${isComplete ? 'is-complete' : ''}`}>
                  <div>
                    <strong>{objective.label}</strong>
                    <small>
                      {objective.expectedFormula ? `Formula in ${objective.cellId}` : `Valore in ${objective.cellId}`}
                    </small>
                  </div>
                  <span>{isComplete ? 'OK' : renderedValue ? 'Check' : 'Todo'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="practice-box">
            <span className="meta-pill">Theory to action</span>
            <small>{quest.practiceHint || quest.note}</small>
          </div>

          <div className="mission-rubric">
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
              <span>Mastery</span>
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
              onClick={() => setHintTier((current) => (current === 0 ? 1 : current === 1 ? 2 : 2))}
              disabled={hintTier === 2}
            >
              {hintTier === 0 ? 'Hint livello 1' : hintTier === 1 ? 'Hint livello 2' : 'Hint completi attivi'}
            </ActionButton>
            <ActionButton
              type="button"
              variant="ghost"
              onClick={() => {
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
                ? `${lab.victoryCopy} Score finale: ${masteryScore}/100 · ${masteryBand}.`
                : `Timer attivo: ${elapsedSeconds}s. La quest verrà chiusa automaticamente quando tutte le celle richieste saranno corrette.`}
            </small>
          </div>
        </div>
      </div>
    </PanelCard>
  );
}
