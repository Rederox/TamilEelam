import type { Lang } from './events'

// ————————————————————————————————————————————————————————————————
// Narrative scaffolding for the immersive vigil experience.
// Historical event bodies live in events.ts; this file holds the
// connective tissue: chapter metadata, scene captions, epilogue.
// ————————————————————————————————————————————————————————————————

export interface ChapterMeta {
  id: string
  num: string
  years: Record<Lang, string>
  kicker: Record<Lang, string>
  title: Record<Lang, string>
  titleAccent: Record<Lang, string>
  tamilGhost: string
}

export const chapters: ChapterMeta[] = [
  {
    id: 'terre',
    num: 'I',
    years: { fr: 'IIIᵉ s. av. J.-C. — 1619', en: '3rd c. BCE — 1619', ta: 'கி.மு. 3 — 1619' },
    kicker: { fr: 'Avant tout, il y a une terre', en: 'Before everything, there is a land', ta: 'எல்லாவற்றிற்கும் முன், ஒரு நிலம்' },
    title: { fr: 'La terre', en: 'The land', ta: 'நிலம்' },
    titleAccent: { fr: 'des ancêtres.', en: 'of the ancestors.', ta: 'முன்னோர்களின்.' },
    tamilGhost: 'ஈழம்',
  },
  {
    id: 'etau',
    num: 'II',
    years: { fr: '1833 — 1956', en: '1833 — 1956', ta: '1833 — 1956' },
    kicker: { fr: "L'injustice arrive par la loi", en: 'Injustice arrives by law', ta: 'அநீதி சட்டத்தால் வருகிறது' },
    title: { fr: "L'étau", en: 'The vice', ta: 'இறுக்கம்' },
    titleAccent: { fr: 'se referme.', en: 'closes in.', ta: 'மூடுகிறது.' },
    tamilGhost: 'சட்டம்',
  },
  {
    id: 'feu',
    num: 'III',
    years: { fr: '1958 — 1981', en: '1958 — 1981', ta: '1958 — 1981' },
    kicker: { fr: 'Puis elle arrive par le feu', en: 'Then it arrives by fire', ta: 'பின்னர் அது நெருப்பால் வருகிறது' },
    title: { fr: 'Le feu', en: 'The fire', ta: 'நெருப்பு' },
    titleAccent: { fr: 'contre la mémoire.', en: 'against memory.', ta: 'நினைவுக்கு எதிராக.' },
    tamilGhost: 'நூலகம்',
  },
  {
    id: 'promesse',
    num: 'IV',
    years: { fr: '1976 — 2002', en: '1976 — 2002', ta: '1976 — 2002' },
    kicker: { fr: 'Un peuple répond, démocratiquement', en: 'A people answers, democratically', ta: 'ஒரு மக்கள் ஜனநாயக ரீதியாக பதிலளிக்கிறார்கள்' },
    title: { fr: 'La promesse', en: 'The promise', ta: 'வாக்குறுதி' },
    titleAccent: { fr: 'de Vaddukoddai.', en: 'of Vaddukoddai.', ta: 'வட்டுக்கோட்டையின்.' },
    tamilGhost: 'தீர்மானம்',
  },
  {
    id: 'juillet',
    num: 'V',
    years: { fr: 'Juillet 1983', en: 'July 1983', ta: 'ஜூலை 1983' },
    kicker: { fr: 'La semaine où tout bascule', en: 'The week everything breaks', ta: 'எல்லாம் உடைந்த வாரம்' },
    title: { fr: 'Juillet', en: 'Black', ta: 'கறுப்பு' },
    titleAccent: { fr: 'noir.', en: 'July.', ta: 'ஜூலை.' },
    tamilGhost: 'கறுப்பு ஜூலை',
  },
  {
    id: 'mullivaikkal',
    num: 'VI',
    years: { fr: 'Mai 2009', en: 'May 2009', ta: 'மே 2009' },
    kicker: { fr: 'Ce que le monde a laissé faire', en: 'What the world allowed', ta: 'உலகம் அனுமதித்தது' },
    title: { fr: 'Mullivaikkal', en: 'Mullivaikkal', ta: 'முள்ளிவாய்க்கால்' },
    titleAccent: { fr: '', en: '', ta: '' },
    tamilGhost: 'முள்ளிவாய்க்கால்',
  },
  {
    id: 'patrie',
    num: 'VII',
    years: { fr: 'Depuis toujours', en: 'Since always', ta: 'என்றென்றும்' },
    kicker: { fr: 'Ce qui ne peut être effacé', en: 'What cannot be erased', ta: 'அழிக்க முடியாதது' },
    title: { fr: 'La patrie', en: 'The homeland', ta: 'தாயகம்' },
    titleAccent: { fr: 'demeure.', en: 'remains.', ta: 'நிலைத்திருக்கிறது.' },
    tamilGhost: 'தமிழீழம்',
  },
  {
    id: 'symboles',
    num: 'VIII',
    years: { fr: "1977 — aujourd'hui", en: '1977 — today', ta: '1977 — இன்று' },
    kicker: { fr: "Ce qu'un peuple choisit pour se dire", en: 'What a people chooses to say itself', ta: 'ஒரு மக்கள் தம்மைச் சொல்லத் தேர்ந்தவை' },
    title: { fr: 'Les symboles', en: 'The symbols', ta: 'சின்னங்கள்' },
    titleAccent: { fr: "d'une nation.", en: 'of a nation.', ta: 'ஒரு தேசத்தின்.' },
    tamilGhost: 'சின்னங்கள்',
  },
  {
    id: 'aube',
    num: 'IX',
    years: { fr: '1983 — demain', en: '1983 — tomorrow', ta: '1983 — நாளை' },
    kicker: { fr: 'La flamme portée ailleurs', en: 'The flame carried elsewhere', ta: 'சுடர் வேறிடம் சுமக்கப்படுகிறது' },
    title: { fr: "L'aube", en: 'The dawn', ta: 'விடியல்' },
    titleAccent: { fr: 'en diaspora.', en: 'in diaspora.', ta: 'புலம்பெயர்வில்.' },
    tamilGhost: 'புலம்பெயர்வு',
  },
]

