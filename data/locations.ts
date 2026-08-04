import type { Lang } from './events'

export type LocationKey =
  | 'jaffna' | 'kilinochchi' | 'mullivaikkal' | 'mullaitivu'
  | 'vavuniya' | 'mannar' | 'trincomalee' | 'batticaloa'
  | 'amparai' | 'puttalam'

export interface Location {
  name: Record<Lang, string>
  tamil: string
  desc: Record<Lang, string>
  coords: [number, number]
  type: 'capital' | 'major' | 'normal'
}

export const locations: Record<LocationKey, Location> = {
  jaffna: {
    name: { fr: 'Jaffna', en: 'Jaffna', ta: 'யாழ்ப்பாணம்' },
    tamil: 'யாழ்ப்பாணம் · Yaazhpaanam',
    desc: {
      fr: 'Capitale culturelle, politique et spirituelle du Tamil Eelam. Siège du royaume tamoul de Jaffna pendant quatre siècles. Cœur du peuple.',
      en: 'Cultural, political and spiritual capital of Tamil Eelam. Seat of the Tamil Kingdom of Jaffna for four centuries. Heart of the people.',
      ta: 'தமிழீழத்தின் கலாச்சார, அரசியல், ஆன்மீக தலைநகர்.',
    },
    coords: [80.0074, 9.6615],
    type: 'capital',
  },
  kilinochchi: {
    name: { fr: 'Kilinochchi', en: 'Kilinochchi', ta: 'கிளிநொச்சி' },
    tamil: 'கிளிநொச்சி · Kilinochchi',
    desc: {
      fr: 'Centre administratif du Tamil Eelam pendant près de deux décennies — écoles, hôpitaux, tribunaux, banque tamoule. Aujourd\'hui lieu de la veille des Mères du Nord.',
      en: 'Administrative centre of Tamil Eelam for nearly two decades — schools, hospitals, courts, Tamil bank. Today, site of the Mothers of the North vigil.',
      ta: 'இரண்டு தசாப்தங்களாக தமிழீழத்தின் நிர்வாக மையம்.',
    },
    coords: [80.4036, 9.3956],
    type: 'major',
  },
  mullivaikkal: {
    name: { fr: 'Mullivaikkal', en: 'Mullivaikkal', ta: 'முள்ளிவாய்க்கால்' },
    tamil: 'முள்ளிவாய்க்கால் · Mullivaikkal',
    desc: {
      fr: 'Lieu sacré de mémoire. Mai 2009 : des dizaines de milliers de civils tamouls y ont perdu la vie. Chaque 18 mai, le monde tamoul s\'y recueille en pensée.',
      en: 'Sacred place of memory. May 2009: tens of thousands of Tamil civilians lost their lives here. Every 18 May, the Tamil world turns its thoughts here.',
      ta: 'புனித நினைவிடம். மே 2009 — ஆயிரக்கணக்கானோர் இங்கு உயிர் இழந்தனர்.',
    },
    coords: [80.8167, 9.2667],
    type: 'major',
  },
  mullaitivu: {
    name: { fr: 'Mullaitivu', en: 'Mullaitivu', ta: 'முல்லைத்தீவு' },
    tamil: 'முல்லைத்தீவு · Mullaitivu',
    desc: {
      fr: 'District côtier du Nord-Est. Théâtre de la phase finale de la guerre. Mémoire du génocide.',
      en: "North-Eastern coastal district. Site of the war's final phase. Memory of genocide.",
      ta: 'வடகிழக்கு கடற்கரை மாவட்டம்.',
    },
    coords: [80.8128, 9.1330],
    type: 'normal',
  },
  vavuniya: {
    name: { fr: 'Vavuniya', en: 'Vavuniya', ta: 'வவுனியா' },
    tamil: 'வவுனியா · Vavuniya',
    desc: {
      fr: 'Porte du Nord. Lieu central des veilles des familles de disparus. Plus grande ville par sa population du Northern Province.',
      en: 'Gateway to the North. Central site of vigils by families of the disappeared. Largest city by population in the Northern Province.',
      ta: 'வடக்கின் வாயில்.',
    },
    coords: [80.4970, 8.7514],
    type: 'normal',
  },
  mannar: {
    name: { fr: 'Mannar', en: 'Mannar', ta: 'மன்னார்' },
    tamil: 'மன்னார் · Mannar',
    desc: {
      fr: 'Ville côtière du Nord-Ouest. Pont historique vers le Tamil Nadu. Mémoire des migrations forcées et des massacres.',
      en: 'North-Western coastal town. Historic bridge to Tamil Nadu. Memory of forced migrations and massacres.',
      ta: 'வடமேற்கு கடற்கரை நகரம்.',
    },
    coords: [79.9043, 8.9810],
    type: 'normal',
  },
  trincomalee: {
    name: { fr: 'Trincomalee', en: 'Trincomalee', ta: 'திருகோணமலை' },
    tamil: 'திருகோணமலை · Thirukonamalai',
    desc: {
      fr: 'Grand port naturel de la côte Est. Site du temple Koneswaram, lieu sacré shivaïte. Capitale historique du Tamil Eelam Oriental.',
      en: 'Great natural harbour of the East coast. Site of Koneswaram Temple, a sacred Shaivite shrine. Historic capital of Eastern Tamil Eelam.',
      ta: 'கிழக்குக் கரையின் இயற்கைத் துறைமுகம்.',
    },
    coords: [81.2335, 8.5874],
    type: 'major',
  },
  batticaloa: {
    name: { fr: 'Batticaloa', en: 'Batticaloa', ta: 'மட்டக்களப்பு' },
    tamil: 'மட்டக்களப்பு · Mattakkalappu',
    desc: {
      fr: 'Centre culturel de la côte Est. Connue pour son lagon, son université tamoule, ses traditions musicales. Lourdement touchée par les violences.',
      en: 'Cultural centre of the East coast. Known for its lagoon, Tamil university, musical traditions. Heavily affected by the violence.',
      ta: 'கிழக்குக் கரையின் கலாச்சார மையம்.',
    },
    coords: [81.6986, 7.7170],
    type: 'normal',
  },
  amparai: {
    name: { fr: 'Amparai (Ampara)', en: 'Amparai (Ampara)', ta: 'அம்பாறை' },
    tamil: 'அம்பாறை · Amparai',
    desc: {
      fr: 'District côtier du Sud-Est. Importante population tamoule et musulmane. Théâtre de massacres et de colonisation systématique de terres tamoules.',
      en: 'South-Eastern coastal district. Significant Tamil and Muslim population. Site of massacres and systematic colonisation of Tamil lands.',
      ta: 'தென்கிழக்கு கடற்கரை மாவட்டம்.',
    },
    coords: [81.6747, 7.2974],
    type: 'normal',
  },
  puttalam: {
    name: { fr: 'Puttalam', en: 'Puttalam', ta: 'புத்தளம்' },
    tamil: 'புத்தளம் · Puttalam',
    desc: {
      fr: 'District côtier de l\'Ouest. Refuge des dizaines de milliers de Tamouls musulmans expulsés du Nord en 1990. Mémoire d\'un autre exil tamoul.',
      en: 'Western coastal district. Refuge for tens of thousands of Tamil-speaking Muslims expelled from the North in 1990. Memory of another Tamil exile.',
      ta: 'மேற்கு கடற்கரை மாவட்டம்.',
    },
    coords: [79.8410, 8.0362],
    type: 'normal',
  },
}
