# DESIGN.md — Tamil Eelam Archives

## Visual theme

Identité issue des quatre couleurs du drapeau fourni dans `public/symbols/flag.png` : jaune, rouge, noir et blanc. Le noir porte le récit, le blanc les textes, le jaune les repères et les interactions, le rouge les accents mémoriels. Cette charte s’applique à tous les chapitres et à la navigation.

## Color palette (tokens Tailwind)

Couleurs source relevées dans l’image : **jaune #FFD400**, **rouge #DE0127**, **noir #000000**, **blanc #FFFFFF**. Elles sont conservées dans les variables `--flag-*`.

- `night` / `night-2` : noir et #0A0A0A ; `soot` : surfaces gris neutre.
- `bone` : blanc ; `bone-dim` #D7D7D7 ; `ash` #ABABAB : texte secondaire.
- `gold` / `flame` : jaune #FFD400, repères, liens et navigation.
- `blood` : rouge source #DE0127, lignes et accents de fond.
- `ember` : rouge franc #EF1724, lisible pour le texte sur noir.
- Mode clair : fond blanc, texte noir, rouge #C80023 et jaune assombri #705800 pour conserver le contraste des petits textes.

Les photos, archives et matières des scènes conservent leurs couleurs naturelles. Les éléments d’interface utilisent les tokens pour suivre le thème. Les évocations générées restent explicitement distinguées des archives.

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
