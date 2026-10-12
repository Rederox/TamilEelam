'use client'

import Image from 'next/image'
import { experience } from '@/data/experience'
import { maaveerar } from '@/data/historyChapters'
import { useLang } from '@/context/LanguageContext'
import { symbols, type SymbolEntry } from '@/data/narrative'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useReveal } from '@/hooks/useReveal'
import { useViewProgress } from '@/hooks/useSceneProgress'
import Air from './Air'
import ChapterOpen from './ChapterOpen'
import ChapterEnd from './ChapterEnd'
import GlEmbers from './gl/GlEmbers'
import { ChBody, Caption, Prose } from './blocks'

/**
 * A picture, given a treatment that says something about its subject
 * rather than a generic fade: the flag unfurls as cloth catches air, the
 * leopard's ground opens like an eye finding it in the underbrush. Both are
 * plain CSS (clip-path transitions triggered by the shared .reveal.in), so
 * they cost nothing extra and fall away cleanly under reduced motion —
 * see .unfurl / .iris in globals.css.
 */
function Frame({
  src,
  width,
  height,
  alt,
  label,
  credit,
  anim,
}: {
  src: string
  width: number
  height: number
  alt: string
  label: string
  credit: string
  anim?: 'unfurl' | 'iris'
}) {
  return (
    <figure className="group relative z-[2] border-y border-bone/20 bg-[rgb(var(--c-night-2))] py-4">
      <div className={anim ?? undefined}>
        <Image
          src={src}
          width={width}
          height={height}
          alt={alt}
          sizes="(min-width: 1024px) 45vw, 90vw"
          className="block max-h-[65svh] w-full object-contain transition-[filter] duration-700 saturate-[0.75] group-hover:saturate-100"
        />
      </div>
      <figcaption className="flex items-center justify-between gap-3 px-1 pb-0.5 pt-2.5 font-mono text-[9px] uppercase tracking-[0.2em] text-ash">
        <span className="font-tamil normal-case tracking-normal">{label}</span>
        <span>{credit}</span>
      </figcaption>
    </figure>
  )
}

function Body({ s, delay = false }: { s: SymbolEntry; delay?: boolean }) {
  const { lang } = useLang()
  return (
    <div>
      <Caption className={`reveal ${delay ? 'd1' : ''}`}>
        {s.title}
        {lang !== 'ta' && <span className="font-tamil normal-case tracking-normal"> · {s.tamil}</span>}
      </Caption>
      <Prose className={`reveal ${delay ? 'd2' : 'd1'}`}>
        <p>{s.text}</p>
      </Prose>
    </div>
  )
}

// Chapter IX — the symbols of Tamil Eelam: flag, leopard, coucal, glory lily.
export default function ChSymboles() {
  const { lang } = useLang()
  const s = symbols[lang]
  const ref = useReveal()
  const stillness = useReducedMotion()

  // the coucal settles into its frame rather than simply appearing: a
  // small parallax drift tied to how far the reader has carried it into view
  const { ref: birdRef, progress: birdProgress } = useViewProgress<HTMLDivElement>()
  const birdDrift = stillness ? 0 : (birdProgress - 0.5) * 26

  return (
    <section
      id="symboles"
      className="relative bg-night bg-[radial-gradient(110%_80%_at_85%_15%,rgb(var(--c-gold)/0.08),transparent_60%)]"
    >
      {/* a flag is cloth before it is an emblem: the fabric hangs behind them all */}
      <Air kind="cloth" intensity={0.75} warmth={0.7} />
      <div className="relative z-[2]">
        <ChapterOpen id="symboles" lede={s.lede} />
        <div ref={ref as React.RefObject<HTMLDivElement>}>
          <ChBody>
          <h3 className="reveal lang-title mb-14 max-w-[20ch] font-display text-[clamp(30px,4vw,52px)] font-light leading-tight">{experience.symbols[lang]}</h3>
          {/* the flag — wide, like a flag, and it unfurls like one */}
          <div className="grid max-w-[1200px] grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-[5vw]">
            <div className="reveal">
              <Frame
                src="/symbols/flag.png"
                width={1400}
                height={933}
                alt={s.flag.title}
                label={s.flag.tamil}
                credit="Tamil Eelam"
                anim="unfurl"
              />
            </div>
            <Body s={s.flag} />
          </div>

          {/* the leopard — portrait image, text first on the left */}
          <div className="mt-16 grid max-w-[1100px] grid-cols-1 gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-[5vw]">
            <div className="order-2 lg:order-1">
              <Body s={s.animal} />
            </div>
            <div className="reveal d2 order-1 lg:order-2">
              <Frame
                src="/symbols/leopard.jpg"
                width={927}
                height={1200}
                alt={s.animal.title}
                label={s.animal.tamil}
                credit="C. J. Sharp · CC BY-SA 4.0"
                anim="iris"
              />
            </div>
          </div>

          {/* the coucal — settling into its frame as the reader arrives */}
          <div className="mt-16 grid max-w-[1200px] grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-[5vw]">
            <div
              ref={birdRef}
              className="reveal will-change-transform"
              style={{ transform: `translateY(${birdDrift.toFixed(2)}px)` }}
            >
              <Frame
                src="/symbols/coucal.jpg"
                width={1400}
                height={932}
                alt={s.bird.title}
                label={s.bird.tamil}
                credit="C. J. Sharp · CC BY-SA 4.0"
              />
            </div>
            <Body s={s.bird} delay />
          </div>

          {/* the flower — its petals are already embers in the telling;
              a few drift here for real, and close the chapter into the
              night that follows every 27 November */}
          <div className="mt-16 grid max-w-[1200px] grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-[5vw]">
            <div className="order-2 lg:order-1">
              <Body s={s.flower} />
            </div>
            <div className="reveal d2 relative order-1 lg:order-2">
              <div className="pointer-events-none absolute -inset-x-6 -inset-y-10 z-[1]">
                <GlEmbers density={16} intensity={0.5} speed={0.8} fallbackDensity={6} />
              </div>
              <Frame
                src="/symbols/gloriosa.jpg"
                width={1400}
                height={933}
                alt={s.flower.title}
                label={s.flower.tamil}
                credit="J. Jose · CC BY-SA 4.0"
              />
            </div>
          </div>

          <a href="#maaveerar" className="reveal mt-12 inline-flex min-h-11 items-center gap-5 border-b border-gold/40 py-3 text-lg text-bone-dim hover:text-flame">
            {maaveerar.link[lang]} <span aria-hidden="true">↓</span>
          </a>
          </ChBody>
        </div>
      </div>
      <ChapterEnd id="symboles" />
    </section>
  )
}
