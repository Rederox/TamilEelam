'use client'

import { useLang } from '@/context/LanguageContext'
import { events } from '@/data/events'
import { vigil } from '@/data/narrative'
import { useReveal } from '@/hooks/useReveal'
import ChapterOpen from './ChapterOpen'
import { ChBody, Caption, Prose, MemFigure } from './blocks'
import Kolam from './Kolam'

// Chapter I — the land: two millennia of presence, the Kingdom of Jaffna.
export default function ChTerre() {
  const { lang } = useLang()
  const v = vigil[lang]
  const ref = useReveal()
  const presence = events[0]
  const kingdom = events[1]
  const colonial = events[13] // 1505-1796 — three European colonisations

  return (
    <section
      id="terre"
      className="relative bg-night bg-[radial-gradient(120%_90%_at_80%_10%,rgb(var(--c-gold)/0.10),transparent_55%)]"
    >
      <ChapterOpen id="terre" lede={v.terreLede} />
      <div ref={ref as React.RefObject<HTMLDivElement>}>
        <ChBody>
          <div className="grid max-w-[1200px] grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-[6vw]">
            <div className="reveal">
              <Kolam size={130} />
              <MemFigure className="mt-6" value={v.terreYears} label={v.terreYearsLabel} tone="gold" />
            </div>
            <div>
              <Caption className="reveal">{presence.year} — {presence.title[lang]}</Caption>
              <Prose className="reveal d1">
                <p className="drop-cap">{presence.detail[lang]}</p>
              </Prose>
              <Caption className="reveal d2 mt-10">{kingdom.year} — {kingdom.title[lang]}</Caption>
              <Prose className="reveal d3">
                <p>{kingdom.detail[lang]}</p>
              </Prose>
            </div>
          </div>

          <div className="mt-14 max-w-[720px]">
            <Caption className="reveal">{colonial.year} — {colonial.title[lang]}</Caption>
            <Prose className="reveal d1">
              <p>{colonial.detail[lang]}</p>
            </Prose>
          </div>
        </ChBody>
      </div>
    </section>
  )
}
