export interface MissionLabObjective {
  id: string;
  label: string;
  cellId: string;
  expectedValue?: string;
  expectedFormula?: string;
  hintPrimary: string;
  hintSecondary?: string;
}

export interface MissionLabDefinition {
  questId: string;
  eyebrow: string;
  title: string;
  description: string;
  columns: string[];
  rows: string[][];
  editableCells: string[];
  objectives: MissionLabObjective[];
  victoryCopy: string;
}

export const missionLabs: MissionLabDefinition[] = [
  {
    questId: 'quest-cleaning-foundations',
    eyebrow: 'Hands-on Lab',
    title: 'Pulizia anagrafica clienti',
    description:
      'Trasforma i nomi sporchi in un formato coerente e marca come validi i record pronti per il report.',
    columns: ['A', 'B', 'C', 'D'],
    rows: [
      ['Raw Name', 'Clean Name', 'Role', 'Status'],
      ['  MARCO ROSSI ', '', 'Sales', ''],
      ['giulia bianchi', '', 'Ops', ''],
      [' LUCA VERDI', '', 'Finance', ''],
    ],
    editableCells: ['B2', 'D2', 'B3', 'D3', 'B4', 'D4'],
    objectives: [
      {
        id: 'clean-b2',
        label: 'Normalizza il primo nome',
        cellId: 'B2',
        expectedValue: 'Marco Rossi',
        hintPrimary: 'Rimuovi spazi extra e usa maiuscole/minuscole corrette.',
        hintSecondary: 'Il formato finale deve essere Nome Cognome con iniziali maiuscole: `Marco Rossi`.',
      },
      {
        id: 'clean-b3',
        label: 'Normalizza il secondo nome',
        cellId: 'B3',
        expectedValue: 'Giulia Bianchi',
        hintPrimary: 'Applica lo stesso pattern di pulizia anche ai nomi già vicini al formato corretto.',
        hintSecondary: 'Mantieni un solo spazio centrale e usa il casing `Giulia Bianchi`.',
      },
      {
        id: 'clean-b4',
        label: 'Normalizza il terzo nome',
        cellId: 'B4',
        expectedValue: 'Luca Verdi',
        hintPrimary: 'Controlla gli spazi a sinistra e il casing finale.',
        hintSecondary: 'Il valore corretto non contiene spazi laterali ed è `Luca Verdi`.',
      },
      {
        id: 'status-d2',
        label: 'Valida il primo record',
        cellId: 'D2',
        expectedValue: 'OK',
        hintPrimary: 'Quando il dato è pulito e pronto per analisi, marca il record come OK.',
        hintSecondary: 'Usa esattamente la stringa `OK` per tutti i record approvati.',
      },
      {
        id: 'status-d3',
        label: 'Valida il secondo record',
        cellId: 'D3',
        expectedValue: 'OK',
        hintPrimary: 'Usa uno stato semplice e coerente per tutti i record pronti.',
        hintSecondary: 'Evita varianti come Valid o Done: qui serve `OK`.',
      },
      {
        id: 'status-d4',
        label: 'Valida il terzo record',
        cellId: 'D4',
        expectedValue: 'OK',
        hintPrimary: 'Tieni il valore identico per rendere il filtro successivo affidabile.',
        hintSecondary: 'La colonna Status deve contenere `OK` in tutti e tre i record.',
      },
    ],
    victoryCopy: 'Hai reso il dataset coerente: ora è pronto per formule, filtri e riepiloghi senza errori nascosti.',
  },
  {
    questId: 'quest-formulas-sumif',
    eyebrow: 'Formula Lab',
    title: 'KPI per categoria con SUMIF e IF',
    description:
      'Scrivi le formule nei campi dedicati per calcolare il totale software e verificare se il target è stato raggiunto.',
    columns: ['A', 'B', 'C', 'D', 'E', 'F'],
    rows: [
      ['Category', 'Amount', '', 'KPI', 'Formula', 'Result'],
      ['Software', '120', '', 'Total Software', '', ''],
      ['Hardware', '80', '', 'Bonus Check', '', ''],
      ['Software', '60', '', '', '', ''],
    ],
    editableCells: ['E2', 'E3'],
    objectives: [
      {
        id: 'formula-e2',
        label: 'Calcola il totale Software',
        cellId: 'E2',
        expectedFormula: '=SUMIF(A2:A4,"Software",B2:B4)',
        hintPrimary: 'Usa SUMIF sul range categorie e somma solo gli importi Software.',
        hintSecondary: 'La struttura è `=SUMIF(range_criterio,"Software",range_somma)`.',
      },
      {
        id: 'formula-e3',
        label: 'Verifica se il target è raggiunto',
        cellId: 'E3',
        expectedFormula: '=IF(F2>=180,"Target hit","Below target")',
        hintPrimary: 'Leggi il totale in F2 e restituisci un testo diverso in base alla soglia 180.',
        hintSecondary: 'Se il totale in F2 è almeno 180, il risultato deve essere `Target hit`.',
      },
    ],
    victoryCopy: 'Hai costruito un mini-riepilogo con formula e logica: è il passaggio chiave da dati grezzi a decisione.',
  },
  {
    questId: 'quest-pivot-analysis',
    eyebrow: 'Analysis Lab',
    title: 'Summary table da dataset vendite',
    description:
      'Leggi il dataset e compila la mini summary table: il focus è capire il pattern, non solo riempire celle.',
    columns: ['A', 'B', 'C', 'D', 'E'],
    rows: [
      ['Region', 'Sales', 'Rep', 'Metric', 'Answer'],
      ['North', '120', 'Ari', 'Top region', ''],
      ['South', '90', 'Nora', 'Total sales', ''],
      ['North', '80', 'Luca', 'Average deal', ''],
      ['West', '60', 'Mina', '', ''],
    ],
    editableCells: ['E2', 'E3', 'E4'],
    objectives: [
      {
        id: 'analysis-e2',
        label: 'Individua la regione con più vendite',
        cellId: 'E2',
        expectedValue: 'North',
        hintPrimary: 'Somma mentalmente le vendite per regione e confronta i totali.',
        hintSecondary: 'North compare due volte: 120 + 80 = 200, più di South e West.',
      },
      {
        id: 'analysis-e3',
        label: 'Calcola il totale vendite',
        cellId: 'E3',
        expectedValue: '350',
        hintPrimary: 'Somma tutti i valori della colonna Sales.',
        hintSecondary: '120 + 90 + 80 + 60 = 350.',
      },
      {
        id: 'analysis-e4',
        label: 'Calcola l average deal',
        cellId: 'E4',
        expectedValue: '87.5',
        hintPrimary: 'Dividi il totale per il numero di righe dati.',
        hintSecondary: '350 diviso 4 fa 87.5.',
      },
    ],
    victoryCopy: 'Hai estratto insight essenziali da un dataset compatto: è il nucleo del lavoro di analysis prima ancora della pivot.',
  },
  {
    questId: 'quest-chart-story',
    eyebrow: 'Visualization Lab',
    title: 'Scegli il grafico e il messaggio giusto',
    description:
      'Non basta fare un grafico: serve scegliere il formato più chiaro e scrivere il takeaway principale.',
    columns: ['A', 'B', 'C', 'D'],
    rows: [
      ['Month', 'Leads', 'Decision', 'Answer'],
      ['Jan', '42', 'Best chart', ''],
      ['Feb', '58', 'Main takeaway', ''],
      ['Mar', '71', '', ''],
      ['Apr', '69', '', ''],
    ],
    editableCells: ['D2', 'D3'],
    objectives: [
      {
        id: 'visual-d2',
        label: 'Scegli il grafico più adatto al trend',
        cellId: 'D2',
        expectedValue: 'Line chart',
        hintPrimary: 'Qui conta mostrare un andamento nel tempo, non un confronto isolato.',
        hintSecondary: 'Per un trend mensile la scelta migliore è `Line chart`.',
      },
      {
        id: 'visual-d3',
        label: 'Scrivi il takeaway principale',
        cellId: 'D3',
        expectedValue: 'Leads trend upward',
        hintPrimary: 'Riassumi in una frase breve ciò che il grafico rende evidente.',
        hintSecondary: 'Il messaggio chiave è che i lead crescono nel tempo: `Leads trend upward`.',
      },
    ],
    victoryCopy: 'Hai collegato chart choice e insight: è quello che distingue un grafico decorativo da uno davvero utile.',
  },
  {
    questId: 'quest-automation-flow',
    eyebrow: 'Automation Lab',
    title: 'Workflow di aggiornamento ticket',
    description:
      'Costruisci un mini-flow operativo: quando arriva un nuovo ticket, definisci trigger, output e owner del passaggio.',
    columns: ['A', 'B', 'C', 'D'],
    rows: [
      ['Step', 'Current State', 'Target State', 'Answer'],
      ['Trigger', 'Nuovo ticket da form', 'Evento iniziale', ''],
      ['Output', 'Aggiornare tracker', 'Dato aggiornato', ''],
      ['Owner', 'Ops Team', 'Responsabile', ''],
    ],
    editableCells: ['D2', 'D3', 'D4'],
    objectives: [
      {
        id: 'automation-d2',
        label: 'Nomina correttamente il trigger',
        cellId: 'D2',
        expectedValue: 'New ticket submitted',
        hintPrimary: 'Il trigger descrive l’evento che avvia il workflow.',
        hintSecondary: 'Qui il trigger corretto è `New ticket submitted`.',
      },
      {
        id: 'automation-d3',
        label: 'Descrivi l output operativo',
        cellId: 'D3',
        expectedValue: 'Tracker updated',
        hintPrimary: 'L’output è il cambiamento osservabile nel sistema o nel foglio.',
        hintSecondary: 'In questo caso l’output atteso è `Tracker updated`.',
      },
      {
        id: 'automation-d4',
        label: 'Assegna il responsabile',
        cellId: 'D4',
        expectedValue: 'Ops Team',
        hintPrimary: 'Ogni workflow sano ha un owner esplicito.',
        hintSecondary: 'Il responsabile atteso resta `Ops Team`.',
      },
    ],
    victoryCopy: 'Hai definito i mattoni fondamentali di un workflow: trigger, output e owner. È la base per macro, script e automazioni reali.',
  },
  {
    questId: 'quest-lookup-logic',
    eyebrow: 'Lookup Lab',
    title: 'Owner e segmento da tabella di mapping',
    description:
      'Recupera i campi corretti da una tabella di supporto usando formule lookup invece di compilare a mano.',
    columns: ['A', 'B', 'C', 'D', 'E', 'F'],
    rows: [
      ['Client ID', 'Client Name', 'Owner', 'Segment', 'Formula', 'Result'],
      ['C-001', 'Acme', '', '', '', ''],
      ['C-002', 'Nova', '', '', '', ''],
      ['C-003', 'Helix', '', '', '', ''],
      ['Map ID', 'Map Owner', 'Map Segment', '', '', ''],
      ['C-001', 'Sara', 'Enterprise', '', '', ''],
      ['C-002', 'Leo', 'SMB', '', '', ''],
      ['C-003', 'Mina', 'Mid Market', '', '', ''],
    ],
    editableCells: ['E2', 'E3', 'E4'],
    objectives: [
      {
        id: 'lookup-e2',
        label: 'Recupera l owner del primo cliente',
        cellId: 'E2',
        expectedFormula: '=XLOOKUP("C-001",A6:A8,B6:B8)',
        hintPrimary: 'Usa la chiave cliente per cercare il nome owner nella tabella di mapping.',
        hintSecondary: 'La formula parte da `XLOOKUP("C-001",A6:A8,...)` e deve restituire `Sara`.',
      },
      {
        id: 'lookup-e3',
        label: 'Recupera l owner del secondo cliente',
        cellId: 'E3',
        expectedFormula: '=XLOOKUP("C-002",A6:A8,B6:B8)',
        hintPrimary: 'Riusa la stessa struttura cambiando solo la chiave da cercare.',
        hintSecondary: 'Per `C-002` l’owner corretto è `Leo`.',
      },
      {
        id: 'lookup-e4',
        label: 'Recupera il segmento del terzo cliente',
        cellId: 'E4',
        expectedFormula: '=XLOOKUP("C-003",A6:A8,C6:C8)',
        hintPrimary: 'Questa volta il valore da restituire è nella colonna segmento, non owner.',
        hintSecondary: 'Per `C-003` il segmento corretto è `Mid Market` e la return array è `C6:C8`.',
      },
    ],
    victoryCopy: 'Hai collegato due tabelle tramite chiave stabile: è il salto che separa i fogli manuali dai fogli scalabili.',
  },
];

export function getMissionLabByQuestId(questId: string) {
  return missionLabs.find((lab) => lab.questId === questId);
}
