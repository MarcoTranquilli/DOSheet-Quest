# Strategia di Import e Riuso

## Stato Reale del Repository

Il repository remoto conteneva solo il commit iniziale con un `README` generico. Non c'era codice applicativo da importare direttamente.

## Cosa Ho Importato Concettualmente

Dato che non esisteva una base DOSheet-Quest, ho riusato dal workspace locale alcuni pattern gia maturi:

- convenzione `React + TypeScript + Vite` come base leggera e veloce
- enfasi DOSE su repository autoesplicativi e documentazione iniziale
- impostazione `local-first` per non bloccare il bootstrap su backend ancora indefinito

## Riferimenti Osservati

- `DOSeverbalizza`
  riferimento per convenzioni di naming, script e pragmatismo di bootstrap
- `dosepranza-2.0`
  riferimento per MVP snello e documentazione operativa

## Import Mancante da Chiarire

Se esiste una di queste sorgenti, il prossimo passo puo essere un import reale:

- mockup o screenshot del prodotto
- foglio Google/Excel da cui derivare la "sheet"
- backlog Notion/Trello/Linear
- codice sorgente esterno non ancora presente nel repo

## Strategia Consigliata per il Prossimo Ciclo

1. confermare dominio reale e lessico di prodotto
2. mappare eventuali sorgenti dati esistenti
3. decidere se restare frontend puro o introdurre API
4. aprire migrazione dati e autenticazione solo dopo la conferma del perimetro
