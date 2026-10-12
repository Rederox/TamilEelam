'use client'

import { useLang } from '@/context/LanguageContext'
import { maaveerar as m } from '@/data/historyChapters'
import { useReveal } from '@/hooks/useReveal'
import ChapterOpen from './ChapterOpen'
import ChapterEnd from './ChapterEnd'
import { ChBody } from './blocks'
import KarthigaiFlower from './KarthigaiFlower'
import HistoryPassages, { HistorySources } from './HistoryPassages'

export default function ChMaaveerar() {
  const { lang } = useLang()
  const ref = useReveal()

  return (
    <section id="maaveerar" aria-labelledby="maaveerar-title" className="relative bg-night bg-[radial-gradient(ellipse_at_15%_45%,rgb(var(--c-blood)/0.09),transparent_55%)]">
      <ChapterOpen id="maaveerar" lede={m.lede[lang]} />
      <div ref={ref as React.RefObject<HTMLDivElement>}>
        <ChBody>
          <div className="mx-auto max-w-[1200px]">
            <div className="grid items-start gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div className="reveal min-w-0 border-t border-gold/30 pt-8 lg:sticky lg:top-28">
                <p lang="ta" className="font-tamil text-2xl text-gold">மாவீரர் நாள்</p>
                <div className="my-8 flex items-center justify-between gap-5">
                  <div>
                    <p className="font-display text-[clamp(90px,12vw,150px)] font-light leading-none text-bone">27</p>
                    <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ash">{m.month[lang]}</p>
                  </div>
                  <KarthigaiFlower size={130} />
                </div>
                <p className="text-xl italic leading-relaxed text-bone-dim">{m.meaning[lang]}</p>
                <p className="mt-5 text-sm text-ash">{m.origin[lang]}</p>
              </div>
              <HistoryPassages passages={m.passages} lang={lang} />
            </div>
            <aside className="reveal mt-20 border-y border-bone/20 py-9" aria-labelledby="memorial-dates-title">
              <h3 id="memorial-dates-title" className="lang-title font-display text-3xl font-light">{m.datesTitle[lang]}</h3>
              <div className="mt-8 grid gap-8 md:grid-cols-3">
                {m.dates.map((entry) => <a key={entry.href} href={entry.href} className="group block border-l border-gold/35 pl-5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-gold">{entry.date[lang]}</span>
                  <span className="mt-4 block max-w-[30ch] text-base leading-relaxed text-bone-dim group-hover:text-bone">{entry.text[lang]} <span aria-hidden="true">↗</span></span>
                </a>)}
              </div>
              <HistorySources ids={['memorialSites', 'maaveerar']} />
            </aside>
          </div>
        </ChBody>
      </div>
      <ChapterEnd id="maaveerar" />
    </section>
  )
}
