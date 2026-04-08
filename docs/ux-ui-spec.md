# UX/UI Spec

Assunzioni adottate per sostituire i placeholder:

- `design_tokens`: palette e token definiti in CSS custom properties nel file `src/styles.css`
- `theme`: guild expedition per task planning e progressione personale
- `style`: minimal
- `primary_device`: mobile
- `accessibility_requirements`: contrasto minimo 4.5:1, font minimo 14px su mobile, touch target minimo 44px

## Analisi

### Problema 1

La UI iniziale comunicava poco la gerarchia tra stato generale, missioni urgenti e azioni disponibili. Questo aumentava il tempo necessario per capire cosa fare per primo, soprattutto in una sessione rapida da mobile.

### Problema 2

Il linguaggio visivo era coerente a meta, ma non ancora abbastanza sistemico: colori, superfici e componenti non esprimevano un design system pienamente riconoscibile. L'impatto era una percezione da MVP tecnico piu che da piattaforma di prodotto.

### Problema 3

Mancavano segnali di onboarding e progressione narrativa utili a sostenere il tema gamificato senza cadere nel superfluo. Questo riduceva engagement e chiarezza sul perche di XP, livelli e leaderboard.

## Varianti

### Variante A

Titolo: Expedition Control

Motivazioni:

- privilegia chiarezza operativa e forte gerarchia informativa
- integra la gamification come supporto, non come distrazione

Mockup mobile:

- hero compatta, progress bar, CTA e tre step onboarding sopra la mission sheet

Mockup desktop:

- hero editoriale a sinistra, avatar e metriche a destra, board principale con sidebar decisionale

### Variante B

Titolo: Tactical Console

Motivazioni:

- look piu tecnico e data dense, adatto a utenti power
- forte enfasi su filtri, ranking e quick actions

Mockup mobile:

- header denso, tab segmentati, cards piu compatte con tag funzionali

Mockup desktop:

- dashboard tipo console con pannelli multipli e mini chart

### Variante C

Titolo: Camp Journal

Motivazioni:

- approccio piu caldo e narrativo, ideale per uso personale quotidiano
- riduce stress percepito e migliora adozione di routine

Mockup mobile:

- card morbide, checklist piu grandi, enfasi su streak e rituali

Mockup desktop:

- layout magazine con board piu ariosa e pannello diario

## Scelta Raccomandata

Variante scelta: A, `Expedition Control`.

Motivi:

- bilancia meglio usabilita, tono prodotto e fattibilita tecnica
- scala bene da mobile a desktop senza richiedere asset pesanti o logiche UI complesse

## Design Tokens

### Palette HEX

- `--color-bg-canvas`: `#0F1218`
- `--color-bg-surface`: `#171D26`
- `--color-bg-elevated`: `#1F2733`
- `--color-line`: `#2A3342`
- `--color-ink-strong`: `#F6F3EA`
- `--color-ink-soft`: `#C6C2B7`
- `--color-ink-muted`: `#969183`
- `--color-accent-sun`: `#F2A65A`
- `--color-accent-coral`: `#EF6F5E`
- `--color-accent-mint`: `#68C3A3`
- `--color-accent-sky`: `#73B7FF`
- `--color-accent-gold`: `#F1CF78`

### Tipografia

Font:

- Heading/UI: `"Avenir Next", "Segoe UI", sans-serif`

Scala:

- Display: `clamp(2.25rem, 5vw, 4.7rem)`
- H1 mobile compatto: `2rem`
- H2: `1.375rem`
- Body base: `1rem`
- Body small: `0.875rem`
- Eyebrow: `0.75rem`

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

### Sistema icone

Icone consigliate:

- `icon-compass`
- `icon-flame`
- `icon-check-ring`
- `icon-scroll`
- `icon-ranking`
- `icon-spark`

Formato: SVG 24x24, stroke 1.75, round caps, no raster.

## Evoluzione Personaggio

### Livello 1

Visual:

- avatar base con `Field Badge`
- palette prevalente `sun + sky`
- una sola orbita sottile

Micro-animazione sbloccabile:

- pulse lieve del badge ogni completamento boss

### Livello 3

Visual:

- `Scout Mantle`
- dettagli `gold + coral`
- doppia orbita e bordo pannello piu caldo

Micro-animazione sbloccabile:

- sweep luminoso rapido sulla progress bar

### Livello 5

Visual:

- `Compass Crown`
- aura `mint`
- alone piu ampio, particelle SVG leggere o bagliore CSS

Micro-animazione sbloccabile:

- orbita lenta permanente, disattivata con `prefers-reduced-motion`

Regole di sblocco:

- livello 1: default
- livello 3: `>= 200 XP`
- livello 5: `>= 400 XP`

## Micro-animazioni

### Orbit Spin

- durata: `12s` e `16s`
- easing: `linear`
- trigger: avatar visibile
- fallback: orbite statiche

### Level Fill

- durata: `220ms`
- easing: `ease-out`
- trigger: aggiornamento XP
- fallback: width aggiornata senza transizione

### Hover Lift

- durata: `140ms`
- easing: `ease`
- trigger: hover/focus su button e template card
- fallback: nessun sollevamento, solo cambio colore

## Wireframe Annotati

### Onboarding Mobile

Elementi:

- hero title `16px top padding`, priorita alta
- progress bar full width, `12px` height, priorita alta
- 3 step card verticali, gap `10px`, priorita alta
- CTA template rapidi sotto fold corto, priorita media

Note UX:

- prima schermata deve spiegare subito il modello mentale
- una sola azione primaria visibile per evitare overload

