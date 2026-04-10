import type { SpreadsheetDomain, SpreadsheetPlatform } from '../types';

export interface LearningTrack {
  id: string;
  title: string;
  domain: SpreadsheetDomain;
  platform: SpreadsheetPlatform;
  missions: number;
  outcome: string;
  skills: string[];
}

export const learningTracks: LearningTrack[] = [
  {
    id: 'track-foundations',
    title: 'Data Foundations',
    domain: 'foundations',
    platform: 'both',
    missions: 2,
    outcome: 'Sapere impostare fogli leggibili, puliti e pronti per calcoli affidabili.',
    skills: ['Data entry', 'Cleaning', 'Validation', 'Formatting'],
  },
  {
    id: 'track-formulas',
    title: 'Formula Builder',
    domain: 'formulas',
    platform: 'both',
    missions: 2,
    outcome: 'Passare da formule base a lookup e logica condizionale con casi reali.',
    skills: ['SUMIF', 'IF', 'XLOOKUP', 'INDEX/MATCH'],
  },
  {
    id: 'track-analysis',
    title: 'Business Analysis',
    domain: 'analysis',
    platform: 'both',
    missions: 2,
    outcome: 'Leggere dataset, creare riepiloghi e prendere decisioni dai numeri.',
    skills: ['Pivot', 'KPIs', 'Scenario thinking', 'ROI'],
  },
  {
    id: 'track-visualization',
    title: 'Dashboard Storytelling',
    domain: 'visualization',
    platform: 'both',
    missions: 2,
    outcome: 'Scegliere grafici, KPI e gerarchia visiva per comunicare una decisione chiara.',
    skills: ['Charts', 'Narrative', 'KPI hierarchy', 'Dashboard layout'],
  },
  {
    id: 'track-automation',
    title: 'Automation Path',
    domain: 'automation',
    platform: 'both',
    missions: 2,
    outcome: 'Capire quando automatizzare con macro, Office Scripts o Apps Script.',
    skills: ['Macros', 'Apps Script', 'Refresh flows', 'Task automation'],
  },
];
