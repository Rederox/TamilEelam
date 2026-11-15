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
- Les quatre familles sont servies depuis le site (`public/fonts`, `app/fonts.css`, générés par `npm run fetch:fonts`) : aucun appel à un CDN de polices, le premier affichage ne dépend d’aucun tiers.

## Motion

- Courbe maison : `cubic-bezier(0.22,1,0.36,1)` (ease-out-quint « vigil »)
- Reveals au scroll (`useReveal`), scènes sticky scrubbing (`useSceneProgress`)
- Flamme CSS multi-couches (flicker-outer/inner/core), braises canvas (`Embers`)
- Tout effet respecte `prefers-reduced-motion` et se met en pause hors viewport

## Mise en scène cinéma

- Entrée : « Entrer avec le son » dès le prologue (un clic, jamais d’autoplay) ; l’entrée silencieuse reste à côté. Absente en lecture calme et en mouvement réduit.
- Cartons de chapitre plein cadre (`ChapterOpen`, 100svh). Les bandes noires (`Letterbox.tsx`, `.letterbox`) se referment tant qu’un carton tient le milieu de l’écran, puis se rouvrent ; pas sur l’épilogue, dont le bouton tomberait sous la bande. Sous l’en-tête et la pastille (z-79), absentes du mode papier.
- Fondu depuis le noir lié au défilement (`card-fade-in` / `card-fade-out`, `animation-timeline: view()`), amélioration progressive : sans prise en charge, rien ne change.
- Grain vivant (`grain-live` sur `body::after`), uniquement avec un pointeur, hors papier.
- Caméra : chaque photographie se pose lentement (`Camera.module.css`, `.settle` dans `.gate`), une seule fois, et finit exactement à `transform: none`.
- Tout cela disparaît en lecture calme, en mouvement réduit et à l’impression.

## Version « immersion » : être dans l’histoire

Le défilement est le pas du lecteur dans un lieu. Quatre appuis, dans cet ordre : l’échelle humaine (un geste, un objet), le temps (ce qui arrive lentement et tient), l’absence (la place laissée), la main du lecteur (rien ne bouge au point d’en refaire un spectateur). La violence reste évoquée, jamais montrée ; aucun visage, nom, chiffre ou document inventé.

- **Le seuil** (`Prologue`) : épinglé, la caméra avance vers la porte jusqu’à ce que le jardin prenne le cadre.
- **La terre** (`LandMemory`) : paysage en cinq plans, le soleil descend avec le défilement, une maison s’éclaire ; la frise se trace en marchant.
- **L’étau** (`ChEtau`, `Etau.module.css`) : les actes posés sur le bureau et tamponnés, les murs qui se resserrent dans les marges.
- **Le feu** (`FeuShelves`) : les rayonnages se vident livre par livre, puis reviennent, neufs et vides.
- **La promesse** (`ChPromesse`) : la feuille qui s’écrit, les bulletins dans l’urne.
- **Juillet noir** (`JuilletExil`) : la valise, les objets d’une maison, la lumière qui quitte la pièce.
- **Prabhakaran** (`ChPrabhakaran`, `Prabhakaran.module.css`) : le défilement est le calendrier. Une grande année, verticale dans la marge, avance de 1954 à 2009 et s’arrête aux quatre dates ; une ligne se trace. Registre strictement factuel : rien n’est ajouté au portrait, ni emblème ni effet. Les repères et les trois textes sont entrelacés dans l’ordre chronologique.
- **Mullivaikkal** (`ChMullivaikkal`, `MullivaikkalScenery`) : un film qu’on avance de la main. Un seul passage pleinement présent à la fois ; une lente avancée vers l’horizon sur toute la séquence ; les lumières de « Chaque vie avait un nom » sont allumées par le défilement, puis s’éteignent une à une pendant le bilan, sauf la première, qui demeure jusqu’au souvenir ; au « silence », tout se fige et le texte attend.
- **La patrie** (`ChPatrie`, `PatrieMap.module.css`) : un voyage. L’atlas est épinglé, le défilement mène de lieu en lieu (Jaffna, Kilinochchi, Mullivaikkal, Mullaitivu, Trincomalee, Batticaloa, Amparai, Vavuniya, Mannar, Puttalam), une lumière suit la route, la carte se penche vers le voyageur. La carte reste manipulable ; la note et les crédits suivent la scène.
- **Les symboles** (`ChSymboles`, `Symboles.module.css`) : quatre rencontres, une par écran, le nom tamoul d’abord : le drapeau qu’on déplie, le léopard qu’on finit par voir, le coucal qui se pose, la fleur qui sort de l’ombre.
- **Les disparus** (`ChDisparus`) : la lumière passe sur les cadres vides ; la ligne des jours écoulés depuis le 18 mai 2009.
- **Maaveerar Naal** (`MaaveerarLamps`) : le champ de lampes allumé de proche en proche ; « Aujourd’hui » les 26 et 27 novembre et le 18 mai.
- **L’aube** (`ChAube`) : le ciel s’éclaircit, les huit villes s’allument une à une, un fil les relie.
- **L’épilogue** (`Epilogue`) : un temps de noir avant que la mèche prenne ; les sources en générique de fin, jamais en défilement automatique.
- **La voix** (`Voice.tsx`, `Spoken`) : les grandes phrases arrivent par membres, avec un temps aux ponctuations ; les chiffres mémoriels arrivent d’un bloc et tiennent, sans jamais compter.
- **Les coupes** (`Letterbox`, `ProgressRail`) : un saut de chapitre passe par le noir au lieu de traverser les autres chapitres.

