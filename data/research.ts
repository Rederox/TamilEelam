import type { Lang } from './events'

export type Localized = Record<Lang, string>
const tr = (fr: string, en: string, ta: string): Localized => ({ fr, en, ta })

// Link health, 14 Nov 2026: usip.org redirects the ceasefire PDF to its home page (the
// Internet Archive copy is cited instead); archives.gov.lk has no valid certificate on www.
export const sources = {
  ceasefire: { year: '2002', institution: 'Norwegian Ministry of Foreign Affairs · USIP archives (Internet Archive copy)', title: 'Announcement of Sri Lanka ceasefire — 22 February 2002', href: 'https://web.archive.org/web/20240602231939/https://www.usip.org/sites/default/files/file/resources/collections/peace_agreements/sri_lanka_norwaypr02222002.pdf' },
  prabhakaran: { year: '2009', institution: 'The Independent', title: 'Velupillai Prabhakaran: Leader of the Tamil Tigers — biographical dates', href: 'https://www.independent.co.uk/news/obituaries/velupillai-prabhakaran-leader-of-the-tamil-tigers-1687239.html' },
  conflict: { year: '2009', institution: 'Council on Foreign Relations', title: 'The Sri Lankan Conflict', href: 'https://www.cfr.org/backgrounders/sri-lankan-conflict' },
  memorialSites: { year: '2016', institution: 'PEARL · Tamil human-rights advocacy organisation', title: 'Erasing the Past: Repression of Memorialization in Sri Lanka — pp. 13–15, 21–25', href: 'https://pearlaction.org/wp-content/uploads/2022/08/pearl-erasing-the-past-nov-1-2016-report-b-1.pdf' },
  history: { year: '1990', institution: 'Library of Congress', title: 'Sri Lanka: a country study', href: 'https://www.loc.gov/item/89600372/' },
  reforms: { year: '1833', institution: 'Sri Lanka National Archives', title: 'The First Reforms, 1833', href: 'https://archives.gov.lk/English/online-exhibits/path-to-freedom/reforms' },
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
  // Added 14 Nov 2026, each read in full text before being cited.
  icjLeary: { year: '1983', institution: 'International Commission of Jurists', title: 'Ethnic Conflict and Violence in Sri Lanka (V. Leary) — pp. 31–32, 103–104', href: 'https://www.icj.org/wp-content/uploads/1983/08/Sri-Lanka-ethnic-conflict-and-violence-fact-finding-mission-report-1983-eng.pdf' },
  icjSieghart: { year: '1984', institution: 'International Commission of Jurists · JUSTICE', title: 'Sri Lanka: A Mounting Tragedy of Errors (P. Sieghart) — pp. 74–76', href: 'https://www.icj.org/wp-content/uploads/1984/03/Sri-Lanka-mounting-tragedy-of-errors-fact-finding-mission-report-1984-eng.pdf' },
  hrw2009: { year: '2009', institution: 'Human Rights Watch', title: 'War on the Displaced: Sri Lankan Army and LTTE Abuses against Civilians in the Vanni', href: 'https://www.hrw.org/report/2009/02/19/war-displaced/sri-lankan-army-and-ltte-abuses-against-civilians-vanni' },
  icg: { year: '2010', institution: 'International Crisis Group', title: 'War Crimes in Sri Lanka — Asia Report N°191, pp. i, 5', href: 'https://icg-prod.s3.amazonaws.com/191-war-crimes-in-sri-lanka.pdf' },
  wgeid: { year: '2016', institution: 'United Nations · Working Group on Enforced or Involuntary Disappearances', title: 'Mission to Sri Lanka — A/HRC/33/51/Add.2, §§ 7–8', href: 'https://documents.un.org/doc/undoc/gen/g16/146/63/pdf/g1614663.pdf' },
  ohchr2021: { year: '2021', institution: 'OHCHR', title: 'Promoting reconciliation, accountability and human rights in Sri Lanka — A/HRC/46/20, §§ 52–56', href: 'https://documents.un.org/doc/undoc/gen/g21/028/52/pdf/g2102852.pdf' },
  crossroads: { year: '2017', institution: 'UCL Press', title: 'Sri Lanka at the Crossroads of History (Z. Biedermann & A. Strathern, eds.) — pp. 14, 22, 142, 233', href: 'https://discovery.ucl.ac.uk/id/eprint/1557938/1/Sri-Lanka-at-the-Crossroads-of-History.pdf' },
  // a 1920 book: cited for one fact only, Nallur as the seat of the kingdom (p. 56)
  pieris: { year: '1920', institution: 'P. E. Pieris · Internet Archive, UCLA Library copy', title: 'Ceylon and the Portuguese, 1505–1658 — p. 56', href: 'https://archive.org/details/ceylonportuguese00pier' },
  independence: { year: '1947', institution: 'UK Parliament · legislation.gov.uk', title: 'Ceylon Independence Act 1947, s. 5 — appointed day, 4 February 1948', href: 'https://www.legislation.gov.uk/ukpga/Geo6/11-12/7/section/5' },
  citizenshipAct: { year: '1948', institution: 'University of Minnesota Human Rights Library', title: 'Citizenship Act, No. 18 of 1948 — s. 4, citizenship by descent', href: 'https://hrlibrary.law.umn.edu/research/srilanka/statutes/Citizenship_Act.pdf' },
  statelessness: { year: '2019', institution: 'Verité Research · Institute on Statelessness and Inclusion', title: 'Hill Country Tamils of Sri Lanka: Towards Meaningful Citizenship — pp. 15, 17', href: 'https://www.veriteresearch.org/wp-content/uploads/2024/05/Verite-Research-Hill-Country-Tamils-of-Sri-Lanka-Towards-Meaningful-Citizenship-1.pdf' },
  constitution: { year: '2023', institution: 'Parliament of Sri Lanka', title: 'The Constitution, revised edition 2023 — Art. 18, as amended by the Thirteenth Amendment', href: 'https://www.parliament.lk/files/pdf/constitution.pdf' },
  // the results list candidates by ballot symbol: the TULF stood under the Sun
  election1977: { year: '1977', institution: 'Election Commission of Sri Lanka', title: 'Parliamentary Election 1977 — results by electorate (nos. 79–102)', href: 'https://elections.gov.lk/web/wp-content/uploads/election-results/parliamentary-elections/general-election-1977.pdf' },
  ipu1977: { year: '1978', institution: 'Inter-Parliamentary Union', title: 'Chronicle of Parliamentary Elections XII (1977–78) — Sri Lanka, pp. 127–129', href: 'http://archive.ipu.org/parline-e/reports/arc/SRI_LANKA_1977_E.PDF' },
  ohchr2022: { year: '2022', institution: 'OHCHR', title: 'Situation of human rights in Sri Lanka — A/HRC/51/5, § 39', href: 'https://documents.un.org/doc/undoc/gen/g22/511/79/pdf/g2251179.pdf' },
  hrw2024: { year: '2024', institution: 'Human Rights Watch', title: 'Sri Lanka: Families of “Disappeared” Persecuted', href: 'https://www.hrw.org/news/2024/08/29/sri-lanka-families-disappeared-persecuted' },
  displaced: { year: '2008', institution: 'United Nations · Representative on the human rights of internally displaced persons', title: 'Mission to Sri Lanka — A/HRC/8/6/Add.4, § 16', href: 'https://documents.un.org/doc/undoc/gen/g08/135/54/pdf/g0813554.pdf' },
  leopard: { year: '2018', institution: 'Biodiversity and Conservation · Springer', title: 'Island-wide distribution of the Sri Lankan leopard, Panthera pardus kotiya (Kittle et al.)', href: 'https://link.springer.com/article/10.1007/s10531-017-1431-8' },
  karthigai: { year: '2023', institution: 'New Lines Magazine · reportage', title: 'In Sri Lanka, Tamils Are Divided Over the Tigers’ Militant Legacy', href: 'https://newlinesmag.com/reportage/in-sri-lanka-tamils-are-divided-over-the-tigers-militant-legacy/' },
  // Two recognitions that are not court judgments: a provincial statute and an opinion tribunal.
  // Neither is cited for a figure (the Ontario preamble's death tolls do not match the UN Panel's).
  ontario: { year: '2021', institution: 'Legislative Assembly of Ontario', title: 'Tamil Genocide Education Week Act, 2021, S.O. 2021, c. 11', href: 'https://www.ontario.ca/laws/statute/21t11' },
  ppt: { year: '2013', institution: 'Permanent Peoples’ Tribunal · civil-society opinion tribunal', title: 'Session on Sri Lanka II, Bremen, 7–10 December 2013', href: 'https://permanentpeoplestribunal.org/39-sri-lanka-and-tamil-people-second-session-bremen-7-10-december-2013/?lang=en' },
} as const
export type SourceId = keyof typeof sources

