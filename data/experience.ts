import type { Localized } from './research'
const tr = (fr: string, en: string, ta: string): Localized => ({ fr, en, ta })

export const experience = {
  etau: tr('L’exclusion s’écrit aussi sur du papier.', 'Exclusion is also written on paper.', 'விலக்கல் தாளிலும் எழுதப்படுகிறது.'),
  etauSub: tr('Un texte de loi. Puis une porte qui se ferme dans la vie de tous les jours.', 'A legal text. Then a door closing in everyday life.', 'ஒரு சட்ட உரை. பின்னர் அன்றாட வாழ்வில் மூடப்படும் ஒரு கதவு.'),
  library: tr('On peut reconstruire des murs. Pas les pages disparues.', 'Walls can be rebuilt. Lost pages cannot.', 'சுவர்களை மீண்டும் கட்டலாம். இழந்த பக்கங்களை அல்ல.'),
  libraryDate: tr('31 mai — 1er juin 1981', '31 May — 1 June 1981', '1981 மே 31 — ஜூன் 1'),
  resolution: tr('Le droit de décider de son avenir.', 'The right to decide one’s future.', 'தமது எதிர்காலத்தைத் தீர்மானிக்கும் உரிமை.'),
  resolutionLabel: tr('La revendication politique', 'The political demand', 'அரசியல் கோரிக்கை'),
  july: tr('Une maison devient un lieu à fuir.', 'A home becomes a place to flee.', 'ஒரு வீடு தப்பிச்செல்ல வேண்டிய இடமாகிறது.'),
  julySub: tr('Ce que l’exil emporte ne tient pas dans une valise.', 'What exile takes away does not fit in a suitcase.', 'புலம்பெயர்வு எடுத்துச் செல்வது ஒரு பெட்டிக்குள் அடங்காது.'),
  war: tr('Après le pogrom, la guerre.', 'After the pogrom, the war.', 'படுகொலைக்குப் பின்னர் போர்.'),
  absence: tr('Une place reste vide.', 'A place remains empty.', 'ஓர் இடம் வெறுமையாக உள்ளது.'),
  waiting: tr('Leurs familles demandent une réponse.', 'Their families ask for an answer.', 'அவர்களின் குடும்பங்கள் பதில் கேட்கின்றன.'),
  map: tr('Les lieux que l’on porte en soi.', 'The places carried within.', 'நமக்குள் சுமக்கும் இடங்கள்.'),
  mapNote: tr('Carte de repérage des lieux du récit. Elle ne représente ni une frontière reconnue, ni les zones de contrôle militaire. Puttalam se situe dans la province du Nord-Ouest.', 'A locator map of places in this story. It shows neither a recognised border nor military control zones. Puttalam is in the North Western Province.', 'கதையின் இடங்களைக் குறிக்கும் வரைபடம். அங்கீகரிக்கப்பட்ட எல்லையையோ இராணுவக் கட்டுப்பாட்டுப் பகுதிகளையோ காட்டவில்லை. புத்தளம் வடமேல் மாகாணத்தில் உள்ளது.'),
  symbols: tr('Ce qui reste familier, même loin.', 'What stays familiar, even far away.', 'தொலைவிலும் பழகியவை.'),
  diaspora: tr('Le pays voyage avec nous.', 'Home travels with us.', 'தாயகம் நம்முடன் பயணிக்கிறது.'),
  diasporaSub: tr('Dans une langue apprise à un enfant. Dans un prénom. Dans une lumière allumée le 18 mai.', 'In a language taught to a child. In a name. In a light lit on 18 May.', 'ஒரு குழந்தைக்குக் கற்பிக்கும் மொழியில். ஒரு பெயரில். மே 18-இல் ஏற்றும் ஒளியில்.'),
  justice: tr('La mémoire demande aussi des comptes.', 'Memory also asks for accountability.', 'நினைவு பொறுப்புக்கூறலையும் கேட்கிறது.'),
  share: tr('Transmettre cette histoire', 'Pass this story on', 'இந்த வரலாற்றைப் பகிருங்கள்'),
  copied: tr('Le lien a été copié.', 'The link has been copied.', 'இணைப்பு நகலெடுக்கப்பட்டது.'),
  copyError: tr('Copiez l’adresse de la page pour partager cette histoire.', 'Copy the page address to share this story.', 'இந்த வரலாற்றைப் பகிர பக்க முகவரியை நகலெடுக்கவும்.'),
}
