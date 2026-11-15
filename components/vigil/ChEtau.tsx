'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useLang } from '@/context/LanguageContext'
import { events } from '@/data/events'
import { experience } from '@/data/experience'
import { vigil } from '@/data/narrative'
import { useOrdeal } from '@/hooks/useOrdeal'
import { useReveal } from '@/hooks/useReveal'
import { useScrub } from '@/hooks/useScrub'
import Air from './Air'
import ChapterOpen from './ChapterOpen'
import ChapterEnd from './ChapterEnd'
import { ChBody } from './blocks'
import styles from './Etau.module.css'

// the angle each sheet keeps once set down: a pile is never square
const TILTS = ['-0.55deg', '0.4deg', '-0.25deg']
// One sheet at a time. When several come into view together, each waits for
// the one before to have been set down, so the stamps fall one by one with
// silence between them. Kept short: the text of a sheet is never held back
// for a gesture longer than this per sheet.
const BEAT = 1300

// Chapter II — the vice: 1833 unification, 1948 Citizenship Act, 1956 Sinhala Only.
// A records office: each act is a sheet set down on the desk and stamped, and
// each can be expanded for the full record. The walls of the room close with
// the scroll. First turn of the vice — the escalation proper only begins here.
export default function ChEtau() {
  const { lang, t } = useLang()
  const v = vigil[lang]
  const ref = useReveal()
  const ordealRef = useOrdeal<HTMLElement>(0.5)
  // rest 0.5: without motion the walls stand nearly shut, the room as it ends up
  const jawsRef = useScrub<HTMLDivElement>({ rest: 0.5 })
  const [open, setOpen] = useState<number | null>(null)
  const acts = [events[2], events[3], events[4]]
  const sealYears = ['1833', '1948–49', '1956']
  const thought = experience.etau[lang].split(' ')

  // The sheets are revealed here rather than by useReveal: same classes
  // (`reveal-ready`, then `in`), plus the wait written once as --d.
  const pileRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const pile = pileRef.current
    if (!pile) return
    let free = 0 // when the desk is free for the next sheet
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          const now = performance.now()
          const wait = Math.max(0, free - now)
          free = now + wait + BEAT
          el.style.setProperty('--d', `${Math.round(wait)}ms`)
          el.classList.add('in')
          io.unobserve(el)
        })
      },
      { threshold: 0.12 }
    )
    pile.querySelectorAll<HTMLElement>('article').forEach((sheet) => {
      if (sheet.classList.contains('in')) return // already on the desk (effect re-run)
      sheet.classList.add('reveal-ready')
      io.observe(sheet)
    })
    return () => io.disconnect()
  }, [])

  return (
    <section id="etau" ref={ordealRef} className="relative bg-gradient-to-b from-night via-[rgb(var(--ch-cold))] to-night">
      {/* archive dust in a cold shaft of light: the air of a records room */}
      <Air kind="motes" intensity={0.7} warmth={0.12} />
      <div className="relative z-[2]">
        <ChapterOpen id="etau" lede={v.etauLede} />
      </div>
      <div className={styles.room}>
        {/* the scrubbed element holds the two walls and nothing else */}
        <div ref={jawsRef} aria-hidden="true" className={styles.jaws}>
          <span className={styles.jaw} />
          <span className={styles.jaw} />
        </div>
        <div ref={ref as React.RefObject<HTMLDivElement>} className="relative z-[2]">
          <ChBody>
          <div className="grid max-w-[1200px] items-start gap-12 lg:grid-cols-[0.75fr_1.35fr] lg:gap-20">
            <div className="lg:sticky lg:top-32">
              <p className={`stagger reveal ${styles.thought} lang-title max-w-[14ch] font-display text-[clamp(30px,3.5vw,46px)] font-light leading-[1.2] text-bone`}>
                {thought.map((word, i) => (
                  <span key={i}>
                    <span className="w" style={{ ['--wi' as string]: i }}>{word}</span>
                    {i < thought.length - 1 && ' '}
                  </span>
                ))}
              </p>
              <p className="reveal d3 mt-6 max-w-[28ch] text-lg italic leading-relaxed text-ash">{experience.etauSub[lang]}</p>
              <div aria-hidden="true" className="reveal d4 mt-10 h-32 w-px bg-gradient-to-b from-bone/35 to-transparent" />
            </div>
            <div ref={pileRef} className={styles.pile}>
            {acts.map((ev, i) => {
              const entry = `${v.actLabel} ${String(i + 1).padStart(2, '0')} — ${ev.year}`
              return (
              <article
                key={ev.year}
                className={`${styles.sheet} p-6 sm:px-9 sm:py-8`}
                style={{ '--i': i + 1, '--tilt': TILTS[i] } as CSSProperties}
              >
                {/* red archival seal */}
                <span
                  aria-hidden="true"
                  className="seal absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full border-[1.5px] border-ember font-mono text-[10px] text-ember sm:right-6 sm:top-5 sm:h-14 sm:w-14 sm:text-[11px]"
                >
                  {sealYears[i]}
                </span>
                <div className="mb-2.5 pr-16 font-mono text-[10px] uppercase tracking-[0.26em] text-ash">
                  {/* typed in one character at a time; --n is how many */}
                  <span className={styles.typed} style={{ '--n': Array.from(entry).length } as CSSProperties}>{entry}</span>
                </div>
                <h3 className="lang-title mb-3 pr-16 font-display text-[clamp(21px,2.6vw,30px)] font-normal">{ev.title[lang]}</h3>
                <p className="max-w-[56ch] text-[15px] leading-[1.75] text-bone-dim">{ev.desc[lang]}</p>
                <p
                    hidden={open !== i}
                    id={`act-${i}-record`}
                    className="mt-5 max-w-[60ch] border-t border-gold/45 pt-4 text-[15px] leading-[1.8] text-bone-dim"
                  >
                    {ev.detail[lang]}
                  </p>
                {/* the record folds both ways: opening one act must not trap the reader in it */}
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  aria-controls={`act-${i}-record`}
                  className="group -mb-2 mt-0.5 inline-flex min-h-11 items-center text-left font-mono text-[10px] uppercase tracking-[0.2em] text-gold"
                >
                  <span className="border-b border-transparent py-1 transition-colors group-hover:border-gold">
                    {open === i ? `${t('ui-hide-record')} ↑` : `${t('ui-read-record')} →`}
                  </span>
                </button>
              </article>
              )
            })}
            </div>
          </div>
          </ChBody>
        </div>
        <ChapterEnd id="etau" />
      </div>
    </section>
  )
}
