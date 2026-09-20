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
    "id": "terre",
    "num": "I",
    "years": {
      "fr": "Antiquité — 1619",
      "en": "Antiquity — 1619",
      "ta": "தொன்மை — 1619"
    },
    "kicker": {
      "fr": "Avant tout, il y a une terre",
      "en": "Before everything, there is a land",
      "ta": "எல்லாவற்றிற்கும் முன், ஒரு நிலம்"
    },
    "title": {
      "fr": "La terre",
      "en": "The land",
      "ta": "நிலம்"
    },
    "titleAccent": {
      "fr": "des ancêtres.",
      "en": "of the ancestors.",
      "ta": "முன்னோர்களின்."
    },
    "tamilGhost": "ஈழம்"
  },
  {
    "id": "etau",
    "num": "II",
    "years": {
      "fr": "1833 — 1956",
      "en": "1833 — 1956",
      "ta": "1833 — 1956"
    },
    "kicker": {
      "fr": "L'injustice arrive par la loi",
      "en": "Injustice arrives by law",
      "ta": "அநீதி சட்டத்தால் வருகிறது"
    },
    "title": {
      "fr": "L'étau",
      "en": "The vice",
      "ta": "இறுக்கம்"
    },
    "titleAccent": {
      "fr": "se referme.",
      "en": "closes in.",
      "ta": "மூடுகிறது."
    },
    "tamilGhost": "சட்டம்"
  },
  {
    "id": "feu",
    "num": "III",
    "years": {
      "fr": "1958 — 1981",
      "en": "1958 — 1981",
      "ta": "1958 — 1981"
    },
    "kicker": {
      "fr": "Puis elle arrive par le feu",
      "en": "Then it arrives by fire",
      "ta": "பின்னர் அது நெருப்பால் வருகிறது"
    },
    "title": {
      "fr": "Le feu",
      "en": "The fire",
      "ta": "நெருப்பு"
    },
    "titleAccent": {
      "fr": "contre la mémoire.",
      "en": "against memory.",
      "ta": "நினைவுக்கு எதிராக."
    },
    "tamilGhost": "நூலகம்"
  },
  {
    "id": "promesse",
    "num": "IV",
    "years": {
      "fr": "1976 — 1977",
      "en": "1976 — 1977",
      "ta": "1976 — 1977"
    },
    "kicker": {
      "fr": "Un peuple répond, démocratiquement",
      "en": "A people answers, democratically",
      "ta": "ஒரு மக்கள் ஜனநாயக ரீதியாக பதிலளிக்கிறார்கள்"
    },
    "title": {
      "fr": "La promesse",
      "en": "The promise",
      "ta": "வாக்குறுதி"
    },
    "titleAccent": {
      "fr": "de Vaddukoddai.",
      "en": "of Vaddukoddai.",
      "ta": "வட்டுக்கோட்டையின்."
    },
    "tamilGhost": "தீர்மானம்"
  },
  {
    "id": "juillet",
    "num": "V",
    "years": {
      "fr": "Juillet 1983",
      "en": "July 1983",
      "ta": "ஜூலை 1983"
    },
    "kicker": {
      "fr": "La semaine où tout bascule",
      "en": "The week everything breaks",
      "ta": "எல்லாம் உடைந்த வாரம்"
    },
    "title": {
      "fr": "Juillet",
      "en": "Black",
      "ta": "கறுப்பு"
    },
    "titleAccent": {
      "fr": "noir.",
      "en": "July.",
      "ta": "ஜூலை."
    },
    "tamilGhost": "கறுப்பு ஜூலை"
  },
  {
    "id": "mullivaikkal",
    "num": "VI",
    "years": {
      "fr": "Mai 2009",
      "en": "May 2009",
      "ta": "மே 2009"
    },
    "kicker": {
      "fr": "Ce que le monde a laissé faire",
      "en": "What the world allowed",
      "ta": "உலகம் அனுமதித்தது"
    },
    "title": {
      "fr": "Mullivaikkal",
      "en": "Mullivaikkal",
      "ta": "முள்ளிவாய்க்கால்"
    },
    "titleAccent": {
      "fr": "",
      "en": "",
      "ta": ""
    },
    "tamilGhost": "முள்ளிவாய்க்கால்"
  },
  {
    "id": "disparus",
    "num": "VII",
    "years": {
      "fr": "Depuis 2009",
      "en": "Since 2009",
      "ta": "2009 முதல்"
    },
    "kicker": {
      "fr": "L’absence ne finit pas avec la guerre",
      "en": "Absence does not end with war",
      "ta": "இல்லாமை போருடன் முடிவதில்லை"
    },
    "title": {
      "fr": "Ceux qui",
      "en": "Those who",
      "ta": "இன்னும்"
    },
    "titleAccent": {
      "fr": "ne rentrent pas.",
      "en": "never came home.",
      "ta": "திரும்பாதவர்கள்."
    },
    "tamilGhost": "காணாமல்"
  },
  {
    "id": "patrie",
    "num": "VIII",
    "years": {
      "fr": "Depuis toujours",
      "en": "Since always",
      "ta": "என்றென்றும்"
    },
    "kicker": {
      "fr": "Ce qui ne peut être effacé",
      "en": "What cannot be erased",
      "ta": "அழிக்க முடியாதது"
    },
    "title": {
      "fr": "La patrie",
      "en": "The homeland",
      "ta": "தாயகம்"
    },
    "titleAccent": {
      "fr": "demeure.",
      "en": "remains.",
      "ta": "நிலைத்திருக்கிறது."
    },
    "tamilGhost": "தமிழீழம்"
  },
  {
    "id": "symboles",
    "num": "IX",
    "years": {
      "fr": "1977 — aujourd'hui",
      "en": "1977 — today",
      "ta": "1977 — இன்று"
    },
    "kicker": {
      "fr": "Ce qu'un peuple choisit pour se dire",
      "en": "What a people chooses to say itself",
      "ta": "ஒரு மக்கள் தம்மைச் சொல்லத் தேர்ந்தவை"
    },
    "title": {
      "fr": "Les symboles",
      "en": "The symbols",
      "ta": "சின்னங்கள்"
    },
    "titleAccent": {
      "fr": "d'une nation.",
      "en": "of a nation.",
      "ta": "ஒரு தேசத்தின்."
    },
    "tamilGhost": "சின்னங்கள்"
  },
  {
    "id": "aube",
    "num": "X",
    "years": {
      "fr": "1983 — demain",
      "en": "1983 — tomorrow",
      "ta": "1983 — நாளை"
    },
    "kicker": {
      "fr": "La flamme portée ailleurs",
      "en": "The flame carried elsewhere",
      "ta": "சுடர் வேறிடம் சுமக்கப்படுகிறது"
    },
    "title": {
      "fr": "L'aube",
      "en": "The dawn",
      "ta": "விடியல்"
    },
    "titleAccent": {
      "fr": "en diaspora.",
      "en": "in diaspora.",
      "ta": "புலம்பெயர்வில்."
    },
    "tamilGhost": "புலம்பெயர்வு"
  }
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
  sources: string
  scene: string
  stages: [string, string, string]
}> = {
  fr: {
    whisper: 'Sri Lanka · Mémoire du peuple tamoul',
    line1: 'D’une génération à l’autre,',
    line2: 'ne pas laisser le silence.',
    sub: 'Derrière l’histoire du génocide des Tamouls, il y a des vies. Des lieux habités, des liens brisés, des familles qui attendent encore. Ce récit suit leur histoire, de la terre à l’exil, pour comprendre et transmettre.',
    enter: 'Entrer dans l’histoire',
    sources: 'Les faits et les sources',
    scene: 'Évocation créée par IA · hors archives',
    stages: ['La mémoire brûlée', 'Juillet noir', 'Mullivaikkal'],
  },
  en: {
    whisper: 'Sri Lanka · Remembering the Tamil people',
    line1: 'From one generation to the next,',
    line2: 'never leave only silence.',
    sub: 'Behind the history of the Tamil genocide are lives. Places once lived in, bonds broken, families still waiting. This story follows their journey, from homeland to exile, to understand and to pass on their memory.',
    enter: 'Enter the story',
    sources: 'The facts and sources',
    scene: 'AI-created evocation · not an archival photograph',
    stages: ['Memory burned', 'Black July', 'Mullivaikkal'],
  },
  ta: {
    whisper: 'இலங்கை · தமிழர் நினைவு',
    line1: 'தலைமுறையிலிருந்து தலைமுறைக்கு,',
    line2: 'மௌனத்தை விட்டுச் செல்லாதிருப்போம்.',
    sub: 'தமிழர் இனப்படுகொலையின் வரலாற்றுக்குப் பின்னால் வாழ்வுகள் உள்ளன. வாழ்ந்த இடங்கள், முறிந்த உறவுகள், இன்னும் காத்திருக்கும் குடும்பங்கள். புரிந்துகொள்ளவும் நினைவை அடுத்த தலைமுறைக்குக் கடத்தவும், தாயகத்திலிருந்து புலம்பெயர்வு வரை இந்தக் கதை பயணிக்கிறது.',
    enter: 'வரலாற்றுக்குள் நுழையுங்கள்',
    sources: 'உண்மைகளும் ஆதாரங்களும்',
    scene: 'AI உருவாக்கிய காட்சி · ஆவணப் படம் அல்ல',
    stages: ['எரிக்கப்பட்ட நினைவு', 'கறுப்பு ஜூலை', 'முள்ளிவாய்க்கால்'],
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
  "fr": {
    "lede": "On peut raconter mai 2009 avec des chiffres. Mais ce que l'on n'oublie pas, ce sont les gestes des gens ordinaires, pris au piège entre la lagune et la mer.",
    "sand": "À la fin de la guerre, l’espace se réduit à une bande côtière. La lagune d’un côté. La mer de l’autre.",
    "zone": "Environ 300 000 civils sont pris au piège dans la phase finale du conflit. Des familles cherchent refuge dans les zones déclarées sans tirs.",
    "shells": "Les zones déclarées sans tirs sont bombardées. Des hôpitaux sont touchés à plusieurs reprises. Les personnes blessées ont de moins en moins d’endroits où être soignées.",
    "namesLine": "Chaque vie avait un nom.",
    "namesSub": "Une famille. Une voix. Quelqu’un qui l’attendait.",
    "kanji": "Dans la pénurie, le kanji — une bouillie de riz claire — devient un repas de survie. Ce goût restera dans la mémoire des survivants.",
    "silence": "L’accès indépendant au terrain est fortement restreint. Pourtant, des soignants, des habitants et des humanitaires font parvenir des informations.",
    "silenceSub": "L’ONU décrira ensuite son propre échec systémique.",
    "countLabel": "Le Panel de 2011 évoque des sources crédibles estimant jusqu’à 40 000 morts civils dans les derniers mois de la guerre. Le nombre exact reste à établir.",
    "countSuffix": "Une estimation. Pas un bilan définitif.",
    "countSource": "ONU · Panel d’experts, 2011 · § 137",
    "naming": "Le génocide des Tamouls. Une mémoire. Une demande de justice.",
    "dayLine": "Chaque 18 mai, des familles partagent à nouveau le kanji.",
    "daySub": "Le même goût. La même mémoire. Pour qu'aucun d'eux ne soit oublié."
  },
  "en": {
    "lede": "May 2009 can be told in numbers. But what stays with you are the gestures of ordinary people, trapped between the lagoon and the sea.",
    "sand": "At the war’s end, the space narrowed to a coastal strip. The lagoon on one side. The sea on the other.",
    "zone": "Around 300,000 civilians were trapped in the conflict’s final phase. Families sought refuge in declared no-fire zones.",
    "shells": "Declared no-fire zones were shelled. Hospitals were hit repeatedly. Wounded people had fewer and fewer places to receive care.",
    "namesLine": "Every life had a name.",
    "namesSub": "A family. A voice. Someone waiting for them.",
    "kanji": "In scarcity, kanji — a thin rice gruel — became a meal of survival. Its taste remains in survivors’ memory.",
    "silence": "Independent access to the area was severely restricted. Yet medical workers, residents and aid workers sent information out.",
    "silenceSub": "The UN would later describe its own systemic failure.",
    "countLabel": "The 2011 Panel cited credible sources estimating as many as 40,000 civilian deaths in the war’s final months. The exact number remains to be established.",
    "countSuffix": "An estimate. Not a definitive toll.",
    "countSource": "UN · Panel of Experts, 2011 · § 137",
    "naming": "The Tamil genocide. A memory. A demand for justice.",
    "dayLine": "Every 18 May, families share kanji again.",
    "daySub": "The same taste. The same memory. So that not one of them is forgotten."
  },
  "ta": {
    "lede": "2009 மே மாதத்தை எண்களால் சொல்லலாம். ஆனால் மறக்க முடியாதது — கடலுக்கும் கடல்நீரேரிக்கும் இடையே சிக்கிய சாதாரண மனிதர்களின் செயல்கள்.",
    "sand": "போரின் முடிவில் இடம் ஒரு கடற்கரைத் துண்டாகச் சுருங்கியது. ஒரு பக்கம் கடல்நீரேரி. மறுபக்கம் கடல்.",
    "zone": "போரின் இறுதிக்கட்டத்தில் சுமார் 300,000 பொதுமக்கள் சிக்கினர். பாதுகாப்பு வலயங்களில் குடும்பங்கள் தஞ்சம் தேடின.",
    "shells": "பாதுகாப்பு வலயங்கள் எறிகணைத் தாக்குதலுக்கு உள்ளாயின. மருத்துவமனைகள் மீண்டும் மீண்டும் தாக்கப்பட்டன. காயமடைந்தவர்களுக்கு சிகிச்சை பெறும் இடங்கள் குறைந்தன.",
    "namesLine": "ஒவ்வொரு உயிருக்கும் ஒரு பெயர் இருந்தது.",
    "namesSub": "ஒரு குடும்பம். ஒரு குரல். காத்திருந்த ஒருவர்.",
    "kanji": "பற்றாக்குறையில் கஞ்சி உயிர்காக்கும் உணவானது. அதன் சுவை உயிர்பிழைத்தவர்களின் நினைவில் நிலைக்கிறது.",
    "silence": "சுயாதீன அணுகல் கடுமையாகக் கட்டுப்படுத்தப்பட்டது. இருந்தும் மருத்துவர்கள், மக்கள், மனிதாபிமானப் பணியாளர்கள் தகவல்களை வெளியே அனுப்பினர்.",
    "silenceSub": "பின்னர் ஐ.நா. தன்னுடைய அமைப்புரீதியான தோல்வியை விவரித்தது.",
    "countLabel": "2011 குழு இறுதி மாதங்களில் 40,000 வரை பொதுமக்கள் இறந்திருக்கலாம் என்ற நம்பகமான மதிப்பீடுகளைக் குறிப்பிட்டது. சரியான எண்ணிக்கை இன்னும் நிறுவப்பட வேண்டும்.",
    "countSuffix": "ஒரு மதிப்பீடு. இறுதி எண்ணிக்கை அல்ல.",
    "countSource": "ஐ.நா. · நிபுணர் குழு, 2011 · § 137",
    "naming": "தமிழர் இனப்படுகொலை. ஒரு நினைவு. நீதிக்கான கோரிக்கை.",
    "dayLine": "ஒவ்வொரு மே 18-இலும் குடும்பங்கள் மீண்டும் கஞ்சியைப் பகிர்கின்றன.",
    "daySub": "அதே சுவை. அதே நினைவு. அவர்களில் ஒருவரும் மறக்கப்படாமல் இருக்க."
  }
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
  "fr": {
    "lede": "Une nation sans État garde ses symboles comme on garde une flamme. Le drapeau, l'animal, l'oiseau, la fleur : chacun raconte d'où l'on vient, et ce qu'on a promis de ne pas oublier.",
    "flag": {
      "title": "Le drapeau",
      "tamil": "தேசியக் கொடி",
      "text": "Le drapeau au tigre est porté dans le mouvement national tamoul et dans une partie de la diaspora. Dérivé du drapeau du LTTE, il accompagne des manifestations et des commémorations. Sa signification n’est pas la même pour toutes les personnes tamoules."
    },
    "animal": {
      "title": "Le léopard · siruthai",
      "tamil": "சிறுத்தை",
      "text": "Le léopard de Sri Lanka — siruthai — appartient à la faune de l’île et apparaît dans les représentations symboliques de l’Eelam. Son image rappelle les forêts, les broussailles et une terre qui est aussi celle du vivant."
    },
    "bird": {
      "title": "Le grand coucal · chembothu",
      "tamil": "செம்போத்து",
      "text": "Le grand coucal — chembothu — porte un plumage sombre et des ailes cuivrées. Dans cette évocation du pays, il rappelle les jardins et les paysages sonores du quotidien : ce que l’on reconnaît avant même de le nommer."
    },
    "flower": {
      "title": "Le kaarthigai poo",
      "tamil": "கார்த்திகைப் பூ",
      "text": "Le kaarthigai poo, ou Gloriosa superba, accompagne la mémoire tamoule et le Maaveerar Naal. Ses pétales retournés évoquent des flammes. Ici, la fleur relie le vivant et le souvenir : quelque chose de fragile que l’on continue de porter."
    }
  },
  "en": {
    "lede": "A nation without a state keeps its symbols the way one keeps a flame. The flag, the animal, the bird, the flower: each tells where we come from, and what we promised not to forget.",
    "flag": {
      "title": "The flag",
      "tamil": "தேசியக் கொடி",
      "text": "The tiger flag is used within the Tamil national movement and parts of the diaspora. Derived from the LTTE flag, it appears at demonstrations and commemorations. Its meaning is not the same for every Tamil person."
    },
    "animal": {
      "title": "The leopard · siruthai",
      "tamil": "சிறுத்தை",
      "text": "The Sri Lankan leopard — siruthai — belongs to the island’s wildlife and appears in symbolic representations of Eelam. Its image recalls forests, scrubland and a homeland shared with other living things."
    },
    "bird": {
      "title": "The greater coucal · chembothu",
      "tamil": "செம்போத்து",
      "text": "The greater coucal — chembothu — has dark plumage and copper-coloured wings. In this evocation of home, it recalls gardens and everyday sounds: things recognised before they are named."
    },
    "flower": {
      "title": "The kaarthigai flower",
      "tamil": "கார்த்திகைப் பூ",
      "text": "Kaarthigai poo, or Gloriosa superba, accompanies Tamil remembrance and Maaveerar Naal. Its recurved petals evoke flames. Here the flower connects life and memory: something fragile that people continue to carry."
    }
  },
  "ta": {
    "lede": "அரசில்லாத ஒரு தேசம் தன் சின்னங்களை ஒரு சுடரைப் போலக் காக்கிறது. கொடி, விலங்கு, பறவை, பூ — ஒவ்வொன்றும் நாம் எங்கிருந்து வந்தோம், எதை மறக்கமாட்டோம் என்று சொல்கிறது.",
    "flag": {
      "title": "கொடி",
      "tamil": "தேசியக் கொடி",
      "text": "புலிக்கொடி தமிழ் தேசிய இயக்கத்திலும் புலம்பெயர் சமூகத்தின் ஒரு பகுதியிலும் பயன்படுத்தப்படுகிறது. புலிகளின் கொடியிலிருந்து வந்த இது போராட்டங்களிலும் நினைவேந்தல்களிலும் இடம்பெறுகிறது. எல்லாத் தமிழர்களுக்கும் அதன் அர்த்தம் ஒன்றல்ல."
    },
    "animal": {
      "title": "சிறுத்தை",
      "tamil": "சிறுத்தை",
      "text": "இலங்கைச் சிறுத்தை தீவின் வனவிலங்குகளில் ஒன்று; ஈழத்தின் அடையாளச் சித்தரிப்புகளில் இடம்பெறுகிறது. அதன் உருவம் காடுகளையும் பிற உயிர்களுடன் பகிர்ந்த நிலத்தையும் நினைவூட்டுகிறது."
    },
    "bird": {
      "title": "செம்போத்து",
      "tamil": "செம்போத்து",
      "text": "செம்போத்து கருமையான உடலும் செம்புநிற இறக்கைகளும் கொண்டது. தாயகத்தின் இந்த நினைவூட்டலில் அது தோட்டங்களையும் அன்றாட ஒலிகளையும் நினைவுபடுத்துகிறது."
    },
    "flower": {
      "title": "கார்த்திகைப் பூ",
      "tamil": "கார்த்திகைப் பூ",
      "text": "கார்த்திகைப் பூ, Gloriosa superba, தமிழ் நினைவேந்தலுடனும் மாவீரர் நாளுடனும் இணைகிறது. அதன் வளைந்த இதழ்கள் சுடர்களை நினைவூட்டுகின்றன. இங்கு மலர் வாழ்வையும் நினைவையும் இணைக்கிறது."
    }
  }
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
  feuArchiveTag: string
  feuArchiveCaption: string
  feuArchiveCredit: string
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
  "fr": {
    "terreLede": "Une langue, des terres cultivées, des ports, des temples. Avant de suivre les dates de la violence, prendre le temps de rencontrer une histoire et les vies qui la portent.",
    "terreYears": "Une terre",
    "terreYearsLabel": "des lieux, une langue, des générations",
    "etauLede": "L’exclusion prend aussi la forme d’un document : une citoyenneté refusée, une langue écartée. Les décisions administratives entrent dans les vies, dans le travail, dans l’avenir des enfants.",
    "actLabel": "Acte",
    "feuBooks": "97 000",
    "feuBooksLabel": "environ 97 000 livres et manuscrits détruits en 1981",
    "feuLede": "Quand les lois ne suffisent pas, vient la violence organisée : 1958, 1977, 1981. Et un geste que le monde entier comprend — brûler une bibliothèque, c'est vouloir tuer une mémoire.",
    "feuArchiveTag": "Archive",
    "feuArchiveCaption": "La bibliothèque de Jaffna, reconstruite sur ses propres ruines — photographiée en 2003, l'échafaudage encore debout vingt-deux ans après l'incendie.",
    "feuArchiveCredit": "Photo : Dooom, 2003 · retouche Mfield · domaine public, Wikimedia Commons",
    "promesseLede": "Face à un État qui refuse l'égalité, le peuple tamoul répond d'abord par les urnes. À Vaddukoddai, en 1976, la revendication est écrite noir sur blanc — puis massivement confirmée par le vote de 1977.",
    "promesseQuoteLabel": "Texte éditorial inspiré de l’aspiration à l’autodétermination",
    "juilletLede": "En juillet 1983, des Tamouls sont tués, leurs maisons et leurs commerces attaqués. Pour de nombreuses familles, fuir devient une nécessité. Le pogrom marque un tournant dans la guerre et dans l’exil.",
    "juilletFigure": "≈ 3 000",
    "juilletFigureLabel": "morts tamouls selon l’estimation haute citée par OISL ; les bilans varient",
    "disparusLede": "Certains ont disparu après leur reddition, d’autres après une arrestation ou un enlèvement. Les familles demandent une réponse : où sont-ils ? L’attente fait partie de cette histoire.",
    "disparusFrames": "Ces cadres vides évoquent l’absence. Ils ne représentent ni un décompte ni des personnes identifiées.",
    "disparusVigil": "Depuis 2017, à Vavuniya, Kilinochchi, Mullaitivu, les Mères du Nord tiennent une veille permanente, photos en main. Certaines sont mortes sans réponse.",
    "patrieLede": "Le Nord et l’Est : des villes, des côtes, des temples et des lagunes. Des lieux habités, quittés, parfois retrouvés. Une carte pour les situer, et pour retenir leurs noms.",
    "patrieHint": "Touchez une ville pour son histoire",
    "aubeLede": "De Toronto à Paris, de Londres à Sydney, la langue et les gestes de mémoire traversent les générations. L’exil n’a pas mis fin au lien avec la terre ni à la demande de justice.",
    "aubeCities": "Toronto · Londres · Paris · Zurich · Oslo · Sydney · Chennai · Berlin",
    "aubeJusticeTitle": "Et la justice ?",
    "aubeJustice": "Rapports OISL de l'ONU, résolutions successives du Conseil des droits de l'homme, reconnaissances officielles du génocide par le Canada et d'autres — la quête continue, portée par les survivants et leurs enfants. Aucun tribunal n'a encore jugé les responsables.",
    "epiTitle1": "Se souvenir n'est pas un acte du passé.",
    "epiTitle2": "C'est un acte du futur.",
    "epiText": "Ce site est une veillée. Il existe pour que les dates, les lieux et les voix traversent les générations — de celles qui ont survécu à celles qui viennent.",
    "epiFlameBtn": "Allumer une flamme de mémoire",
    "epiFlameLit": "Votre flamme est allumée. Portez-la plus loin — racontez cette histoire.",
    "epiSources": "Pour aller plus loin",
    "epiTransmit": "Transmettez ce site à quelqu'un qui doit savoir."
  },
  "en": {
    "terreLede": "A language, cultivated fields, ports, temples. Before following the dates of violence, take time to encounter a history and the lives that carry it.",
    "terreYears": "A homeland",
    "terreYearsLabel": "places, a language, generations",
    "etauLede": "Exclusion also takes the form of a document: citizenship denied, a language excluded. Administrative decisions enter people’s lives, their work and their children’s futures.",
    "actLabel": "Act",
    "feuBooks": "97,000",
    "feuBooksLabel": "around 97,000 books and manuscripts destroyed in 1981",
    "feuLede": "When laws are not enough, organised violence follows: 1958, 1977, 1981. And one gesture the whole world understands — to burn a library is to try to kill a memory.",
    "feuArchiveTag": "Archive",
    "feuArchiveCaption": "The Jaffna Library, rebuilt on its own ruins — photographed in 2003, the scaffolding still standing twenty-two years after the fire.",
    "feuArchiveCredit": "Photo: Dooom, 2003 · retouched by Mfield · public domain, Wikimedia Commons",
    "promesseLede": "Facing a state that refuses equality, the Tamil people answer first at the ballot box. At Vaddukoddai, in 1976, the claim is written down — then overwhelmingly confirmed by the 1977 vote.",
    "promesseQuoteLabel": "Editorial text inspired by the aspiration to self-determination",
    "juilletLede": "In July 1983, Tamils are killed and their homes and businesses attacked. For many families, flight becomes a necessity. The pogrom marks a turning point in the war and in exile.",
    "juilletFigure": "≈ 3,000",
    "juilletFigureLabel": "Tamil deaths in the upper estimate cited by OISL; estimates vary",
    "disparusLede": "Some disappeared after surrendering, others after arrest or abduction. Families ask for an answer: where are they? The waiting is part of this history.",
    "disparusFrames": "These empty frames evoke absence. They are neither a count nor portraits of identified people.",
    "disparusVigil": "Since 2017, in Vavuniya, Kilinochchi, Mullaitivu, the Mothers of the North have kept a permanent vigil, photos in hand. Some have died without an answer.",
    "patrieLede": "The North and East: cities, coasts, temples and lagoons. Places lived in, left behind, sometimes returned to. A map to locate them and remember their names.",
    "patrieHint": "Tap a city for its story",
    "aubeLede": "From Toronto to Paris, London to Sydney, language and acts of remembrance pass between generations. Exile has not ended the connection to the land or the demand for justice.",
    "aubeCities": "Toronto · London · Paris · Zurich · Oslo · Sydney · Chennai · Berlin",
    "aubeJusticeTitle": "And justice?",
    "aubeJustice": "UN OISL reports, successive Human Rights Council resolutions, formal genocide recognitions by Canada and others — the quest continues, carried by survivors and their children. No tribunal has yet judged those responsible.",
    "epiTitle1": "To remember is not an act of the past.",
    "epiTitle2": "It is an act of the future.",
    "epiText": "This site is a vigil. It exists so that the dates, the places and the voices cross generations — from those who survived to those who come next.",
    "epiFlameBtn": "Light a flame of remembrance",
    "epiFlameLit": "Your flame is lit. Carry it further — tell this story.",
    "epiSources": "Going deeper",
    "epiTransmit": "Pass this site to someone who should know."
  },
  "ta": {
    "terreLede": "ஒரு மொழி, விளைநிலங்கள், துறைமுகங்கள், கோவில்கள். வன்முறையின் தேதிகளுக்குள் செல்லும்முன், ஒரு வரலாற்றையும் அதைச் சுமக்கும் வாழ்வுகளையும் சந்திப்போம்.",
    "terreYears": "ஒரு தாயகம்",
    "terreYearsLabel": "இடங்கள், ஒரு மொழி, தலைமுறைகள்",
    "etauLede": "ஒதுக்குதல் ஆவணத்தின் வடிவத்திலும் வருகிறது: மறுக்கப்பட்ட குடியுரிமை, ஒதுக்கப்பட்ட மொழி. நிர்வாக முடிவுகள் வாழ்விலும் வேலையிலும் குழந்தைகளின் எதிர்காலத்திலும் நுழைகின்றன.",
    "actLabel": "சட்டம்",
    "feuBooks": "97,000",
    "feuBooksLabel": "1981-இல் சுமார் 97,000 நூல்களும் கையெழுத்துப் பிரதிகளும் அழிந்தன",
    "feuLede": "சட்டங்கள் போதாதபோது, ஒழுங்கமைக்கப்பட்ட வன்முறை வருகிறது: 1958, 1977, 1981. உலகம் புரிந்துகொள்ளும் ஒரு செயல் — நூலகத்தை எரிப்பது என்பது நினைவைக் கொல்ல முயல்வது.",
    "feuArchiveTag": "காப்பகம்",
    "feuArchiveCaption": "யாழ்ப்பாண நூலகம், தன் இடிபாடுகளின் மேலே மீண்டும் கட்டப்பட்டது — 2003இல் எடுக்கப்பட்ட புகைப்படம், தீ வைக்கப்பட்ட இருபத்திரண்டு ஆண்டுகளுக்குப் பின்னும் கட்டுமான மேடைகள் நிற்கின்றன.",
    "feuArchiveCredit": "புகைப்படம்: Dooom, 2003 · திருத்தம்: Mfield · பொது உடைமை, விக்கிமீடியா காமன்ஸ்",
    "promesseLede": "சமத்துவத்தை மறுக்கும் அரசை எதிர்கொண்டு, தமிழ் மக்கள் முதலில் வாக்குப்பெட்டியால் பதிலளிக்கிறார்கள். 1976-இல் வட்டுக்கோட்டையில் கோரிக்கை எழுதப்படுகிறது — 1977 தேர்தலில் பேரளவில் உறுதிப்படுத்தப்படுகிறது.",
    "promesseQuoteLabel": "சுயநிர்ணயக் கோரிக்கையால் தூண்டப்பட்ட ஆசிரியர் உரை",
    "juilletLede": "1983 ஜூலையில் தமிழர்கள் கொல்லப்பட்டனர்; வீடுகளும் வணிகங்களும் தாக்கப்பட்டன. பல குடும்பங்களுக்கு தப்பிச் செல்வது அவசியமானது. இனவன்முறை போரிலும் புலம்பெயர்விலும் ஒரு திருப்புமுனையானது.",
    "juilletFigure": "≈ 3,000",
    "juilletFigureLabel": "OISL குறிப்பிடும் உயர்ந்த மதிப்பீட்டில் தமிழ் உயிரிழப்புகள்; மதிப்பீடுகள் வேறுபடுகின்றன",
    "disparusLede": "சிலர் சரணடைந்தபின் காணாமல் ஆக்கப்பட்டனர்; மற்றவர்கள் கைது அல்லது கடத்தலுக்குப் பிறகு. அவர்கள் எங்கே என்று குடும்பங்கள் பதில் கேட்கின்றன. காத்திருப்பதும் இந்த வரலாற்றின் ஒரு பகுதி.",
    "disparusFrames": "இந்த வெற்றுச் சட்டங்கள் இல்லாமையை நினைவூட்டுகின்றன. இவை எண்ணிக்கையோ அடையாளம் காணப்பட்டவர்களின் படங்களோ அல்ல.",
    "disparusVigil": "2017 முதல், வவுனியா, கிளிநொச்சி, முல்லைத்தீவில், வடக்கின் தாய்மார்கள் புகைப்படங்களுடன் நிரந்தர விழிப்பு காக்கிறார்கள். சிலர் பதில் இன்றி இறந்துவிட்டனர்.",
    "patrieLede": "வடக்கும் கிழக்கும்: நகரங்கள், கடற்கரைகள், கோவில்கள், கடல்நீரேரிகள். வாழ்ந்த, பிரிந்த, சில நேரம் மீண்டும் திரும்பிய இடங்கள். அவற்றின் இடங்களையும் பெயர்களையும் நினைவில் கொள்ள ஒரு வரைபடம்.",
    "patrieHint": "நகரத்தைத் தொட்டு அதன் கதையை அறியுங்கள்",
    "aubeLede": "டொராண்டோ முதல் பாரிஸ் வரை, லண்டன் முதல் சிட்னி வரை, மொழியும் நினைவுச் செயல்களும் தலைமுறைகளைக் கடக்கின்றன. புலம்பெயர்வு நிலத்தின் தொடர்பையோ நீதிக்கான கோரிக்கையையோ முடிக்கவில்லை.",
    "aubeCities": "டொராண்டோ · லண்டன் · பாரிஸ் · சூரிச் · ஒஸ்லோ · சிட்னி · சென்னை · பெர்லின்",
    "aubeJusticeTitle": "நீதி எங்கே?",
    "aubeJustice": "ஐ.நா. OISL அறிக்கைகள், தொடர்ச்சியான மனித உரிமைகள் கவுன்சில் தீர்மானங்கள், கனடா உள்ளிட்ட நாடுகளின் இன அழிப்பு அங்கீகாரங்கள் — தேடல் தொடர்கிறது. பொறுப்பானவர்களை இன்னும் எந்த தீர்ப்பாயமும் விசாரிக்கவில்லை.",
    "epiTitle1": "நினைவு என்பது கடந்த காலத்தின் செயல் அல்ல.",
    "epiTitle2": "அது எதிர்காலத்தின் செயல்.",
    "epiText": "இந்த தளம் ஒரு விழிப்பு. தேதிகளும், இடங்களும், குரல்களும் தலைமுறைகளைக் கடக்கவே இது இருக்கிறது.",
    "epiFlameBtn": "நினைவுச் சுடர் ஏற்றுங்கள்",
    "epiFlameLit": "உங்கள் சுடர் எரிகிறது. அதை மேலும் சுமந்து செல்லுங்கள் — இந்தக் கதையைச் சொல்லுங்கள்.",
    "epiSources": "மேலும் அறிய",
    "epiTransmit": "அறிய வேண்டிய ஒருவருக்கு இந்த தளத்தை அனுப்புங்கள்."
  }
}
