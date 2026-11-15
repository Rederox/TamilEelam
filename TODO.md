# À faire — La Veillée

État au 15 novembre 2026. Trois branches sur GitHub : `main` (inchangée), `film` (performances, sources, mise en scène de film), `immersion` (les douze scènes, construite sur `film`). Rien n'a été fusionné dans `main`.

## Texte du récit : formulations à trancher

Aucune date ni aucun chiffre n'a été trouvé franchement faux. Ces sept formulations sont fragiles ; aucune n'a été réécrite.

- [ ] **Mullivaikkal sur la carte** (`data/locations.ts`) : le français et l'anglais disent « des dizaines de milliers de civils y ont perdu la vie », le tamoul dit « des milliers » (ஆயிரக்கணக்கானோர்) et n'a pas la phrase sur le 18 mai. Aligner les trois langues, de préférence sur la formule du reste du site : « jusqu'à 40 000, une estimation » (Panel de l'ONU 2011, § 137).
- [ ] **Élection de 1977** (`data/events.ts`, `data/narrative.ts`) : « majorité écrasante dans les circonscriptions tamoules » est exact pour le Nord (14 circonscriptions sur 14). À l'Est : premier à Trincomalee, Batticaloa et Paddiruppu, battu de peu à Kalkudah, derrière à Mutur, Samanthurai et Kalmunai.
- [ ] **Trincomalee** (`data/locations.ts`) : « capitale historique du Tamil Eelam oriental » n'a aucune source.
- [ ] **18 h 07** (`data/historyChapters.ts`) : c'est ce que dit PEARL, p. 15 ; Tamil Guardian donne 18 h 05. Garder l'attribution à PEARL ou signaler l'écart.
- [ ] **Bibliothèque de Jaffna** : le site dit « environ 97 000 » et « une foule comprenant des policiers » (source AISLS). Le rapport de la Commission internationale de juristes de 1983 dit 95 000 volumes, des policiers seuls, sur deux nuits (31 mai–1er juin et 1er–2 juin).
- [ ] **Symboles** : pas de source institutionnelle pour le léopard et le coucal comme symboles de l'Eelam, ni pour la date « 1977 » du chapitre. Seuls la fleur (reportage) et le caractère endémique du léopard sont sourcés.
- [ ] **Les disparus** : « les Mères du Nord » et les trois villes (Vavuniya, Kilinochchi, Mullaitivu) ne figurent pas dans les textes de l'ONU ou de HRW lus. Le début en 2017, la continuité et les décès, eux, sont sourcés.
- [ ] **Jaffna, « pendant quatre siècles »** : approximatif ; le royaume a été conquis un temps par Kotte au XVᵉ siècle, et aucune source lue ne donne de date de fondation.

## Version « immersion » (branche `immersion`)

- [ ] **Regarder les douze scènes** et dire ce qui doit changer : le seuil, la terre, l'étau, le feu, la promesse, la valise de juillet, les dix plans de Mullivaikkal, les disparus, les lampes de Maaveerar, l'aube, l'épilogue et son générique, les coupes au noir. Liste et principes dans `DESIGN.md`.
- [ ] **Texte ajouté, à relire (surtout le tamoul)** :
  - `components/vigil/ChDisparus.tsx` : « {n} jours ont passé depuis le 18 mai 2009. » / « {n} days have passed since 18 May 2009. » / « 2009 மே 18 முதல் {n} நாட்கள் கடந்துவிட்டன. » (et la version sans nombre, affichée sans JavaScript). Décider aussi si le 18 mai 2009 est le bon point de départ pour ce chapitre.
  - `components/vigil/ChMaaveerar.tsx` : « Aujourd’hui » / « Today » / « இன்று », affiché seulement le 26 novembre, le 27 novembre et le 18 mai.
- [ ] **Mullivaikkal, plan 3 (« Sous les obus »)** : la mer WebGL (`gl/GlSea.tsx`, antérieure à cette version) dessine encore une traînée d'obus, une lueur, de la fumée et une marée rouge ; `.redVeil` teinte la scène. La nouvelle direction dit « évoquer, ne pas montrer » : garder, atténuer ou retirer.
- [ ] **Objets de la valise** (horloge, cadre vide, marmite, radio, cahier, tissu, clés, parapluie) et **palmiers, maison et fumée de la terre** : vérifier qu'ils sonnent juste pour un foyer tamoul de 1983 et pour le Nord ; ce sont des évocations dessinées, pas des archives.
- [ ] **Empreintes de pas** du plan 9 de Mullivaikkal (« La trace ») : à valider.
- [ ] Mode papier : le plan 1 de Mullivaikkal (la bande de sable) est une lame blanche un peu dure.
- [ ] Les rayonnages utilisent `color-mix()` : sur un très vieux navigateur, les étagères sont vides du début à la fin.
- [ ] **Son** : aucune musique ni voix n'a été ajoutée. Une voix de narrateur ou une tanpura réelles seraient le plus fort levier d'émotion ; une synthèse n'a pas été tentée (impossible à juger sans oreille, et risquée sur ce sujet).
- [ ] Non vérifié : Safari et Firefox pour toutes les scènes ; un vrai téléphone ; l'anglais dans plusieurs scènes ; l'impression.

