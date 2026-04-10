import type { TacticalPhase, TacticalState } from '../types';

export const DEFAULT_ACTION_POINTS = 3;

export const tacticalPhaseLabels: Record<TacticalPhase, string> = {
  command: 'Command',
  engage: 'Engage',
  review: 'Review',
};

export function createInitialTacticalState(): TacticalState {
  return {
    turn: 1,
    phase: 'command',
    actionPoints: DEFAULT_ACTION_POINTS,
    maxActionPoints: DEFAULT_ACTION_POINTS,
    momentum: 0,
    lastEvent: 'Session deployed',
  };
}
