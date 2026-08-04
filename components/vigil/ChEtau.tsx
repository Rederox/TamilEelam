'use client'

import { useState } from 'react'
import { useLang } from '@/context/LanguageContext'
import { events } from '@/data/events'
import { vigil } from '@/data/narrative'
import { useReveal } from '@/hooks/useReveal'
import ChapterOpen from './ChapterOpen'
import { ChBody } from './blocks'

// Chapter II — the vice: 1833 unification, 1948 Citizenship Act, 1956 Sinhala Only.
// Presented as stamped archival acts; each can be expanded for the full record.
export default function ChEtau() {
  const { lang } = useLang()
  const v = vigil[lang]
  const ref = useReveal()
  const [open, setOpen] = useState<number | null>(null)
  const acts = [events[2], events[3], events[4]]
  const sealYears = ['1833', '1948', '1956']

  return (
    <section id="etau" className="relative bg-gradient-to-b from-night via-[rgb(var(--ch-cold))] to-night">
      <ChapterOpen id="etau" lede={v.etauLede} />
      <div ref={ref as React.RefObject<HTMLDivElement>}>
        <ChBody>
          <div className="grid max-w-[780px] gap-6">
            {acts.map((ev, i) => (
              <article
                key={ev.year}
                className={`reveal ${i === 1 ? 'd1' : i === 2 ? 'd2' : ''} group relative border border-bone/15 bg-gradient-to-br from-bone/[0.03] to-transparent p-6 transition-all duration-300 hover:translate-x-1.5 hover:border-bone/30 sm:px-9 sm:py-8`}
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
                {open === i ? (
                  <p className="mt-4 max-w-[60ch] border-l-2 border-gold pl-4 text-[15px] leading-[1.8] text-bone-dim">
                    {ev.detail[lang]}
                  </p>
                ) : (
                  <button
                    onClick={() => setOpen(i)}
                    className="mt-3.5 border-b border-transparent py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gold transition-colors hover:border-gold"
                  >
                    {lang === 'fr' ? 'Lire le récit complet →' : lang === 'en' ? 'Read the full record →' : 'முழு பதிவைப் படிக்க →'}
                  </button>
                )}
              </article>
            ))}
          </div>
        </ChBody>
      </div>
    </section>
  )
}
