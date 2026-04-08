import type { QuestCadence, QuestDifficulty, QuestFocus, QuestPriority } from '../types';

export const cadenceLabels: Record<QuestCadence, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  backlog: 'Backlog',
};

export const difficultyLabels: Record<QuestDifficulty, string> = {
  light: 'Light',
  core: 'Core',
  boss: 'Boss',
};

export const focusLabels: Record<QuestFocus, string> = {
  build: 'Build',
  ops: 'Ops',
  admin: 'Admin',
  learning: 'Learning',
  personal: 'Personal',
};

export const priorityLabels: Record<QuestPriority, string> = {
  now: 'Now',
  next: 'Next',
  later: 'Later',
};
