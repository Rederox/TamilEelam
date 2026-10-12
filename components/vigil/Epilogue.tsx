'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/context/LanguageContext'
import { sources, researchCopy } from '@/data/research'
import { vigil } from '@/data/narrative'
import { soundCredits, soundCreditsLabel } from '@/data/soundCredits'
import { usePresence } from '@/hooks/usePresence'
import { lightLamp } from '@/lib/sounds/bell'
import Vilakku from './Vilakku'
import GlEmbers from './gl/GlEmbers'
import GlFlameField from './gl/GlFlameField'

// Epilogue — the flame is passed to the visitor.
export default function Epilogue() {
  const { lang, t } = useLang()
  const v = vigil[lang]
  const [lit, setLit] = useState(false)
  // the ambient sound listens for this: the lamp's own flame, heard once it is lit
  const lampRef = usePresence<HTMLElement>('lamp', lit ? 0.8 : 0)
  // bumped when the visitor lights their flame: the embers answer with a burst of sparks
  const burst = useRef(0)

  useEffect(() => {
    try { setLit(localStorage.getItem('vigil-flame') === '1') } catch { /* Storage is optional. */ }
  }, [])

  const light = () => {
    setLit(true)
    burst.current += 1
    lightLamp()
    try { localStorage.setItem('vigil-flame', '1') } catch { /* The gesture still works for this visit. */ }
  }

  return (
    <>
      <section
        id="epilogue"
        ref={lampRef}
        className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-night bg-[radial-gradient(90%_70%_at_50%_100%,rgb(var(--c-flame)/0.10),transparent_60%)] px-6 pb-16 pt-28 text-center"
      >
        <GlEmbers density={55} intensity={0.6} fallbackDensity={12} burst={burst} burstAt={{ x: 0.5, y: 0.6 }} />

        {/* A symbolic field of flames accompanies this personal gesture */}
        <GlFlameField lit={lit} />

        <h2 className="lang-title relative z-[2] max-w-[20ch] font-display text-[clamp(30px,5.4vw,62px)] font-[320] leading-[1.18]">
          {v.epiTitle1} <em className="italic text-flame">{v.epiTitle2}</em>
        </h2>
        <p className="mt-7 max-w-[540px] text-base leading-[1.75] text-bone-dim">{v.epiText}</p>

        {/* lighting the flame swaps the control for a message: say so out loud */}
        <div aria-live="polite" className="my-12 flex flex-col items-center gap-6">
          {/* the earthen lamp the visitor lights, not a flame on nothing */}
          <Vilakku size={280} lit={lit} />
          {lit ? (
            <p className="max-w-[42ch] animate-rise-in text-[15px] italic text-bone-dim" style={{ animationDuration: '1s' }}>
              {v.epiFlameLit}
              <br />
              {v.epiTransmit}
              <br />
              <span className="mt-2 inline-block font-mono text-[10px] uppercase not-italic tracking-[0.2em] text-flame">
                {t('epi-among-others')}
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={light}
              className="min-h-[44px] border border-flame px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-flame transition-[background-color,box-shadow] duration-300 ease-vigil hover:bg-flame/10 hover:shadow-[0_0_30px_rgb(var(--c-flame)/0.25)]"
            >
              {v.epiFlameBtn}
            </button>
          )}
        </div>

        <div className="font-tamil text-[clamp(20px,3vw,30px)] font-semibold text-ember">{t('ft-motto')}</div>
      </section>

      <footer id="sources" className="relative border-t border-bone/15 bg-night-2 px-6 pb-24 pt-20 sm:px-[9vw]">
        <div className="mx-auto max-w-[1200px]">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">{researchCopy.label[lang]}</p>
          <h2 className="lang-title mt-5 max-w-[22ch] font-display text-[clamp(32px,5vw,64px)] font-light leading-[1.2]">{researchCopy.heading[lang]}</h2>
          <div className="my-10 grid gap-8 text-base leading-[1.8] text-bone-dim lg:grid-cols-2">
            <p>{researchCopy.method[lang]}</p>
            <p>{researchCopy.qualification[lang]}</p>
          </div>
          <ul className="grid gap-x-10 md:grid-cols-2">
            {Object.entries(sources).map(([id, source], index) => (
              <li key={id} className="border-t border-bone/15">
                <a href={source.href} target="_blank" rel="noopener noreferrer" className="group flex gap-4 py-5 hover:text-flame">
                  <span className="pt-1 font-mono text-[10px] text-ash">{String(index + 1).padStart(2, '0')}</span>
                  <span><span className="block font-mono text-[9px] uppercase tracking-[0.1em] text-gold">{source.institution} · {source.year}</span><span className="mt-2 block text-[15px] leading-relaxed text-bone-dim group-hover:text-flame">{source.title} ↗</span></span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-8 font-mono text-[10px] text-ash">{researchCopy.reviewed[lang]}</p>
          {/* the ambient sound is made of other people's field recordings: say whose */}
          <div className="mt-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">{soundCreditsLabel[lang]}</p>
            <ul className="mt-4 grid gap-x-10 gap-y-2 text-[13px] leading-relaxed text-ash md:grid-cols-2">
              {soundCredits.map((credit) => (
                <li key={credit.file}>
                  <a href={credit.href} target="_blank" rel="noopener noreferrer" className="hover:text-flame">{credit.what[lang]} — {credit.author}</a>
                  {' · '}
                  <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] hover:text-flame">{credit.license}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-16 flex flex-wrap justify-between gap-6 border-t border-bone/15 pt-7">
            <p className="max-w-[50ch] text-sm italic leading-relaxed text-bone-dim">{t('ft-about')}</p>
            <a href="#prologue" className="font-tamil text-xl text-gold">தமிழீழம் ↑</a>
          </div>
        </div>
      </footer>
    </>
  )
}
