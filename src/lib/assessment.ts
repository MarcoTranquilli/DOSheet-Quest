import { learningTracks } from '../data/learningTracks';
import type { QuestItem, QuestProfile, SpreadsheetDomain, SpreadsheetPlatform } from '../types';

type AssessmentStatus = 'not-started' | 'in-progress' | 'ready' | 'certified';

export interface TrackAssessment {
  id: string;
  title: string;
  domain: SpreadsheetDomain;
  platform: SpreadsheetPlatform;
  completionRate: number;
  completedMissions: number;
  availableMissions: number;
  status: AssessmentStatus;
  badgeTitle: string;
  summary: string;
}

export interface AcademyAssessment {
  overallRate: number;
  certifiedTracks: number;
  readyTracks: number;
  academyRank: string;
  trackAssessments: TrackAssessment[];
}

const badgeTitles: Record<string, string> = {
  foundations: 'Data Foundations Verified',
  formulas: 'Formula Builder Certified',
  analysis: 'Business Analysis Verified',
  automation: 'Automation Planner Verified',
};

function computeTrackStatus(completedMissions: number, availableMissions: number): AssessmentStatus {
  if (completedMissions === 0) {
    return 'not-started';
  }

  if (completedMissions >= availableMissions && availableMissions > 0) {
    return 'certified';
  }

  if (availableMissions > 1 && completedMissions >= availableMissions - 1) {
    return 'ready';
  }

  return 'in-progress';
}

function computeAcademyRank(profile: QuestProfile, certifiedTracks: number, readyTracks: number) {
  if (certifiedTracks >= 4) {
    return 'Spreadsheet Architect';
  }

  if (certifiedTracks >= 2 || readyTracks >= 3 || profile.level >= 5) {
    return 'Spreadsheet Operator';
  }

  if (profile.level >= 3) {
    return 'Spreadsheet Analyst';
  }

  return 'Spreadsheet Explorer';
}

export function computeAcademyAssessment(quests: QuestItem[], profile: QuestProfile): AcademyAssessment {
  const trackAssessments = learningTracks.map((track) => {
    const matchingQuests = quests.filter((quest) => quest.focus === 'learning' && quest.domain === track.domain);
    const completedMissions = matchingQuests.filter((quest) => quest.completed).length;
    const availableMissions = matchingQuests.length;
    const completionRate = availableMissions > 0 ? Math.round((completedMissions / availableMissions) * 100) : 0;
    const status = computeTrackStatus(completedMissions, availableMissions);

    return {
      id: track.id,
      title: track.title,
      domain: track.domain,
      platform: track.platform,
      completionRate,
      completedMissions,
      availableMissions,
      status,
      badgeTitle: badgeTitles[track.domain] || `${track.title} Badge`,
      summary: track.outcome,
    };
  });

  const certifiedTracks = trackAssessments.filter((track) => track.status === 'certified').length;
  const readyTracks = trackAssessments.filter((track) => track.status === 'ready').length;
  const overallRate = trackAssessments.length > 0
    ? Math.round(trackAssessments.reduce((total, track) => total + track.completionRate, 0) / trackAssessments.length)
    : 0;

  return {
    overallRate,
    certifiedTracks,
    readyTracks,
    academyRank: computeAcademyRank(profile, certifiedTracks, readyTracks),
    trackAssessments,
  };
}
