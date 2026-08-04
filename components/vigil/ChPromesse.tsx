'use client'

import { useLang } from '@/context/LanguageContext'
import { events } from '@/data/events'
import { vigil } from '@/data/narrative'
import { useReveal } from '@/hooks/useReveal'
import ChapterOpen from './ChapterOpen'
import { ChBody, Caption, Prose, Quote, MemFigure } from './blocks'

// Chapter IV — the promise: Vaddukoddai 1976, then two decades of resistance.
export default function ChPromesse() {
  const { lang, t } = useLang()
  const v = vigil[lang]
  const ref = useReveal()
  const vaddukoddai = events[6] // 14 May 1976 — Vaddukoddai Resolution
  const struggle = events[8]    // 1983-2002 — armed struggle & de facto state
  const ltte = events[14]       // 1976-2009 — LTTE & Prabhakaran

  return (
    <section
      id="promesse"
      className="relative bg-night bg-[radial-gradient(100%_80%_at_12%_30%,rgb(var(--c-ember)/0.10),transparent_60%)]"
    >
      <ChapterOpen id="promesse" lede={v.promesseLede} />
      <div ref={ref as React.RefObject<HTMLDivElement>}>
        <ChBody>
          <div className="reveal max-w-[720px] border-l-2 border-gold pl-6 sm:pl-7">
            <Quote text={t('t3-quote')} author={`${t('t3-author')} — ${v.promesseQuoteLabel}`} />
          </div>

          <div className="reveal d1 mt-14 lg:mt-16">
            <MemFigure
              value="14.05.1976"
              label={
                lang === 'fr'
                  ? 'La revendication est écrite à Vaddukoddai — puis massivement votée en 1977.'
                  : lang === 'en'
                    ? 'The claim is written at Vaddukoddai — then overwhelmingly voted in 1977.'
                    : 'கோரிக்கை வட்டுக்கோட்டையில் எழுதப்பட்டது — 1977-இல் பேரளவில் வாக்களிக்கப்பட்டது.'
              }
              tone="gold"
            />
          </div>

          <div className="mt-14 grid max-w-[1200px] grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-[6vw]">
            <div>
              <Caption className="reveal">{vaddukoddai.year} — {vaddukoddai.title[lang]}</Caption>
              <Prose className="reveal d1">
                <p>{vaddukoddai.detail[lang]}</p>
              </Prose>
            </div>
            <div>
              <Caption className="reveal d1">{struggle.year} — {struggle.title[lang]}</Caption>
              <Prose className="reveal d2">
                <p>{struggle.detail[lang]}</p>
              </Prose>
            </div>
          </div>

          <div className="mt-14 max-w-[720px]">
            <Caption className="reveal">{ltte.year} — {ltte.title[lang]}</Caption>
            <Prose className="reveal d1">
              <p>{ltte.detail[lang]}</p>
            </Prose>
          </div>
        </ChBody>
      </div>
    </section>
  )
}
