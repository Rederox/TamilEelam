'use client'

import { useLang } from '@/context/LanguageContext'
import { events } from '@/data/events'
import { experience } from '@/data/experience'
import { vigil } from '@/data/narrative'
import { useReveal } from '@/hooks/useReveal'
import Air from './Air'
import ChapterOpen from './ChapterOpen'
import ChapterEnd from './ChapterEnd'
import { ChBody, Caption, Prose } from './blocks'

// Chapter IV — the promise: Vaddukoddai 1976, then two decades of resistance.
export default function ChPromesse() {
  const { lang, t } = useLang()
  const v = vigil[lang]
  const ref = useReveal()
  const vaddukoddai = events[6] // 14 May 1976 — Vaddukoddai Resolution

  return (
    <section
      id="promesse"
      className="relative bg-night bg-[radial-gradient(100%_80%_at_12%_30%,rgb(var(--c-ember)/0.10),transparent_60%)]"
    >
      {/* the same grains as the archive, but warm: embers that never went out */}
      <Air kind="motes" intensity={0.62} warmth={0.9} />
      <div className="relative z-[2]">
        <ChapterOpen id="promesse" lede={v.promesseLede} />
        <div ref={ref as React.RefObject<HTMLDivElement>}>
          <ChBody>
          <div className="grid max-w-[1200px] items-start gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
            <div className="reveal resolution-sheet relative border border-gold/30 px-7 py-12 sm:px-12 sm:py-16">
              <p className="font-mono text-[10px] uppercase tracking-[0.23em] text-gold">TULF · Vaddukoddai</p>
              <p className="mt-10 font-display text-[clamp(32px,4vw,58px)] font-light leading-none text-bone">14.05.1976</p>
              <div className="my-9 h-px w-16 bg-gold/50" />
              <h3 className="lang-title max-w-[16ch] font-display text-[clamp(27px,3vw,40px)] italic leading-[1.3]">{experience.resolution[lang]}</h3>
              <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.15em] text-ash">{experience.resolutionLabel[lang]}</p>
            </div>
            <div className="reveal d1 lg:pt-12">
              <Caption>{vaddukoddai.title[lang]}</Caption>
              <Prose><p className="drop-cap">{vaddukoddai.detail[lang]}</p></Prose>
              <p className="mt-10 border-l border-gold/40 pl-6 text-xl italic leading-relaxed text-bone">{t('t3-quote')}</p>
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
