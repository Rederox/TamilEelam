'use client'

import { useLang } from '@/context/LanguageContext'
import { events } from '@/data/events'
import { vigil } from '@/data/narrative'
import { useReveal } from '@/hooks/useReveal'
import ChapterOpen from './ChapterOpen'
import { ChBody, Quote } from './blocks'
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
          <div
            className="reveal grid max-w-[900px] grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-2.5 sm:grid-cols-[repeat(auto-fill,minmax(96px,1fr))] sm:gap-3.5"
            role="img"
            aria-label={v.disparusFrames}
          >
            {Array.from({ length: FRAME_COUNT }, (_, i) => (
              <div
                key={i}
                className="relative aspect-[3/4] border border-bone/15 bg-bone/[0.015] transition-colors duration-500 hover:border-flame"
                style={{ opacity: 0.4 + ((i * 7) % 10) * 0.06 }}
              >
                {/* faceless silhouette */}
                <span
                  aria-hidden="true"
                  className="absolute bottom-[18%] left-1/2 h-[52%] w-[46%] -translate-x-1/2 blur-[1px]"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 18%, rgb(var(--c-ash)/0.24) 0 22%, transparent 23%), radial-gradient(80% 55% at 50% 88%, rgb(var(--c-ash)/0.20), transparent 70%)',
                  }}
                />
                <span className="absolute right-2 top-1.5 font-mono text-[11px] text-ash-dim">?</span>
              </div>
            ))}
          </div>
          <p className="reveal d1 mt-6 max-w-[46ch] text-sm italic text-ash">{v.disparusFrames}</p>

          <div className="reveal d2 mt-16 grid max-w-[820px] grid-cols-1 items-start gap-8 border-t border-bone/15 pt-12 sm:grid-cols-[auto_1fr]">
            <Flame size={22} />
            <div>
              <Quote text={t('t2-quote')} author={`${t('t2-author')} · ${t('t2-role')}`} />
              <p className="mt-6 max-w-[56ch] text-[15px] leading-[1.75] text-bone-dim">{v.disparusVigil}</p>
              <p className="mt-4 max-w-[56ch] text-[15px] leading-[1.75] text-bone-dim">{disappeared.detail[lang]}</p>
            </div>
          </div>
        </ChBody>
      </div>
    </section>
  )
}
