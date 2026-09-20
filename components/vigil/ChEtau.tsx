'use client'

import { useState } from 'react'
import { useLang } from '@/context/LanguageContext'
import { events } from '@/data/events'
import { experience } from '@/data/experience'
import { vigil } from '@/data/narrative'
import { useOrdeal } from '@/hooks/useOrdeal'
import { useReveal } from '@/hooks/useReveal'
import Air from './Air'
import ChapterOpen from './ChapterOpen'
import ChapterEnd from './ChapterEnd'
import { ChBody } from './blocks'

// Chapter II — the vice: 1833 unification, 1948 Citizenship Act, 1956 Sinhala Only.
// Presented as stamped archival acts; each can be expanded for the full record.
// First turn of the vice — the escalation proper only begins here.
export default function ChEtau() {
  const { lang, t } = useLang()
  const v = vigil[lang]
  const ref = useReveal()
  const ordealRef = useOrdeal<HTMLElement>(0.5)
  const [open, setOpen] = useState<number | null>(null)
  const acts = [events[2], events[3], events[4]]
  const sealYears = ['1833', '1948–49', '1956']

  return (
    <section id="etau" ref={ordealRef} className="relative bg-gradient-to-b from-night via-[rgb(var(--ch-cold))] to-night">
      {/* archive dust in a cold shaft of light: the air of a records room */}
      <Air kind="motes" intensity={0.7} warmth={0.12} />
      <div className="relative z-[2]">
        <ChapterOpen id="etau" lede={v.etauLede} />
        <div ref={ref as React.RefObject<HTMLDivElement>}>
          <ChBody>
          <div className="grid max-w-[1200px] items-start gap-12 lg:grid-cols-[0.75fr_1.35fr] lg:gap-20">
            <div className="reveal lg:sticky lg:top-32">
              <p className="lang-title max-w-[14ch] font-display text-[clamp(30px,3.5vw,46px)] font-light leading-[1.2] text-bone">{experience.etau[lang]}</p>
              <p className="mt-6 max-w-[28ch] text-lg italic leading-relaxed text-ash">{experience.etauSub[lang]}</p>
              <div aria-hidden="true" className="mt-10 h-32 w-px bg-gradient-to-b from-bone/35 to-transparent" />
            </div>
            <div className="grid gap-8">
            {acts.map((ev, i) => (
              <article
                key={ev.year}
                className={`reveal ${i === 1 ? 'd1' : i === 2 ? 'd2' : ''} group relative border border-bone/15 archive-act bg-gradient-to-br from-bone/[0.07] to-bone/[0.01] p-6 transition-[transform,border-color] duration-300 ease-vigil hover:translate-x-1.5 hover:border-bone/30 sm:px-9 sm:py-8`}
              >
                {/* red archival seal */}
                <span
                  aria-hidden="true"
                  className="seal absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full border-[1.5px] border-ember font-mono text-[10px] text-ember sm:right-6 sm:top-5 sm:h-14 sm:w-14 sm:text-[11px]"
                >
                  {sealYears[i]}
                </span>
                <div className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.26em] text-ash">
                  {v.actLabel} {String(i + 1).padStart(2, '0')} — {ev.year}
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
                  className="mt-3.5 border-b border-transparent py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gold transition-colors hover:border-gold"
                >
                  {open === i ? `${t('ui-hide-record')} ↑` : `${t('ui-read-record')} →`}
                </button>
              </article>
            ))}
            </div>
          </div>
          </ChBody>
        </div>
      </div>
      <ChapterEnd id="etau" />
    </section>
  )
}
