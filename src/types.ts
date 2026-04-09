export type QuestCadence = 'daily' | 'weekly' | 'backlog';
export type QuestDifficulty = 'light' | 'core' | 'boss';
export type QuestFocus = 'build' | 'ops' | 'admin' | 'learning' | 'personal';
export type QuestPriority = 'now' | 'next' | 'later';
export type SpreadsheetPlatform = 'excel' | 'sheets' | 'both';
export type SpreadsheetDomain = 'foundations' | 'formulas' | 'analysis' | 'visualization' | 'automation';

export interface QuestItem {
  id: string;
  title: string;
  note: string;
  cadence: QuestCadence;
  difficulty: QuestDifficulty;
  focus: QuestFocus;
  priority: QuestPriority;
  xp: number;
  completed: boolean;
  createdAt: string;
  platform?: SpreadsheetPlatform;
  domain?: SpreadsheetDomain;
  theorySnippet?: string;
  practiceHint?: string;
}

export interface QuestProfile {
  streakDays: number;
  totalXp: number;
  level: number;
}

export interface QuestActivityEntry {
  id: string;
  questId: string;
  questTitle: string;
  xpGained: number;
  focus: QuestFocus;
  difficulty: QuestDifficulty;
  cadence: QuestCadence;
  completedAt: string;
  levelAfter: number;
  wasLevelUp: boolean;
}

export interface MissionLabSessionState {
  cells: Record<string, string>;
  hintTier: 0 | 1 | 2;
  startedAt: number;
  elapsedSeconds: number;
}

export interface QuestBoardState {
  quests: QuestItem[];
  profile: QuestProfile;
  activityLog: QuestActivityEntry[];
  missionLabState: Record<string, MissionLabSessionState>;
}
