'use client'

import { useLang } from '@/context/LanguageContext'
import { chapters } from '@/data/narrative'
import { chapterSources, researchCopy, sources } from '@/data/research'

/** Sources stay beside the claims; native disclosure also works without scripting. */
export default function ChapterEnd({ id }: { id: string }) {
  const { lang } = useLang()
  const next = chapters[chapters.findIndex((chapter) => chapter.id === id) + 1]
  return (
    <div className="relative z-[2] mx-auto max-w-[1440px] px-6 pb-14 sm:px-[9vw] lg:pb-20">
      <details className="source-notes max-w-[900px] border-y border-bone/15">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ash hover:text-bone">
          <span>{researchCopy.label[lang]} <span className="ml-3 text-gold">{String((chapterSources[id] ?? []).length).padStart(2, '0')}</span></span>
          <span className="disclosure-mark text-xl" aria-hidden="true">+</span>
        </summary>
        <ul className="space-y-4 pb-6">
          {(chapterSources[id] ?? []).map((key) => {
            const source = sources[key]
            return <li key={key} className="grid gap-1 sm:grid-cols-[75px_1fr]">
              <span className="font-mono text-[10px] text-gold">{source.year}</span>
              <a href={source.href} target="_blank" rel="noopener noreferrer" className="text-sm leading-relaxed text-bone-dim underline decoration-bone/25 underline-offset-4 hover:text-flame">{source.institution} · {source.title}</a>
            </li>
          })}
        </ul>
      </details>
      <a href={next ? `#${next.id}` : '#epilogue'} className="group mt-12 flex min-h-16 max-w-[900px] items-center justify-between gap-6 text-bone-dim hover:text-bone">
        <span>
          <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-ash">{next ? researchCopy.next[lang] : researchCopy.end[lang]}</span>
          <span className="lang-title mt-3 block font-display text-[clamp(21px,2.8vw,32px)] font-light">{next ? <>{next.title[lang]} <em>{next.titleAccent[lang]}</em></> : 'தமிழீழம்'}</span>
        </span>
        <span aria-hidden="true" className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-bone/25 text-xl transition-transform duration-500 group-hover:translate-y-1">↓</span>
      </a>
    </div>
  )
}
