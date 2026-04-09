# UX/UI Spec

Assunzioni adottate per sostituire i placeholder:

- `design_tokens`: palette, spacing, radius, typography, elevation e iconografia documentati qui e implementati in `src/styles.css`
- `theme`: spreadsheet academy
- `style`: minimal
- `primary_device`: mobile
- `accessibility_requirements`: contrasto minimo 4.5:1 per testo, font minimo 14px su mobile, target touch minimo 44px, variante ad alto contrasto via media query

## Analisi

### Problema 1

La direzione visiva precedente era efficace come dashboard gamificata, ma parlava piu di "quest board" che di apprendimento dei fogli di calcolo. L'impatto era una promessa di prodotto meno chiara: engagement alto, ma trasferimento di competenza percepito in modo meno immediato.

### Problema 2

Su mobile la gerarchia tra teoria, missione, progressione e filtri era leggibile ma ancora densa. Questo aumentava il tempo per capire dove iniziare una sessione rapida e rischiava di disperdere l'attenzione.

### Problema 3

La UI aveva buoni accenti e motion, ma mancava una grammatica visiva piu vicina al mondo spreadsheet: griglia, dati, riepiloghi, moduli di skill. L'impatto era una minore coerenza tra estetica e promessa didattica.

## Varianti

### Variante A

Titolo: Analyst Deck

Motivazioni:

- porta la UI verso un look SaaS da piattaforma di formazione professionale
- massimizza leggibilita e fiducia su contenuti densi

Mockup mobile:

- header compatto, card onboarding, theory sprint, board ridotta in stack verticale

Mockup desktop:

- hero con value proposition, progress panel a destra, board principale e colonna laterale accademica

### Variante B

Titolo: Spreadsheet Academy

Motivazioni:

- combina linguaggio visivo data-centric e progressione gamificata senza eccessi
- e la variante piu equilibrata tra accessibilita, identita e fattibilita tecnica

Mockup mobile:

- hero sintetica, 3 highlight card, filtri incapsulati, mission list leggibile con badge e theory subito sotto

Mockup desktop:

- hero a due colonne con avatar, stat card lineari, board a sinistra e learning stack a destra

### Variante C

Titolo: Terminal Mentor

Motivazioni:

- accentua il lato tecnico e hacker del prodotto
- funziona bene per utenti esperti e contesti "challenge"

Mockup mobile:

- interfaccia piu mono, contrasto forte, chip compatti, motion ridotto

Mockup desktop:

- pannelli scuri ad alta densita, visuale console, piu enfasi su log e activity feed

## Scelta Raccomandata

Variante scelta: B, `Spreadsheet Academy`.

Motivi:

- e la piu coerente con l'obiettivo di insegnare fogli di calcolo, non solo motivare
- scala bene da mobile a desktop
- mantiene una forte identita senza pagare un costo eccessivo in complessita o peso asset

## Specifica Variante Scelta

### Palette HEX

- `--color-bg-canvas`: `#0D1320`
- `--color-bg-surface`: `#141C2B`
- `--color-bg-elevated`: `#1B2537`
- `--color-line`: `#334157`
- `--color-ink-strong`: `#F7F9FC`
- `--color-ink-soft`: `#D3DAE7`
- `--color-ink-muted`: `#AAB4C8`
- `--color-accent-sky`: `#6CBCFF`
- `--color-accent-mint`: `#46D9A6`
- `--color-accent-sun`: `#FFB648`
- `--color-accent-coral`: `#FF6B6B`
- `--color-accent-gold`: `#F3D27A`

### Tipografia

Font:

- display: `"Avenir Next", "Segoe UI", sans-serif`
- body: `"Avenir Next", "Segoe UI", sans-serif`

Scala:

- display hero: `clamp(2.25rem, 5vw, 4.7rem)`
- title panel: `1.375rem`
- stat number: `clamp(1.8rem, 4vw, 3.2rem)`
- body: `1rem`
- body small: `0.875rem`
- eyebrow: `0.75rem`