## Sources

- [ ] Ouvrir à la main, dans un navigateur, les sources qui bloquent les robots : UNHCR (citoyenneté), Library of Congress (country study), UK Parliament (question 53578), Refworld (Panel 2011 et OISL). Le contenu du Panel, de l'OISL et de l'Internal Review Panel a été vérifié sur des miroirs officiels ; celui des trois premières ne l'a pas été.
- [ ] Lire le rapport du HCDH de 2024 sur les disparitions forcées : c'est un PDF scanné, illisible par script.
- [ ] Mettre à jour « Références consultées le 11 septembre 2026 » (`data/research.ts`, `researchCopy.reviewed`) une fois les deux points ci-dessus faits.
- [ ] International Crisis Group : le lien pointe vers leur espace de stockage (`icg-prod.s3.amazonaws.com`), lu mais moins stable. Le remplacer par la page officielle si elle s'ouvre normalement dans un navigateur.
- [ ] Tribunal permanent des peuples : le PDF anglais du jugement renvoie une erreur 403 ; le site cite la page de la session. Ne pas écrire que l'Inde a été jugée complice : le jugement reporte sa décision sur ce point.
- [ ] Décider si le chiffre officiel de Statistique Canada (environ 237 900 personnes capables de converser en tamoul, recensement 2021) entre dans « L'aube » ; le site ne donne aujourd'hui aucun chiffre pour la diaspora.

## Droits

- [ ] **Portrait de Prabhakaran** : obtenir l'autorisation de Reuters / NTB Scanpix avant toute publication, ou le remplacer. Voir `public/archive/prabhakaran-portrait.md`.

## Tamoul à relire

Ces phrases ont été écrites pendant la session, sans relecture par un locuteur.

- [ ] `components/vigil/Prologue.tsx` : « ஒலியுடன் நுழையுங்கள் » et l'indication sur le casque.
- [ ] `hooks/useAmbience.ts` : reprises telles quelles de l'ancien bandeau, à vérifier au passage.

## À vérifier sur de vrais appareils

- [ ] Un vrai téléphone, milieu de gamme si possible : fluidité des scènes WebGL (le feu, juillet, la mer de Mullivaikkal). Seule l'émulation a été testée.
- [ ] Safari et Firefox : le fondu depuis le noir des cartons de chapitre n'a été regardé que dans Chrome. Ailleurs, le site doit rester tel qu'avant.
- [ ] Le son sur iPhone : démarrage après « Entrer avec le son ».

## Mise en scène : réglages possibles

- [ ] Bandes noires sur téléphone : presque invisibles à 6 % de la hauteur. Les rendre visibles demande environ 12 %, donc de revoir la place des cartons en tamoul.
- [ ] Petits écrans (360×740) : « Entrer avec le son » demande environ 50 px de défilement.
- [ ] Titres de chapitre en tamoul sur ordinateur : réduits de 96 à 80 px pour tenir entre les bandes. À valider à l'œil.
- [ ] Durée des mouvements de caméra sur les photographies (9 à 12 s) : à juger en regardant, `components/vigil/Camera.module.css`.
- [ ] Grain vivant : à retirer s'il gêne (règle « Living grain » et `@keyframes grain-live` dans `app/globals.css`).

## Ménage

- [ ] Choisir la version à garder et la fusionner dans `main` (`git checkout main && git merge immersion && git push`, ou `film` pour la version sans les scènes).
- [ ] `components/vigil/Kaarthigai.tsx` et `gl/GlKaarthigai.tsx` ne sont importés nulle part : les supprimer ou les remettre en service.
- [ ] `tsconfig.json` contient une ligne `.next-dev-3002` ajoutée par un serveur de dev : la garder ou l'enlever.
- [ ] `.env.example` mentionne un jeton Mapbox qu'aucun code n'utilise.
- [ ] Après un `npm run fetch:fonts`, mettre à jour les trois noms de fichiers préchargés dans `app/layout.tsx` si la version des polices a changé.
- [ ] Les navigateurs de test Playwright (environ 300 Mo) sont dans `~/Library/Caches/ms-playwright` ; à supprimer s'ils ne servent plus.
