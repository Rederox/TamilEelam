import type { Lang } from './events'

/**
 * What stands at the address until the vigil opens: one screen, a lamp set
 * down on a kolam, and the word that it is coming.
 */
export const soon: Record<Lang, {
  whisper: string
  line1: string
  line2: string
  sub: string
  status: string
  /** names what is on the floor, the way a museum label would */
  caption: string
}> = {
  fr: {
    whisper: 'Tamil Eelam · Mémoire d’un peuple',
    line1: 'La veillée',
    line2: 'commence bientôt.',
    sub: 'Avant d’ouvrir la porte, on trace le seuil. Chaque matin, devant les maisons tamoules, un kolam est dessiné à la farine de riz, d’un seul trait. Celui-ci attend un récit : l’histoire du peuple tamoul d’Eelam, de la terre à l’exil, écrite pour être transmise.',
    status: 'Ouverture prochaine',
    caption: 'Kolam, farine de riz · Agal vilakku, argile',
  },
  en: {
    whisper: 'Tamil Eelam · Memory of a people',
    line1: 'The vigil',
    line2: 'begins soon.',
    sub: 'Before the door opens, the threshold is drawn. Each morning, outside Tamil homes, a kolam is traced in rice flour, in one unbroken line. This one is waiting for a story: the history of the Eelam Tamil people, from homeland to exile, written to be passed on.',
    status: 'Opening soon',
    caption: 'Kolam, rice flour · Agal vilakku, clay',
  },
  ta: {
    whisper: 'தமிழீழம் · ஒரு மக்களின் நினைவு',
    line1: 'விழிப்பு',
    line2: 'விரைவில் தொடங்கும்.',
    sub: 'கதவு திறக்கும் முன் வாசலில் கோலம் இடப்படுகிறது. ஒவ்வொரு காலையும் தமிழ் வீடுகளின் முன், அரிசி மாவால், ஒரே கோட்டில் அது வரையப்படுகிறது. இந்தக் கோலம் ஒரு கதைக்காகக் காத்திருக்கிறது: தாயகம் முதல் புலம்பெயர்வு வரை, ஈழத் தமிழ் மக்களின் வரலாறு, அடுத்த தலைமுறைக்குக் கையளிக்க எழுதப்படுகிறது.',
    status: 'விரைவில் திறக்கப்படும்',
    caption: 'கோலம், அரிசி மா · அகல் விளக்கு, களிமண்',
  },
}