Donner envie d’avancer, sans flèche ni consigne : chaque geste du pouce se voit dans l’image ; le cadre tient toujours quelque chose d’inachevé (une lumière pas encore allumée, un lieu pas encore atteint) ; une seule pensée à la fois. À la fin de chaque chapitre, `ChapterEnd` donne déjà la phrase d’ouverture du suivant.

Règles techniques, toutes issues de mesures :
- `hooks/useScrub.ts` donne la progression d’une scène. Sur une petite scène, il écrit `--p` sur l’élément ; sur une scène de centaines d’éléments, `variable: false` et `onChange` : on ne touche que les éléments dont l’état change (une variable héritée restylait 300 éléments par image).
- `transform` et `opacity` seulement ; rien n’anime hors écran ; un plan qui bouge est son propre élément, pas un `<g>` dans un grand SVG.
- L’état au repos est celui du HTML servi : sans JavaScript, en lecture calme et en mouvement réduit, chaque scène est complète, immobile, dans le flux (pas d’épinglage).
- Pour vérifier un build sans toucher à un `next start` qui tourne : `VIGIL_DIST_DIR=.next-dev-verify npx next build`, puis `next start -p 3123` avec la même variable.
- Les figures portent la mention « Évocation visuelle », numérotées dans l’ordre de lecture (01 la terre, 02 le feu, 03 juillet, 04 Maaveerar).

## WebGL layer (couche immersive)

- Composants `components/vigil/gl/*` : three.js chargé dynamiquement (jamais dans le bundle initial)
- Les composants WebGL eux-mêmes (shaders compris) s’importent depuis `gl/lazy.ts` : un seul fichier, chargé après l’hydratation, jamais rendu côté serveur. Un nouveau composant WebGL s’ajoute à `gl/layer.ts` et `gl/lazy.ts`.
- Chargement d’ouverture lié à l’image d’accueil, contournable et limité à 6 secondes même si l’hydratation échoue ; sans JavaScript, accès direct au contenu.
- Images d’ouverture, du bol, de la bibliothèque et des symboles livrées en WebP précompilé (`npm run optimize:images`), originaux conservés.
- Aucune variable CSS n’est écrite sur `<html>` à chaque image : cela recalcule le style de tout le document (mesuré : 30 images/s au lieu de 60 dans les chapitres lourds). `--ordeal` est écrite sur `.vignette` et, par dixièmes, sur la section ; `--draught` seulement quand les flammes CSS de secours sont à l’écran.
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
- Deux commandes, un seul état (`hooks/useAmbience.ts`) : le bouton de l’en-tête, accessible depuis tout le récit, et le bandeau sous le prologue.
