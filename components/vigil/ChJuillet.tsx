'use client'

import { useLang } from '@/context/LanguageContext'
import { events } from '@/data/events'
import { experience } from '@/data/experience'
import { vigil } from '@/data/narrative'
import { useOrdeal } from '@/hooks/useOrdeal'
import { usePresence } from '@/hooks/usePresence'
import { useReveal } from '@/hooks/useReveal'
import ChapterOpen from './ChapterOpen'
import ChapterEnd from './ChapterEnd'
import { Caption, Prose, MemFigure } from './blocks'
import JuilletYear from './JuilletYear'
import JuilletVeil from './JuilletVeil'
import GlJuillet from './gl/GlJuillet'
import GlSmoke from './gl/GlSmoke'
import NeighbourhoodTrees from './NeighbourhoodTrees'
import styles from './Juillet.module.css'

// Chapter V — Black July 1983: a blood veil descends, the year fills the
// screen and the wall around it is riddled, one impact after another. Under
// it all, the city burns: the sky lit from below, ash coming down, and at
// the foot of the chapter the rooftops themselves.
export default function ChJuillet() {
  const { lang } = useLang()
  const v = vigil[lang]
  const ref = useReveal()
  const ordealRef = useOrdeal<HTMLElement>(0.8)
  // the fires are streets away: the crackle is heard here too, more faintly
  const fireRef = usePresence<HTMLElement>('fire', 0.55)
  const blackJuly = events[7]
  const struggle = events[8]
  const ltte = events[14]

  return (
    <section
      id="juillet"
      className={`relative bg-[rgb(var(--ch-ink))] ${styles.chapter}`}
      ref={(el) => {
        ordealRef.current = el
        fireRef.current = el
      }}
    >
      {/* the night itself, pinned under the reader: firelight on the sky,
          ash coming down, embers carried over the roofs */}
      <GlJuillet alpha={0.9} />
      <JuilletVeil />
      <div className="relative z-[2]">
        <ChapterOpen id="juillet" lede={v.juilletLede} />
      </div>
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`relative z-[2] mx-auto max-w-[1440px] px-6 pb-20 pt-12 sm:px-[9vw] lg:pb-28 ${styles.content}`}
      >
        <Caption className="reveal mb-10">{blackJuly.year} — {blackJuly.title[lang]}</Caption>
        <div className="grid items-center gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
          <JuilletYear />
          <p className="reveal d1 max-w-[22ch] font-display text-[clamp(28px,3.2vw,44px)] font-light leading-[1.2] tracking-[-0.015em] text-bone">{experience.july[lang]}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-10 border-t border-bone/15 pt-9 lg:mt-16 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
          <div>
            <Prose className="reveal d2">
              <p>{blackJuly.detail[lang]}</p>
            </Prose>
          </div>
          <MemFigure className={`reveal d2 ${styles.figure}`} value={v.juilletFigure} label={v.juilletFigureLabel} tone="ember" />
        </div>
      </div>
      <div className={`relative z-[2] mx-auto max-w-[1440px] px-6 pb-20 sm:px-[9vw] ${styles.content}`}>
        <p className="mb-16 max-w-[32ch] border-l border-ember/40 py-2 pl-6 font-display text-[clamp(25px,2.8vw,38px)] italic leading-[1.35] text-bone-dim">{experience.julySub[lang]}</p>
        <h3 className="lang-title mb-8 font-display text-3xl font-light">{experience.war[lang]}</h3>
        <div className="grid gap-10 border-t border-bone/15 pt-8 lg:grid-cols-2 lg:gap-16">
          <div><Caption>{struggle.year}</Caption><Prose><p>{struggle.detail[lang]}</p></Prose></div>
          <div><Caption>{ltte.title[lang]}</Caption><Prose><p>{ltte.detail[lang]}</p></Prose></div>
        </div>
      </div>
      {/* what stood over Colombo: the rooftops, some of them alight, and the
          smoke rising off them */}
      <GlSmoke alpha={0.8} />
      <NeighbourhoodTrees />
      <ChapterEnd id="juillet" />
    </section>
  )
}
