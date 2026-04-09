import { computeAcademyAssessment } from './assessment';
import type { QuestActivityEntry, QuestItem, QuestProfile } from '../types';

export interface AcademyInsights {
  nextBestAction: string;
  weakArea: string;
  momentum: string;
  completionThisWeek: number;
}

export function computeAcademyInsights(
  quests: QuestItem[],
  profile: QuestProfile,
  activityLog: QuestActivityEntry[],
): AcademyInsights {
  const assessment = computeAcademyAssessment(quests, profile);
  const weakestTrack = [...assessment.trackAssessments].sort((left, right) => left.completionRate - right.completionRate)[0];
  const readyTrack = assessment.trackAssessments.find((track) => track.status === 'ready');
  const completionThisWeek = activityLog.filter((item) => {
    const diff = Date.now() - new Date(item.completedAt).getTime();
    return diff <= 7 * 24 * 60 * 60 * 1000;
  }).length;

  const nextBestAction = readyTrack
    ? `Chiudi la track ${readyTrack.title}: sei a un passo dalla certificazione.`
    : weakestTrack
      ? `Rinforza la track ${weakestTrack.title} con una nuova missione guidata.`
      : 'Completa una missione per iniziare a costruire il tuo profilo di competenza.';

  const weakArea = weakestTrack
    ? `${weakestTrack.title} è la tua area meno consolidata con ${weakestTrack.completionRate}% di avanzamento.`
    : 'Nessuna area debole rilevata: continua a distribuire la pratica sulle track attive.';

  const momentum =
    completionThisWeek >= 4
      ? 'Momentum alto: stai mantenendo una cadenza di pratica molto solida.'
      : completionThisWeek >= 2
        ? 'Momentum buono: hai già costruito una routine di apprendimento credibile.'
        : 'Momentum basso: una sessione breve oggi migliorerebbe molto la continuità.';

  return {
    nextBestAction,
    weakArea,
    momentum,
    completionThisWeek,
  };
}
