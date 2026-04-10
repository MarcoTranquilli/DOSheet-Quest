import { sampleQuests } from '../data/sampleQuests';
import { computeLevel } from './score';
import { createInitialTacticalState } from './tactics';
import type {
  MissionLabProgressState,
  MissionLabSessionState,
  QuestActivityEntry,
  QuestBoardState,
  QuestFocus,
  QuestItem,
  QuestPriority,
} from '../types';

const STORAGE_KEY = 'dosheet-quest:v5';

const fallbackState: QuestBoardState = {
  quests: sampleQuests,
  profile: {
    streakDays: 0,
    totalXp: 0,
    level: 1,
  },
  activityLog: [],
  missionLabState: {},
  missionLabProgress: {},
  tacticalState: createInitialTacticalState(),
};

const validFocuses: QuestFocus[] = ['build', 'ops', 'admin', 'learning', 'personal'];
const validPriorities: QuestPriority[] = ['now', 'next', 'later'];

function normalizeQuest(item: Partial<QuestItem>, index: number): QuestItem {
  const difficulty = item.difficulty === 'light' || item.difficulty === 'core' || item.difficulty === 'boss'
    ? item.difficulty
    : 'core';
  const cadence = item.cadence === 'daily' || item.cadence === 'weekly' || item.cadence === 'backlog'
    ? item.cadence
    : 'backlog';

  return {
    id: item.id || `quest-${index + 1}`,
    title: String(item.title || `Quest ${index + 1}`),
    note: String(item.note || ''),
    cadence,
    difficulty,
    focus: validFocuses.includes(item.focus as QuestFocus) ? (item.focus as QuestFocus) : 'ops',
    priority: validPriorities.includes(item.priority as QuestPriority) ? (item.priority as QuestPriority) : 'next',
    xp: Number(item.xp ?? 30),
    completed: Boolean(item.completed),
    createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
    platform: item.platform === 'excel' || item.platform === 'sheets' || item.platform === 'both'
      ? item.platform
      : undefined,
    domain: item.domain === 'foundations' || item.domain === 'formulas' || item.domain === 'analysis' || item.domain === 'visualization' || item.domain === 'automation'
      ? item.domain
      : undefined,
    theorySnippet: typeof item.theorySnippet === 'string' ? item.theorySnippet : undefined,
    practiceHint: typeof item.practiceHint === 'string' ? item.practiceHint : undefined,
  };
}

function normalizeActivity(item: Partial<QuestActivityEntry>, index: number): QuestActivityEntry {
  return {
    id: item.id || `activity-${index + 1}`,
    questId: String(item.questId || `quest-${index + 1}`),
    questTitle: String(item.questTitle || 'Quest completata'),
    xpGained: Number(item.xpGained ?? 0),
    focus: validFocuses.includes(item.focus as QuestFocus) ? (item.focus as QuestFocus) : 'ops',
    difficulty: item.difficulty === 'light' || item.difficulty === 'core' || item.difficulty === 'boss'
      ? item.difficulty
      : 'core',
    cadence: item.cadence === 'daily' || item.cadence === 'weekly' || item.cadence === 'backlog'
      ? item.cadence
      : 'backlog',
    completedAt: typeof item.completedAt === 'string' ? item.completedAt : new Date().toISOString(),
    levelAfter: Number(item.levelAfter ?? 1),
    wasLevelUp: Boolean(item.wasLevelUp),
  };
}

function normalizeMissionLabState(item: Partial<MissionLabSessionState>): MissionLabSessionState {
  return {
    cells: typeof item.cells === 'object' && item.cells !== null ? Object.fromEntries(
      Object.entries(item.cells).map(([key, value]) => [key, String(value)]),
    ) : {},
    hintTier: item.hintTier === 1 || item.hintTier === 2 ? item.hintTier : 0,
    startedAt: Number(item.startedAt ?? Date.now()),
    elapsedSeconds: Number(item.elapsedSeconds ?? 0),
  };
}

function normalizeMissionLabProgress(item: Partial<MissionLabProgressState>): MissionLabProgressState {
  return {
    attempts: Number(item.attempts ?? 0),
    bestMasteryScore: Number(item.bestMasteryScore ?? 0),
    completedRuns: Number(item.completedRuns ?? 0),
    completedWithoutHints: Boolean(item.completedWithoutHints),
    lastCompletedAt: typeof item.lastCompletedAt === 'string' ? item.lastCompletedAt : undefined,
  };
}