export const chapterSources: Record<string, SourceId[]> = {
  terre: ['history', 'crossroads', 'pieris', 'reforms', 'independence'],
  etau: ['reforms', 'citizenshipAct', 'statelessness', 'citizenship', 'language', 'constitution'],
  // OISL says nothing of 1981 or the library: the ICJ's 1981 mission report does
  feu: ['library', 'icjLeary'], promesse: ['resolution', 'election1977', 'ipu1977'],
  juillet: ['oisl', 'icjLeary', 'icjSieghart', 'hrw'],
  prabhakaran: ['prabhakaran', 'language', 'resolution', 'conflict', 'ceasefire'],
  maaveerar: ['memorialArchive', 'memorialSites', 'maaveerar', 'remembrance', 'karthigai'],
  mullivaikkal: ['panel', 'oisl', 'review', 'hrw2009', 'icg', 'kanji', 'canada'],
  disparus: ['disappearances', 'wgeid', 'ohchr2022', 'hrw2024', 'hrw'],
  patrie: ['history', 'crossroads', 'review', 'displaced', 'oisl'],
  symboles: ['memorialArchive', 'karthigai', 'leopard', 'maaveerar'],
  aube: ['remembrance', 'memorialArchive', 'maaveerar', 'ohchr2021', 'canada', 'ontario', 'ppt', 'uk'],
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
