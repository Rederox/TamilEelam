import type { Lang } from './events'

export type Localized = Record<Lang, string>
const tr = (fr: string, en: string, ta: string): Localized => ({ fr, en, ta })

export const sources = {
  history: { year: '1990', institution: 'Library of Congress', title: 'Sri Lanka: a country study', href: 'https://www.loc.gov/item/89600372/' },
  reforms: { year: '1833', institution: 'Sri Lanka National Archives', title: 'The First Reforms, 1833', href: 'https://www.archives.gov.lk/English/online-exhibits/path-to-freedom/reforms' },
  citizenship: { year: '2004', institution: 'UNHCR', title: 'Sri Lanka makes citizens out of stateless tea pickers', href: 'https://www.unhcr.org/us/news/stories/feature-sri-lanka-makes-citizens-out-stateless-tea-pickers' },
  language: { year: '1956 / 2008', institution: 'Law & Society Trust', title: 'Language rights in Sri Lanka — Official Language Act, p. 114', href: 'https://lst.lk/wp-content/uploads/2024/02/Language-rights-in-Sri-Lanka-English-2008.pdf' },
  library: { year: '1981', institution: 'American Institute for Sri Lankan Studies', title: 'Burning of the Jaffna Public Library', href: 'https://www.aisls.org/teaching-about-the-sri-lankan-civil-war/1981-burning-of-the-jaffna-public-library/' },
  resolution: { year: '1976', institution: 'TULF · Ilankai Tamil Sangam', title: 'Vaddukoddai Resolution — historical political document', href: 'https://sangam.org/FB_HIST_DOCS/vaddukod.htm' },
  hrw: { year: '2008', institution: 'Human Rights Watch', title: 'Recurring Nightmare — background and documented abuses', href: 'https://www.hrw.org/report/2008/03/05/recurring-nightmare/state-responsibility-disappearances-and-abductions-sri-lanka' },
  panel: { year: '2011', institution: 'United Nations · Refworld', title: 'Panel of Experts on Accountability in Sri Lanka — §§ 130–137', href: 'https://www.refworld.org/sites/default/files/legacy-pdf/en/2011-3/4db7b23e2.pdf' },
  review: { year: '2012', institution: 'United Nations', title: 'Internal Review Panel on United Nations Action in Sri Lanka', href: 'https://digitallibrary.un.org/record/737299/files/The_Internal_Review_Panel_report_on_Sri_Lanka.pdf' },
  oisl: { year: '2015', institution: 'OHCHR · Refworld', title: 'Investigation on Sri Lanka — A/HRC/30/CRP.2', href: 'https://www.refworld.org/sites/default/files/legacy-pdf/en/2015-9/55ffb1d04.pdf' },
  disappearances: { year: '2024', institution: 'OHCHR', title: 'Accountability for Enforced Disappearances in Sri Lanka', href: 'https://www.ohchr.org/sites/default/files/documents/hrbodies/hrcouncil/sri-lanka/report-accountability-enforced-disappearances-sri-lanka-may2024-en.pdf' },
  canada: { year: '2022', institution: 'House of Commons of Canada', title: 'Journals No. 74 — motion adopted on 18 May 2022', href: 'https://www.ourcommons.ca/DocumentViewer/en/11795160' },
  uk: { year: '2025', institution: 'UK Parliament', title: 'Written question 53578 — answer of 2 June 2025', href: 'https://questions-statements.parliament.uk/written-questions/detail/2025-05-20/53578' },
  remembrance: { year: '2024', institution: 'Amnesty International', title: 'Fifteen years after the end of war, victims still await justice', href: 'https://www.amnesty.org/en/latest/news/2024/05/sri-lanka-fifteen-years-after-the-end-of-war-victims-still-await-justice-at-mullivaikkal/' },
  kanji: { year: '2024', institution: 'Adayaalam Centre for Policy Research · civil society', title: 'Persisting Denial of the Right to Truth, Memory and Memorialisation', href: 'https://adayaalam.org/wp-content/uploads/2024/05/Joint-Civil-Society-Statement-Persisting-Denial-of-the-Right-to-Truth-Memory-and-Memorialisation-14-May-2024.pdf' },
  memorialArchive: { year: '1989 / 2024', institution: 'Diasporic Tamil Archives', title: 'Maaveerar Naal — community archive and chronology', href: 'https://diasporatamil.no/tamil-eelam-national-heroes-day/' },
  maaveerar: { year: '2022', institution: 'Human Rights Watch', title: 'Sri Lanka’s Tamils Remember War Dead, but Justice Remains Elusive', href: 'https://www.hrw.org/news/2022/05/16/sri-lankas-tamils-remember-war-dead-justice-remains-elusive' },
} as const
export type SourceId = keyof typeof sources