### Spacing token

- `space-2`: `8px`
- `space-3`: `12px`
- `space-4`: `16px`
- `space-5`: `20px`
- `space-6`: `24px`
- `space-8`: `32px`

### Radius

- `radius-sm`: `14px`
- `radius-md`: `20px`
- `radius-lg`: `28px`

### Elevazioni

- `shadow-soft`: `0 12px 32px rgba(0,0,0,0.22)`
- `shadow-panel`: `0 24px 64px rgba(5,7,10,0.36)`
- `shadow-glow`: `0 0 0 1px rgba(115,183,255,0.1), 0 18px 40px rgba(6,10,16,0.28)`

### Iconografia

Set consigliato:

- `icon-compass`
- `icon-spark`
- `icon-crown`
- `icon-shield`
- `icon-trail`
- `icon-grid`
- `icon-formula`
- `icon-chart-bar`

Formato:

- SVG 24x24
- stroke 1.75
- round caps/joins
- no immagini raster per UI core

## Evoluzione per Livelli

### Livello 1

Aspetto:

- avatar essenziale con badge base
- superfici pulite, glow limitato
- una sola orbita tenue

Accessori:

- field badge
- chip progress semplice

Micro-animazione:

- pulse lieve della progress bar

Regola di sblocco:

- default iniziale

### Livello 3

Aspetto:

- maggiore intensita di glow nei pannelli chiave
- secondo anello avatar
- card di activity con accent piu marcati

Accessori:

- scout mantle
- segmented progress ring

Micro-animazione:

- orbit lenta avatar
- rise piu evidente nel floating XP

Regola di sblocco:

- `>= 200 XP`

### Livello 5

Aspetto:

- massimo contrasto locale su hero e summary strip
- aura mint sull'avatar
- leaderboard row self piu distintiva

Accessori:

- compass crown
- aura trail

Micro-animazione:

- ring dinamico del level-up overlay
- accento luminoso su activity log

Regola di sblocco:

- `>= 400 XP`

## Micro-animazioni

### Floating XP

- durata: `2200ms`
- easing: `ease`
- trigger: completamento quest
- fallback: toast statico senza movimento

### Orbit Ring

- durata: `11s` e `16s`
- easing: `linear`
- trigger: avatar o level-up card in viewport
- fallback: anelli statici

### Progress Fill

- durata: `220ms`
- easing: `ease-out`
- trigger: aggiornamento XP
- fallback: width aggiornata senza transizione

## Wireframe Annotati

### Onboarding Mobile

Elementi:

- hero compatta con titolo e 2 chip, priorita alta
- 3 step verticali, gap `10-12px`, priorita alta
- theory sprint subito dopo, priorita alta
- template card sotto fold, priorita media

Misure:

- padding page `16px`
- panel padding `16px`
- target tap `44px`

Note UX:

- spiegare "imparo con missioni brevi" nei primi 5 secondi
- mostrare teoria e pratica prima di leaderboard o metriche secondarie

### Dashboard Desktop

Elementi:

- hero 60/40 con avatar e highlights
- stat cards in row da 4
- mission board a sinistra
- theory sprint, tracks, activity e leaderboard in colonna destra

Misure:

- max width `1320px`
- gap principali `16px`
- panel padding `20px`

Note UX:

- priorita alla missione attuale e al prossimo passo formativo
- rendere subito visibile quale skill si sta allenando

### Leaderboard

Elementi:

- top rows in lista verticale
- rank badge `32x32`
- XP e livello allineati a destra desktop, sotto su mobile

Misure:

- row padding `12x14`
- spacing interno `12px`

Note UX:

- tono collaborativo, non aggressivo
- niente segnali pay-to-win o dominance tossica

## Brief Tecnico

### Layer naming

