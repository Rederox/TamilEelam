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
- Chargement d’ouverture lié à l’image d’accueil, contournable et limité à 6 secondes même si l’hydratation échoue ; sans JavaScript, accès direct au contenu.
- Images d’ouverture et du bol livrées en WebP précompilé (`npm run optimize:images`), originaux conservés.
- WebGL initialisé après l’ouverture, à moins de 240 px du viewport ; rendu en pause hors écran.
- DPR plafonné à 1 sur mobile/appareils limités (30 images/s), 1.75 sur ordinateur (60 images/s). Buffers limités à 2/4 mégapixels et 4096 px par côté ; compte de particules réduit sur mobile.
- Chaque effet : IntersectionObserver (pause hors écran), fallback vers l'existant (canvas `Embers` ou rien), aria-hidden
- Palette des shaders = tokens ci-dessus (braise eda63d→f7d488, eau nocturne teintée bone froid)

## Components

- `blocks.tsx` : ChBody / Caption (tick doré + mono) / Prose / MemFigure (chiffre mémorial géant) / Quote (guillemets braise)
- `Flame` (flamme CSS), `Embers` (canvas 2D fallback), `Kolam`, `KanjiBowl`, `InkNames`
- Chapitres = sections plein écran, vignette cinématique fixe par-dessus

## Sound (ambiance, sur demande)

- De vrais enregistrements de terrain (`public/audio`, 4,9 Mo, Wikimedia Commons, crédités dans `data/soundCredits.ts` et affichés sous les sources), chargés seulement après le clic sur le son, le lieu où se trouve le lecteur en premier. Jamais de boucle audible : chaque nappe rejoue un passage pris au hasard, en fondu enchaîné. La synthèse ne sert qu’à ce qu’un enregistrement ne peut pas faire (résonance d’une pièce, mèche, poids sous un tir lointain). `lib/soundscape.ts` (contexte, pièce à réverbération, limiteur) et une couche par lieu dans `lib/sounds/`.
- Une couche = un canal de présence (`lib/presence.ts`). Le chapitre l’écrit pendant qu’il est à l’écran ; `proximity()` (hooks/usePresence.ts) le mesure depuis le milieu de l’écran, en pixels de défilement, pour que le son entre et sorte sur la même distance quelle que soit la hauteur du chapitre.
- Lieux : feu (bibliothèque, juillet), mer + artillerie très lointaine (Mullivaikkal, la mer presque effacée à la scène « Le silence »), vent et grillons (la terre), pièce vide et horloge comtoise ralentie (les disparus), forêt du Tamil Nadu à l’aube, koël et ghanta d’un temple lointain (l’aube), mèche et ghanta à l’allumage de la lampe (épilogue).
- Chaque lieu passe par un passe-bas qui s’ouvre à mesure qu’on y entre : de loin, assourdi ; au milieu du chapitre, net.
- Jamais de son avant un geste de l’utilisateur ; coupé en lecture calme, onglet masqué et `prefers-reduced-motion`.
