'use client'

import { useLang } from '@/context/LanguageContext'
import { events } from '@/data/events'
import { experience } from '@/data/experience'
import { vigil } from '@/data/narrative'
import { useReveal } from '@/hooks/useReveal'
import ChapterOpen from './ChapterOpen'
import ChapterEnd from './ChapterEnd'
import { ChBody } from './blocks'
import Flame from './Flame'

const FRAME_COUNT = 24

// Chapter VII — the disappeared: a wall of empty photo frames,
// and the vigil of the Mothers of the North.
export default function ChDisparus() {
  const { lang, t } = useLang()
  const v = vigil[lang]
  const ref = useReveal()
  const disappeared = events[10]

  return (
    <section id="disparus" className="relative bg-gradient-to-b from-[rgb(var(--ch-void))] via-[rgb(var(--ch-void-2))] to-night">
      <ChapterOpen id="disparus" lede={v.disparusLede} />
      <div ref={ref as React.RefObject<HTMLDivElement>}>
        <ChBody>
          <div className="reveal mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <h3 className="lang-title max-w-[17ch] font-display text-[clamp(32px,4.5vw,58px)] font-light leading-tight">{experience.absence[lang]}</h3>
            <p className="text-lg italic text-ash">{experience.waiting[lang]}</p>
          </div>
          <div
            className="reveal grid max-w-[1200px] grid-cols-4 gap-4 py-6 sm:grid-cols-6 sm:gap-7"
            role="img"
            aria-label={v.disparusFrames}
          >
            {Array.from({ length: FRAME_COUNT }, (_, i) => (
              <div
                key={i}
                className="empty-frame relative aspect-[3/4] border border-bone/25 bg-bone/[0.025] p-2"
                style={{ opacity: 0.4 + ((i * 7) % 10) * 0.06 }}
              >
                <span aria-hidden="true" className="absolute inset-2 border border-bone/10" />
                <span aria-hidden="true" className="absolute bottom-4 left-1/2 h-px w-5 -translate-x-1/2 bg-bone/20" />
              </div>
            ))}
          </div>
          <p className="reveal d1 mt-6 max-w-[46ch] text-sm italic text-ash">{v.disparusFrames}</p>

          <div className="reveal d2 mt-16 grid max-w-[820px] grid-cols-1 items-start gap-8 border-t border-bone/15 pt-12 sm:grid-cols-[auto_1fr]">
            <Flame size={22} />
            <div>
              <p className="font-display text-2xl italic leading-relaxed text-bone">{t('t2-quote')}</p>
              <p className="mt-4 font-mono text-[9px] uppercase tracking-wide text-ash">{t('t2-author')} · {t('t2-role')}</p>
              <p className="mt-6 max-w-[56ch] text-[15px] leading-[1.75] text-bone-dim">{v.disparusVigil}</p>
              <p className="mt-4 max-w-[56ch] text-[15px] leading-[1.75] text-bone-dim">{disappeared.detail[lang]}</p>
            </div>
          </div>
        </ChBody>
      </div>
      <ChapterEnd id="disparus" />
    </section>
  )
}