export function chapterById(id: string): ChapterMeta {
  const c = chapters.find((c) => c.id === id)
  if (!c) throw new Error(`Unknown chapter: ${id}`)
  return c
}

// ————— Prologue —————
export const prologue: Record<Lang, {
  whisper: string
  line1: string
  line2: string
  sub: string
  enter: string
}> = {
  fr: {
    whisper: 'Il y a des histoires que l\'on a essayé d\'effacer.',
    line1: 'Celle-ci',
    line2: 'refuse.',
    sub: "L'histoire du peuple tamoul d'Eelam — sa terre, sa souffrance, sa mémoire. Racontée pour que nos générations, et les suivantes, la portent plus loin.",
    enter: 'Descendre dans la mémoire',
  },
  en: {
    whisper: 'There are histories they tried to erase.',
    line1: 'This one',
    line2: 'refuses.',
    sub: 'The story of the Eelam Tamil people — their land, their suffering, their memory. Told so that our generations, and the next, carry it forward.',
    enter: 'Descend into memory',
  },
  ta: {
    whisper: 'அழிக்க முயன்ற வரலாறுகள் உண்டு.',
    line1: 'இது',
    line2: 'மறுக்கிறது.',
    sub: 'ஈழத் தமிழ் மக்களின் கதை — அவர்களின் நிலம், துன்பம், நினைவு. எங்கள் தலைமுறைகளும் அடுத்தவையும் சுமந்து செல்வதற்காக.',
    enter: 'நினைவுக்குள் இறங்குங்கள்',
  },
}

