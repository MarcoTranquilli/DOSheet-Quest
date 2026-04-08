import { sampleQuests } from '../data/sampleQuests';
import { computeLevel } from './score';
import type { QuestBoardState, QuestFocus, QuestItem, QuestPriority } from '../types';

const STORAGE_KEY = 'dosheet-quest:v2';

const fallbackState: QuestBoardState = {
  quests: sampleQuests,
  profile: {
    streakDays: 0,
    totalXp: 0,
    level: 1,
  },
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
  };
}
