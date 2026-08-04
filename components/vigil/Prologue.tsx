'use client'

import { useLang } from '@/context/LanguageContext'
import { prologue } from '@/data/narrative'
import Flame from './Flame'
import GhostWord from './GhostWord'
import GlEmbers from './gl/GlEmbers'

/** Split into grapheme clusters (safe for Tamil combining signs). */
function graphemes(text: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    return Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text), (s) => s.segment)
  }
  return Array.from(text)
}

export default function Prologue() {
  const { lang } = useLang()
  const p = prologue[lang]

  // letter cascade for latin scripts, word cascade for Tamil (shaping safety)
  const units =
    lang === 'ta'
      ? `${p.line1} ${p.line2}`.split(' ').map((w, i, arr) => ({ t: w, sp: i < arr.length - 1, accent: i >= p.line1.split(' ').length }))
      : [
          ...graphemes(p.line1).map((g) => ({ t: g, sp: false, accent: false })),
          { t: ' ', sp: false, accent: false },
          ...graphemes(p.line2).map((g) => ({ t: g, sp: false, accent: true })),
        ]

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-24 text-center" id="prologue">
      <GlEmbers density={80} intensity={0.7} fallbackDensity={12} />

      {/* the lamp's breathing light over the room */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 animate-[lamp-breathe_4.5s_ease-in-out_infinite] bg-[radial-gradient(60%_45%_at_50%_38%,rgb(var(--c-flame)/0.09),transparent_70%)] motion-reduce:animate-none"
      />

      {/* ghosted Tamil watermark */}
      <GhostWord
        word="தமிழீழம்"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-ghost-drift motion-reduce:animate-none"
        fill={0.88}
        maxPx={340}
      />

      <div className="relative z-[2] mb-11 animate-rise-in" style={{ animationDuration: '2.2s' }}>
        <Flame size={34} />
      </div>

      <p className="relative z-[2] animate-rise-in font-body text-[clamp(15px,2vw,19px)] italic tracking-[0.04em] text-ash" style={{ animationDelay: '0.5s' }}>
        {p.whisper}
      </p>

      <h1 className="lang-title relative z-[2] mt-6 font-display text-[clamp(52px,10.5vw,150px)] font-[340] leading-[0.98] tracking-[-0.02em]">
        {units.map((u, i) =>
          u.t === ' ' ? (
            ' '
          ) : (
            <span key={i}>
              <span
                className={u.accent ? 'lt italic text-ember' : 'lt'}
                style={{ ['--li' as string]: i }}
              >
                {u.t}
              </span>
              {u.sp && ' '}
            </span>
          )
        )}
      </h1>

      <div className="relative z-[2] mt-5 animate-rise-in font-tamil text-[clamp(22px,3.4vw,40px)] font-semibold text-flame" style={{ animationDelay: '2s' }}>
        தமிழீழம் — Tamil Eelam
      </div>

      <p className="relative z-[2] mt-7 max-w-[560px] animate-rise-in text-[clamp(15px,1.8vw,18px)] leading-[1.7] text-bone-dim" style={{ animationDelay: '2.4s' }}>
        {p.sub}
      </p>

      <div
        className="absolute bottom-16 left-1/2 z-[2] flex -translate-x-1/2 animate-rise-in flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-ash lg:bottom-9"
        style={{ animationDelay: '3s' }}
      >
        {p.enter}
        <span className="block h-11 w-px animate-cue-drop bg-gradient-to-b from-flame to-transparent motion-reduce:animate-none" />
      </div>
    </section>
  )
}