// ————— Mullivaikkal: the heart of the vigil —————
// Told through what people did, not what institutions declared.
// Every detail here is documented survivor testimony.
export const mvScenes: Record<Lang, {
  lede: string
  sand: string
  zone: string
  shells: string
  namesLine: string
  namesSub: string
  kanji: string
  silence: string
  silenceSub: string
  countLabel: string; countSuffix: string; countSource: string
  naming: string
  dayLine: string
  daySub: string
}> = {
  fr: {
    lede: "On peut raconter mai 2009 avec des chiffres. Mais ce que l'on n'oublie pas, ce sont les gestes des gens ordinaires, pris au piège entre la lagune et la mer.",
    sand: "En mai 2009, il ne reste qu'une bande de sable. La lagune d'un côté, la mer de l'autre. Deux kilomètres de long.",
    zone: "On leur avait dit d'aller là. On appelait cet endroit une « zone de sécurité ». Ils étaient plus de trois cent mille — des familles, des vieillards, des nouveau-nés.",
    shells: "Puis les obus sont tombés. Sur la zone de sécurité. Sur les files d'attente pour l'eau. Sur le dernier hôpital — encore, et encore.",
    namesLine: "Les mères écrivaient le nom de leurs enfants sur leurs bras.",
    namesSub: "À l'encre. Pour qu'on puisse les reconnaître, après.",
    kanji: "Il n'y avait plus rien à manger. Ils partageaient un kanji — une bouillie de riz claire — sous le bruit des obus.",
    silence: "Aucun journaliste. Aucun observateur. Aucune caméra.",
    silenceSub: "Le monde a appelé cela une victoire.",
    countLabel: "civils tamouls tués dans les derniers mois, selon le Panel d'experts de l'ONU",
    countSuffix: 'à 75 000, et au-delà',
    countSource: "Rapport Darusman, Nations Unies, 2011 — d'autres estimations dépassent 100 000",
    naming: "Ce n'était pas la fin d'une guerre. C'était un génocide.",
    dayLine: 'Chaque 18 mai, partout dans le monde, les Tamouls partagent un kanji.',
    daySub: "Le même goût. La même mémoire. Pour qu'aucun d'eux ne soit oublié.",
  },
  en: {
    lede: 'May 2009 can be told in numbers. But what stays with you are the gestures of ordinary people, trapped between the lagoon and the sea.',
    sand: 'In May 2009, all that was left was a strip of sand. The lagoon on one side, the sea on the other. Two kilometres long.',
    zone: 'They had been told to go there. The place was called a "safe zone". There were more than three hundred thousand of them — families, elders, newborns.',
    shells: 'Then the shells came down. On the safe zone. On the queues for water. On the last hospital — again, and again.',
    namesLine: "Mothers wrote their children's names on their arms.",
    namesSub: 'In ink. So that they could be recognised, afterwards.',
    kanji: 'There was nothing left to eat. They shared kanji — a thin rice gruel — beneath the sound of the shells.',
    silence: 'No journalists. No observers. No cameras.',
    silenceSub: 'The world called it a victory.',
    countLabel: 'Tamil civilians killed in the final months, according to the UN Panel of Experts',
    countSuffix: 'to 75,000, and beyond',
    countSource: 'Darusman Report, United Nations, 2011 — other estimates exceed 100,000',
    naming: 'This was not the end of a war. It was a genocide.',
    dayLine: 'Every 18th of May, across the world, Tamils share a kanji.',
    daySub: 'The same taste. The same memory. So that not one of them is forgotten.',
  },
  ta: {
    lede: '2009 மே மாதத்தை எண்களால் சொல்லலாம். ஆனால் மறக்க முடியாதது — கடலுக்கும் கடல்நீரேரிக்கும் இடையே சிக்கிய சாதாரண மனிதர்களின் செயல்கள்.',
    sand: '2009 மே. மிச்சமிருந்தது ஒரு மணல் திட்டு மட்டுமே. ஒரு பக்கம் கடல்நீரேரி, மறுபக்கம் கடல். இரண்டு கிலோமீட்டர் நீளம்.',
    zone: 'அங்கே போகச் சொன்னார்கள். அந்த இடத்தை «பாதுகாப்பு வலயம்» என்றார்கள். மூன்று லட்சத்துக்கும் மேற்பட்டோர் — குடும்பங்கள், முதியவர்கள், பிறந்த குழந்தைகள்.',
    shells: 'பின்னர் எறிகணைகள் விழுந்தன. பாதுகாப்பு வலயத்தின் மேல். தண்ணீர் வரிசைகளின் மேல். கடைசி மருத்துவமனையின் மேல் — மீண்டும், மீண்டும்.',
    namesLine: 'தாய்மார்கள் தங்கள் குழந்தைகளின் பெயர்களை அவர்களின் கைகளில் எழுதினார்கள்.',
    namesSub: 'மையால். பின்னர் அடையாளம் காண்பதற்காக.',
    kanji: 'உண்பதற்கு ஒன்றுமில்லை. எறிகணைகளின் சத்தத்தின் கீழ் ஒரு கஞ்சியைப் பகிர்ந்து கொண்டார்கள்.',
    silence: 'பத்திரிகையாளர்கள் இல்லை. பார்வையாளர்கள் இல்லை. கேமராக்கள் இல்லை.',
    silenceSub: 'உலகம் அதை ஒரு வெற்றி என்றது.',
    countLabel: 'இறுதி மாதங்களில் கொல்லப்பட்ட தமிழ் குடிமக்கள் — ஐ.நா. நிபுணர் குழுவின்படி',
    countSuffix: '75,000 வரை, அதற்கும் மேல்',
    countSource: 'தருஸ்மான் அறிக்கை, ஐக்கிய நாடுகள், 2011 — பிற மதிப்பீடுகள் 100,000-ஐ தாண்டுகின்றன',
    naming: 'அது ஒரு யுத்தத்தின் முடிவல்ல. அது ஒரு இனப்படுகொலை.',
    dayLine: 'ஒவ்வொரு மே 18 அன்றும், உலகெங்கும், தமிழர்கள் ஒரு கஞ்சியைப் பகிர்ந்து கொள்கிறார்கள்.',
    daySub: 'அதே சுவை. அதே நினைவு. அவர்களில் ஒருவரும் மறக்கப்படாமல் இருக்க.',
  },
}

