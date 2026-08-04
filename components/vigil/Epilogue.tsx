'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/context/LanguageContext'
import { vigil } from '@/data/narrative'
import Flame from './Flame'
import GlEmbers from './gl/GlEmbers'
import GlFlameField from './gl/GlFlameField'

const SOURCES: { label: string; href?: string }[] = [
  { label: 'ONU — Rapport du Panel d\'experts (Darusman, 2011)', href: 'https://www.un.org/News/dh/infocus/Sri_Lanka/POE_Report_Full.pdf' },
  { label: 'UN OHCHR — Enquête OISL (2015)', href: 'https://www.ohchr.org/en/hr-bodies/hrc/oisl' },
  { label: 'International Truth & Justice Project', href: 'https://itjpsl.com' },
  { label: 'PEARL Action — The Tamil Genocide', href: 'https://pearlaction.org/tamil-genocide/' },
  { label: 'Tamil Guardian', href: 'https://www.tamilguardian.com' },
  { label: 'Le Temps — « Prabhakaran, le dernier souffle des Tigres » (2009)', href: 'https://www.letemps.ch/monde/prabhakaran-dernier-souffle-tigres' },
  { label: 'Migrations Société — « Réfugiés tamouls sri-lankais » (Cairn, 2015)', href: 'https://www.cairn.info/revue-migrations-societe-2015-5-page-105.htm' },
  { label: 'BBC — Sri Lanka profile: Timeline', href: 'https://www.bbc.com/news/world-south-asia-12004081' },
  { label: 'Bibliomonde — Maaveerar Naal, 27 novembre', href: 'https://www.bibliomonde.fr/lalmanach/maaveerar-naal-27-novembre-tamoul-sri-lanka' },
  { label: 'Nijaththadan — Eelappadukolayin Suvadugal (Niedharshanam, 2022)' },
  { label: 'Mothers of the Disappeared' },
]

// Epilogue — the flame is passed to the visitor.
export default function Epilogue() {
  const { lang, t } = useLang()
  const v = vigil[lang]
  const [lit, setLit] = useState(false)

  useEffect(() => {
    setLit(localStorage.getItem('vigil-flame') === '1')
  }, [])

  const light = () => {
    setLit(true)
    localStorage.setItem('vigil-flame', '1')
  }

  return (
    <>
      <section
        id="epilogue"
        className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-night bg-[radial-gradient(90%_70%_at_50%_100%,rgb(var(--c-flame)/0.10),transparent_60%)] px-6 pb-16 pt-28 text-center"
      >
        <GlEmbers density={55} intensity={0.6} fallbackDensity={12} />

        {/* when the visitor lights their flame, it joins thousands of others */}
        <GlFlameField lit={lit} />

        <h2 className="lang-title relative z-[2] max-w-[20ch] font-display text-[clamp(30px,5.4vw,62px)] font-[320] leading-[1.18]">
          {v.epiTitle1} <em className="italic text-flame">{v.epiTitle2}</em>
        </h2>
        <p className="mt-7 max-w-[540px] text-base leading-[1.75] text-bone-dim">{v.epiText}</p>

        <div className="my-12 flex flex-col items-center gap-6">
          <Flame size={38} lit={lit} />
          {lit ? (
            <p className="max-w-[42ch] animate-rise-in text-[15px] italic text-bone-dim" style={{ animationDuration: '1s' }}>
              {v.epiFlameLit}
              <br />
              {v.epiTransmit}
              <br />
              <span className="mt-2 inline-block font-mono text-[10px] uppercase not-italic tracking-[0.2em] text-flame">
                {lang === 'fr' ? 'Votre flamme brûle parmi des milliers d\'autres' : lang === 'en' ? 'Your flame burns among thousands of others' : 'உங்கள் சுடர் ஆயிரக்கணக்கானவற்றுடன் எரிகிறது'}
              </span>
            </p>
          ) : (
            <button
              onClick={light}
              className="border border-flame px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-flame transition-all duration-300 hover:bg-flame/10 hover:shadow-[0_0_30px_rgb(var(--c-flame)/0.25)]"
            >
              {v.epiFlameBtn}
            </button>
          )}
        </div>

        <div className="font-tamil text-[clamp(20px,3vw,30px)] font-semibold text-ember">{t('ft-motto')}</div>
      </section>

      <footer className="grid grid-cols-1 gap-10 border-t border-bone/15 bg-night-2 px-6 pb-10 pt-12 sm:px-[9vw] lg:grid-cols-[2fr_1fr]">
        <div>
          <h4 className="mb-3.5 font-mono text-[10px] uppercase tracking-[0.24em] text-ash">{t('ft-about-label')}</h4>
          <p className="max-w-[46ch] text-[14.5px] italic leading-[1.7] text-bone-dim">{t('ft-about')}</p>
        </div>
        <div>
          <h4 className="mb-3.5 font-mono text-[10px] uppercase tracking-[0.24em] text-ash">{v.epiSources}</h4>
          <ul className="space-y-2 text-[13.5px] text-bone-dim">
            {SOURCES.map((s) => (
              <li key={s.label}>
                {s.href ? (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-bone/25 underline-offset-4 transition-colors hover:text-flame hover:decoration-flame/60"
                  >
                    {s.label}
                  </a>
                ) : (
                  s.label
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-full mt-6 flex flex-wrap justify-between gap-3 border-t border-bone/15 pt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-ash-dim">
          <span>தமிழீழம் — Tamil Eelam · {new Date().getFullYear()}</span>
          <span>Mullivaikkal Remembrance Day — 18.05</span>
        </div>
      </footer>
    </>
  )
}
