export type Lang = 'fr' | 'en' | 'ta'
export type Category = 'origins' | 'oppression' | 'resistance' | 'memory' | 'international'

export interface TimelineEvent {
  year: string
  cat: Category
  title: Record<Lang, string>
  desc: Record<Lang, string>
  detail: Record<Lang, string>
}

// Sources and qualification notes: data/research.ts. Preserve ordering for chapter references.
export const events: TimelineEvent[] = [
  {
    "year": "Antiquité",
    "cat": "origins",
    "title": {
      "fr": "Une histoire ancienne",
      "en": "An ancient history",
      "ta": "ஒரு தொன்மையான வரலாறு"
    },
    "desc": {
      "fr": "Les liens entre l’île et le sud de l’Inde remontent à l’Antiquité. La présence tamoule s’inscrit dans cette histoire de peuplement, de langues et d’échanges.",
      "en": "Connections between the island and southern India reach back to antiquity. Tamil presence belongs to this history of settlement, languages and exchange.",
      "ta": "தீவுக்கும் தென்னிந்தியாவுக்கும் இடையிலான தொடர்புகள் தொன்மையானவை. தமிழர் இருப்பு குடியேற்றம், மொழி, பரிமாற்றங்களின் வரலாற்றில் வேரூன்றியுள்ளது."
    },
    "detail": {
      "fr": "Le tamoul, les échanges maritimes et les traditions religieuses relient depuis longtemps les deux rives. Les origines des communautés de l’île font l’objet de recherches et de débats historiques ; une date unique ne résume pas leur formation. La profondeur de cette histoire se retrouve dans les lieux, les textes et les pratiques transmis entre générations.",
      "en": "Tamil, maritime exchange and religious traditions have long connected the two shores. The origins of the island’s communities remain subjects of historical research and debate; no single date captures their formation. Places, texts and practices carry this history between generations.",
      "ta": "தமிழ் மொழி, கடல்வழி வணிகம், சமய மரபுகள் இரு கரைகளையும் நீண்டகாலமாக இணைக்கின்றன. தீவின் சமூகங்களின் தோற்றம் வரலாற்று ஆய்வுக்கும் விவாதத்திற்கும் உரியது; ஒரே தேதியால் அதைச் சுருக்க முடியாது. இடங்களும் நூல்களும் மரபுகளும் இந்த வரலாற்றைத் தலைமுறைகளுக்குக் கொண்டு செல்கின்றன."
    }
  },
  {
    "year": "XIIIᵉ s. — 1619",
    "cat": "origins",
    "title": {
      "fr": "Le royaume de Jaffna",
      "en": "The kingdom of Jaffna",
      "ta": "யாழ்ப்பாண இராச்சியம்"
    },
    "desc": {
      "fr": "Au Moyen Âge, un royaume tamoul se développe au Nord, autour de Nallur. La conquête portugaise de 1619 met fin à son indépendance.",
      "en": "In the medieval period a Tamil kingdom developed in the North, centred on Nallur. The Portuguese conquest of 1619 ended its independence.",
      "ta": "இடைக்காலத்தில் நல்லூரை மையமாகக் கொண்டு வடக்கில் ஒரு தமிழ் இராச்சியம் வளர்ந்தது. 1619 போர்த்துக்கேய வெற்றி அதன் சுதந்திரத்தை முடிவுக்குக் கொண்டுவந்தது."
    },
    "detail": {
      "fr": "Le royaume de Jaffna, associé à la dynastie des Aryacakravarti, s’affirme à partir du XIIIᵉ siècle. Nallur en est le centre royal. Son histoire, ses monnaies et ses institutions témoignent d’un pouvoir tamoul distinct, dont les limites et l’influence ont varié. La conquête de 1619 ouvre une nouvelle période de domination européenne.",
      "en": "The kingdom of Jaffna, associated with the Aryacakravarti dynasty, emerged from the thirteenth century. Nallur was its royal centre. Its history, coins and institutions attest to a distinct Tamil polity, whose boundaries and influence changed over time. The conquest of 1619 opened a new period of European rule.",
      "ta": "ஆரியச்சக்கரவர்த்தி வம்சத்துடன் தொடர்புடைய யாழ்ப்பாண இராச்சியம் பதின்மூன்றாம் நூற்றாண்டிலிருந்து வளர்ந்தது. நல்லூர் அதன் அரச மையமாக இருந்தது. அதன் நாணயங்களும் நிறுவனங்களும் தனித்த தமிழ் அரசியலைச் சுட்டுகின்றன. எல்லைகளும் செல்வாக்கும் காலத்துடன் மாறின. 1619 வெற்றி ஐரோப்பிய ஆட்சியின் புதிய காலத்தைத் தொடங்கியது."
    }
  },
  {
    "year": "1833",
    "cat": "oppression",
    "title": {
      "fr": "Unification coloniale britannique",
      "en": "British colonial unification",
      "ta": "பிரிட்டிஷ் ஒன்றிணைப்பு"
    },
    "desc": {
      "fr": "Les réformes Colebrooke-Cameron centralisent l’administration coloniale de l’île.",
      "en": "The Colebrooke-Cameron reforms centralised the island’s colonial administration.",
      "ta": "கோல்புரூக்–கமரன் சீர்திருத்தங்கள் தீவின் காலனித்துவ நிர்வாகத்தை மையப்படுத்தின."
    },
    "detail": {
      "fr": "En 1833, l’administration britannique réorganise l’île sous un cadre centralisé. Des conseils exécutif et législatif sont créés. Ce pouvoir colonial ne repose pas sur le consentement démocratique des populations. La résolution tamoule de Vaddukoddai reviendra sur cette unification comme un tournant de la perte d’autonomie.",
      "en": "In 1833, British rule reorganised the island under a centralised framework and established executive and legislative councils. Colonial authority did not rest on the populations’ democratic consent. The Tamil Vaddukoddai Resolution would later identify this unification as a turning point in the loss of autonomy.",
      "ta": "1833-இல் பிரித்தானியர் தீவின் நிர்வாகத்தை மையப்படுத்தி, நிர்வாக மற்றும் சட்டமன்றச் சபைகளை அமைத்தனர். காலனித்துவ அதிகாரம் மக்களின் ஜனநாயக ஒப்புதலை அடிப்படையாகக் கொண்டிருக்கவில்லை. பின்னர் வட்டுக்கோட்டை தீர்மானம் இந்த ஒன்றிணைப்பைத் தன்னாட்சி இழப்பின் திருப்பமாகக் குறிப்பிட்டது."
    }
  },
  {
    "year": "1948 — 1949",
    "cat": "oppression",
    "title": {
      "fr": "Indépendance & Citizenship Act",
      "en": "Independence & Citizenship Act",
      "ta": "சுதந்திரம் & குடியுரிமை சட்டம்"
    },
    "desc": {
      "fr": "Après l’indépendance du 4 février 1948, les lois de citoyenneté et de vote excluent une grande partie des Tamouls d’origine indienne des plantations.",
      "en": "After independence on 4 February 1948, citizenship and voting laws excluded many plantation Tamils of Indian origin.",
      "ta": "1948 பிப்ரவரி 4 சுதந்திரத்தின் பின்னர் குடியுரிமை மற்றும் வாக்குரிமைச் சட்டங்கள் இந்திய வம்சாவளித் தோட்டத் தமிழர்கள் பலரை விலக்கின."
    },
    "detail": {
      "fr": "Les critères des lois de 1948 et 1949 laissent des centaines de milliers de personnes apatrides et privées de représentation électorale. Elles travaillent dans les plantations, souvent depuis plusieurs générations. Cette histoire concerne particulièrement les Tamouls des montagnes, dont le parcours diffère de celui des Tamouls du Nord et de l’Est. Des lois ultérieures, notamment en 2003, permettront de résoudre une grande partie de cette apatridie.",
      "en": "The requirements introduced in 1948 and 1949 left hundreds of thousands stateless and without electoral representation. Many families had worked on the plantations for generations. This particularly affected Hill Country Tamils, whose history differs from that of Northern and Eastern Tamils. Later legislation, notably in 2003, addressed much of this statelessness.",
      "ta": "1948 மற்றும் 1949 சட்டங்களின் நிபந்தனைகள் இலட்சக்கணக்கானவர்களை நாடற்றவர்களாகவும் வாக்குரிமையற்றவர்களாகவும் ஆக்கின. பல குடும்பங்கள் தலைமுறைகளாகத் தோட்டங்களில் உழைத்திருந்தன. இது மலையகத் தமிழர்களைச் சிறப்பாகப் பாதித்தது; அவர்களின் வரலாறு வடக்கு, கிழக்குத் தமிழர்களிடமிருந்து வேறுபடுகிறது. 2003 உள்ளிட்ட பின்னைய சட்டங்கள் இந்த நாடற்ற நிலையின் பெரும்பகுதியைத் தீர்க்க உதவின."
    }
  },
  {
    "year": "1956",
    "cat": "oppression",
    "title": {
      "fr": "Sinhala Only Act",
      "en": "Sinhala Only Act",
      "ta": "சிங்களம் மட்டும் சட்டம்"
    },
    "desc": {
      "fr": "Le Sinhala Only Act fait du cinghalais la seule langue officielle, à la place de l’anglais. Le tamoul n’obtient pas un statut égal.",
      "en": "The Sinhala Only Act replaced English with Sinhala as the sole official language. Tamil did not receive equal status.",
      "ta": "சிங்களம் மட்டும் சட்டம் ஆங்கிலத்திற்குப் பதிலாகச் சிங்களத்தை ஒரே ஆட்சி மொழியாக்கியது. தமிழுக்குச் சம அந்தஸ்து வழங்கப்படவில்லை."
    },
    "detail": {
      "fr": "La loi n° 33 de 1956 impose le cinghalais comme langue officielle. Pour les personnes de langue tamoule, l’accès aux services publics et aux emplois administratifs devient plus difficile. Les protestations non violentes conduites par S. J. V. Chelvanayakam sont attaquées. Le tamoul sera reconnu comme langue officielle par le treizième amendement de 1987 ; les inégalités vécues ne disparaissent pas pour autant.",
      "en": "Act No. 33 of 1956 made Sinhala the official language. Tamil speakers faced new barriers to public services and government employment. Nonviolent protests led by S. J. V. Chelvanayakam were attacked. Tamil gained official-language status under the thirteenth amendment in 1987; that legal change did not itself end inequalities in daily life.",
      "ta": "1956-இன் 33ஆம் இலக்கச் சட்டம் சிங்களத்தை ஆட்சி மொழியாக்கியது. தமிழ்பேசுவோர் அரச சேவைகளையும் வேலைகளையும் பெறுவதில் தடைகளை எதிர்கொண்டனர். எஸ். ஜே. வி. செல்வநாயகம் வழிநடத்திய அறவழிப் போராட்டங்கள் தாக்கப்பட்டன. 1987-இன் பதின்மூன்றாம் திருத்தம் தமிழுக்கு ஆட்சி மொழி அந்தஸ்து வழங்கியது; அன்றாடச் சமத்துவமின்மை அதனால் மட்டும் முடிவுறவில்லை."
    }
  },
  {
    "year": "1958 · 1977 · 1981",
    "cat": "oppression",
    "title": {
      "fr": "Pogroms anti-tamouls",
      "en": "Anti-Tamil pogroms",
      "ta": "தமிழ் எதிர்ப்பு படுகொலைகள்"
    },
    "desc": {
      "fr": "Des violences répétées frappent les civils tamouls. En 1981, l’incendie de la bibliothèque de Jaffna détruit une part irremplaçable du patrimoine écrit.",
      "en": "Repeated violence struck Tamil civilians. In 1981, the burning of Jaffna Library destroyed irreplaceable written heritage.",
      "ta": "தொடர்ச்சியான வன்முறை தமிழ் பொதுமக்களைத் தாக்கியது. 1981-இல் யாழ் நூலக எரிப்பு ஈடுசெய்ய முடியாத எழுத்துப் பாரம்பரியத்தை அழித்தது."
    },
    "detail": {
      "fr": "Après les violences de 1958 et de 1977, Jaffna connaît de nouvelles attaques à la fin de mai 1981. Dans la nuit du 31 mai au 1er juin, la bibliothèque est incendiée par une foule comprenant des policiers. Environ 97 000 livres et manuscrits sont perdus. Le bâtiment sera reconstruit ; des exemplaires uniques ne pourront jamais être remplacés.",
      "en": "After the violence of 1958 and 1977, renewed attacks struck Jaffna in late May 1981. On the night of 31 May–1 June, a mob including police officers burned the library. Around 97,000 books and manuscripts were lost. The building would be rebuilt; unique works could never be replaced.",
      "ta": "1958 மற்றும் 1977 வன்முறைகளுக்குப் பின்னர், 1981 மே இறுதியில் யாழ்ப்பாணம் மீண்டும் தாக்கப்பட்டது. மே 31–ஜூன் 1 இரவில் காவல்துறையினரும் அடங்கிய கும்பல் நூலகத்தை எரித்தது. சுமார் 97,000 நூல்களும் கையெழுத்துப் பிரதிகளும் அழிந்தன. கட்டிடம் மீண்டும் எழுப்பப்பட்டது; தனித்த பிரதிகள் மீட்கப்பட முடியாதவை."
    }
  },
  {
    "year": "14 mai 1976",
    "cat": "resistance",
    "title": {
      "fr": "Résolution de Vaddukoddai",
      "en": "Vaddukoddai Resolution",
      "ta": "வட்டுக்கோட்டை தீர்மானம்"
    },
    "desc": {
      "fr": "Le Tamil United Liberation Front, réuni à Vaddukoddai, adopte démocratiquement la revendication d'un État tamoul indépendant : le Tamil Eelam.",
      "en": "The Tamil United Liberation Front, meeting at Vaddukoddai, democratically adopts the call for an independent Tamil state: Tamil Eelam.",
      "ta": "வட்டுக்கோட்டை தீர்மானம் — சுதந்திர தமிழீழம்."
    },
    "detail": {
      "fr": "Le 14 mai 1976, à Vaddukoddai (district de Jaffna), le Tamil United Liberation Front (TULF), coalition des principaux partis tamouls, adopte par consensus la « Résolution de Vaddukoddai ». Le texte constate l'échec de toutes les voies politiques pour obtenir l'égalité et la dignité dans le cadre de l'État sri-lankais. Il proclame l'aspiration à un État souverain — Tamil Eelam — sur les territoires traditionnels du Nord et de l'Est. Aux élections de 1977, le TULF se présente sur cette plateforme et remporte une majorité écrasante dans les circonscriptions tamoules : c'est le mandat démocratique de l'autodétermination tamoule, jamais reconnu par les gouvernements successifs.",
      "en": "On 14 May 1976, in Vaddukoddai (Jaffna District), the Tamil United Liberation Front (TULF), a coalition of the main Tamil parties, adopted by consensus the 'Vaddukoddai Resolution'. The text records the failure of all political avenues to obtain equality and dignity within the Sri Lankan state. It proclaims the aspiration to a sovereign state — Tamil Eelam — over the traditional territories of the North and East. At the 1977 elections, the TULF ran on this platform and won an overwhelming majority in Tamil constituencies: this was the democratic mandate of Tamil self-determination, never recognised by successive governments.",
      "ta": "1976 மே 14 அன்று, வட்டுக்கோட்டையில் தமிழீழம் கோரிக்கை அதிகாரப்பூர்வமாக வெளியிடப்பட்டது."
    }
  },
  {
    "year": "07.1983",
    "cat": "memory",
    "title": {
      "fr": "Black July — கறுப்பு ஜூலை",
      "en": "Black July",
      "ta": "கறுப்பு ஜூலை"
    },
    "desc": {
      "fr": "Des foules attaquent les Tamouls à Colombo et dans d’autres villes. Des familles perdent leurs proches, leur maison et leur sécurité.",
      "en": "Mobs attacked Tamils in Colombo and other towns. Families lost relatives, homes and their sense of safety.",
      "ta": "கொழும்பிலும் பிற நகரங்களிலும் கும்பல்கள் தமிழர்களைத் தாக்கின. குடும்பங்கள் உறவுகளையும் வீடுகளையும் பாதுகாப்பையும் இழந்தன."
    },
    "detail": {
      "fr": "Après une embuscade du LTTE ayant tué treize soldats le 23 juillet, les attaques anti-tamoules s’étendent. Mais les victimes civiles ne sont pas responsables de cette attaque : des maisons et commerces sont ciblés en raison de l’identité de leurs occupants. Les bilans varient de plusieurs centaines à environ 3 000 morts. Ces journées accélèrent l’exode et la guerre.",
      "en": "After an LTTE ambush killed thirteen soldiers on 23 July, anti-Tamil attacks spread. The civilian victims were not responsible for that attack: homes and businesses were targeted because of their occupants’ identity. Death estimates range from several hundred to around 3,000. These days accelerated both exile and war.",
      "ta": "ஜூலை 23-இல் பதின்மூன்று படையினரைக் கொன்ற புலிகளின் தாக்குதலுக்குப் பின்னர் தமிழ் எதிர்ப்பு வன்முறை பரவியது. பொதுமக்கள் அந்தத் தாக்குதலுக்குப் பொறுப்பானவர்கள் அல்ல; அவர்களின் அடையாளத்திற்காக வீடுகளும் வணிகங்களும் குறிவைக்கப்பட்டன. உயிரிழப்பு மதிப்பீடுகள் பல நூறிலிருந்து சுமார் 3,000 வரை வேறுபடுகின்றன. இந்த நாட்கள் வெளியேற்றத்தையும் போரையும் தீவிரப்படுத்தின."
    }
  },
  {
    "year": "1983 — 2002",
    "cat": "resistance",
    "title": {
      "fr": "La guerre et les tentatives de paix",
      "en": "War and attempts at peace",
      "ta": "போரும் அமைதி முயற்சிகளும்"
    },
    "desc": {
      "fr": "Le conflit s’étend. Le LTTE contrôle une partie du Nord et de l’Est. En février 2002, un cessez-le-feu est signé sous médiation norvégienne.",
      "en": "The conflict expanded. The LTTE controlled parts of the North and East. A Norwegian-mediated ceasefire was signed in February 2002.",
      "ta": "போர் விரிவடைந்தது. வடக்கு, கிழக்கின் பகுதிகள் புலிகளின் கட்டுப்பாட்டில் இருந்தன. 2002 பிப்ரவரியில் நோர்வே மத்தியஸ்தத்தில் போர்நிறுத்தம் கையெழுத்தானது."
    },
    "detail": {
      "fr": "Les aspirations tamoules à l’autodétermination prennent des formes politiques et armées différentes. Le LTTE devient le principal mouvement armé et établit une administration dans les territoires qu’il contrôle. La guerre détruit des vies civiles dans toutes les communautés. Le cessez-le-feu de 2002 ouvre un espoir qui ne se transforme pas en paix durable.",
      "en": "Tamil aspirations to self-determination took different political and armed forms. The LTTE became the dominant armed movement and established an administration in areas it controlled. War devastated civilian lives across communities. The 2002 ceasefire offered hope that did not become lasting peace.",
      "ta": "தமிழரின் சுயநிர்ணயக் கோரிக்கை வெவ்வேறு அரசியல், ஆயுத வடிவங்களை எடுத்தது. புலிகள் பிரதான ஆயுத இயக்கமாகி தமது கட்டுப்பாட்டுப் பகுதிகளில் நிர்வாகத்தை அமைத்தனர். போர் எல்லாச் சமூகங்களின் பொதுமக்களையும் பாதித்தது. 2002 போர்நிறுத்தத்தின் நம்பிக்கை நிலையான அமைதியாக மாறவில்லை."
    }
  },
  {
    "year": "05.2009",
    "cat": "memory",
    "title": {
      "fr": "Mullivaikkal",
      "en": "Mullivaikkal",
      "ta": "முள்ளிவாய்க்கால்"
    },
    "desc": {
      "fr": "La phase finale de la guerre enferme les civils dans un espace toujours plus réduit. Les zones déclarées sans tirs sont bombardées.",
      "en": "The final phase of war trapped civilians in an ever smaller space. Declared no-fire zones were shelled.",
      "ta": "போரின் இறுதிக்கட்டத்தில் பொதுமக்கள் சுருங்கிவரும் இடத்தில் சிக்கினர். பாதுகாப்பு வலயங்கள் எறிகணைத் தாக்குதலுக்கு உள்ளாயின."
    },
    "detail": {
      "fr": "À Mullivaikkal, le manque de nourriture, les bombardements et l’effondrement des soins se conjuguent. Le rapport de l’ONU de 2011 examine des estimations pouvant atteindre 40 000 morts civils durant les derniers mois du conflit, sans établir un bilan définitif. Les enquêtes décrivent les bombardements gouvernementaux. La protection des personnes civiles demeurait une obligation.",
      "en": "At Mullivaikkal, hunger, shelling and the collapse of medical care converged. The 2011 UN report considered estimates of as many as 40,000 civilian deaths during the conflict’s final months, without establishing a definitive toll. Investigations describe government shelling. The protection of civilians remained an obligation.",
      "ta": "முள்ளிவாய்க்காலில் பசி, எறிகணைத் தாக்குதல், மருத்துவச் சேவைகளின் சிதைவு ஒன்றுசேர்ந்தன. 2011 ஐ.நா. அறிக்கை இறுதி மாதங்களில் 40,000 வரை பொதுமக்கள் இறந்திருக்கலாம் என்ற மதிப்பீடுகளை ஆய்வு செய்தது; இறுதியான எண்ணிக்கையை நிறுவவில்லை. அரசின் எறிகணைத் தாக்குதல்களை விசாரணைகள் விவரிக்கின்றன. பொதுமக்களைப் பாதுகாப்பது ஒரு கடமையாக இருந்தது."
    }
  },
  {
    "year": "Depuis 2009",
    "cat": "memory",
    "title": {
      "fr": "Les disparus — காணாமல் ஆனோர்",
      "en": "The disappeared",
      "ta": "காணாமல் ஆனோர்"
    },
    "desc": {
      "fr": "Des personnes disparaissent après leur arrestation ou leur reddition. Leurs familles cherchent toujours la vérité.",
      "en": "People disappeared after arrest or surrender. Their families continue to seek the truth.",
      "ta": "கைது அல்லது சரணடைதலுக்குப் பின்னர் மக்கள் காணாமல் ஆக்கப்பட்டனர். குடும்பங்கள் உண்மையைத் தேடுகின்றன."
    },
    "detail": {
      "fr": "Les disparitions forcées traversent plusieurs décennies de l’histoire de Sri Lanka. Des familles tamoules disent avoir vu leurs proches se rendre aux forces armées en mai 2009 avant de perdre toute trace d’eux. Depuis 2017, des mobilisations continues dans le Nord et l’Est réclament leur sort et leur lieu de détention. Le rapport du HCDH de 2024 décrit les conséquences de cette attente, les obstacles à la justice et le besoin de rendre des comptes.",
      "en": "Enforced disappearances span decades of Sri Lanka’s history. Tamil families describe seeing relatives surrender to the armed forces in May 2009 before losing all trace of them. Since 2017, sustained protests in the North and East have demanded their fate and whereabouts. OHCHR’s 2024 report describes the effects of this waiting, barriers to justice and the need for accountability.",
      "ta": "இலங்கையில் வலிந்து காணாமலாக்கப்படுதல் பல தசாப்தங்களைத் தாண்டுகிறது. 2009 மேயில் உறவினர்கள் படையினரிடம் சரணடைந்ததைப் பார்த்த பின்னர் அவர்களைப் பற்றிய தகவலே இல்லை எனத் தமிழ் குடும்பங்கள் கூறுகின்றன. 2017 முதல் வடக்கு, கிழக்கில் தொடரும் போராட்டங்கள் அவர்களின் நிலையும் இருப்பிடமும் தெரிய வேண்டும் எனக் கோருகின்றன. 2024 மனித உரிமைகள் உயர்ஸ்தானிகர் அறிக்கை இந்தக் காத்திருப்பின் விளைவுகளையும் நீதிக்கான தடைகளையும் விவரிக்கிறது."
    }
  },
  {
    "year": "L’exil et la transmission",
    "cat": "international",
    "title": {
      "fr": "Diaspora tamoule mondiale",
      "en": "Global Tamil diaspora",
      "ta": "உலகத் தமிழ் புலம்பெயர்வு"
    },
    "desc": {
      "fr": "De Toronto à Paris, de Londres à Sydney, des communautés tamoules font vivre la langue et la mémoire.",
      "en": "From Toronto to Paris, London to Sydney, Tamil communities sustain language and memory.",
      "ta": "டொராண்டோ முதல் பாரிஸ், லண்டன் முதல் சிட்னி வரை தமிழ் சமூகங்கள் மொழியையும் நினைவையும் காக்கின்றன."
    },
    "detail": {
      "fr": "Les violences de 1983, la guerre et les déplacements successifs ont conduit de nombreuses familles hors de l’île. L’exil transforme les lieux de vie, sans effacer les liens avec le pays. Écoles de langue, associations, œuvres artistiques et commémorations permettent la transmission. Les identités, les opinions et les parcours de cette diaspora sont multiples ; aucun chiffre mondial unique ni aucune organisation ne les résume.",
      "en": "The violence of 1983, war and successive displacements took many families beyond the island. Exile changed where people lived without erasing ties to home. Language schools, associations, art and commemorations support transmission. The diaspora contains many identities, views and experiences; no single global count or organisation can stand for all of them.",
      "ta": "1983 வன்முறை, போர், தொடர்ச்சியான இடப்பெயர்வுகள் பல குடும்பங்களைத் தீவிற்கு வெளியே கொண்டு சென்றன. புலம்பெயர்வு வாழிடத்தை மாற்றியது; தாயக உறவுகளை அழிக்கவில்லை. மொழிப் பள்ளிகள், அமைப்புகள், கலை, நினைவேந்தல்கள் மரபைக் கடத்துகின்றன. புலம்பெயர் சமூகத்தின் அடையாளங்களும் கருத்துகளும் அனுபவங்களும் பலவகையானவை; ஓர் எண்ணிக்கையோ ஓர் அமைப்போ அனைத்தையும் பிரதிநிதித்துவப்படுத்தாது."
    }
  },
  {
    "year": "2015 · 2022 · 2024",
    "cat": "international",
    "title": {
      "fr": "L'ONU & la quête de justice",
      "en": "The UN & the quest for justice",
      "ta": "ஐ.நா. மற்றும் நீதிக்கான தேடல்"
    },
    "desc": {
      "fr": "Les enquêtes, les reconnaissances et la mobilisation des familles poursuivent la quête de justice.",
      "en": "Investigations, recognitions and family campaigns continue the search for justice.",
      "ta": "விசாரணைகள், அங்கீகாரங்கள், குடும்பங்களின் இயக்கங்கள் நீதிக்கான தேடலைத் தொடர்கின்றன."
    },
    "detail": {
      "fr": "En 2015, l’enquête OISL décrit des violations susceptibles de constituer des crimes de guerre et des crimes contre l’humanité et recommande un tribunal hybride. Le 18 mai 2022, la Chambre des communes du Canada reconnaît le génocide des Tamouls. Il s’agit d’une reconnaissance parlementaire. En 2024, le HCDH publie un rapport consacré aux disparitions forcées. Ces documents ont des portées différentes ; ils nourrissent la demande de vérité et de justice.",
      "en": "In 2015, OISL described violations that may amount to war crimes and crimes against humanity and recommended a hybrid court. On 18 May 2022, Canada’s House of Commons recognised the genocide of Tamils. This is a parliamentary recognition. In 2024, OHCHR published a report on enforced disappearances. These documents have different scopes; each contributes to demands for truth and justice.",
      "ta": "2015 OISL விசாரணை போர்க்குற்றங்களாகவும் மனிதகுலத்திற்கு எதிரான குற்றங்களாகவும் அமையக்கூடிய மீறல்களை விவரித்து கலப்பு நீதிமன்றத்தைப் பரிந்துரைத்தது. 2022 மே 18-இல் கனடாவின் பொதுச்சபை தமிழர் இனப்படுகொலையை அங்கீகரித்தது. இது நாடாளுமன்ற அங்கீகாரம். 2024-இல் மனித உரிமைகள் உயர்ஸ்தானிகர் காணாமலாக்கப்படுதல் குறித்த அறிக்கையை வெளியிட்டார். இவற்றின் நோக்கங்கள் வேறுபடுகின்றன; உண்மைக்கும் நீதிக்குமான கோரிக்கையை வலுப்படுத்துகின்றன."
    }
  },
  {
    "year": "1505 — 1948",
    "cat": "origins",
    "title": {
      "fr": "Trois colonisations européennes",
      "en": "Three European colonisations",
      "ta": "மூன்று ஐரோப்பிய காலனித்துவங்கள்"
    },
    "desc": {
      "fr": "Portugais, Hollandais et Britanniques étendent successivement leur pouvoir sur l’île.",
      "en": "Portuguese, Dutch and British rule extended over the island in succession.",
      "ta": "போர்த்துக்கேயர், ஒல்லாந்தர், பிரித்தானியர் அடுத்தடுத்து தீவில் தமது அதிகாரத்தை விரிவாக்கினர்."
    },
    "detail": {
      "fr": "Les Portugais arrivent au début du XVIᵉ siècle et conquièrent Jaffna en 1619. Les Hollandais les remplacent dans les territoires côtiers au XVIIᵉ siècle. Les Britanniques prennent ces possessions en 1796, puis le royaume de Kandy en 1815. L’économie de plantation transforme l’île et entraîne l’arrivée de travailleurs depuis l’Inde. Ceylan devient indépendant le 4 février 1948.",
      "en": "The Portuguese arrived in the early sixteenth century and conquered Jaffna in 1619. The Dutch replaced them in coastal territories in the seventeenth century. The British took those possessions in 1796 and the kingdom of Kandy in 1815. The plantation economy transformed the island and brought workers from India. Ceylon became independent on 4 February 1948.",
      "ta": "பதினாறாம் நூற்றாண்டின் தொடக்கத்தில் வந்த போர்த்துக்கேயர் 1619-இல் யாழ்ப்பாணத்தைக் கைப்பற்றினர். பதினேழாம் நூற்றாண்டில் கடற்கரைப் பகுதிகளில் ஒல்லாந்தர் அவர்களை மாற்றினர். 1796-இல் பிரித்தானியர் அப்பகுதிகளையும் 1815-இல் கண்டியையும் கைப்பற்றினர். தோட்டப் பொருளாதாரம் தீவை மாற்றி இந்தியத் தொழிலாளர்களைக் கொண்டு வந்தது. 1948 பிப்ரவரி 4-இல் இலங்கை சுதந்திரம் பெற்றது."
    }
  },
  {
    "year": "1976 — 2009",
    "cat": "resistance",
    "title": {
      "fr": "Le LTTE & Velupillai Prabhakaran",
      "en": "The LTTE & Velupillai Prabhakaran",
      "ta": "விடுதலைப் புலிகள் & வேலுப்பிள்ளை பிரபாகரன்"
    },
    "desc": {
      "fr": "Fondé en 1976 sous la direction de Velupillai Prabhakaran, le LTTE devient le principal mouvement armé de la lutte pour le Tamil Eelam. Il est défait en mai 2009.",
      "en": "Founded in 1976 under Velupillai Prabhakaran, the LTTE became the leading armed movement in the struggle for Tamil Eelam. It was defeated in May 2009.",
      "ta": "1976-இல் வேலுப்பிள்ளை பிரபாகரன் தலைமையில் உருவான புலிகள் தமிழீழ விடுதலைப் போராட்டத்தின் பிரதான ஆயுத இயக்கமாகினர். 2009 மேயில் தோற்கடிக்கப்பட்டனர்."
    },
    "detail": {
      "fr": "Pour de nombreux Tamouls, le LTTE a incarné la défense de leur terre, de leur langue et de leur culture face aux discriminations et aux violences, ainsi que l’espoir d’un État indépendant. Dans les territoires qu’il contrôlait, il a mis en place une administration civile, avec ses tribunaux et sa police. Prabhakaran meurt lors de l’offensive finale de mai 2009.",
      "en": "For many Tamils, the LTTE stood for the defence of their land, language and culture against discrimination and violence, and for the hope of an independent state. In the areas it controlled, it built a civil administration with its own courts and police. Prabhakaran died during the final offensive in May 2009.",
      "ta": "பல தமிழர்களுக்கு, பாகுபாட்டுக்கும் வன்முறைக்கும் எதிராகத் தம் நிலத்தையும் மொழியையும் பண்பாட்டையும் காத்த இயக்கமாகவும் சுதந்திர அரசின் நம்பிக்கையாகவும் புலிகள் விளங்கினர். தமது கட்டுப்பாட்டுப் பகுதிகளில் நீதிமன்றங்களும் காவல்துறையும் கொண்ட சிவில் நிர்வாகத்தை அமைத்தனர். 2009 மே இறுதித் தாக்குதலில் பிரபாகரன் இறந்தார்."
    }
  },
  {
    "year": "27.11",
    "cat": "memory",
    "title": {
      "fr": "Maaveerar Naal — மாவீரர் நாள்",
      "en": "Maaveerar Naal — Heroes Day",
      "ta": "மாவீரர் நாள்"
    },
    "desc": {
      "fr": "Le 27 novembre, le Maaveerar Naal commémore les combattants tamouls morts. Cette journée se distingue du souvenir des victimes civiles le 18 mai.",
      "en": "On 27 November, Maaveerar Naal commemorates fallen Tamil fighters. It is distinct from remembrance of civilian victims on 18 May.",
      "ta": "நவம்பர் 27 மாவீரர் நாள் வீழ்ந்த தமிழ்ப் போராளிகளை நினைவுகூர்கிறது. மே 18 பொதுமக்கள் நினைவேந்தலிலிருந்து இது வேறுபடுகிறது."
    },
    "detail": {
      "fr": "Institué par le LTTE en 1989, le Maaveerar Naal renvoie à la mort de Shankar le 27 novembre 1982. Des familles et des communautés allument des lampes en souvenir de leurs morts. La fleur de kaarthigai accompagne cette mémoire. Les pratiques et leur sens varient selon les familles et les lieux. Les commémorations au pays ont subi des destructions de cimetières, des restrictions et une surveillance documentées par des organisations de défense des droits humains.",
      "en": "Established by the LTTE in 1989, Maaveerar Naal recalls Shankar’s death on 27 November 1982. Families and communities light lamps for their dead. The kaarthigai flower accompanies this remembrance. Practices and meanings vary between families and places. Human-rights organisations have documented cemetery destruction, restrictions and surveillance affecting commemorations in the homeland.",
      "ta": "1989-இல் புலிகளால் தொடங்கப்பட்ட மாவீரர் நாள், 1982 நவம்பர் 27 சங்கர் இறந்ததை நினைவுகூர்கிறது. குடும்பங்களும் சமூகங்களும் இறந்தவர்களுக்காக விளக்கேற்றுகின்றன. கார்த்திகைப் பூ இந்த நினைவுடன் இணைகிறது. நடைமுறைகளும் அர்த்தங்களும் இடத்திற்கும் குடும்பத்திற்கும் மாறுகின்றன. தாயக நினைவேந்தல்களைப் பாதித்த கல்லறை அழிப்பு, கட்டுப்பாடுகள், கண்காணிப்பு மனித உரிமை அமைப்புகளால் ஆவணப்படுத்தப்பட்டுள்ளன."
    }
  }
]

export const catLabel: Record<Lang, Record<Category, string>> = {
  "fr": {
    "origins": "Origines",
    "oppression": "Oppression",
    "resistance": "Résistance",
    "international": "International",
    "memory": "Mémoire"
  },
  "en": {
    "origins": "Origins",
    "oppression": "Oppression",
    "resistance": "Resistance",
    "international": "International",
    "memory": "Memory"
  },
  "ta": {
    "origins": "தோற்றம்",
    "oppression": "ஒடுக்குமுறை",
    "resistance": "எதிர்ப்பு",
    "international": "சர்வதேசம்",
    "memory": "நினைவு"
  }
}
