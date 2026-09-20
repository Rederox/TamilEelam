'use client'

import { useLang } from '@/context/LanguageContext'
import { events } from '@/data/events'
import { vigil } from '@/data/narrative'
import { useReveal } from '@/hooks/useReveal'
import Air from './Air'
import ChapterOpen from './ChapterOpen'
import ChapterEnd from './ChapterEnd'
import { ChBody, Prose } from './blocks'
import KarthigaiFlower from './KarthigaiFlower'
import LandMemory from './LandMemory'
import styles from './LandHistory.module.css'

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
      {/* the land itself: relief turning over under a light that crosses
          only while the chapter is being read */}
      <Air kind="ground" intensity={0.85} warmth={0.85} />
      <div className="relative z-[2]">
        <ChapterOpen id="terre" lede={v.terreLede} />
        <div ref={ref as React.RefObject<HTMLDivElement>}>
          <ChBody>
          <LandMemory />
          <div className="mx-auto grid max-w-[1200px] items-start gap-12 border-t border-gold/20 pt-10 sm:pt-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-[7vw]" data-land-history>
            <header className={`reveal ${styles.intro}`}>
              <div className={styles.plant}>
                <KarthigaiFlower size={320} />
              </div>
              <div className={styles.copy}>
                <h3 className={`lang-title font-display text-[clamp(44px,5.5vw,76px)] font-light leading-[1.05] tracking-[-0.035em] text-gold ${styles.title}`}>{v.terreYears}</h3>
                <p className={`mt-5 font-display text-[clamp(19px,2vw,24px)] italic leading-[1.5] text-bone-dim ${styles.description}`}>{v.terreYearsLabel}</p>
                <span aria-hidden="true" className="mt-8 block h-px w-12 bg-gold/40" />
              </div>
            </header>

            <ol className="relative min-w-0 border-l border-gold/25 pl-6 sm:pl-9">
              {[presence, kingdom, colonial].map((event, i) => (
                <li key={event.year} className={`reveal relative pb-11 last:pb-0 sm:pb-14 ${i === 1 ? 'd1' : i === 2 ? 'd2' : ''}`}>
                  <span aria-hidden="true" className="absolute -left-[28.5px] top-1 h-2 w-2 rounded-full border border-gold/75 bg-night sm:-left-[40.5px]" />
                  <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-gold">{event.year}</p>
                  <h4 className="lang-title mb-4 mt-3 font-display text-[clamp(25px,2.5vw,33px)] font-light leading-[1.2] text-bone">{event.title[lang]}</h4>
                  <Prose className="max-w-[58ch]"><p>{event.detail[lang]}</p></Prose>
                  {i < 2 && <span aria-hidden="true" className="mt-9 block h-px w-full bg-bone/10" />}
                </li>
              ))}
            </ol>
          </div>
          </ChBody>
        </div>
      </div>
      <ChapterEnd id="terre" />
    </section>
  )
}
