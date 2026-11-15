'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/context/LanguageContext'
import { sources, researchCopy } from '@/data/research'
import { vigil } from '@/data/narrative'
import { soundCredits, soundCreditsLabel } from '@/data/soundCredits'
import { usePresence } from '@/hooks/usePresence'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useReveal } from '@/hooks/useReveal'
import { lightLamp } from '@/lib/sounds/bell'
import Vilakku from './Vilakku'
import { GlEmbers, GlFlameField } from './gl/lazy'
import s from './Epilogue.module.css'

/** unlit → held (the gesture is made, the room holds its breath) → lit;
 *  `kept` is a lamp lit on an earlier visit: the settled room, nothing replayed */
type Phase = 'unlit' | 'held' | 'lit' | 'kept'
// the dark between the gesture and the wick taking
const HOLD = 1000

// Epilogue — the flame is passed to the visitor.
export default function Epilogue() {
  const { lang, t } = useLang()
  const v = vigil[lang]
  const still = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('unlit')
  const lit = phase !== 'unlit'
  const burning = phase === 'lit' || phase === 'kept'
  // the ambient sound listens for this: the lamp's own flame, heard once it is lit
  const lampRef = usePresence<HTMLElement>('lamp', lit ? 0.8 : 0)
  const standRef = useRef<HTMLDivElement>(null)
  const creditsRef = useReveal()
  // bumped when the wick takes: the embers answer with a burst of sparks
  const burst = useRef(0)
  // a ref, not the state: a double click lands before the next render
  const acted = useRef(false)
  const hold = useRef<ReturnType<typeof setTimeout>>()
  // the lamp has come up into the screen: the room may settle around it
  const [near, setNear] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem('vigil-flame') === '1') { acted.current = true; setPhase('kept') }
    } catch { /* Storage is optional. */ }
    return () => clearTimeout(hold.current)
  }, [])

  // where the wick stands in the section, for the dark and the light to centre on
  useEffect(() => {
    const room = lampRef.current
    const stand = standRef.current
    if (!room || !stand) return
    const measure = () => {
      const r = room.getBoundingClientRect()
      const l = stand.getBoundingClientRect()
      if (r.height) room.style.setProperty('--ly', `${(((l.top + l.height * 0.45 - r.top) / r.height) * 100).toFixed(1)}%`)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(room)
    return () => ro.disconnect()
  }, [lampRef, lang])

  useEffect(() => {
    const stand = standRef.current
    if (!stand || still) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setNear(true); io.disconnect() } },
      { rootMargin: '0px 0px -30% 0px' }
    )
    io.observe(stand)
    return () => io.disconnect()
  }, [still])

  const light = () => {
    if (acted.current) return
    acted.current = true
    // the match and the bell belong to the gesture itself; what is seen waits
    lightLamp()
    try { localStorage.setItem('vigil-flame', '1') } catch { /* The gesture still works for this visit. */ }
    const take = () => { burst.current += 1; setPhase('lit') }
    if (still) return take()
    setPhase('held')
    hold.current = setTimeout(take, HOLD)
  }

  const message = (
    <>
      <span className={s.line}>{v.epiFlameLit}</span>
      <span className={s.line}>{v.epiTransmit}</span>
      <span className={`${s.line} mt-2 font-mono text-[10px] uppercase not-italic tracking-[0.2em] text-flame`}>{t('epi-among-others')}</span>
    </>
  )

  return (
    <>
      <section
        id="epilogue"
        ref={lampRef}
        data-lamp={phase}
        data-near={near && !still}
        className={`${s.room} relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-night bg-[radial-gradient(90%_70%_at_50%_100%,rgb(var(--c-flame)/0.10),transparent_60%)] px-6 pb-16 pt-28 text-center`}
      >
        <GlEmbers density={55} intensity={0.6} fallbackDensity={12} burst={burst} burstAt={{ x: 0.5, y: 0.6 }} />

        {/* A symbolic field of flames accompanies this personal gesture */}
        <GlFlameField lit={burning} />

        <span aria-hidden="true" className={s.dark} />
        <span aria-hidden="true" className={s.light} />

        <h2 className="lang-title relative z-[2] max-w-[20ch] font-display text-[clamp(30px,5.4vw,62px)] font-[320] leading-[1.18]">
          {v.epiTitle1} <em className="italic text-flame">{v.epiTitle2}</em>
        </h2>
        <p className="relative z-[2] mt-7 max-w-[540px] text-base leading-[1.75] text-bone-dim">{v.epiText}</p>

        {/* the earthen lamp the visitor lights, not a flame on nothing */}
        <div ref={standRef} className="relative z-[2] mt-12">
          <Vilakku size={280} lit={burning} />
        </div>

        {/* lighting the flame swaps the control for a message: say so out loud */}
        <div aria-live="polite" className={`${s.cell} relative z-[2] mb-12 mt-6`}>
          <p aria-hidden="true" className={`${s.sizer} max-w-[42ch] text-[15px] italic`}>{message}</p>
          {lit && <p className="max-w-[42ch] text-[15px] italic text-bone-dim">{message}</p>}
          {!burning && (
            <button
              type="button"
              onClick={light}
              className={`${s.button} min-h-[44px] border border-flame px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-flame hover:bg-flame/10 hover:shadow-[0_0_30px_rgb(var(--c-flame)/0.25)]`}
            >
              {v.epiFlameBtn}
            </button>
          )}
        </div>

        <div className={`${s.motto} relative z-[2] font-tamil text-[clamp(20px,3vw,30px)] font-semibold text-ember`}>{t('ft-motto')}</div>
      </section>

      {/* The end credits, and this film's credits are its proof. A roll in
          form only: it never moves by itself, the reader passes the names at
          their own pace, and every one of them is a link. */}
      <footer id="sources" ref={creditsRef} className="relative border-t border-bone/15 bg-night-2 px-6 pt-24 text-center sm:px-[9vw]">
        <div className="mx-auto max-w-[1040px]">
          {/* the opening card: what this is, and what it does not claim */}
          <div className="reveal">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">{researchCopy.label[lang]}</p>
            <h2 className="lang-title mx-auto mt-5 max-w-[22ch] font-display text-[clamp(32px,5vw,64px)] font-light leading-[1.2]">{researchCopy.heading[lang]}</h2>
          </div>
          <div className="reveal mx-auto mt-10 grid max-w-[60ch] gap-6 text-base leading-[1.8] text-bone-dim">
            <p>{researchCopy.method[lang]}</p>
            <p>{researchCopy.qualification[lang]}</p>
          </div>
          <ul className="mt-16 md:mt-24">
            {Object.entries(sources).map(([id, source], index) => (
              <li key={id} className={`reveal ${s.credit}`}>
                <a href={source.href} target="_blank" rel="noopener noreferrer" className="group block min-h-[44px] py-3 md:grid md:grid-cols-2 md:items-baseline md:gap-x-10 md:py-2.5">
                  <span className="block font-mono text-[10px] uppercase leading-[1.7] tracking-[0.14em] text-gold md:text-right">
                    <span className="mr-3 tracking-normal text-ash">{String(index + 1).padStart(2, '0')}</span>
                    {source.institution} · {source.year}
                  </span>
                  <span className="mx-auto mt-1 block max-w-[34ch] font-display text-[17px] font-[340] leading-[1.35] text-bone group-hover:text-flame md:mx-0 md:mt-0 md:max-w-none md:text-left md:text-[19px]">{source.title}{'\u00a0'}↗</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="reveal mt-10 font-mono text-[10px] text-ash">{researchCopy.reviewed[lang]}</p>
          {/* the ambient sound is made of other people's field recordings: say whose */}
          <div className="reveal mt-20 md:mt-28">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">{soundCreditsLabel[lang]}</p>
            <ul className="mt-5 grid gap-y-2.5 text-[13px] leading-relaxed text-ash">
              {soundCredits.map((credit) => (
                <li key={credit.file}>
                  <a href={credit.href} target="_blank" rel="noopener noreferrer" className="hover:text-flame">{credit.what[lang]} — {credit.author}</a>
                  {' · '}
                  <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] hover:text-flame">{credit.license}</a>
                </li>
              ))}
            </ul>
          </div>
          {/* the last frame: one line, then the way back, and nothing else */}
          <div className={`reveal ${s.last} flex flex-col items-center justify-center gap-12`}>
            <p className="max-w-[50ch] text-sm italic leading-relaxed text-bone-dim">{t('ft-about')}</p>
            <a href="#prologue" className="inline-flex min-h-[44px] items-center font-tamil text-xl text-gold">தமிழீழம் ↑</a>
          </div>
        </div>
      </footer>
    </>
  )
}
