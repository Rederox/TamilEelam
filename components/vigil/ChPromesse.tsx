'use client'

import { Fragment, useRef, type CSSProperties } from 'react'
import { useLang } from '@/context/LanguageContext'
import { events } from '@/data/events'
import { experience } from '@/data/experience'
import { vigil } from '@/data/narrative'
import { useReveal } from '@/hooks/useReveal'
import { useScrub } from '@/hooks/useScrub'
import Air from './Air'
import ChapterOpen from './ChapterOpen'
import ChapterEnd from './ChapterEnd'
import { ChBody, Caption, Prose } from './blocks'
import s from './Promesse.module.css'

const vars = (v: Record<string, number>) => v as CSSProperties

// One slip per hand: where it is held before it comes down (in slip-widths
// left or right of the slot, in slip-heights above it), how it is tilted
// (degrees), and when and how long its gesture is along the pinned scroll.
// Uneven on purpose — people do not vote in step — and never two at once.
// No meaning in how many there are: enough to read as "many", few enough for
// each to be seen.
const SLIPS: [x: number, up: number, tilt: number, at: number, span: number][] = [
  [-0.9, 3.4, -14, 0.03, 0.085], [0.7, 3.7, 11, 0.125, 0.07], [-0.3, 3.2, 6, 0.2, 0.09],
  [1.0, 3.5, 16, 0.31, 0.07], [-1.1, 3.6, -9, 0.385, 0.1], [0.4, 3.3, -15, 0.5, 0.07],
  [-0.6, 3.7, 12, 0.575, 0.08], [0.9, 3.4, 8, 0.665, 0.075], [-0.2, 3.6, -6, 0.755, 0.1],
]
const RULES = 9

// Chapter IV — the promise: Vaddukoddai 1976, a text written down, then a vote.
export default function ChPromesse() {
  const { lang, t } = useLang()
  const v = vigil[lang]
  const ref = useReveal()
  const vaddukoddai = events[6] // 14 May 1976 — Vaddukoddai Resolution

  // What is written stays written: the sheet follows the furthest point the
  // reader has reached (--w), not where they are now (--p), which CSS alone
  // cannot remember.
  const written = useRef(0)
  const sheet = useScrub<HTMLDivElement>({
    onChange: (p) => {
      if (p <= written.current) return
      written.current = p
      sheet.current?.style.setProperty('--w', p.toFixed(3))
    },
  })
  const vote = useScrub<HTMLDivElement>({ pinned: true })

  return (
    <section id="promesse" className={`relative bg-night ${s.room}`}>
      {/* the same grains as the archive, by day: dust in the light of a window */}
      <Air kind="motes" intensity={0.62} warmth={0.35} />
      <div className="relative z-[2]">
        <ChapterOpen id="promesse" lede={v.promesseLede} />
        <div ref={ref as React.RefObject<HTMLDivElement>}>
          <ChBody>
          <div className="grid max-w-[1200px] items-start gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-x-20 lg:gap-y-16">
            <div ref={sheet} className={`reveal resolution-sheet ${s.sheet} px-7 py-12 sm:px-12 sm:py-16`}>
              <span aria-hidden="true" className={s.daylight} />
              <p className="font-mono text-[10px] uppercase tracking-[0.23em] text-gold">TULF · Vaddukoddai</p>
              <p className={`${s.date} mt-10 font-display text-[clamp(32px,4vw,58px)] font-light leading-none text-bone`}>
                {'14.05.1976'.split('').map((c, i) => <span key={i} className={s.ink} style={vars({ '--i': i })}>{c}</span>)}
              </p>
              <div className={`${s.rule} my-9 h-px w-16 bg-gold/50`} />
              <div className={s.ruled}>
                <span aria-hidden="true" className={s.lines}>
                  {Array.from({ length: RULES }, (_, i) => <span key={i} style={vars({ '--i': i })} />)}
                </span>
                <h3 className={`lang-title ${s.sentence} max-w-[16ch] font-display text-[clamp(27px,3vw,40px)] italic`}>
                  {experience.resolution[lang].split(' ').map((w, i) => (
                    <Fragment key={i}>{i ? ' ' : null}<span className={s.ink} style={vars({ '--i': i })}>{w}</span></Fragment>
                  ))}
                </h3>
              </div>
              <div aria-hidden="true" className={s.signature} />
              <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.15em] text-ash">{experience.resolutionLabel[lang]}</p>
            </div>
            <div className="reveal d1 lg:pt-12">
              <Caption>{vaddukoddai.title[lang]}</Caption>
              <Prose><p className="drop-cap">{vaddukoddai.detail[lang]}</p></Prose>
            </div>
            {/* the vote of 1977, as a gesture: no count, no colour, no emblem */}
            <div ref={vote} aria-hidden="true" data-poll className={s.poll}>
            <div className={s.vote}>
              <svg className={s.box} viewBox="0 0 240 300">
                <path className={s.lid} d="M41 155 52 140H188L199 155Z" />
                <path d="M0 280H240" />
              </svg>
              {SLIPS.map(([x, up, tilt, at, span], i) => (
                <span key={i} className={s.slip} style={vars({ '--x': x, '--s': up, '--r': tilt, '--a': at, '--d': span })} />
              ))}
              <svg className={s.box} viewBox="0 0 240 300">
                <path className={s.lid} d="M41 155H199L210 170H30Z" />
                <path className={s.front} d="M30 170H210V280H30Z" />
                <path className={s.slot} d="M84 155H156" />
              </svg>
            </div>
            {/* without scripts nothing is cast one by one: no track to cross */}
            <noscript><style>{'[data-poll]{height:auto!important}'}</style></noscript>
            </div>
            <div className={`reveal ${s.aside}`}>
              <p className="border-l border-gold/40 pl-6 text-xl italic leading-relaxed text-bone">{t('t3-quote')}</p>
              <p className="mt-4 pl-6 font-mono text-[9px] uppercase tracking-[0.13em] text-ash">{t('t3-author')} · {t('t3-role')}</p>
            </div>
          </div>
          </ChBody>
        </div>
      </div>
      <ChapterEnd id="promesse" />
    </section>
  )
}
