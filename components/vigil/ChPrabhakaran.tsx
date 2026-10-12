'use client'

import Image from 'next/image'
import { useLang } from '@/context/LanguageContext'
import { prabhakaran as p } from '@/data/historyChapters'
import { useReveal } from '@/hooks/useReveal'
import ChapterOpen from './ChapterOpen'
import ChapterEnd from './ChapterEnd'
import { ChBody, Caption } from './blocks'
import HistoryPassages, { HistorySources } from './HistoryPassages'

export default function ChPrabhakaran() {
  const { lang } = useLang()
  const ref = useReveal()

  return (
    <section id="prabhakaran" aria-labelledby="prabhakaran-title" className="relative bg-night">
      <ChapterOpen id="prabhakaran" lede={p.lede[lang]} />
      <div ref={ref as React.RefObject<HTMLDivElement>}>
        <ChBody>
          <div className="mx-auto grid max-w-[1200px] items-start gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div className="min-w-0 lg:sticky lg:top-28">
              <figure className="reveal mb-10">
                <div className="border border-bone/20 bg-night-2 p-1.5">
                  <Image
                    src="/archive/prabhakaran-portrait.jpg"
                    alt={p.photoAlt[lang]}
                    width={1200}
                    height={800}
                    sizes="(max-width: 639px) calc(100vw - 62px), (max-width: 1023px) 82vw, 440px"
                    className="block h-auto w-full"
                  />
                </div>
                <figcaption className="mt-4 border-l border-gold/30 pl-4">
                  <p className="text-sm italic leading-relaxed text-bone-dim">{p.photoCaption[lang]}</p>
                  <a href="https://snl.no/Velupillai_Prabhakaran" target="_blank" rel="noopener noreferrer"
                    className="mt-1 inline-flex min-h-11 items-center font-mono text-[9px] leading-relaxed text-ash underline decoration-bone/25 underline-offset-4 hover:text-flame">
                    © Reuters / NTB Scanpix · Store norske leksikon ↗
                  </a>
                </figcaption>
              </figure>
              <div className="reveal border-l border-blood pl-6">
                <Caption>{p.label[lang]}</Caption>
                <p lang="ta" className="font-tamil text-xl leading-relaxed text-gold">வேலுப்பிள்ளை பிரபாகரன்</p>
                <p className="lang-title mt-5 font-display text-[clamp(30px,4vw,48px)] font-light leading-[1.15]">{p.name[lang]}</p>
                <p className="mt-5 max-w-[32ch] text-sm leading-relaxed text-ash">{p.acronym[lang]}</p>
              </div>
              <ol aria-label={p.timelineLabel[lang]} className="mt-12 space-y-6">
                {p.timeline.map((entry) => <li key={entry.date} className="reveal border-t border-bone/15 pt-5">
                  <p className="font-mono text-[11px] tracking-[0.12em] text-gold">{entry.date}</p>
                  <p className="mt-3 text-base leading-relaxed text-bone-dim">{entry.text[lang]}</p>
                  <HistorySources ids={[entry.source]} />
                </li>)}
              </ol>
            </div>
            <div>
              <HistoryPassages passages={p.passages} lang={lang} />
              <p className="reveal mt-12 border-l border-gold/40 pl-6 text-lg italic leading-relaxed text-bone-dim">{p.closing[lang]}</p>
            </div>
          </div>
        </ChBody>
      </div>
      <ChapterEnd id="prabhakaran" />
    </section>
  )
}