### Dashboard Desktop

Elementi:

- hero left `60%`, avatar right `40%`, gap `20px`, priorita alta
- stat cards in row da 4, gap `16px`, priorita alta
- mission board principale a sinistra, sidebar a destra, priorita alta
- filtri in singola riga finche lo spazio lo permette, priorita media

Note UX:

- board e sidebar devono essere leggibili anche a 1280px senza scroll orizzontale
- le quest urgenti devono emergere in meno di 2 secondi

### Leaderboard

Elementi:

- top 3 rows in lista verticale, padding `12x14`
- rank badge `32x32`
- XP e livello allineati a destra su desktop, sotto su mobile

Note UX:

- leaderboard deve essere motivazionale, non competitiva in modo tossico
- nessun elemento pay to win o premio aggressivo

## Brief Tecnico

Mini design system interno ora presente nel codice:

- `ActionButton`
- `PanelCard`
- `SectionHeading`
- `EmptyState`

### Layer naming

- `bg/canvas`
- `bg/surface/panel`
- `hero/title`
- `hero/progress-track`
- `hero/progress-fill`
- `avatar/core`
- `avatar/orbit/a`
- `avatar/orbit/b`
- `board/filter/search`
- `board/row/default`
- `board/row/completed`
- `leaderboard/row/self`

### Asset naming

- `icon-compass-24.svg`
- `icon-ranking-24.svg`
- `avatar-badge-field.svg`
- `avatar-badge-mantle.svg`
- `avatar-badge-crown.svg`

### CSS/SVG pseudocode

```css
.level-progress-fill {
  background: linear-gradient(90deg, #f2a65a, #ef6f5e);
  transition: width 220ms ease-out;
}

.avatar-orbit {
  border: 1px dashed rgba(255,255,255,.14);
  animation: orbit-spin 12s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .avatar-orbit,
  .level-progress-fill {
    animation: none;
    transition: none;
  }
}
```

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
  <path d="..." stroke-linecap="round" stroke-linejoin="round" />
</svg>
```

### Performance

- preferire SVG inline o sprite sheet SVG per icone e badge
- evitare PNG per elementi UI geometrici
- obiettivo peso icone totale `< 25 KB gzip`
- eventuali illustrazioni future: WebP, max `120 KB` mobile hero
- lazy loading per asset non above-the-fold
- nessuna libreria di animazione esterna se CSS copre il caso

## Iterazioni Automatiche

### Iterazione 1

Cambiato:

- ridotta la densita visiva mobile
- aumentato il contrasto di superfici, testi e focus states
- semplificata la gerarchia a 320x568

Perche:

- la prima esperienza d'uso su schermi piccoli richiede comprensione immediata e tap target piu robusti

### Iterazione 2

Cambiato:

- approccio asset-light basato su CSS e SVG
- animazioni rese fattibili senza dipendenze pesanti
- leaderboard e avatar costruiti con forme CSS, non immagini raster

Perche:

- migliore rapporto qualita/peso, piu controllo sul rendering e meno costo di implementazione

### Iterazione 3

Cambiato:

- board resa piu scansionabile con summary strip, righe con accenti di priorita, meta-pill e hierarchy più forte
- avatar e leaderboard raffinati con dettagli visivi leggeri ma piu distintivi
- aggiunto supporto `prefers-contrast: more` per una variante ad alto contrasto

Perche:

- serviva un salto di maturita grafica senza introdurre asset pesanti o complessita non sostenibile in implementazione

## Export Specs

### Mockup Full Screen

- desktop: `1440x1024`, file `mockup-dashboard-desktop-v3.png`
- mobile: `390x844`, file `mockup-onboarding-mobile-v3.png`
- leaderboard: `1280x960`, file `mockup-leaderboard-v3.png`

### Avatar

- standard UI: `64x64`, file `avatar-rank-lv1-64.png`, `avatar-rank-lv3-64.png`, `avatar-rank-lv5-64.png`
- source vector: `avatar-rank-master.svg`

### Icona Semplificata

- app/icon badge: `24x24` e `32x32`, file `icon-compass-simplified-24.svg`, `icon-compass-simplified-32.svg`

### Layer Naming per Export

- `bg/base`
- `bg/glow/top-left`
- `hero/content`
- `hero/avatar`
- `board/summary-strip`
- `board/filter-row`
- `board/quest-row/priority-now`
- `leaderboard/row/top1`
- `avatar/badge`

## Backlog Prioritizzato

- `Must` Ridisegnare la mission hero con avatar, progress bar e CTA. Complessita: media.
- `Must` Consolidare i design token in un file dedicato o CSS variables documentate. Complessita: bassa.
- `Must` Rafforzare la leggibilita mobile della board a `320x568`. Complessita: media.
- `Must` Aggiungere icone SVG coerenti al sistema mission/guild. Complessita: media.
- `Must` Implementare stati focus, hover e reduced motion accessibili. Complessita: bassa.
- `Should` Distinguere visivamente quest `now` e `boss` con semafori non invasivi. Complessita: media.
- `Should` Introdurre onboarding progressivo con preset iniziali. Complessita: media.
- `Should` Rendere la leaderboard dati-driven e non statica. Complessita: media.
- `Should` Aggiungere test visuali snapshot su breakpoint mobile e desktop. Complessita: media.
- `NiceToHave` Aggiungere micro-celebrazione non bloccante al completamento boss. Complessita: media.
- `NiceToHave` Preparare tema secondario light o corporate per white-label. Complessita: alta.
- `NiceToHave` Estrarre componenti UI condivisi in un mini design system interno. Complessita: media.
