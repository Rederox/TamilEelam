/**
 * The field recordings the ambient sound is made from (public/audio), all
 * from Wikimedia Commons. Each was trimmed, filtered and level-matched for
 * the page; the CC BY-SA ones remain under that licence.
 */

export interface SoundCredit {
  file: string
  what: { fr: string; en: string; ta: string }
  author: string
  license: string
  licenseUrl: string
  href: string
}

export const soundCredits: SoundCredit[] = [
  {
    file: 'sea.mp3',
    what: { fr: 'Vagues sur une plage tropicale', en: 'Waves on a tropical beach', ta: 'வெப்பமண்டலக் கடற்கரை அலைகள்' },
    author: 'Jarrod Stanley (J.D. Savanyu)',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    href: 'https://commons.wikimedia.org/wiki/File:Ocean_Waves_on_a_Tropical_Beach.ogg',
  },
  {
    file: 'fire.mp3',
    what: { fr: 'Un grand feu qui brûle', en: 'A large fire burning', ta: 'எரியும் பெருந்தீ' },
    author: 'Work With Sounds / Werstas',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    href: 'https://commons.wikimedia.org/wiki/File:WWS_Bonfireburning.ogg',
  },
  {
    file: 'shells.mp3',
    what: { fr: 'Tirs d’artillerie (démonstration, Fort Nelson)', en: 'Artillery firing (demonstration, Fort Nelson)', ta: 'பீரங்கிச் சூடு (செயல்விளக்கம், Fort Nelson)' },
    author: 'LouiseBrown1981',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    href: 'https://commons.wikimedia.org/wiki/File:Sexton_artillery_firing.oga',
  },
  {
    file: 'wind.mp3',
    what: { fr: 'Vent dans les arbres', en: 'Wind in the trees', ta: 'மரங்களில் காற்று' },
    author: 'Gravity Sound',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    href: 'https://commons.wikimedia.org/wiki/File:Wind_in_forest_(Gravity_Sound).wav',
  },
  {
    file: 'crickets.mp3',
    what: { fr: 'Grillons', en: 'Crickets', ta: 'சில்வண்டுகள்' },
    author: 'Fortunamarco2003',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    href: 'https://commons.wikimedia.org/wiki/File:Night_original_format.wav',
  },
  {
    file: 'clock.mp3',
    what: { fr: 'Une horloge comtoise', en: 'A grandfather clock', ta: 'ஒரு பழைய சுவர்க்கடிகாரம்' },
    author: 'Jud McCranie',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    href: 'https://commons.wikimedia.org/wiki/File:Grandfather_Clock_Ticking.ogg',
  },
  {
    file: 'birds.mp3',
    what: { fr: 'Oiseaux, forêt de Perungalathur (Tamil Nadu)', en: 'Birds, Perungalathur forest (Tamil Nadu)', ta: 'பெருங்களத்தூர் காட்டுப் பறவைகள் (தமிழ்நாடு)' },
    author: 'Mk170101',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    href: 'https://commons.wikimedia.org/wiki/File:Birds_Perungalathur_Reserved_Forest.wav',
  },
  {
    file: 'koel.mp3',
    what: { fr: 'Le koël (kuyil), Ezhimala, Kerala', en: 'The Asian koel (kuyil), Ezhimala, Kerala', ta: 'குயில், எழிமலை, கேரளம்' },
    author: 'Manoj Karingamadathil',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    href: 'https://commons.wikimedia.org/wiki/File:Asian_Koel_Eudynamys_scolopaceus_from_Ezhimala_Kannur_Kerala.wav',
  },
  {
    file: 'bell.mp3',
    what: { fr: 'Ghanta, cloche rituelle en laiton', en: 'Ghanta, a brass ritual bell', ta: 'கண்டாமணி, பித்தளைப் பூசை மணி' },
    author: 'the_very_Real_Horst',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    href: 'https://commons.wikimedia.org/wiki/File:274316_the-very-real-horst_ghanta-leather-mallet-2015-05-16.wav',
  },
]

export const soundCreditsLabel = {
  fr: 'Sons — enregistrements de terrain',
  en: 'Sound — field recordings',
  ta: 'ஒலிகள் — கள ஒலிப்பதிவுகள்',
}