// ————— The symbols of Tamil Eelam —————
export interface SymbolEntry {
  title: string
  tamil: string
  text: string
}
export const symbols: Record<Lang, {
  lede: string
  flag: SymbolEntry
  animal: SymbolEntry
  bird: SymbolEntry
  flower: SymbolEntry
}> = {
  fr: {
    lede: "Une nation sans État garde ses symboles comme on garde une flamme. Le drapeau, l'animal, l'oiseau, la fleur : chacun raconte d'où l'on vient, et ce qu'on a promis de ne pas oublier.",
    flag: {
      title: 'Le drapeau national',
      tamil: 'தேசியக் கொடி',
      text: "Dessiné en 1977, proclamé drapeau national du Tamil Eelam en 1990. Le tigre bondissant reprend l'emblème des empereurs Chola, dont les bannières traversaient l'océan il y a mille ans ; face au lion du drapeau sri-lankais, il disait qu'un peuple refusait de disparaître. Le rouge porte le sang versé, l'or la lumière de la liberté ; le cercle de rayons dit qu'elle se lève. Aujourd'hui il flotte à Toronto, Londres, Paris, Zurich — partout où le pays vit sans terre.",
    },
    animal: {
      title: "L'animal national — le léopard",
      tamil: 'சிறுத்தை',
      text: "Le léopard de Sri Lanka (Panthera pardus kotiya) — siruthai — est l'animal national du Tamil Eelam. Seigneur silencieux des forêts du Vanni et des maquis du Nord-Est, il chasse seul, patient, presque invisible. Pendant les années de guerre, il a survécu dans les mêmes forêts que les déplacés — deux survies parallèles sur la même terre. Sous-espèce unique à l'île, il est aujourd'hui menacé.",
    },
    bird: {
      title: "L'oiseau national — le grand coucal",
      tamil: 'செம்போத்து',
      text: "Le grand coucal (Centropus sinensis) — chembothu — est l'oiseau national. Plumage noir aux reflets bleus, ailes cuivrées, œil rouge : on l'entend plus qu'on ne le voit, un chant grave qui roule au lever du jour, boum-boum-boum. Dans les foyers tamouls, l'entendre le matin est un signe de bonne fortune. Oiseau des jardins, des lagunes et des palmeraies — le paysage sonore du pays.",
    },
    flower: {
      title: 'La fleur nationale — kaarthigai poo',
      tamil: 'கார்த்திகைப் பூ',
      text: "Le lys de gloire (Gloriosa superba) fleurit en novembre, le mois du souvenir. Ses pétales renversés ressemblent à des flammes : une fleur qui brûle sans se consumer. Fleur nationale du Tamil Eelam et emblème du Maaveerar Naal, elle pousse sauvage dans le Vanni. Au pays, la porter attire encore la police ; en diaspora, elle fleurit sur chaque mémorial, chaque 27 novembre.",
    },
  },
  en: {
    lede: 'A nation without a state keeps its symbols the way one keeps a flame. The flag, the animal, the bird, the flower: each tells where we come from, and what we promised not to forget.',
    flag: {
      title: 'The national flag',
      tamil: 'தேசியக் கொடி',
      text: "Designed in 1977, proclaimed the national flag of Tamil Eelam in 1990. The leaping tiger carries the emblem of the Chola emperors, whose banners crossed the ocean a thousand years ago; facing the lion of the Sri Lankan flag, it said that a people refused to disappear. The red bears the blood that was shed, the gold the light of freedom; the circle of rays says that it rises. Today it flies in Toronto, London, Paris, Zurich — everywhere the country lives without land.",
    },
    animal: {
      title: 'The national animal — the leopard',
      tamil: 'சிறுத்தை',
      text: "The Sri Lankan leopard (Panthera pardus kotiya) — siruthai — is the national animal of Tamil Eelam. Silent lord of the Vanni forests and the scrublands of the North-East, it hunts alone, patient, almost invisible. Through the war years it survived in the same forests as the displaced — two parallel survivals on the same land. A subspecies unique to the island, it is endangered today.",
    },
    bird: {
      title: 'The national bird — the greater coucal',
      tamil: 'செம்போத்து',
      text: "The greater coucal (Centropus sinensis) — chembothu — is the national bird. Black plumage with blue sheen, copper wings, a red eye: it is heard more than seen, a deep call rolling at daybreak, boom-boom-boom. In Tamil homes, hearing it in the morning is a sign of good fortune. A bird of gardens, lagoons and palmyra groves — the soundscape of the country.",
    },
    flower: {
      title: 'The national flower — kaarthigai poo',
      tamil: 'கார்த்திகைப் பூ',
      text: "The glory lily (Gloriosa superba) blooms in November, the month of remembrance. Its upswept petals look like flames: a flower that burns without being consumed. National flower of Tamil Eelam and emblem of Maaveerar Naal, it grows wild in the Vanni. In the homeland, wearing it can still draw the police; in the diaspora, it blooms on every memorial, every 27 November.",
    },
  },
  ta: {
    lede: 'அரசில்லாத ஒரு தேசம் தன் சின்னங்களை ஒரு சுடரைப் போலக் காக்கிறது. கொடி, விலங்கு, பறவை, பூ — ஒவ்வொன்றும் நாம் எங்கிருந்து வந்தோம், எதை மறக்கமாட்டோம் என்று சொல்கிறது.',
    flag: {
      title: 'தேசியக் கொடி',
      tamil: 'தேசியக் கொடி',
      text: '1977-இல் வடிவமைக்கப்பட்டு, 1990-இல் தமிழீழத்தின் தேசியக் கொடியாக அறிவிக்கப்பட்டது. பாயும் புலி சோழப் பேரரசர்களின் சின்னம். சிவப்பு — சிந்திய இரத்தம்; பொன் — விடுதலையின் ஒளி; கதிர்வட்டம் — அது உதிக்கிறது என்பது.',
    },
    animal: {
      title: 'தேசிய விலங்கு — சிறுத்தை',
      tamil: 'சிறுத்தை',
      text: 'இலங்கைச் சிறுத்தை (Panthera pardus kotiya) தமிழீழத்தின் தேசிய விலங்கு. வன்னிக் காடுகளின் மௌன அரசன் — தனியாக, பொறுமையாக, கண்ணுக்குத் தெரியாமல் வாழ்கிறது. தீவுக்கே உரிய இனம்; இன்று அருகி வருகிறது.',
    },
    bird: {
      title: 'தேசியப் பறவை — செம்போத்து',
      tamil: 'செம்போத்து',
      text: 'செம்போத்து (Centropus sinensis) தேசியப் பறவை. கருநீல உடல், செம்பு நிற இறக்கைகள், சிவந்த கண். காலையில் அதன் குரலைக் கேட்பது நல்ல சகுனம் என்பது தமிழ் வீடுகளின் நம்பிக்கை.',
    },
    flower: {
      title: 'தேசிய மலர் — கார்த்திகைப் பூ',
      tamil: 'கார்த்திகைப் பூ',
      text: 'செங்காந்தள் (Gloriosa superba) நவம்பரில் — நினைவின் மாதத்தில் — பூக்கிறது. அதன் இதழ்கள் சுடர்களைப் போன்றவை. தமிழீழத்தின் தேசிய மலர், மாவீரர் நாளின் சின்னம். வன்னியில் காட்டில் பூக்கிறது; புலம்பெயர்வில் ஒவ்வொரு நினைவிடத்திலும் மலர்கிறது.',
    },
  },
}

