'use client'

import { useLang } from '@/context/LanguageContext'
import { events } from '@/data/events'
import { vigil } from '@/data/narrative'
import { useReveal } from '@/hooks/useReveal'
import { useViewProgress } from '@/hooks/useSceneProgress'
import ChapterOpen from './ChapterOpen'
import { Caption, Prose, MemFigure } from './blocks'
import Embers from './Embers'
import BulletHole from './BulletHole'
import Skyline from './Skyline'

// Preset impact pattern around the year — the wall takes the hits
const IMPACTS: Array<{ x: string; y: string; size: number; delay: number }> = [
  { x: '58%', y: '14%', size: 40, delay: 1.0 },
  { x: '70%', y: '30%', size: 30, delay: 1.15 },
  { x: '48%', y: '8%', size: 26, delay: 1.3 },
  { x: '82%', y: '16%', size: 34, delay: 1.5 },
  { x: '64%', y: '48%', size: 26, delay: 1.7 },
  { x: '88%', y: '42%', size: 28, delay: 1.9 },
  { x: '76%', y: '6%', size: 22, delay: 2.1 },
]

// Chapter V — Black July 1983: a blood veil descends, the year fills the
// screen and the wall around it is riddled, one impact after another.
export default function ChJuillet() {
  const { lang } = useLang()
  const v = vigil[lang]
  const ref = useReveal()
  const { ref: veilRef, progress } = useViewProgress<HTMLElement>()
  const blackJuly = events[7]

  // the blood veil deepens as the reader descends into the chapter
  const veilOpacity = Math.min(1, Math.max(0, (progress - 0.25) * 2.2))

  return (
    <section
      id="juillet"
      className="relative bg-[rgb(var(--ch-ink))]"
      ref={(el) => { (veilRef as React.MutableRefObject<HTMLElement | null>).current = el }}
    >
      {/* blood veil bleeding down from the top */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[46svh] bg-gradient-to-b from-blood/45 via-blood/10 to-transparent transition-opacity duration-700"
        style={{ opacity: veilOpacity }}
      />
      <Embers density={18} />
      <ChapterOpen id="juillet" lede={v.juilletLede} />
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="relative z-[2] flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 py-24 sm:px-[9vw]"
      >
        <div className="reveal relative inline-block max-w-max">
          <div
            aria-hidden="true"
            className="shot-target font-display text-[clamp(100px,24vw,380px)] font-light leading-[0.9] tracking-[-0.04em] text-blood"
          >
            1983
          </div>

          {/* the wall is riddled */}
          {IMPACTS.map((h, i) => (
            <BulletHole key={i} x={h.x} y={h.y} size={h.size} delay={h.delay} />
          ))}

          {/* blood runs down from the numerals */}
          <span aria-hidden="true" className="drip absolute left-[18%] top-[88%] h-24 w-[3px]" style={{ ['--bd' as string]: '1.6s', ['--dt' as string]: '7s' }} />
          <span aria-hidden="true" className="drip absolute left-[41%] top-[90%] h-36 w-[2px]" style={{ ['--bd' as string]: '2.1s', ['--dt' as string]: '9s' }} />
          <span aria-hidden="true" className="drip absolute left-[63%] top-[86%] h-16 w-[2.5px]" style={{ ['--bd' as string]: '1.9s', ['--dt' as string]: '6s' }} />
          <span aria-hidden="true" className="drip absolute left-[80%] top-[89%] h-28 w-[2px]" style={{ ['--bd' as string]: '2.5s', ['--dt' as string]: '8s' }} />
        </div>

        <div className="mt-16 grid max-w-[1150px] grid-cols-1 gap-9 lg:grid-cols-[1.1fr_1fr] lg:gap-[5vw]">
          <div>
            <Caption className="reveal d1">{blackJuly.year} — {blackJuly.title[lang]}</Caption>
            <Prose className="reveal d2">
              <p>{blackJuly.detail[lang]}</p>
            </Prose>
          </div>
          <MemFigure className="reveal d2" value={v.juilletFigure} label={v.juilletFigureLabel} tone="ember" />
        </div>
      </div>
      <Skyline />
    </section>
  )
}
