import type { Localized, SourceId } from './research'

const tr = (fr: string, en: string, ta: string): Localized => ({ fr, en, ta })

export interface HistoryPassage {
  title: Localized
  text: Localized
  sources: SourceId[]
}

export const prabhakaran = {
  photoAlt: tr('Portrait de Velupillai Prabhakaran en uniforme et casquette.', 'Portrait of Velupillai Prabhakaran wearing a uniform and cap.', 'சீருடையும் தொப்பியும் அணிந்த வேலுப்பிள்ளை பிரபாகரனின் படம்.'),
  photoCaption: tr('Velupillai Prabhakaran, 2007.', 'Velupillai Prabhakaran, 2007.', 'வேலுப்பிள்ளை பிரபாகரன், 2007.'),
  lede: tr(
    'Velupillai Prabhakaran, aussi écrit Pirabakaran, fonde le LTTE en 1976 et le dirige jusqu’à sa mort en mai 2009. Son projet : un État indépendant, le Tamil Eelam, dans le nord et l’est de l’île.',
    'Velupillai Prabhakaran, also written Pirabakaran, founded the LTTE in 1976 and led it until his death in May 2009. His goal was an independent state, Tamil Eelam, in the island’s north and east.',
    'வேலுப்பிள்ளை பிரபாகரன் 1976-இல் தமிழீழ விடுதலைப் புலிகள் இயக்கத்தை நிறுவி, 2009 மே மாதம் இறக்கும் வரை வழிநடத்தினார். இலங்கையின் வடக்கிலும் கிழக்கிலும் சுதந்திரத் தமிழீழ அரசை அமைப்பதே அவரது இலக்காக இருந்தது.'),
  name: tr('Velupillai Prabhakaran', 'Velupillai Prabhakaran', 'வேலுப்பிள்ளை பிரபாகரன்'),
  label: tr('Parcours · 1954–2009', 'Life · 1954–2009', 'வாழ்க்கைப் பயணம் · 1954–2009'),
  acronym: tr('LTTE · Tigres de libération de l’Eelam tamoul', 'LTTE · Liberation Tigers of Tamil Eelam', 'LTTE · தமிழீழ விடுதலைப் புலிகள்'),
  timelineLabel: tr('Repères dans son parcours', 'Milestones in his life', 'வாழ்க்கையின் முக்கிய நிகழ்வுகள்'),
  timeline: [
    { date: '26.11.1954', text: tr('Naissance à Valvettithurai.', 'Born in Valvettithurai.', 'வல்வெட்டித்துறையில் பிறந்தார்.'), source: 'prabhakaran' as const },
    { date: '1976', text: tr('Fondation du LTTE.', 'The LTTE is founded.', 'விடுதலைப் புலிகள் இயக்கம் உருவாக்கப்பட்டது.'), source: 'conflict' as const },
    { date: '2002', text: tr('Cessez-le-feu avec le gouvernement, facilité par la Norvège.', 'A Norway-facilitated ceasefire with the government.', 'நோர்வேயின் அனுசரணையுடன் அரசாங்கத்துடன் போர்நிறுத்தம்.'), source: 'ceasefire' as const },
    { date: '2009', text: tr('Mort de Prabhakaran et défaite militaire du LTTE en mai.', 'Prabhakaran dies and the LTTE is militarily defeated in May.', 'மே மாதம் பிரபாகரன் இறந்தார்; புலிகள் இராணுவ ரீதியாகத் தோற்கடிக்கப்பட்டனர்.'), source: 'conflict' as const },
  ],
  passages: [
    {
      title: tr('La langue et les droits tamouls', 'Tamil language and rights', 'தமிழ் மொழியும் உரிமைகளும்'),
      text: tr('La question de la langue occupe une place centrale dans les revendications tamoules. En 1956, le Sinhala Only Act fait du cinghalais la seule langue officielle. Cette politique affecte l’accès des tamoulophones à l’administration et à l’emploi public. La reconnaissance du tamoul et l’égalité des droits deviennent des enjeux politiques majeurs.',
        'Language occupies a central place in Tamil political demands. In 1956, the Sinhala Only Act made Sinhala the sole official language. This policy affected Tamil speakers’ access to administration and public employment. Recognition of Tamil and equal rights became major political issues.',
        'தமிழர்களின் அரசியல் கோரிக்கைகளில் மொழி முக்கிய இடம் பெறுகிறது. 1956-இல் தனிச் சிங்களச் சட்டம் சிங்களத்தை ஒரே உத்தியோகபூர்வ மொழியாக்கியது. இக்கொள்கை தமிழ்பேசுவோர் நிர்வாகத்தை அணுகுவதையும் அரச வேலைவாய்ப்புகளையும் பாதித்தது. தமிழுக்கான அங்கீகாரமும் சம உரிமைகளும் முக்கிய அரசியல் கோரிக்கைகளாகின.'),
      sources: ['language'],
    },
    {
      title: tr('La revendication du Tamil Eelam', 'The demand for Tamil Eelam', 'தமிழீழக் கோரிக்கை'),
      text: tr('En mai 1976, la résolution de Vaddukoddai, adoptée par le TULF, revendique un État tamoul indépendant. Le LTTE, fondé la même année par Prabhakaran, poursuit cet objectif par la lutte armée. Prabhakaran dirige le mouvement durant la guerre. Le projet politique du Tamil Eelam s’inscrit aussi dans une histoire plus large de partis, de mobilisations et de débats tamouls.',
        'In May 1976, the Vaddukoddai Resolution adopted by the TULF called for an independent Tamil state. The LTTE, founded that year by Prabhakaran, pursued that goal through armed struggle. Prabhakaran led the movement during the war. The political project of Tamil Eelam also belongs to a broader history of Tamil parties, activism and debate.',
        '1976 மே மாதம் TULF ஏற்ற வட்டுக்கோட்டைத் தீர்மானம் சுதந்திரத் தமிழ் அரசைக் கோரியது. அதே ஆண்டில் பிரபாகரன் நிறுவிய புலிகள் இயக்கம் ஆயுதப் போராட்டத்தின் மூலம் அந்த இலக்கை நாடியது. போர்க்காலத்தில் அவர் இயக்கத்தை வழிநடத்தினார். தமிழீழ அரசியல் கோரிக்கை தமிழ்க் கட்சிகள், மக்கள் இயக்கங்கள், விவாதங்கள் ஆகியவற்றின் பரந்த வரலாற்றிலும் இடம்பெறுகிறது.'),
      sources: ['resolution', 'conflict'],
    },
    {
      title: tr('Le cessez-le-feu de 2002', 'The 2002 ceasefire', '2002 போர்நிறுத்தம்'),
      text: tr('En février 2002, Prabhakaran et le Premier ministre Ranil Wickremesinghe signent un accord de cessez-le-feu, facilité par la Norvège. Il prévoit l’arrêt des opérations offensives, la protection des civils et des mesures pour rétablir la vie quotidienne. Cet accord constitue un repère important dans les tentatives de règlement politique du conflit.',
        'In February 2002, Prabhakaran and Prime Minister Ranil Wickremesinghe signed a Norway-facilitated ceasefire agreement. It provided for an end to offensive operations, civilian protection and measures to restore everyday life. The agreement was an important milestone in efforts to reach a political settlement of the conflict.',
        '2002 பிப்ரவரியில் நோர்வேயின் அனுசரணையுடன் பிரபாகரனும் பிரதமர் ரணில் விக்கிரமசிங்கவும் போர்நிறுத்த ஒப்பந்தத்தில் கையெழுத்திட்டனர். தாக்குதல் நடவடிக்கைகளை நிறுத்துதல், பொதுமக்களைப் பாதுகாத்தல், இயல்பு வாழ்க்கையை மீட்டெடுத்தல் ஆகியவை அதில் இடம்பெற்றன. மோதலுக்கு அரசியல் தீர்வு காணும் முயற்சிகளில் இந்த ஒப்பந்தம் ஒரு முக்கிய நிகழ்வாகும்.'),
      sources: ['ceasefire'],
    },
  ] satisfies HistoryPassage[],
  closing: tr('La langue, les droits et la mémoire des familles traversent cette histoire. Le parcours de Prabhakaran en constitue un chapitre ; l’histoire du peuple tamoul se raconte aussi à travers ses voix, ses lieux et sa transmission entre les générations.',
    'Language, rights and family memory run through this history. Prabhakaran’s life forms one chapter; the history of the Tamil people is also told through their voices, places and transmission between generations.',
    'மொழி, உரிமைகள், குடும்பங்களின் நினைவுகள் இந்த வரலாற்றின் ஊடாகத் தொடர்கின்றன. பிரபாகரனின் வாழ்க்கை அதன் ஓர் அத்தியாயம்; தமிழ்மக்களின் வரலாறு அவர்களது குரல்கள், இடங்கள், தலைமுறைகளுக்கிடையேயான பரிமாற்றம் வழியாகவும் சொல்லப்படுகிறது.'),
}

