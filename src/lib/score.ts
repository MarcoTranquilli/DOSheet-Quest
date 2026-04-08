import type { QuestBoardState, QuestItem } from '../types';

export const XP_BY_DIFFICULTY: Record<QuestItem['difficulty'], number> = {
  light: 15,
  core: 30,
  boss: 55,
};

export function computeLevel(totalXp: number): number {
  return Math.max(1, Math.floor(totalXp / 100) + 1);
}

export function computeBoardMetrics(quests: QuestItem[]) {
  const completed = quests.filter((quest) => quest.completed).length;
  const openNow = quests.filter((quest) => !quest.completed && quest.priority === 'now').length;
  const bossOpen = quests.filter((quest) => !quest.completed && quest.difficulty === 'boss').length;
  const completionRatio = quests.length > 0 ? Math.round((completed / quests.length) * 100) : 0;

  return {
    completed,
    openNow,
    bossOpen,
    completionRatio,
  };
}

export function completeQuest(state: QuestBoardState, questId: string): QuestBoardState {
  let gainedXp = 0;

  const quests = state.quests.map((quest) => {
    if (quest.id !== questId || quest.completed) {
      return quest;
    }

    gainedXp = quest.xp;
    return {
      ...quest,
      completed: true,
    };
  });

  const totalXp = state.profile.totalXp + gainedXp;

  return {
    quests,
    profile: {
      ...state.profile,
      totalXp,
      level: computeLevel(totalXp),
      streakDays: gainedXp > 0 ? state.profile.streakDays + 1 : state.profile.streakDays,
    },
  };
}

export function reopenQuest(state: QuestBoardState, questId: string): QuestBoardState {
  let removedXp = 0;

  const quests = state.quests.map((quest) => {
    if (quest.id !== questId || !quest.completed) {
      return quest;
    }

    removedXp = quest.xp;
    return {
      ...quest,
      completed: false,
    };
  });

  const totalXp = Math.max(0, state.profile.totalXp - removedXp);

  return {
    quests,
    profile: {
      ...state.profile,
      totalXp,
      level: computeLevel(totalXp),
      streakDays: removedXp > 0 ? Math.max(0, state.profile.streakDays - 1) : state.profile.streakDays,
    },
  };
}
