export type Lang = 'fr' | 'en' | 'ta'
export type Category = 'origins' | 'oppression' | 'resistance' | 'memory' | 'international'

export interface TimelineEvent {
  year: string
  cat: Category
  title: Record<Lang, string>
  desc: Record<Lang, string>
  detail: Record<Lang, string>
}

export const events: TimelineEvent[] = [
  {
    year: 'IIIᵉ av. J.-C.', cat: 'origins',
    title: { fr: 'Présence tamoule attestée', en: 'Tamil presence attested', ta: 'தமிழ் இருப்பின் ஆரம்பம்' },
    desc: {
      fr: "Le peuple tamoul est installé sur l'île depuis au moins le IIIᵉ siècle avant notre ère. Inscriptions, poésie Sangam, échanges commerciaux avec le continent.",
      en: 'The Tamil people have been settled on the island since at least the 3rd century BCE. Inscriptions, Sangam poetry, trade with the mainland.',
      ta: 'தமிழ் மக்கள் கி.மு. மூன்றாம் நூற்றாண்டிலிருந்து தீவில் வாழ்ந்து வருகின்றனர்.',
    },
    detail: {
      fr: "L'histoire tamoule sur l'île — connue dans la littérature ancienne sous le nom d'Eelam — remonte à plus de deux millénaires. Les inscriptions en tamoul-brahmi, les références dans la littérature Sangam, les routes commerciales qui relient le Nord de l'île au Tamil Nadu continental témoignent d'une présence ancienne, continue et constitutive de l'identité de l'île. Le peuple tamoul n'est pas un visiteur sur cette terre : il en est l'un des peuples fondateurs.",
      en: "Tamil history on the island — known in ancient literature as Eelam — goes back more than two millennia. Tamil-Brahmi inscriptions, references in Sangam literature, and trade routes connecting the island's North with mainland Tamil Nadu all testify to an ancient, continuous, constitutive presence. The Tamil people are not visitors on this land — they are one of its founding peoples.",
      ta: 'தமிழ் வரலாறு தீவில் — பண்டைய இலக்கியத்தில் ஈழம் என அறியப்படும் — இரண்டாயிரம் ஆண்டுகளுக்கும் மேற்பட்டது.',
    },
  },
  {
    year: '1215-1619', cat: 'origins',
    title: { fr: 'Royaume de Jaffna', en: 'Kingdom of Jaffna', ta: 'யாழ்ப்பாண இராச்சியம்' },
    desc: {
      fr: 'Quatre siècles de souveraineté tamoule au Nord. Le royaume de Jaffna, Aryacakravarti, gouverne avec une cour, une langue, des lois propres.',
      en: 'Four centuries of Tamil sovereignty in the North. The Kingdom of Jaffna, ruled by the Aryacakravarti, had its own court, language and laws.',
      ta: 'வடக்கில் நான்கு நூற்றாண்டுகள் தமிழ் இறையாண்மை. யாழ்ப்பாண இராச்சியம்.',
    },
    detail: {
      fr: "Pendant quatre siècles, le royaume de Jaffna, sous la dynastie des Aryacakravarti, gouverne le Nord de l'île. Capitale à Nallur. Diplomatie indépendante avec les royaumes du Sud de l'Inde, la Chine impériale, les marchands arabes. Frappe de monnaie propre. Cette souveraineté est interrompue en 1619 par la conquête portugaise — premier maillon de la subjugation coloniale du peuple tamoul. La mémoire du royaume de Jaffna reste, jusqu'à aujourd'hui, l'une des bases historiques de la revendication d'autodétermination.",
      en: "For four centuries the Kingdom of Jaffna, under the Aryacakravarti dynasty, ruled the North of the island. Capital at Nallur. Independent diplomacy with South Indian kingdoms, imperial China, Arab traders. Its own coinage. This sovereignty was interrupted in 1619 by the Portuguese conquest — the first link in the colonial subjugation of the Tamil people. The memory of the Kingdom of Jaffna remains, to this day, one of the historical foundations of the claim to self-determination.",
      ta: 'நான்கு நூற்றாண்டுகளுக்கு யாழ்ப்பாண இராச்சியம் வடக்கை ஆட்சி செய்தது.',
    },
  },
  {
    year: '1833', cat: 'oppression',
    title: { fr: 'Unification coloniale britannique', en: 'British colonial unification', ta: 'பிரிட்டிஷ் ஒன்றிணைப்பு' },
    desc: {
      fr: "Les Britanniques fusionnent administrativement les territoires tamouls et cinghalais. Une décision coloniale qui ignore l'histoire des deux nations.",
      en: 'The British administratively merged Tamil and Sinhalese territories. A colonial decision that ignored the history of two distinct nations.',
      ta: 'பிரிட்டிஷார் தமிழ் மற்றும் சிங்கள பிரதேசங்களை ஒன்றிணைத்தனர்.',
    },
    detail: {
      fr: "Avant 1833, les territoires tamouls et cinghalais étaient administrés séparément. Les Britanniques, pour des raisons de commodité administrative et coloniale, fusionnent l'île en une seule entité. Cette décision impose à un peuple — le peuple tamoul d'Eelam — une cohabitation forcée dans un État qu'il n'a pas choisi et où il deviendra structurellement minoritaire. Toute l'injustice du XXᵉ siècle découle de cet acte colonial : un peuple souverain est transformé en minorité dans la maison d'un autre.",
      en: "Before 1833, Tamil and Sinhalese territories were administered separately. The British, for colonial administrative convenience, merged the island into a single entity. This decision imposed forced cohabitation on the Eelam Tamil people in a state they had not chosen — and where they would become structurally minoritised. Much of the injustice of the 20th century flows from this colonial act: a sovereign people turned into a minority in another's house.",
      ta: '1833-க்கு முன், தமிழ் மற்றும் சிங்கள பிரதேசங்கள் தனித்தனியாக நிர்வகிக்கப்பட்டன.',
    },
  },
  {
    year: '1948', cat: 'oppression',
    title: { fr: 'Indépendance & Citizenship Act', en: 'Independence & Citizenship Act', ta: 'சுதந்திரம் & குடியுரிமை சட்டம்' },
    desc: {
      fr: "Ceylan devient indépendant. Quelques mois plus tard, le Citizenship Act dépouille de leur citoyenneté des centaines de milliers de Tamouls des plantations.",
      en: 'Ceylon becomes independent. Months later, the Citizenship Act strips hundreds of thousands of plantation Tamils of their citizenship.',
      ta: 'இலங்கை சுதந்திரம் பெற்றது. சில மாதங்களில் தோட்டத் தமிழர்களின் குடியுரிமை பறிக்கப்பட்டது.',
    },
    detail: {
      fr: "L'indépendance de février 1948 n'apporte pas la libération au peuple tamoul. Dès la fin 1948, le Ceylon Citizenship Act prive de leur citoyenneté les Tamouls des plantations — environ 700 000 personnes — au motif qu'ils descendraient d'« immigrants ». La même logique de pureté ethnique cinghalaise structure le nouvel État. Les Tamouls du Nord et de l'Est, eux, restent citoyens — mais voient s'installer la doctrine : Sri Lanka est un État cinghalais bouddhiste, dans lequel les Tamouls sont des invités.",
      en: "The independence of February 1948 brought no liberation for the Tamil people. By late 1948, the Ceylon Citizenship Act stripped plantation Tamils — about 700,000 people — of citizenship on the grounds of supposed 'immigrant' origin. The same logic of Sinhalese-Buddhist ethnic purity structured the new state. Northern and Eastern Tamils remained citizens — but the doctrine took hold: Sri Lanka is a Sinhalese-Buddhist state, in which Tamils are guests.",
      ta: '1948 பிப்ரவரி சுதந்திரம் தமிழ் மக்களுக்கு விடுதலை கொடுக்கவில்லை.',
    },
  },
  {
    year: '1956', cat: 'oppression',
    title: { fr: 'Sinhala Only Act', en: 'Sinhala Only Act', ta: 'சிங்களம் மட்டும் சட்டம்' },
    desc: {
      fr: 'Le cinghalais devient l\'unique langue officielle. Des milliers de fonctionnaires tamouls sont écartés. Le satyagraha tamoul est attaqué par la foule.',
      en: 'Sinhala becomes the only official language. Thousands of Tamil civil servants are pushed out. Tamil satyagraha is attacked by mobs.',
      ta: 'சிங்களம் மட்டுமே ஆட்சி மொழியாக ஆக்கப்பட்டது.',
    },
    detail: {
      fr: "Le « Sinhala Only Act » de 1956 est l'acte fondateur de la marginalisation institutionnelle des Tamouls. Le cinghalais devient la seule langue officielle ; le tamoul est exclu de l'administration, des examens, de la magistrature. Le leader tamoul S.J.V. Chelvanayakam — le « Gandhi tamoul » — organise un satyagraha non-violent devant le Parlement. Les manifestants sont battus par des foules organisées sous le regard passif de la police. C'est le moment où la voie politique non-violente commence à se refermer.",
      en: "The 1956 Sinhala Only Act is the founding act of the institutional marginalisation of Tamils. Sinhala became the only official language; Tamil was excluded from administration, exams, the judiciary. Tamil leader S.J.V. Chelvanayakam — 'the Tamil Gandhi' — organised a non-violent satyagraha at Parliament. Protesters were beaten by organised mobs under the passive gaze of police. This was the moment the non-violent political path began to close.",
      ta: '1956 ஆம் ஆண்டின் சிங்களம் மட்டும் சட்டம் தமிழர்களின் நிறுவன ஒதுக்கலின் அடிப்படை.',
    },
  },
  {
    year: '1958, 1977, 1981', cat: 'oppression',
    title: { fr: 'Pogroms anti-tamouls', en: 'Anti-Tamil pogroms', ta: 'தமிழ் எதிர்ப்பு படுகொலைகள்' },
    desc: {
      fr: 'Vagues successives de violences contre les civils tamouls — Colombo, Vavuniya, Anuradhapura. En 1981, la bibliothèque de Jaffna est brûlée.',
      en: 'Successive waves of violence against Tamil civilians — Colombo, Vavuniya, Anuradhapura. In 1981, the Jaffna Library was burned.',
      ta: 'தமிழ் குடிமக்களுக்கு எதிரான வன்முறை அலைகள்.',
    },
    detail: {
      fr: "Pendant trois décennies avant la guerre, le peuple tamoul subit des vagues répétées de violence organisée. 1958 : premiers pogroms massifs, après l'agitation autour du Sinhala Only Act. 1977 : nouvelles attaques après la victoire du TULF aux élections. 1981 : la bibliothèque publique de Jaffna — l'une des plus grandes d'Asie, gardant des manuscrits irremplaçables — est incendiée par des forces de sécurité cinghalaises. Plus de 97 000 livres et manuscrits anciens sont détruits. C'est un crime culturel reconnu mondialement comme un « biblioclasme ». Le message est sans ambiguïté : effacer la mémoire tamoule.",
      en: "For three decades before the war, the Tamil people suffered repeated waves of organised violence. 1958: first mass pogroms, after the Sinhala Only Act agitation. 1977: new attacks following the TULF election victory. 1981: the Jaffna Public Library — one of the largest in Asia, holding irreplaceable manuscripts — was burned down by Sinhalese security forces. Over 97,000 books and ancient manuscripts were destroyed. It is recognised worldwide as a 'biblioclasm' — a cultural crime. The message was unambiguous: erase Tamil memory.",
      ta: 'போருக்கு முந்தைய மூன்று தசாப்தங்களில் தமிழ் மக்கள் தொடர்ச்சியான ஒழுங்கமைக்கப்பட்ட வன்முறைகளை அனுபவித்தனர்.',
    },
  },
  {
    year: '14 mai 1976', cat: 'resistance',
    title: { fr: 'Résolution de Vaddukoddai', en: 'Vaddukoddai Resolution', ta: 'வட்டுக்கோட்டை தீர்மானம்' },
    desc: {
      fr: "Le Tamil United Liberation Front, réuni à Vaddukoddai, adopte démocratiquement la revendication d'un État tamoul indépendant : le Tamil Eelam.",
      en: 'The Tamil United Liberation Front, meeting at Vaddukoddai, democratically adopts the call for an independent Tamil state: Tamil Eelam.',
      ta: 'வட்டுக்கோட்டை தீர்மானம் — சுதந்திர தமிழீழம்.',
    },
    detail: {
      fr: "Le 14 mai 1976, à Vaddukoddai (district de Jaffna), le Tamil United Liberation Front (TULF), coalition des principaux partis tamouls, adopte par consensus la « Résolution de Vaddukoddai ». Le texte constate l'échec de toutes les voies politiques pour obtenir l'égalité et la dignité dans le cadre de l'État sri-lankais. Il proclame l'aspiration à un État souverain — Tamil Eelam — sur les territoires traditionnels du Nord et de l'Est. Aux élections de 1977, le TULF se présente sur cette plateforme et remporte une majorité écrasante dans les circonscriptions tamoules : c'est le mandat démocratique de l'autodétermination tamoule, jamais reconnu par les gouvernements successifs.",
      en: "On 14 May 1976, in Vaddukoddai (Jaffna District), the Tamil United Liberation Front (TULF), a coalition of the main Tamil parties, adopted by consensus the 'Vaddukoddai Resolution'. The text records the failure of all political avenues to obtain equality and dignity within the Sri Lankan state. It proclaims the aspiration to a sovereign state — Tamil Eelam — over the traditional territories of the North and East. At the 1977 elections, the TULF ran on this platform and won an overwhelming majority in Tamil constituencies: this was the democratic mandate of Tamil self-determination, never recognised by successive governments.",
      ta: '1976 மே 14 அன்று, வட்டுக்கோட்டையில் தமிழீழம் கோரிக்கை அதிகாரப்பூர்வமாக வெளியிடப்பட்டது.',
    },
  },
  {
    year: 'Juillet 1983', cat: 'memory',
    title: { fr: 'Black July — கறுப்பு ஜூலை', en: 'Black July', ta: 'கறுப்பு ஜூலை' },
    desc: {
      fr: 'Pogrom organisé contre les Tamouls de Colombo et d\'autres villes. Listes électorales utilisées pour identifier les victimes. Le monde tamoul se réfugie en exil.',
      en: 'An organised pogrom against Tamils in Colombo and other cities. Voter rolls used to identify victims. The Tamil world goes into exile.',
      ta: 'கறுப்பு ஜூலை — கொழும்பு மற்றும் பிற நகரங்களில் தமிழர்களுக்கு எதிரான திட்டமிட்ட படுகொலை.',
    },
    detail: {
      fr: "En juillet 1983, une violence anti-tamoule d'une ampleur sans précédent éclate à Colombo et dans d'autres villes du Sud. Des foules organisées, munies des listes électorales (qui indiquent l'ethnicité), parcourent les rues, détruisent les maisons et les commerces tamouls, brûlent vifs des hommes, des femmes, des enfants. Les estimations vont de 400 à plus de 3 000 morts. Des dizaines de milliers fuient vers le Nord ; des centaines de milliers émigrent — c'est la naissance de la grande diaspora tamoule mondiale. Black July n'est pas une émeute spontanée : c'est un pogrom préparé, dans lequel l'État sri-lankais est complice par son inaction. Pour les Tamouls, c'est le moment où il devient évident qu'il n'y a pas de place pour eux dans cet État.",
      en: "In July 1983, anti-Tamil violence of unprecedented scale erupted in Colombo and other Southern cities. Organised mobs, armed with voter rolls (which indicated ethnicity), roamed the streets, destroying Tamil homes and businesses, burning men, women, and children alive. Estimates range from 400 to over 3,000 dead. Tens of thousands fled north; hundreds of thousands emigrated — this was the birth of the global Tamil diaspora. Black July was no spontaneous riot: it was a prepared pogrom, in which the Sri Lankan state was complicit by inaction. For Tamils, this was the moment when it became clear: there was no place for them in this state.",
      ta: '1983 ஜூலையில் கொழும்பில் முன்னெப்போதும் இல்லாத அளவில் தமிழ் எதிர்ப்பு வன்முறை வெடித்தது.',
    },
  },
  {
    year: '1983-2002', cat: 'resistance',
    title: { fr: 'Lutte armée pour l\'autodétermination', en: 'Armed struggle for self-determination', ta: 'சுயநிர்ணய ஆயுதப் போராட்டம்' },
    desc: {
      fr: 'Face à un État qui refuse l\'égalité, le mouvement de libération tamoul prend les armes. Pendant deux décennies, une administration de facto se construit au Nord-Est.',
      en: 'Faced with a state that refuses equality, the Tamil liberation movement takes up arms. Over two decades, a de facto administration is built in the North-East.',
      ta: 'சமத்துவத்தை மறுத்த அரசுக்கு எதிராக தமிழ் விடுதலை இயக்கம் ஆயுதங்களை எடுத்துக் கொண்டது.',
    },
    detail: {
      fr: "Devant l'épuisement de toutes les voies politiques, devant les pogroms répétés, devant un État qui refuse même de discuter l'égalité linguistique, la jeunesse tamoule choisit la résistance armée. Pendant près de deux décennies, le mouvement de libération établit dans le Nord-Est une administration de facto avec ses tribunaux, ses écoles, ses hôpitaux, sa police, sa banque, son système postal. C'est l'émergence concrète d'un État tamoul. Plusieurs trêves et tentatives de négociation — notamment l'accord de cessez-le-feu de février 2002 sous médiation norvégienne — démontrent la volonté tamoule de paix dans la justice. À chaque fois, l'État sri-lankais privilégie la voie militaire.",
      en: "With all political avenues exhausted, repeated pogroms unanswered, and a state refusing even to discuss linguistic equality, Tamil youth chose armed resistance. For nearly two decades, the liberation movement built a de facto administration in the North-East — with its own courts, schools, hospitals, police, bank, and postal system. This was the concrete emergence of a Tamil state. Multiple truces and attempts at negotiation — notably the Norwegian-brokered ceasefire of February 2002 — demonstrated Tamil willingness for peace within justice. Each time, the Sri Lankan state chose the military path.",
      ta: 'அரசியல் வழிகள் தீர்ந்தபோது, தமிழ் இளைஞர்கள் ஆயுதப் போராட்டத்தை தேர்ந்தெடுத்தனர்.',
    },
  },
  {
    year: 'Mai 2009', cat: 'memory',
    title: { fr: 'Mullivaikkal — முள்ளிவாய்க்கால்', en: 'Mullivaikkal', ta: 'முள்ளிவாய்க்கால்' },
    desc: {
      fr: 'Dernière phase de la guerre. Selon l\'ONU, des dizaines de milliers de civils tamouls tués sur une bande côtière, malgré les « zones de non-feu ».',
      en: "Final phase of the war. According to the UN, tens of thousands of Tamil civilians killed on a coastal strip, despite 'no-fire zones'.",
      ta: 'முள்ளிவாய்க்கால் — யுத்தத்தின் கடைசி கட்டம்.',
    },
    detail: {
      fr: "En mai 2009, sur une bande côtière de quelques kilomètres carrés près de Mullivaikkal (district de Mullaitivu), des dizaines de milliers de civils tamouls — femmes, enfants, vieillards, blessés — sont pris au piège. Les zones déclarées « no-fire zones » par le gouvernement sont pourtant pilonnées par l'artillerie et bombardées par voie aérienne. Les hôpitaux sont visés. Des témoins documentent l'usage de munitions à effet de zone contre des concentrations de civils. Aucun observateur international n'est autorisé. Selon le rapport du Panel d'experts de l'ONU (Darusman, 2011), entre 40 000 et 75 000 civils tamouls sont morts dans les mois finaux. D'autres estimations vont au-delà de 100 000. Le rapport documente des « allégations crédibles » de crimes de guerre et de crimes contre l'humanité commis par l'État sri-lankais. Pour le peuple tamoul, Mullivaikkal n'est pas une « fin de guerre » : c'est un génocide. Le 18 mai est devenu, dans le monde tamoul entier, le jour de la mémoire — Mullivaikkal Remembrance Day.",
      en: "In May 2009, on a coastal strip a few square kilometres wide near Mullivaikkal (Mullaitivu District), tens of thousands of Tamil civilians — women, children, elderly, wounded — were trapped. Zones declared 'no-fire' by the government were nonetheless shelled by artillery and bombed from the air. Hospitals were targeted. Witnesses documented the use of area munitions against civilian concentrations. No international observers were permitted. According to the UN Panel of Experts (Darusman Report, 2011), between 40,000 and 75,000 Tamil civilians died in the final months. Other estimates go beyond 100,000. The report documented 'credible allegations' of war crimes and crimes against humanity committed by the Sri Lankan state. For the Tamil people, Mullivaikkal is not the 'end of a war': it is a genocide. The 18th of May has become, throughout the Tamil world, the day of remembrance — Mullivaikkal Remembrance Day.",
      ta: '2009 மே மாதம், ஆயிரக்கணக்கான தமிழ் குடிமக்கள் முள்ளிவாய்க்காலில் கொல்லப்பட்டனர்.',
    },
  },
  {
    year: "2009-aujourd'hui", cat: 'memory',
    title: { fr: 'Les disparus — காணாமல் ஆனோர்', en: 'The disappeared', ta: 'காணாமல் ஆனோர்' },
    desc: {
      fr: 'Des milliers de Tamouls remis à l\'armée en mai 2009 n\'ont jamais reparu. Les Mères du Nord les attendent depuis. C\'est l\'un des taux d\'enforced disappearances les plus élevés au monde.',
      en: 'Thousands of Tamils handed over to the army in May 2009 have never reappeared. The Mothers of the North have waited ever since. One of the highest rates of enforced disappearance in the world.',
      ta: '2009 மே மாதம் ராணுவத்திடம் ஒப்படைக்கப்பட்ட ஆயிரக்கணக்கான தமிழர்கள் இன்னும் காணாமல் உள்ளனர்.',
    },
    detail: {
      fr: "Dans les derniers jours de la guerre, et dans les semaines qui suivirent, des milliers de Tamouls — combattants ayant déposé les armes, mais aussi de très nombreux civils, dont des familles entières — se sont rendus à l'armée sri-lankaise sous la promesse explicite d'un traitement digne. Beaucoup ont été filmés et photographiés au moment de leur reddition. Ils n'ont jamais reparu. Depuis 2017, à Vavuniya, Kilinochchi, Mullaitivu, Trincomalee, Batticaloa, des mères, des épouses, des sœurs — les « Mères du Nord » — tiennent une veille permanente, photos en main, exigeant des nouvelles. Selon les groupes de défense des droits humains, Sri Lanka présente l'un des taux d'enforced disappearances les plus élevés au monde. Aucune réponse n'a été donnée. Aucune justice n'a été rendue. Ces mères vieillissent ; certaines meurent sans avoir su.",
      en: "In the last days of the war, and in the weeks that followed, thousands of Tamils — combatants who had laid down their arms, but also many civilians, including entire families — surrendered to the Sri Lankan army on the explicit promise of dignified treatment. Many were filmed and photographed at the moment of surrender. They never reappeared. Since 2017, in Vavuniya, Kilinochchi, Mullaitivu, Trincomalee and Batticaloa, mothers, wives, and sisters — the 'Mothers of the North' — have kept a permanent vigil, photos in hand, demanding answers. According to human-rights groups, Sri Lanka has one of the highest rates of enforced disappearance in the world. No answer has been given. No justice has been delivered. These mothers are growing old; some die without ever knowing.",
      ta: 'போரின் கடைசி நாட்களில் ஆயிரக்கணக்கானோர் ராணுவத்திடம் ஒப்படைக்கப்பட்டனர், திரும்பவே இல்லை.',
    },
  },
  {
    year: "2009-aujourd'hui", cat: 'international',
    title: { fr: 'Diaspora tamoule mondiale', en: 'Global Tamil diaspora', ta: 'உலகத் தமிழ் புலம்பெயர்வு' },
    desc: {
      fr: 'De Toronto à Londres, de Paris à Sydney, près d\'un million de Tamouls d\'Eelam vivent en diaspora. Ils maintiennent la mémoire, la langue, la cause.',
      en: 'From Toronto to London, Paris to Sydney, nearly a million Eelam Tamils live in diaspora. They keep the memory, the language, the cause alive.',
      ta: 'டொராண்டோ முதல் சிட்னி வரை — உலகெங்கும் தமிழ் புலம்பெயர்வு.',
    },
    detail: {
      fr: "La diaspora tamoule d'Eelam — issue des vagues de Black July 1983 et de l'exode post-2009 — est aujourd'hui présente dans plus de 80 pays. Le Canada (Toronto, Scarborough) accueille la plus grande communauté hors d'Asie : plus de 300 000 Tamouls. Le Royaume-Uni, la France (en particulier la région parisienne, La Chapelle), l'Allemagne, la Suisse, l'Australie, la Norvège, l'Italie comptent toutes des communautés importantes. La diaspora fait vivre la langue, la culture, les commémorations annuelles du Maaveerar Naal (Jour des Héros, 27 novembre) et du Mullivaikkal Remembrance Day (18 mai). Elle finance écoles, médias, et plaidoyer international. Le Conseil Mondial Tamoul (GTF) et le Gouvernement Transnational du Tamil Eelam (TGTE) portent la voix politique de la diaspora auprès des institutions internationales. La cause du Tamil Eelam n'est pas une cause éteinte : elle est portée chaque jour par les enfants et petits-enfants des survivants.",
      en: "The Eelam Tamil diaspora — born of Black July 1983 and the post-2009 exodus — is today present in over 80 countries. Canada (Toronto, Scarborough) hosts the largest community outside Asia: over 300,000 Tamils. The United Kingdom, France (especially Paris and La Chapelle), Germany, Switzerland, Australia, Norway, and Italy all have significant communities. The diaspora keeps alive the language, culture, and the annual commemorations of Maaveerar Naal (Heroes Day, 27 November) and Mullivaikkal Remembrance Day (18 May). It funds schools, media, international advocacy. The Global Tamil Forum (GTF) and the Transnational Government of Tamil Eelam (TGTE) carry the political voice of the diaspora to international institutions. The cause of Tamil Eelam is not extinguished: it is carried every day by the children and grandchildren of survivors.",
      ta: 'உலகெங்கிலும் தமிழ் புலம்பெயர்வு — 80-க்கும் மேற்பட்ட நாடுகளில்.',
    },
  },
  {
    year: '2015+', cat: 'international',
    title: { fr: "L'ONU & la quête de justice", en: 'The UN & the quest for justice', ta: 'ஐ.நா. மற்றும் நீதிக்கான தேடல்' },
    desc: {
      fr: "Résolutions successives du Conseil des droits de l'homme. L'OISL appelle à un tribunal hybride. Sri Lanka refuse. La diaspora poursuit le plaidoyer.",
      en: 'Successive Human Rights Council resolutions. OISL calls for a hybrid tribunal. Sri Lanka refuses. The diaspora keeps advocating.',
      ta: 'ஐ.நா. மனித உரிமைகள் கவுன்சில் தீர்மானங்கள்.',
    },
    detail: {
      fr: "En 2015, le Bureau du Haut-Commissaire de l'ONU aux droits de l'homme publie le rapport OISL — Office of the High Commissioner Investigation on Sri Lanka — qui documente les violations massives commises pendant la guerre et appelle à la mise en place d'un tribunal hybride avec participation internationale. Sri Lanka s'engage par la résolution 30/1 du Conseil des droits de l'homme à coopérer — puis se retire sous le gouvernement Rajapaksa. Aucune justice n'a été obtenue. Mais le combat ne s'arrête pas : chaque session du Conseil voit la diaspora, le TGTE, le GTF, des familles de disparus, des survivants, faire entendre leur voix. Des pays comme le Canada, le Royaume-Uni, et certains États américains ont reconnu officiellement le génocide tamoul. La reconnaissance internationale grandit, lentement mais sûrement. La justice viendra.",
      en: "In 2015, the UN Office of the High Commissioner for Human Rights published the OISL report — Office of the High Commissioner Investigation on Sri Lanka — documenting mass violations during the war and calling for a hybrid tribunal with international participation. Sri Lanka committed under Human Rights Council resolution 30/1 to cooperate — then withdrew under the Rajapaksa government. No justice has been obtained. But the fight does not stop: at every Council session, the diaspora, TGTE, GTF, families of the disappeared, and survivors make their voice heard. Countries such as Canada, the UK, and several US states have formally recognised the Tamil genocide. International recognition is growing, slowly but surely. Justice will come.",
      ta: '2015 இல் OISL அறிக்கை வெளியிடப்பட்டது.',
    },
  },
  // ————— Events 13+ : added from the TPA research (corrected dates & facts).
  // Components reference events by index — only append here, never insert.
  {
    year: '1505-1796', cat: 'origins',
    title: { fr: 'Trois colonisations européennes', en: 'Three European colonisations', ta: 'மூன்று ஐரோப்பிய காலனித்துவங்கள்' },
    desc: {
      fr: "Portugais, Hollandais, Britanniques : trois empires se succèdent sur l'île. En 1619, le royaume de Jaffna tombe — la souveraineté tamoule est confisquée pour des siècles.",
      en: 'Portuguese, Dutch, British: three empires succeed one another on the island. In 1619 the Kingdom of Jaffna falls — Tamil sovereignty is confiscated for centuries.',
      ta: 'போர்த்துக்கேயர், ஒல்லாந்தர், பிரித்தானியர் — மூன்று பேரரசுகள். 1619-இல் யாழ்ப்பாண இராச்சியம் வீழ்ந்தது.',
    },
    detail: {
      fr: "En 1505, les Portugais abordent l'île, attirés par la cannelle. Ils obtiennent en 1517-18 le droit de bâtir un fort à Colombo, imposent leur tribut au royaume de Kotte, puis conquièrent un à un les royaumes de la côte. En 1619, ils prennent Jaffna : quatre siècles de souveraineté tamoule prennent fin. Les Hollandais, appelés en renfort par le roi de Kandy Rajasinha II, chassent les Portugais — Colombo tombe en 1656, Jaffna en 1658 — mais gardent les territoires pour eux. En 1796, les Britanniques les remplacent, puis annexent Kandy en 1815 : le dernier roi, Sri Vikrama Rajasinha, est capturé et exilé en Inde. L'île entière est colonisée. Les plantations de café, puis de thé après la maladie du caféier dans les années 1870, redessinent l'économie. À la fin du XIXᵉ siècle, un renouveau bouddhiste et hindou s'affirme face aux missions chrétiennes. Le 4 février 1948, Ceylan devient indépendant — mais pour le peuple tamoul, une domination en remplace une autre.",
      en: "In 1505 the Portuguese reached the island, drawn by cinnamon. In 1517-18 they obtained the right to build a fort at Colombo, imposed tribute on the Kotte kingdom, then conquered the coastal kingdoms one by one. In 1619 they took Jaffna: four centuries of Tamil sovereignty ended. The Dutch, called in by King Rajasinha II of Kandy, drove out the Portuguese — Colombo fell in 1656, Jaffna in 1658 — but kept the territories for themselves. In 1796 the British replaced them, then annexed Kandy in 1815: the last king, Sri Vikrama Rajasinha, was captured and exiled to India. The whole island was colonised. Coffee plantations — then tea, after the coffee blight of the 1870s — reshaped the economy. In the late 19th century a Buddhist and Hindu revival rose against the Christian missions. On 4 February 1948 Ceylon became independent — but for the Tamil people, one domination replaced another.",
      ta: '1505-இல் போர்த்துக்கேயர் வந்தனர். 1619-இல் யாழ்ப்பாணம் வீழ்ந்தது. 1656/1658-இல் ஒல்லாந்தர், 1796-இல் பிரித்தானியர். 1948 பிப்ரவரி 4-இல் சுதந்திரம்.',
    },
  },
  {
    year: '1976-2009', cat: 'resistance',
    title: { fr: 'Le LTTE & Velupillai Prabhakaran', en: 'The LTTE & Velupillai Prabhakaran', ta: 'விடுதலைப் புலிகள் & வேலுப்பிள்ளை பிரபாகரன்' },
    desc: {
      fr: "Né le 26 novembre 1954 à Valvettithurai, Prabhakaran fonde les Tigres de libération de l'Eelam tamoul le 5 mai 1976. La guerre s'achève avec sa mort, le 18 mai 2009.",
      en: 'Born 26 November 1954 in Valvettithurai, Prabhakaran founded the Liberation Tigers of Tamil Eelam on 5 May 1976. The war ended with his death on 18 May 2009.',
      ta: '1954 நவம்பர் 26-இல் வல்வெட்டித்துறையில் பிறந்த பிரபாகரன், 1976 மே 5-இல் விடுதலைப் புலிகளை நிறுவினார்.',
    },
    detail: {
      fr: "Velupillai Prabhakaran naît le 26 novembre 1954 à Valvettithurai, dans le district de Jaffna, dernier enfant d'une famille qui lui raconte très tôt les discriminations subies par les Tamouls. Adolescent pendant les années où les manifestations pacifiques sont réprimées, il conclut que la voie non violente est fermée. Il fonde les Tamil New Tigers au début des années 1970, renommés « Liberation Tigers of Tamil Eelam » (LTTE) le 5 mai 1976 — l'année même de la résolution de Vaddukoddai. Le mouvement, soumis à une discipline stricte (ni alcool, ni tabac, égalité entre combattantes et combattants, noms de guerre protégeant les familles), devient la principale force armée tamoule : c'est le seul mouvement non étatique de l'histoire à avoir aligné une force navale (Sea Tigers) et une aviation (Air Tigers). Ses méthodes de guerre lui valent d'être interdit dans plus de 30 pays. Après l'échec du cessez-le-feu de 2002, l'offensive finale de l'armée sri-lankaise écrase le mouvement : Prabhakaran est tué le 18 mai 2009 à Mullivaikkal. Pour beaucoup de Tamouls, son nom reste lié à la revendication d'une patrie ; l'histoire complète, avec ses ombres et ses sacrifices, appartient désormais à la mémoire du peuple.",
      en: "Velupillai Prabhakaran was born on 26 November 1954 in Valvettithurai, Jaffna District, the youngest child of a family that told him early about the discrimination Tamils faced. A teenager in the years when peaceful protest was met with repression, he concluded that the non-violent path was closed. He founded the Tamil New Tigers in the early 1970s, renamed the Liberation Tigers of Tamil Eelam (LTTE) on 5 May 1976 — the very year of the Vaddukoddai Resolution. The movement, bound by strict discipline (no alcohol, no tobacco, equality between men and women fighters, noms de guerre protecting families), became the main Tamil armed force: the only non-state movement in history to field a navy (Sea Tigers) and an air wing (Air Tigers). Its methods of war led to its being banned in more than 30 countries. After the collapse of the 2002 ceasefire, the Sri Lankan army's final offensive crushed the movement: Prabhakaran was killed on 18 May 2009 at Mullivaikkal. For many Tamils his name remains tied to the claim to a homeland; the full history, with its shadows and its sacrifices, now belongs to the people's memory.",
      ta: 'பிரபாகரன் 1954 நவம்பர் 26-இல் பிறந்தார். 1976 மே 5-இல் விடுதலைப் புலிகள் உருவானது. 2009 மே 18-இல் முள்ளிவாய்க்காலில் கொல்லப்பட்டார்.',
    },
  },
  {
    year: '27 novembre', cat: 'memory',
    title: { fr: 'Maaveerar Naal — மாவீரர் நாள்', en: 'Maaveerar Naal — Heroes Day', ta: 'மாவீரர் நாள்' },
    desc: {
      fr: "Chaque 27 novembre, les Tamouls du monde entier commémorent leurs combattants tombés — depuis la mort du premier d'entre eux, Shankar, le 27 novembre 1982.",
      en: 'Every 27 November, Tamils across the world commemorate their fallen fighters — since the death of the first of them, Shankar, on 27 November 1982.',
      ta: 'ஒவ்வொரு நவம்பர் 27-இலும், உலகெங்கும் தமிழர்கள் வீழ்ந்த போராளிகளை நினைவுகூர்கிறார்கள்.',
    },
    detail: {
      fr: "Le Maaveerar Naal — « Jour des Grands Héros » — est observé chaque 27 novembre, date de la mort au combat de Shankar (Sathiyanathan), premier combattant du LTTE tombé, en 1982. Des lampes à huile sont allumées pendant trois jours ; la flamme de sacrifice est ravivée ; le symbole de la journée est le kaarthigai poo, le lys de gloire (Gloriosa superba), fleur qui s'épanouit en novembre. Au pays, les cimetières des combattants — les thuyilum illam, « maisons du repos » — ont été rasés au bulldozer par l'armée après 2009 : commémorer y demeure surveillé, parfois interdit. C'est donc la diaspora qui porte la journée : de Toronto à Londres, de Paris à Zurich, des dizaines de milliers de personnes se rassemblent chaque année. En Suisse, des tournois sportifs, des concours d'éloquence et des journées entières d'hommage transmettent la mémoire aux générations nées en exil.",
      en: "Maaveerar Naal — 'Great Heroes Day' — is observed every 27 November, the date the first LTTE fighter, Shankar (Sathiyanathan), fell in combat in 1982. Oil lamps are lit for three days; the flame of sacrifice is rekindled; the day's symbol is the kaarthigai poo, the glory lily (Gloriosa superba), which blooms in November. In the homeland, the fighters' cemeteries — the thuyilum illam, 'resting homes' — were bulldozed by the army after 2009: commemoration there remains watched, sometimes forbidden. So it is the diaspora that carries the day: from Toronto to London, Paris to Zurich, tens of thousands gather every year. In Switzerland, sports tournaments, oratory competitions and whole days of tribute pass the memory on to generations born in exile.",
      ta: 'மாவீரர் நாள் — ஒவ்வொரு நவம்பர் 27. முதல் மாவீரர் சங்கர் 1982-இல் வீழ்ந்த நாள். சின்னம்: கார்த்திகைப் பூ.',
    },
  },
]

export const catLabel: Record<Lang, Record<Category, string>> = {
  fr: { origins: 'Origines', oppression: 'Oppression', resistance: 'Résistance', international: 'International', memory: 'Mémoire' },
  en: { origins: 'Origins',  oppression: 'Oppression', resistance: 'Resistance', international: 'International', memory: 'Memory' },
  ta: { origins: 'தோற்றம்', oppression: 'ஒடுக்குமுறை', resistance: 'எதிர்ப்பு', international: 'சர்வதேசம்', memory: 'நினைவு' },
}