export const maaveerar = {
  lede: tr('Le 27 novembre, des familles au pays et dans la diaspora se réunissent pour Maaveerar Naal, la journée de mémoire des combattants morts du LTTE. Une date publique, et des deuils intimes.',
    'On 27 November, families in the homeland and diaspora gather for Maaveerar Naal, the day commemorating fallen LTTE fighters. A public date, and deeply personal losses.',
    'நவம்பர் 27 அன்று தாயகத்திலும் புலம்பெயர் நாடுகளிலும் குடும்பங்கள் மாவீரர் நாளில் ஒன்றுகூடி இறந்த விடுதலைப் புலிப் போராளிகளை நினைவுகூர்கின்றன. இது பொதுவான நினைவு நாளும் தனிப்பட்ட துயரங்களைச் சுமக்கும் நாளுமாகும்.'),
  month: tr('Novembre', 'November', 'நவம்பர்'),
  meaning: tr('Maaveerar Naal · Journée des grands héros', 'Maaveerar Naal · Great Heroes’ Day', 'மாவீரர் நாள்'),
  origin: tr('Première commémoration : 1989', 'First commemoration: 1989', 'முதல் நினைவேந்தல்: 1989'),
  passages: [
    {
      title: tr('Pourquoi le 27 novembre ?', 'Why 27 November?', 'ஏன் நவம்பர் 27?'),
      text: tr('Le LTTE institue cette journée en 1989. Elle renvoie au 27 novembre 1982, date de la mort de Shankar, considéré comme son premier combattant mort. Le rendez-vous annuel donne une date commune au souvenir des membres du mouvement.',
        'The LTTE established the day in 1989. It marks 27 November 1982, when Shankar, remembered as its first fallen fighter, died. The annual observance created a shared date to remember members of the movement.',
        '1989-இல் புலிகள் இந்த நாளை நிறுவினர். இயக்கத்தின் முதல் உயிரிழந்த போராளியாக நினைவுகூரப்படும் சங்கர் இறந்த 1982 நவம்பர் 27-ஐ இது குறிக்கிறது. இயக்க உறுப்பினர்களை நினைவுகூர ஒரு பொதுவான ஆண்டு நாளாக இது அமைந்தது.'),
      sources: ['memorialArchive'],
    },
    {
      title: tr('Les gestes du souvenir', 'Acts of remembrance', 'நினைவேந்தல் முறைகள்'),
      text: tr('Des lampes, des fleurs et des portraits accompagnent les cérémonies. Les familles se recueillent dans les Thuyilum Illam, les cimetières de combattants, ou dans les lieux de rassemblement de la diaspora. Le rapport de PEARL décrit l’allumage traditionnel de la flamme à 18 h 07, heure associée à la mort de Shankar.',
        'Lamps, flowers and portraits accompany the ceremonies. Families gather at Thuyilum Illam, the fighters’ cemeteries, or at diaspora meeting places. PEARL’s report describes the traditional lighting of the flame at 18:07, the time associated with Shankar’s death.',
        'விளக்குகள், மலர்கள், உருவப்படங்கள் நினைவேந்தலில் இடம்பெறுகின்றன. குடும்பங்கள் மாவீரர் துயிலும் இல்லங்களிலோ புலம்பெயர் சமூக அரங்குகளிலோ கூடுகின்றன. சங்கர் இறந்த நேரத்துடன் தொடர்புடைய மாலை 6:07 மணிக்குச் சுடரேற்றும் வழக்கத்தை PEARL அறிக்கை விவரிக்கிறது.'),
      sources: ['memorialSites'],
    },
    {
      title: tr('Pouvoir faire son deuil', 'Being able to mourn', 'துயரை வெளிப்படுத்தும் உரிமை'),
      text: tr('Après la guerre, des cimetières ont été détruits et des commémorations entravées. PEARL documente ces atteintes aux lieux de mémoire ; Human Rights Watch rapporte aussi des intimidations lors du souvenir des morts. Pour les proches, préserver un nom ou une photographie reste une manière de garder une place à l’absent.',
        'After the war, cemeteries were destroyed and commemorations obstructed. PEARL documents damage to memorial sites; Human Rights Watch also reports intimidation surrounding remembrance of the dead. For relatives, keeping a name or photograph preserves a place for someone who is absent.',
        'போருக்குப் பின் கல்லறைகள் அழிக்கப்பட்டன; நினைவேந்தல்கள் தடுக்கப்பட்டன. நினைவிடங்கள் மீதான அழிவுகளை PEARL ஆவணப்படுத்துகிறது; இறந்தவர்களை நினைவுகூரும்போது ஏற்பட்ட அச்சுறுத்தல்களை Human Rights Watch-உம் பதிவு செய்கிறது. உறவுகளுக்கு ஒரு பெயரையோ படத்தையோ பேணுவது இல்லாதவருக்கான இடத்தைத் தக்கவைப்பதாகும்.'),
      sources: ['memorialSites', 'maaveerar'],
    },
  ] satisfies HistoryPassage[],
  datesTitle: tr('Trois dates, trois repères', 'Three dates to distinguish', 'வேறுபடுத்த வேண்டிய மூன்று நாட்கள்'),
  dates: [
    { date: tr('26 novembre', '26 November', 'நவம்பர் 26'), text: tr('Anniversaire de naissance de Prabhakaran.', 'Prabhakaran’s birthday.', 'பிரபாகரனின் பிறந்தநாள்.'), href: '#prabhakaran' },
    { date: tr('27 novembre', '27 November', 'நவம்பர் 27'), text: tr('Maaveerar Naal : souvenir des combattants morts du LTTE.', 'Maaveerar Naal: remembrance of fallen LTTE fighters.', 'மாவீரர் நாள்: இறந்த புலிப் போராளிகளின் நினைவு.'), href: '#maaveerar' },
    { date: tr('18 mai', '18 May', 'மே 18'), text: tr('Mullivaikkal : mémoire de la fin de la guerre et des victimes, notamment civiles.', 'Mullivaikkal: remembering the war’s end and its victims, especially civilians.', 'முள்ளிவாய்க்கால்: போரின் முடிவையும் குறிப்பாகப் பொதுமக்கள் உள்ளிட்ட பாதிக்கப்பட்டவர்களையும் நினைவுகூர்தல்.'), href: '#mullivaikkal' },
  ],
  link: tr('Comprendre Maaveerar Naal', 'Understanding Maaveerar Naal', 'மாவீரர் நாளைப் புரிந்துகொள்ள'),
}
