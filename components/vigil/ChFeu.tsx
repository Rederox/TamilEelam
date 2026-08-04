'use client'

import { useLang } from '@/context/LanguageContext'
import { events } from '@/data/events'
import { vigil } from '@/data/narrative'
import { useCounter } from '@/hooks/useCounter'
import { useReveal } from '@/hooks/useReveal'
import ChapterOpen from './ChapterOpen'
import { ChBody, Caption, Prose, MemFigure } from './blocks'
import GlEmbers from './gl/GlEmbers'
import GlSmolder from './gl/GlSmolder'

// Chapter III — fire: the pogroms and the burning of the Jaffna Library.
export default function ChFeu() {
  const { lang } = useLang()
  const v = vigil[lang]
  const ref = useReveal()
  const pogroms = events[5] // 1958, 1977, 1981
  const { value, ref: counterRef } = useCounter(97000, 2600)

  return (
    <section
      id="feu"
      className="relative bg-night bg-[radial-gradient(110%_80%_at_50%_108%,rgb(var(--c-blood)/0.38),rgb(var(--c-ember)/0.08)_55%,transparent_75%)]"
    >
      <GlEmbers density={70} heat={0.5} speed={0.8} intensity={0.75} fallbackDensity={26} />
      {/* the dying fire itself, breathing along the ground */}
      <GlSmolder alpha={0.7} />
      {/* pages of the library, torn loose by the fire */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] overflow-hidden motion-reduce:hidden">
        {[
          { x: '8%', pt: 13, pd: 0 },
          { x: '22%', pt: 10, pd: 4 },
          { x: '45%', pt: 15, pd: 2 },
          { x: '63%', pt: 11, pd: 6 },
          { x: '78%', pt: 14, pd: 1 },
          { x: '91%', pt: 12, pd: 8 },
        ].map((p, i) => (
          <span
            key={i}
            className="page-ash bottom-0"
            style={{ left: p.x, ['--pt' as string]: `${p.pt}s`, ['--pd' as string]: `${p.pd}s` }}
          />
        ))}
      </div>
      {/* the fire breathing below */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[30svh] animate-[lamp-breathe_3.6s_ease-in-out_infinite] bg-gradient-to-t from-blood/35 via-ember/10 to-transparent motion-reduce:animate-none"
      />
      <div className="relative z-[2]">
        <ChapterOpen id="feu" lede={v.feuLede} />
        <div ref={ref as React.RefObject<HTMLDivElement>}>
          <ChBody>
            <div className="grid max-w-[1200px] grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-[6vw]">
              <div ref={counterRef as React.RefObject<HTMLDivElement>} className="reveal">
                <MemFigure
                  value={<span className="tabular-nums">{value.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')}</span>}
                  label={v.feuBooksLabel}
                  tone="ember"
                />
              </div>
              <div>
                <Caption className="reveal">{pogroms.year} — {pogroms.title[lang]}</Caption>
                <Prose className="reveal d1">
                  <p>{pogroms.detail[lang]}</p>
                </Prose>
              </div>
            </div>
          </ChBody>
        </div>
      </div>
    </section>
  )
}
