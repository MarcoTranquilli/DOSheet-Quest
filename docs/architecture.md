# Architettura Iniziale

## Scelta Stack

Per il bootstrap ho scelto:

- React per velocita di iterazione UI
- TypeScript per evitare drift nei modelli dati
- Vite per setup leggero e tempi rapidi

Questa combinazione e coerente con il modo in cui gli altri progetti locali sono gia stati impostati e permette di scalare verso:

- API backend
- auth
- desktop shell
- deployment statico o edge

## Modello Dati Corrente

### Quest

- `id`
- `title`
- `note`
- `cadence`: `daily | weekly | backlog`
- `difficulty`: `light | core | boss`
- `xp`
- `completed`

### Profile

- `streakDays`
- `totalXp`
- `level`

## Stato Applicativo

L'MVP e `local-first`:

- stato caricato da `localStorage`
- seed iniziale se il browser non ha dati
- serializzazione completa della board locale

## Moduli

- `src/App.tsx`
  orchestrazione della pagina
- `src/components/QuestHud.tsx`
  pannello di stato e posizionamento del prodotto
- `src/components/QuestBoard.tsx`
  tabella delle missioni con filtri
- `src/components/QuestComposer.tsx`
  inserimento di nuove quest
- `src/lib/score.ts`
  logica XP, livello, completamento e riapertura
- `src/lib/storage.ts`
  persistenza locale e fallback

## Evoluzioni Naturali

### Fase 2

- autenticazione
- board per utente
- template di quest
- filtri per tag o dominio

### Fase 3

- report settimanali
- reward loops configurabili
- sincronizzazione cloud
- telemetria di uso

## Decisioni Aperte

- il prodotto restera personale o sara team-based?
- il concetto di quest coincide con task semplici o con rituali ricorrenti?
- la streak deve essere temporale reale o solo progressiva locale?
- il punteggio deve influire su suggerimenti, premi o ranking?
