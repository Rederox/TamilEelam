'use client'

import { useEffect, type ReactNode } from 'react'
import { useLang } from '@/context/LanguageContext'
import { chapterById } from '@/data/narrative'
import { useReveal } from '@/hooks/useReveal'
import { useViewProgress } from '@/hooks/useSceneProgress'
import GhostWord from './GhostWord'

/**
 * Full-viewport chapter opener: roman numeral, years, kicker,
 * word-staggered blurred title reveal, ghosted Tamil word drifting
 * behind with scroll parallax, cinematic veil from the previous chapter.
 */
export default function ChapterOpen({ id, lede, children }: { id: string; lede?: string; children?: ReactNode }) {
  const { lang } = useLang()
  const c = chapterById(id)
  const revealRef = useReveal()
  const { ref: viewRef, progress } = useViewProgress<HTMLDivElement>()

  // one element, two refs
  useEffect(() => {
    viewRef.current = revealRef.current as HTMLDivElement | null
  })

  const words = [
    ...c.title[lang].split(' ').map((w) => ({ w, accent: false })),
    ...(c.titleAccent[lang] ? c.titleAccent[lang].split(' ').map((w) => ({ w, accent: true })) : []),
  ]

  const parallax = (progress - 0.5) * 90

  return (
    <div
      ref={revealRef as React.RefObject<HTMLDivElement>}
      className="relative flex min-h-[92svh] flex-col justify-center overflow-hidden px-6 pb-20 pt-28 sm:px-[9vw] lg:pt-32"
    >
      {/* veil: cinematic fade from the previous chapter */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-night to-transparent" />

      {/* ghosted Tamil word, drifting against the scroll */}
      <GhostWord
        word={c.tamilGhost}
        className="absolute bottom-[4%] right-[2%] will-change-transform motion-reduce:transform-none"
        style={{ transform: `translateY(${parallax}px)` }}
        maxPx={230}
      />

      <div className="reveal mb-7 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.28em] text-ash">
        <span
          className="font-display text-[30px] normal-case italic tracking-normal text-gold will-change-transform motion-reduce:transform-none"
          style={{ transform: `translateY(${-parallax * 0.3}px)` }}
        >
          {c.num}
        </span>
        <span className="h-px w-12 bg-bone/30 sm:w-14" />
        <span>{c.years[lang]}</span>
      </div>

      <p className="kicker reveal d1 mb-3.5 font-body text-[clamp(16px,2vw,21px)] italic text-ash">{c.kicker[lang]}</p>

      <h2 className="stagger reveal d1 lang-title max-w-[12ch] font-display text-[clamp(44px,8vw,120px)] font-[320] leading-[1.02] tracking-[-0.02em]">
        {words.map((word, i) => (
          <span key={i}>
            <span className={word.accent ? 'w italic text-ember' : 'w'} style={{ ['--wi' as string]: i }}>
              {word.w}
            </span>
            {i < words.length - 1 && ' '}
          </span>
        ))}
      </h2>

      {lede && (
        <p className="reveal d3 mt-9 max-w-[620px] text-[clamp(16px,1.9vw,20px)] leading-[1.75] text-bone-dim">
          {lede}
        </p>
      )}
      {children}
    </div>
  )
}