export const chapterSources: Record<string, SourceId[]> = {
  terre: ['history', 'reforms'], etau: ['reforms', 'citizenship', 'language'],
  feu: ['library', 'oisl'], promesse: ['resolution'], juillet: ['oisl', 'hrw'],
  mullivaikkal: ['panel', 'oisl', 'review', 'kanji', 'canada'],
  disparus: ['disappearances', 'hrw'], patrie: ['history', 'oisl'],
  symboles: ['memorialArchive', 'maaveerar'], aube: ['remembrance', 'memorialArchive', 'maaveerar', 'canada', 'uk'],
}

export const researchCopy = {
  heading: tr('Les traces, les preuves, les voix.', 'The traces, the evidence, the voices.', 'தடயங்கள், ஆதாரங்கள், குரல்கள்.'),
  label: tr('Sources & repères', 'Sources & context', 'ஆதாரங்களும் பின்னணியும்'),
  read: tr('Consulter les sources', 'Explore the sources', 'ஆதாரங்களை வாசிக்க'),
  next: tr('Poursuivre le récit', 'Continue the story', 'கதையைத் தொடருங்கள்'),
  end: tr('Porter la mémoire', 'Carry the memory', 'நினைவைச் சுமக்க'),
  method: tr('Ce récit est consacré à la mémoire du génocide des Tamouls. Les références permettent de distinguer les faits documentés, les estimations et les reconnaissances politiques. Les textes de liaison sont une écriture éditoriale ; ils ne sont pas attribués à des témoins. Les illustrations évoquent des lieux et des gestes, sans se présenter comme des archives.', 'This narrative is dedicated to the memory of the Tamil genocide. References distinguish documented facts, estimates and political recognitions. Connecting passages are editorial writing, not words attributed to witnesses. Illustrations evoke places and gestures without presenting themselves as archival evidence.', 'இந்தக் கதை தமிழர் இனப்படுகொலையின் நினைவுக்காக அர்ப்பணிக்கப்படுகிறது. ஆதாரங்கள் ஆவணப்படுத்தப்பட்ட உண்மைகள், மதிப்பீடுகள், அரசியல் அங்கீகாரங்களை வேறுபடுத்துகின்றன. இணைப்புப் பகுதிகள் ஆசிரியர் எழுத்துகள்; சாட்சிகளின் சொற்களாகக் கூறப்படவில்லை. விளக்கப்படங்கள் இடங்களையும் செயல்களையும் நினைவூட்டுகின்றன; ஆவணச் சான்றுகளாக அல்ல.'),
  qualification: tr('Le 18 mai 2022, la Chambre des communes du Canada a reconnu le génocide des Tamouls. Le rapport OISL de 2015 documente des faits susceptibles de constituer des crimes de guerre et des crimes contre l’humanité : c’est une enquête de droits humains, pas un jugement pénal.', 'On 18 May 2022, Canada’s House of Commons recognised the genocide of Tamils. The 2015 OISL report documents acts that may constitute war crimes and crimes against humanity: it is a human-rights investigation, not a criminal judgment.', '2022 மே 18-இல் கனடாவின் பொதுச்சபை தமிழர் இனப்படுகொலையை அங்கீகரித்தது. 2015 OISL அறிக்கை போர்க்குற்றங்களாகவும் மனிதகுலத்திற்கு எதிரான குற்றங்களாகவும் அமையக்கூடிய செயல்களை ஆவணப்படுத்துகிறது: இது மனித உரிமை விசாரணை; குற்றவியல் தீர்ப்பு அல்ல.'),
  reviewed: tr('Références consultées le 11 septembre 2026', 'References consulted on 11 September 2026', '2026 செப்டம்பர் 11 அன்று ஆதாரங்கள் பார்க்கப்பட்டன'),
  illustration: tr('Évocation visuelle', 'Visual evocation', 'காட்சி நினைவூட்டல்'),
  editorial: tr('Texte de mémoire · rédaction du site', 'Memorial text · site editorial', 'நினைவு உரை · தள ஆசிரியர் எழுத்து'),
}
