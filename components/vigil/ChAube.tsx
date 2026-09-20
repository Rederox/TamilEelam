'use client'

import { useLang } from '@/context/LanguageContext'
import { events } from '@/data/events'
import { vigil } from '@/data/narrative'
import { experience } from '@/data/experience'
import { sources } from '@/data/research'
import { useReveal } from '@/hooks/useReveal'
import Air from './Air'
import ChapterOpen from './ChapterOpen'
import ChapterEnd from './ChapterEnd'
import { ChBody, Caption, Prose } from './blocks'
import Flame from './Flame'

const cities = ['Toronto', 'London', 'Paris', 'Zurich', 'Oslo', 'Sydney', 'Chennai', 'Berlin']
const milestones = [
  { year: '2011', source: 'panel', fr: 'Documenter les crimes', en: 'Documenting the crimes', ta: 'குற்றங்களை ஆவணப்படுத்துதல்' },
  { year: '2015', source: 'oisl', fr: 'Établir les responsabilités', en: 'Establishing accountability', ta: 'பொறுப்புக்கூறலை நிறுவுதல்' },
  { year: '2022', source: 'canada', fr: 'Reconnaître le génocide', en: 'Recognising the genocide', ta: 'இனப்படுகொலையை அங்கீகரித்தல்' },
  { year: '2024', source: 'disappearances', fr: 'Chercher les disparus', en: 'Searching for the disappeared', ta: 'காணாமலாக்கப்பட்டவர்களைத் தேடுதல்' },
] as const

export default function ChAube() {
  const { lang } = useLang()
  const v = vigil[lang]
  const ref = useReveal()

  return (
    <section id="aube" className="relative bg-gradient-to-b from-night via-[rgb(var(--ch-dawn-1))] to-[rgb(var(--ch-dawn-2))]">
      <Air kind="rake" intensity={0.8} warmth={0.95} />
      <div className="relative z-[2]">
        <ChapterOpen id="aube" lede={v.aubeLede} />
        <div ref={ref as React.RefObject<HTMLDivElement>}>
          <ChBody>
            <div className="reveal relative max-w-[1200px] overflow-hidden border-y border-gold/25 py-14 sm:py-20">
              <p className="lang-title max-w-[16ch] font-display text-[clamp(38px,5.8vw,78px)] font-light leading-[1.12]">{experience.diaspora[lang]}</p>
              <p className="mt-7 max-w-[40ch] text-xl italic leading-relaxed text-bone-dim">{experience.diasporaSub[lang]}</p>
              <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4">
                {cities.map((city, i) => <div key={city} className="light-up flex items-end gap-4 border-b border-gold/15 pb-5" style={{ ['--ld' as string]: `${i * 0.15}s` }}>
                  <Flame size={16} /><span className="font-display text-[clamp(21px,2.5vw,32px)] italic text-flame">{city}</span>
                </div>)}
              </div>
            </div>
            <div className="mt-16 grid max-w-[1200px] gap-12 lg:grid-cols-2 lg:gap-20">
              <div className="reveal"><Caption>{events[11].title[lang]}</Caption><Prose><p>{events[11].detail[lang]}</p></Prose></div>
              <div className="reveal d1"><Caption>{events[15].title[lang]} · 27.11</Caption><Prose><p>{events[15].detail[lang]}</p></Prose></div>
            </div>
            <div className="reveal mt-24 max-w-[1200px]">
              <h3 className="lang-title mb-12 max-w-[20ch] font-display text-[clamp(30px,4vw,52px)] font-light leading-tight">{experience.justice[lang]}</h3>
              <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
                <ol className="border-l border-gold/30 pl-7">
                  {milestones.map((item) => <li key={item.year} className="relative pb-9 last:pb-0">
                    <span aria-hidden="true" className="absolute -left-[32.5px] top-1.5 h-2 w-2 rounded-full bg-gold" />
                    <span className="font-mono text-[11px] text-gold">{item.year}</span>
                    <a href={sources[item.source].href} target="_blank" rel="noopener noreferrer" className="mt-2 block w-fit font-display text-2xl text-bone-dim underline decoration-bone/20 underline-offset-4 hover:text-flame">{item[lang]} ↗</a>
                  </li>)}
                </ol>
                <Prose><p>{events[12].detail[lang]}</p></Prose>
              </div>
            </div>
          </ChBody>
        </div>
      </div>
      <ChapterEnd id="aube" />
    </section>
  )
}