// ————— Chapter-level connective copy —————
export const vigil: Record<Lang, {
  terreLede: string
  terreYears: string
  terreYearsLabel: string
  etauLede: string
  actLabel: string
  feuBooks: string
  feuBooksLabel: string
  feuLede: string
  promesseLede: string
  promesseQuoteLabel: string
  juilletLede: string
  juilletFigure: string
  juilletFigureLabel: string
  disparusLede: string
  disparusFrames: string
  disparusVigil: string
  patrieLede: string
  patrieHint: string
  aubeLede: string
  aubeCities: string
  aubeJustice: string
  aubeJusticeTitle: string
  epiTitle1: string
  epiTitle2: string
  epiText: string
  epiFlameBtn: string
  epiFlameLit: string
  epiSources: string
  epiTransmit: string
}> = {
  fr: {
    terreLede: 'Avant la guerre, avant les lois, avant l\'île coloniale — il y a un peuple, une langue parmi les plus anciennes du monde, et une terre qui porte son nom : Eelam.',
    terreYears: '2 000+',
    terreYearsLabel: 'années de présence attestée — inscriptions, poésie Sangam, royaumes',
    etauLede: 'L\'oppression ne commence pas par des coups de feu. Elle commence par des textes votés, tamponnés, archivés. Trois actes suffisent à faire d\'un peuple fondateur un étranger chez lui.',
    actLabel: 'Acte',
    feuBooks: '97 000',
    feuBooksLabel: 'livres et manuscrits brûlés avec la bibliothèque de Jaffna, 1981',
    feuLede: 'Quand les lois ne suffisent pas, vient la violence organisée : 1958, 1977, 1981. Et un geste que le monde entier comprend — brûler une bibliothèque, c\'est vouloir tuer une mémoire.',
    promesseLede: 'Face à un État qui refuse l\'égalité, le peuple tamoul répond d\'abord par les urnes. À Vaddukoddai, en 1976, la revendication est écrite noir sur blanc — puis massivement confirmée par le vote de 1977.',
    promesseQuoteLabel: 'Esprit de la résolution',
    juilletLede: 'Des foules organisées, munies des listes électorales, maison par maison. L\'État regarde. Des centaines de milliers partent — c\'est la naissance de la diaspora.',
    juilletFigure: '3 000',
    juilletFigureLabel: 'morts selon les estimations hautes — et une diaspora mondiale née dans la fuite',
    disparusLede: 'Ils se sont rendus à l\'armée, filmés, photographiés. Puis plus rien. Des milliers de familles attendent depuis — l\'un des taux de disparitions forcées les plus élevés au monde.',
    disparusFrames: 'Chaque cadre vide est une personne remise vivante, jamais revue.',
    disparusVigil: 'Depuis 2017, à Vavuniya, Kilinochchi, Mullaitivu, les Mères du Nord tiennent une veille permanente, photos en main. Certaines sont mortes sans réponse.',
    patrieLede: 'Le Nord et l\'Est. Neuf districts, une côte, des temples, des lagunes. On peut bombarder une terre, pas son appartenance.',
    patrieHint: 'Touchez une ville pour son histoire',
    aubeLede: 'De Toronto à Paris, de Londres à Sydney — près d\'un million de Tamouls d\'Eelam portent la langue, les commémorations, la cause. La mémoire a survécu au voyage.',
    aubeCities: 'Toronto · Londres · Paris · Zurich · Oslo · Sydney · Chennai · Berlin',
    aubeJusticeTitle: 'Et la justice ?',
    aubeJustice: 'Rapports OISL de l\'ONU, résolutions successives du Conseil des droits de l\'homme, reconnaissances officielles du génocide par le Canada et d\'autres — la quête continue, portée par les survivants et leurs enfants. Aucun tribunal n\'a encore jugé les responsables.',
    epiTitle1: 'Se souvenir n\'est pas un acte du passé.',
    epiTitle2: 'C\'est un acte du futur.',
    epiText: 'Ce site est une veillée. Il existe pour que les dates, les lieux et les voix traversent les générations — de celles qui ont survécu à celles qui viennent.',
    epiFlameBtn: 'Allumer une flamme de mémoire',
    epiFlameLit: 'Votre flamme est allumée. Portez-la plus loin — racontez cette histoire.',
    epiSources: 'Pour aller plus loin',
    epiTransmit: 'Transmettez ce site à quelqu\'un qui doit savoir.',
  },
  en: {
    terreLede: 'Before the war, before the laws, before the colonial island — there is a people, one of the world\'s oldest living languages, and a land that bears their name: Eelam.',
    terreYears: '2,000+',
    terreYearsLabel: 'years of attested presence — inscriptions, Sangam poetry, kingdoms',
    etauLede: 'Oppression does not begin with gunfire. It begins with texts — voted, stamped, filed. Three acts were enough to turn a founding people into strangers in their own home.',
    actLabel: 'Act',
    feuBooks: '97,000',
    feuBooksLabel: 'books and manuscripts burned with the Jaffna Library, 1981',
    feuLede: 'When laws are not enough, organised violence follows: 1958, 1977, 1981. And one gesture the whole world understands — to burn a library is to try to kill a memory.',
    promesseLede: 'Facing a state that refuses equality, the Tamil people answer first at the ballot box. At Vaddukoddai, in 1976, the claim is written down — then overwhelmingly confirmed by the 1977 vote.',
    promesseQuoteLabel: 'Spirit of the resolution',
    juilletLede: 'Organised mobs, armed with voter rolls, house by house. The state watches. Hundreds of thousands flee — the diaspora is born.',
    juilletFigure: '3,000',
    juilletFigureLabel: 'dead by higher estimates — and a global diaspora born in flight',
    disparusLede: 'They surrendered to the army, filmed and photographed. Then nothing. Thousands of families have waited since — one of the highest rates of enforced disappearance in the world.',
    disparusFrames: 'Every empty frame is a person handed over alive, never seen again.',
    disparusVigil: 'Since 2017, in Vavuniya, Kilinochchi, Mullaitivu, the Mothers of the North have kept a permanent vigil, photos in hand. Some have died without an answer.',
    patrieLede: 'The North and the East. Nine districts, a coastline, temples, lagoons. You can shell a land — not its belonging.',
    patrieHint: 'Tap a city for its story',
    aubeLede: 'From Toronto to Paris, London to Sydney — nearly a million Eelam Tamils carry the language, the commemorations, the cause. Memory survived the journey.',
    aubeCities: 'Toronto · London · Paris · Zurich · Oslo · Sydney · Chennai · Berlin',
    aubeJusticeTitle: 'And justice?',
    aubeJustice: 'UN OISL reports, successive Human Rights Council resolutions, formal genocide recognitions by Canada and others — the quest continues, carried by survivors and their children. No tribunal has yet judged those responsible.',
    epiTitle1: 'To remember is not an act of the past.',
    epiTitle2: 'It is an act of the future.',
    epiText: 'This site is a vigil. It exists so that the dates, the places and the voices cross generations — from those who survived to those who come next.',
    epiFlameBtn: 'Light a flame of remembrance',
    epiFlameLit: 'Your flame is lit. Carry it further — tell this story.',
    epiSources: 'Going deeper',
    epiTransmit: 'Pass this site to someone who should know.',
  },
  ta: {
    terreLede: 'போருக்கு முன், சட்டங்களுக்கு முன், காலனித்துவ தீவுக்கு முன் — ஒரு மக்கள், உலகின் மிகப் பழமையான மொழிகளில் ஒன்று, அவர்களின் பெயரைச் சுமக்கும் ஒரு நிலம்: ஈழம்.',
    terreYears: '2,000+',
    terreYearsLabel: 'ஆண்டுகள் உறுதிப்படுத்தப்பட்ட இருப்பு — கல்வெட்டுகள், சங்க இலக்கியம், இராச்சியங்கள்',
    etauLede: 'ஒடுக்குமுறை துப்பாக்கிச் சூட்டால் தொடங்குவதில்லை. வாக்களிக்கப்பட்ட, முத்திரையிடப்பட்ட ஆவணங்களால் தொடங்குகிறது. மூன்று சட்டங்கள் போதும் — ஒரு மூல மக்களை சொந்த வீட்டில் அந்நியர்களாக்க.',
    actLabel: 'சட்டம்',
    feuBooks: '97,000',
    feuBooksLabel: 'யாழ் நூலகத்துடன் எரிக்கப்பட்ட நூல்களும் ஓலைச்சுவடிகளும், 1981',
    feuLede: 'சட்டங்கள் போதாதபோது, ஒழுங்கமைக்கப்பட்ட வன்முறை வருகிறது: 1958, 1977, 1981. உலகம் புரிந்துகொள்ளும் ஒரு செயல் — நூலகத்தை எரிப்பது என்பது நினைவைக் கொல்ல முயல்வது.',
    promesseLede: 'சமத்துவத்தை மறுக்கும் அரசை எதிர்கொண்டு, தமிழ் மக்கள் முதலில் வாக்குப்பெட்டியால் பதிலளிக்கிறார்கள். 1976-இல் வட்டுக்கோட்டையில் கோரிக்கை எழுதப்படுகிறது — 1977 தேர்தலில் பேரளவில் உறுதிப்படுத்தப்படுகிறது.',
    promesseQuoteLabel: 'தீர்மானத்தின் ஆவி',
    juilletLede: 'வாக்காளர் பட்டியல்களுடன் ஒழுங்கமைக்கப்பட்ட கும்பல்கள், வீடு வீடாக. அரசு பார்த்துக்கொண்டிருக்கிறது. லட்சக்கணக்கானோர் வெளியேறுகிறார்கள் — புலம்பெயர்வு பிறக்கிறது.',
    juilletFigure: '3,000',
    juilletFigureLabel: 'உயர் மதிப்பீடுகளின்படி இறந்தவர்கள் — தப்பியோட்டத்தில் பிறந்த உலகப் புலம்பெயர்வு',
    disparusLede: 'அவர்கள் ராணுவத்திடம் சரணடைந்தனர், படமெடுக்கப்பட்டனர். பின்னர் ஒன்றுமில்லை. ஆயிரக்கணக்கான குடும்பங்கள் காத்திருக்கின்றன — உலகின் மிக உயர்ந்த வலுக்கட்டாய காணாமல்போதல் விகிதங்களில் ஒன்று.',
    disparusFrames: 'ஒவ்வொரு வெற்று சட்டகமும் உயிருடன் ஒப்படைக்கப்பட்டு, மீண்டும் காணப்படாத ஒருவர்.',
    disparusVigil: '2017 முதல், வவுனியா, கிளிநொச்சி, முல்லைத்தீவில், வடக்கின் தாய்மார்கள் புகைப்படங்களுடன் நிரந்தர விழிப்பு காக்கிறார்கள். சிலர் பதில் இன்றி இறந்துவிட்டனர்.',
    patrieLede: 'வடக்கும் கிழக்கும். மாவட்டங்கள், கடற்கரை, கோவில்கள், கடல்நீரேரிகள். ஒரு நிலத்தை குண்டுவீசலாம் — அதன் சொந்தத்தை முடியாது.',
    patrieHint: 'நகரத்தைத் தொட்டு அதன் கதையை அறியுங்கள்',
    aubeLede: 'டொராண்டோ முதல் பாரிஸ் வரை, லண்டன் முதல் சிட்னி வரை — கிட்டத்தட்ட பத்து லட்சம் ஈழத் தமிழர்கள் மொழியையும், நினைவேந்தல்களையும், காரணத்தையும் சுமக்கிறார்கள்.',
    aubeCities: 'டொராண்டோ · லண்டன் · பாரிஸ் · சூரிச் · ஒஸ்லோ · சிட்னி · சென்னை · பெர்லின்',
    aubeJusticeTitle: 'நீதி எங்கே?',
    aubeJustice: 'ஐ.நா. OISL அறிக்கைகள், தொடர்ச்சியான மனித உரிமைகள் கவுன்சில் தீர்மானங்கள், கனடா உள்ளிட்ட நாடுகளின் இன அழிப்பு அங்கீகாரங்கள் — தேடல் தொடர்கிறது. பொறுப்பானவர்களை இன்னும் எந்த தீர்ப்பாயமும் விசாரிக்கவில்லை.',
    epiTitle1: 'நினைவு என்பது கடந்த காலத்தின் செயல் அல்ல.',
    epiTitle2: 'அது எதிர்காலத்தின் செயல்.',
    epiText: 'இந்த தளம் ஒரு விழிப்பு. தேதிகளும், இடங்களும், குரல்களும் தலைமுறைகளைக் கடக்கவே இது இருக்கிறது.',
    epiFlameBtn: 'நினைவுச் சுடர் ஏற்றுங்கள்',
    epiFlameLit: 'உங்கள் சுடர் எரிகிறது. அதை மேலும் சுமந்து செல்லுங்கள் — இந்தக் கதையைச் சொல்லுங்கள்.',
    epiSources: 'மேலும் அறிய',
    epiTransmit: 'அறிய வேண்டிய ஒருவருக்கு இந்த தளத்தை அனுப்புங்கள்.',
  },
}
