# DESIGN.md — Tamil Eelam Archives

## Visual theme

Nuit de veillée : fond quasi noir teinté de suie chaude, lumière de lampe à huile (ambre/or), accents braise et sang séché. Stratégie couleur : **Restrained sur fond nocturne** — l'ambre (flame) est l'unique accent vivant, le rouge (ember/blood) est réservé à la violence et au deuil.

## Color palette (tokens Tailwind)

- `night` #070605 / `night-2` #0d0a08 — fonds
- `soot` #17120e / `soot-2` #221a14 — surfaces
- `bone` #ece3d3 / `bone-dim` #cfc4b0 — texte
- `ash` #97897a / `ash-dim` #5f564b — texte secondaire, mono labels
- `flame` #eda63d / `flame-hot` #f7d488 — la flamme, accent principal
- `ember` #d64f33 — braise, violence évoquée
- `blood` #8f2318 — deuil, uniquement dans les chapitres de massacre
- `gold` #c99b2f — mémoire ancienne, royaume, résolution

Règle : jamais de #000/#fff purs. Les rouges ne servent jamais de décoration.

## Typography

- Display : Fraunces (320–340, italiques expressives) — titres de chapitres
- Body : Newsreader — prose longue, 16.5px, leading 1.85
- Mono : JetBrains Mono — labels 10–11px uppercase tracking 0.2em+ (dates, sources)
- Tamoul : Noto Serif Tamil — jamais en fallback dégradé, toujours chargée

## Motion

- Courbe maison : `cubic-bezier(0.22,1,0.36,1)` (ease-out-quint « vigil »)
- Reveals au scroll (`useReveal`), scènes sticky scrubbing (`useSceneProgress`)
- Flamme CSS multi-couches (flicker-outer/inner/core), braises canvas (`Embers`)
- Tout effet respecte `prefers-reduced-motion` et se met en pause hors viewport

## WebGL layer (couche immersive)

- Composants `components/vigil/gl/*` : three.js chargé dynamiquement (jamais dans le bundle initial)
- DPR plafonné à 1.75, compte de particules réduit sur mobile
- Chaque effet : IntersectionObserver (pause hors écran), fallback vers l'existant (canvas `Embers` ou rien), aria-hidden
- Palette des shaders = tokens ci-dessus (braise eda63d→f7d488, eau nocturne teintée bone froid)

## Components

- `blocks.tsx` : ChBody / Caption (tick doré + mono) / Prose / MemFigure (chiffre mémorial géant) / Quote (guillemets braise)
- `Flame` (flamme CSS), `Embers` (canvas 2D fallback), `Kolam`, `KanjiBowl`, `InkNames`
- Chapitres = sections plein écran, vignette cinématique fixe par-dessus
