# DOSheet Quest

DOSheet Quest e un bootstrap operativo per un prodotto DOSE orientato a task planning gamificato: una "sheet" di missioni quotidiane e settimanali che rende visibili priorita, avanzamento, streak e punteggio in un'unica interfaccia.

Questo repository era vuoto. Ho quindi impostato:

- una base frontend moderna con React, TypeScript e Vite
- un MVP navigabile con persistenza locale
- import/export JSON, template rapidi e filtri operativi
- mini design system interno con componenti UI riusabili
- una documentazione iniziale di prodotto e architettura
- una traccia concreta di riuso/import dalle convenzioni gia presenti negli altri progetti locali

## Ipotesi Prodotto

In assenza di specifiche nel repository, l'MVP assume che `DOSheet Quest` sia:

- uno strumento personale o team-light per organizzare "quest" operative
- pensato per uso quotidiano, con categorie `daily`, `weekly`, `backlog`
- focalizzato su chiarezza, momentum e gratificazione di completamento

Queste ipotesi sono esplicitate per essere facili da confermare o correggere nel prossimo ciclo.

## Stack

- React 19
- TypeScript 5
- Vite 7

## Avvio

```bash
npm install
npm run dev
```

Build di verifica:

```bash
npm run build
```

## Script

- `npm run dev` avvia il frontend in sviluppo
- `npm run build` produce la build
- `npm run preview` apre la build locale
- `npm run typecheck` esegue il controllo TypeScript

## Struttura

```text
docs/
  architecture.md
  import-strategy.md
  product-brief.md
src/
  components/
  data/
  lib/
  App.tsx
  main.tsx
  styles.css
```

## Documenti Chiave

- [Product brief](./docs/product-brief.md)
- [Architettura iniziale](./docs/architecture.md)
- [Strategia di import/riuso](./docs/import-strategy.md)

## Prossimi Passi Consigliati

1. Confermare il perimetro reale di prodotto rispetto all'ipotesi MVP.
2. Decidere se introdurre auth e sync cloud oppure restare local-first piu a lungo.
3. Collegare il dominio reale dei dati: utenti, rituali, template, premi, reporting.
4. Aprire backlog tecnico e funzionale a partire dai documenti in `docs/`.
