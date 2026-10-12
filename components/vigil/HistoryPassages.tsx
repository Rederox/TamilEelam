import type { Lang } from '@/data/events'
import type { HistoryPassage } from '@/data/historyChapters'
import { sources, type SourceId } from '@/data/research'
import { Prose } from './blocks'

export function HistorySources({ ids }: { ids: SourceId[] }) {
  return <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1">
    {ids.map((id) => <a key={id} href={sources[id].href} target="_blank" rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center font-mono text-[10px] leading-relaxed text-ash underline decoration-bone/25 underline-offset-4 hover:text-flame">
      {sources[id].institution} · {sources[id].year} ↗
    </a>)}
  </div>
}

export default function HistoryPassages({ passages, lang }: { passages: HistoryPassage[]; lang: Lang }) {
  return <div className="min-w-0 space-y-12">
    {passages.map((passage, i) => <article key={i} className="reveal border-t border-bone/20 pt-7">
      <h3 className="lang-title mb-5 font-display text-[clamp(25px,3vw,36px)] font-light leading-[1.25]">{passage.title[lang]}</h3>
      <Prose className="max-w-[62ch]"><p>{passage.text[lang]}</p></Prose>
      <HistorySources ids={passage.sources} />
    </article>)}
  </div>
}