- `bg/canvas`
- `bg/hero-grid`
- `hero/title`
- `hero/highlight/learn`
- `hero/highlight/mobile`
- `hero/highlight/performance`
- `board/filter-shell`
- `board/session-focus`
- `board/session-focus-side`
- `board/summary-strip`
- `board/row/default`
- `board/row/completed`
- `activity/row`
- `onboarding/banner`
- `onboarding/outcome-a`
- `onboarding/outcome-b`
- `leaderboard/banner`
- `theory/card`
- `avatar/ring/a`
- `avatar/ring/b`

### Asset naming

- `icon-grid-24.svg`
- `icon-formula-24.svg`
- `icon-chart-bar-24.svg`
- `avatar-badge-field-64.svg`
- `avatar-badge-mantle-64.svg`
- `avatar-badge-crown-64.svg`

### Export specs

- mockup desktop: `1440x1024`, `mockup-dashboard-desktop-spreadsheet-academy.png`
- mockup mobile: `390x844`, `mockup-onboarding-mobile-spreadsheet-academy.png`
- leaderboard: `1280x960`, `mockup-leaderboard-spreadsheet-academy.png`
- avatar compact: `64x64`, `avatar-rank-lv1-64.png`, `avatar-rank-lv3-64.png`, `avatar-rank-lv5-64.png`
- icon simplified: `24x24`, `icon-grid-simplified-24.svg`

### CSS/SVG pseudocode

```css
.hero-card {
  background:
    linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px),
    linear-gradient(180deg, rgba(255,255,255,.03) 1px, transparent 1px),
    linear-gradient(145deg, #141c2b, #0d1320);
}

.level-progress-fill {
  background: linear-gradient(90deg, #6cbcff, #46d9a6, #ffb648);
  transition: width 220ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .level-progress-fill,
  .avatar-orbit-a,
  .avatar-orbit-b {
    transition: none;
    animation: none;
  }
}
```

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
  <path d="..." stroke-linecap="round" stroke-linejoin="round" />
</svg>
```

### Performance

- preferire SVG inline o sprite sheet per icone
- niente bitmap per decorazioni di pannello
- usare gradienti CSS e pattern leggeri
- obiettivo asset UI custom `< 30 KB gzip`
- lazy load solo per eventuali illustrazioni future, non per icone core

## Changelog Grafico

- `Must` Riallineare il tema da quest-board a spreadsheet academy. Complessita: media.
- `Must` Rafforzare contrasto e leggibilita mobile. Complessita: bassa.
- `Must` Rendere hero, tracks e theory piu coerenti con il contesto spreadsheet. Complessita: media.
- `Should` Introdurre icone dedicate a grid, formulas e analytics. Complessita: media.
- `Should` Distinguere visivamente domain e platform in tutte le missioni. Complessita: media.
- `Should` Mettere in evidenza la missione consigliata dentro la board con theory e practice prompt. Complessita: bassa.
- `Should` Spostare la leaderboard verso un confronto collaborativo con streak e delta settimanali. Complessita: bassa.
- `Should` Aggiungere mockup statici o screenshot guidati in docs. Complessita: bassa.
- `NiceToHave` Tema secondario corporate chiaro per contesti enterprise. Complessita: media.
- `NiceToHave` Illustrazioni SVG dell'avatar piu ricche per rank alti. Complessita: media.

## Iterazione 1

Cambiato:

- contrasto dei testi secondari e dei bordi aumentato
- shell dei filtri resa piu netta
- hero e highlights riorganizzati per lettura piu rapida a `320x568`
- banner onboarding e outcome card aggiunti per chiarire il primo passo
- session focus reso visibile prima dei filtri per ridurre il tempo di decisione

Perche:

- migliorare onboarding e comprensione immediata su schermi piccoli

## Iterazione 2

Cambiato:

- confermato uso prevalente di CSS gradients e SVG
- niente immagini decorative pesanti
- motion limitato a transform/opacity

Perche:

- massimizzare fluidita, tempi di caricamento e sostenibilita tecnica del design