export function loadBoardState(): QuestBoardState {
  if (typeof window === 'undefined') {
    return fallbackState;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return fallbackState;
  }

  try {
    const parsed = JSON.parse(raw) as QuestBoardState;
    return {
      quests: Array.isArray(parsed.quests) && parsed.quests.length > 0
        ? parsed.quests.map((item, index) => normalizeQuest(item, index))
        : fallbackState.quests,
      profile: {
        streakDays: Number(parsed.profile?.streakDays ?? 0),
        totalXp: Number(parsed.profile?.totalXp ?? 0),
        level: computeLevel(Number(parsed.profile?.totalXp ?? 0)),
      },
      activityLog: Array.isArray(parsed.activityLog)
        ? parsed.activityLog.map((item, index) => normalizeActivity(item, index)).slice(0, 10)
        : [],
      missionLabState: typeof parsed.missionLabState === 'object' && parsed.missionLabState !== null
        ? Object.fromEntries(
          Object.entries(parsed.missionLabState).map(([questId, session]) => [questId, normalizeMissionLabState(session)]),
        )
        : {},
      missionLabProgress: typeof parsed.missionLabProgress === 'object' && parsed.missionLabProgress !== null
        ? Object.fromEntries(
          Object.entries(parsed.missionLabProgress).map(([questId, progress]) => [questId, normalizeMissionLabProgress(progress)]),
        )
        : {},
      tacticalState: {
        turn: Number(parsed.tacticalState?.turn ?? 1),
        phase: parsed.tacticalState?.phase === 'engage' || parsed.tacticalState?.phase === 'review' ? parsed.tacticalState.phase : 'command',
        actionPoints: Number(parsed.tacticalState?.actionPoints ?? fallbackState.tacticalState.actionPoints),
        maxActionPoints: Number(parsed.tacticalState?.maxActionPoints ?? fallbackState.tacticalState.maxActionPoints),
        momentum: Number(parsed.tacticalState?.momentum ?? 0),
        lastEvent: typeof parsed.tacticalState?.lastEvent === 'string' ? parsed.tacticalState.lastEvent : fallbackState.tacticalState.lastEvent,
      },
    };
  } catch {
    return fallbackState;
  }
}

export function saveBoardState(state: QuestBoardState): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetBoardState(): QuestBoardState {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return fallbackState;
}

export function exportBoardState(state: QuestBoardState): string {
  return JSON.stringify(state, null, 2);
}

export function importBoardState(raw: string): QuestBoardState {
  const parsed = JSON.parse(raw) as QuestBoardState;
  return {
    quests: Array.isArray(parsed.quests) && parsed.quests.length > 0
      ? parsed.quests.map((item, index) => normalizeQuest(item, index))
      : fallbackState.quests,
    profile: {
      streakDays: Number(parsed.profile?.streakDays ?? 0),
      totalXp: Number(parsed.profile?.totalXp ?? 0),
      level: computeLevel(Number(parsed.profile?.totalXp ?? 0)),
    },
    activityLog: Array.isArray(parsed.activityLog)
      ? parsed.activityLog.map((item, index) => normalizeActivity(item, index)).slice(0, 10)
      : [],
    missionLabState: typeof parsed.missionLabState === 'object' && parsed.missionLabState !== null
      ? Object.fromEntries(
        Object.entries(parsed.missionLabState).map(([questId, session]) => [questId, normalizeMissionLabState(session)]),
      )
      : {},
    missionLabProgress: typeof parsed.missionLabProgress === 'object' && parsed.missionLabProgress !== null
      ? Object.fromEntries(
        Object.entries(parsed.missionLabProgress).map(([questId, progress]) => [questId, normalizeMissionLabProgress(progress)]),
      )
      : {},
    tacticalState: {
      turn: Number(parsed.tacticalState?.turn ?? 1),
      phase: parsed.tacticalState?.phase === 'engage' || parsed.tacticalState?.phase === 'review' ? parsed.tacticalState.phase : 'command',
      actionPoints: Number(parsed.tacticalState?.actionPoints ?? fallbackState.tacticalState.actionPoints),
      maxActionPoints: Number(parsed.tacticalState?.maxActionPoints ?? fallbackState.tacticalState.maxActionPoints),
      momentum: Number(parsed.tacticalState?.momentum ?? 0),
      lastEvent: typeof parsed.tacticalState?.lastEvent === 'string' ? parsed.tacticalState.lastEvent : fallbackState.tacticalState.lastEvent,
    },
  };
}
