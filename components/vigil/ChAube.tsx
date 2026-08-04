'use client'

import { useLang } from '@/context/LanguageContext'
import { events } from '@/data/events'
import { vigil } from '@/data/narrative'
import { useReveal } from '@/hooks/useReveal'
import ChapterOpen from './ChapterOpen'
import { ChBody, Caption, Prose, Quote } from './blocks'
import Flame from './Flame'

const CITIES = ['Toronto', 'London', 'Paris', 'Zurich', 'Oslo', 'Sydney', 'Chennai', 'Berlin']

// Chapter IX — dawn in diaspora: memory carried across the world,
// and the ongoing quest for justice. The palette warms toward dawn.
export default function ChAube() {
  const { lang, t } = useLang()
  const v = vigil[lang]
  const ref = useReveal()
  const diaspora = events[11]
  const justice = events[12]
  const maaveerar = events[15] // 27 November — Maaveerar Naal

  const figures = [
    { n: '80+', l: lang === 'fr' ? 'pays où vit la diaspora' : lang === 'en' ? 'countries of the diaspora' : 'புலம்பெயர் நாடுகள்' },
    { n: '≈1M', l: lang === 'fr' ? "Tamouls d'Eelam en diaspora" : lang === 'en' ? 'Eelam Tamils in diaspora' : 'புலம்பெயர்ந்த ஈழத் தமிழர்கள்' },
    { n: '18.05', l: lang === 'fr' ? 'jour de mémoire, chaque année, partout' : lang === 'en' ? 'remembrance day, every year, everywhere' : 'நினைவு நாள், ஒவ்வொரு ஆண்டும், எங்கும்' },
  ]

  return (
    <section id="aube" className="relative bg-gradient-to-b from-night via-[rgb(var(--ch-dawn-1))] to-[rgb(var(--ch-dawn-2))]">
      <ChapterOpen id="aube" lede={v.aubeLede} />
      <div ref={ref as React.RefObject<HTMLDivElement>}>
        <ChBody>
          {/* the flame, relit in every city of exile */}
          <div className="reveal flex max-w-[820px] flex-wrap items-end gap-x-9 gap-y-8 sm:gap-x-12">
            {CITIES.map((city, i) => (
              <div key={city} className="light-up flex flex-col items-center gap-2.5" style={{ ['--ld' as string]: `${0.3 + i * 0.35}s` }}>
                <Flame size={13} />
                <span className="font-display text-[clamp(15px,1.8vw,20px)] italic text-flame">{city}</span>
              </div>
            ))}
          </div>

          <div className="my-14 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-[6vw] lg:my-16">
            {figures.map((f, i) => (
              <div key={f.n} className={`reveal ${i === 1 ? 'd1' : i === 2 ? 'd2' : ''}`}>
                <div className="font-display text-[clamp(40px,6vw,76px)] font-light leading-none text-bone">{f.n}</div>
                <div className="mt-2 max-w-[180px] font-mono text-[10px] uppercase leading-[1.7] tracking-[0.18em] text-ash">{f.l}</div>
              </div>
            ))}
          </div>

          <div className="grid max-w-[1200px] grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-[6vw]">
            <div className="reveal">
              <Caption>{diaspora.year} — {diaspora.title[lang]}</Caption>
              <Prose>
                <p>{diaspora.detail[lang]}</p>
              </Prose>
            </div>
            <div className="reveal d1 border-l-2 border-gold pl-6 sm:pl-7">
              <Quote text={t('t4-quote')} author={`${t('t4-author')} · ${t('t4-role')}`} />
            </div>
          </div>

          <div className="mt-14 max-w-[720px]">
            <Caption className="reveal">{maaveerar.year} — {maaveerar.title[lang]}</Caption>
            <Prose className="reveal d1">
              <p>{maaveerar.detail[lang]}</p>
            </Prose>
          </div>

          <div className="reveal mt-16 max-w-[640px] border-t border-bone/15 pt-11">
            <h3 className="lang-title mb-4 font-display text-[clamp(24px,3vw,34px)] italic text-bone">{v.aubeJusticeTitle}</h3>
            <p className="text-[15.5px] leading-[1.8] text-bone-dim">{justice.detail[lang]}</p>
          </div>
        </ChBody>
      </div>
    </section>
  )
}
