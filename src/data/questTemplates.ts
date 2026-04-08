import type { QuestItem } from '../types';

type QuestTemplate = Omit<QuestItem, 'id' | 'createdAt' | 'completed'>;

export const questTemplates: QuestTemplate[] = [
  {
    title: 'Sprint di consegna',
    note: 'Porta a termine il pezzo piu vicino al rilascio di oggi.',
    cadence: 'daily',
    difficulty: 'boss',
    focus: 'build',
    priority: 'now',
    xp: 55,
  },
  {
    title: 'Pulizia operativa',
    note: 'Riduci attriti, follow-up e microbloccanti del flusso.',
    cadence: 'daily',
    difficulty: 'core',
    focus: 'ops',
    priority: 'next',
    xp: 30,
  },
  {
    title: 'Rituale di apprendimento',
    note: 'Dedica uno slot breve a migliorare una competenza critica.',
    cadence: 'weekly',
    difficulty: 'light',
    focus: 'learning',
    priority: 'later',
    xp: 15,
  },
];
