'use client'

import { useEffect, type ReactNode } from 'react'
import Image from 'next/image'
import { experience } from '@/data/experience'
import { maaveerar } from '@/data/historyChapters'
import { useLang } from '@/context/LanguageContext'
import { symbols, type SymbolEntry } from '@/data/narrative'
import { useReveal } from '@/hooks/useReveal'
import { useScrub } from '@/hooks/useScrub'
import Air from './Air'
import ChapterOpen from './ChapterOpen'
import ChapterEnd from './ChapterEnd'
import { GlEmbers } from './gl/lazy'
import { ChBody, Caption, Prose } from './blocks'
import { Spoken } from './Voice'
import camera from './Camera.module.css'
import sym from './Symboles.module.css'

type Kind = 'flag' | 'leopard' | 'coucal' | 'flower'

const ramp = (p: number, from: number, to: number) => (p <= from ? 0 : p >= to ? 1 : (p - from) / (to - from))

/**
 * What the reader's scroll does to each one, the way that thing is met. `p`
 * is the picture's own passage up the screen (0 as its top touches the
 * bottom, 0.5 centred), so every gesture is over before the picture is
 * centred and it is then held, whole and still. One property per element,
 * written inline on that element alone; '' hands it back to the stylesheet,
 * which is the rest state the server sent.
 */
const ACTS: Record<Kind, (scene: HTMLElement, p: number) => void> = {
  // cloth: drawn out from the pole edge by the hand that scrolls, at the hand's own pace
  flag(scene, p) {
    const pic = scene.querySelector<HTMLElement>('[data-pic]')
    if (!pic) return
    const t = ramp(p, 0.12, 0.46)
    pic.style.clipPath = t < 1 ? `inset(0 ${(100 - t * 100).toFixed(2)}% 0 0)` : ''
    // p < 1: never at rest (useScrub reports 1 in reduced motion and quiet reading)
    pic.firstElementChild?.toggleAttribute('data-out', t === 1 && p < 1)
  },
  // found, not shown: the eye adjusts, slowly at first, from where its own eyes are
  leopard(scene, p) {
    const pic = scene.querySelector<HTMLElement>('[data-pic]')
    if (!pic) return
    const t = ramp(p, 0.14, 0.44)
    pic.style.clipPath = t < 1 ? `circle(${(t * t * (3 - 2 * t) * 95).toFixed(2)}% at 33% 57%)` : ''
  },
  // a living thing arriving: down and in from behind its tail, slower as it lands, and it stays
  coucal(scene, p) {
    const pic = scene.querySelector<HTMLElement>('[data-pic]')
    const img = scene.querySelector<HTMLElement>('img')
    if (!pic || !img) return
    const t = ramp(p, 0.08, 0.46)
    const left = (1 - t) * (1 - t)
    img.style.transform = t < 1 ? `translate(${(left * 10).toFixed(2)}%, ${(-left * left * 14).toFixed(2)}%)` : ''
    pic.style.opacity = t < 1 ? Math.min(1, t * 2.5).toFixed(3) : ''
  },
  // the longest: the picture comes out of the dark as its warmth and the embers rise
  flower(scene, p) {
    const img = scene.querySelector<HTMLElement>('img')
    const warm = scene.querySelector<HTMLElement>('[data-warm]')
    if (!img || !warm) return
    const t = ramp(p, 0.06, 0.58)
    img.style.opacity = t < 1 ? (0.16 + 0.84 * t).toFixed(3) : ''
    warm.style.opacity = t < 1 ? t.toFixed(3) : ''
  },
}

/**
 * One symbol, alone on its screen: the Tamil name first, then the picture
 * the scroll brings about, then the caption and the paragraph. The picture is
 * served whole; the gesture is taken away and given back by ACTS, so without
 * JavaScript, in reduced motion and in quiet reading it is simply there.
 */
function Moment({
  kind,
  s,
  src,
  width,
  height,
  credit,
  cols,
  flip = false,
  behind,
  children,
}: {
  kind: Kind
  s: SymbolEntry
  src: string
  width: number
  height: number
  credit: string
  cols: string
  /** on wide screens the text comes first, as the page alternated before */
  flip?: boolean
  behind?: ReactNode
  children?: ReactNode
}) {
  const { lang } = useLang()
  const ref = useScrub<HTMLDivElement>({ variable: false, onChange: (p) => ref.current && ACTS[kind](ref.current, p) })

  // the air on the flag moves only while the flag is on screen
  useEffect(() => {
    const el = ref.current
    if (kind !== 'flag' || !el) return
    const io = new IntersectionObserver(([entry]) => el.toggleAttribute('data-near', entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [kind, ref])

  return (
    <div className={`${sym.moment} grid grid-cols-1 gap-10 lg:items-center lg:gap-[5vw] ${cols}`}>
      <div className={flip ? 'lg:order-2' : undefined}>
        {/* in Tamil the title is the name: said once */}
        <p lang="ta" className={`reveal font-tamil ${sym.name}`}>{lang === 'ta' ? s.title : s.tamil}</p>
        <div ref={ref} className={sym.scene}>
          {behind}
          <figure className="group relative z-[2] border-y border-bone/20 bg-[rgb(var(--c-night-2))] py-4">
            {/* three elements, three jobs: the unfurl / iris on the wrapper,
                the gate with its own clip (and the flag's air), the image */}
            <div data-pic>
              <div className={`${camera.gate} ${camera.hug} ${kind === 'flag' ? sym.air : ''}`} style={{ ['--gate-ar' as string]: width / height }}>
                <Image
                  src={src}
                  width={width}
                  height={height}
                  alt={s.title}
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="block max-h-[65svh] w-full object-contain transition-[filter] duration-700 saturate-[0.75] group-hover:saturate-100"
                />
              </div>
            </div>
            <figcaption className="flex items-center justify-between gap-3 px-1 pb-0.5 pt-2.5 font-mono text-[9px] uppercase tracking-[0.2em] text-ash">
              <span className="font-tamil normal-case tracking-normal">{s.tamil}</span>
              <span>{credit}</span>
            </figcaption>
          </figure>
        </div>
      </div>
      <div>
        {lang !== 'ta' && <Caption className="reveal">{s.title}</Caption>}
        <Prose className="reveal d1">
          <p>{s.text}</p>
        </Prose>
        {children}
      </div>
    </div>
  )
}

// Chapter IX — the symbols of Tamil Eelam: flag, leopard, coucal, glory lily.
export default function ChSymboles() {
  const { lang } = useLang()
  const s = symbols[lang]
  const ref = useReveal()

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
            <Spoken as="h3" text={experience.symbols[lang]} className="lang-title mb-14 max-w-[20ch] font-display text-[clamp(30px,4vw,52px)] font-light leading-tight" />

            {/* the flag — wide, like a flag, and the reader unfurls it */}
            <Moment kind="flag" s={s.flag} src="/symbols/flag.webp" width={1400} height={933} credit="Tamil Eelam" cols="max-w-[1200px] lg:grid-cols-[1.2fr_1fr]" />

            {/* the leopard — portrait image, text first on the left */}
            <Moment kind="leopard" s={s.animal} src="/symbols/leopard.webp" width={927} height={1200} credit="C. J. Sharp · CC BY-SA 4.0" cols="max-w-[1100px] lg:grid-cols-[1fr_0.9fr]" flip />

            {/* the coucal — settling into its frame as the reader arrives */}
            <Moment kind="coucal" s={s.bird} src="/symbols/coucal.webp" width={1400} height={932} credit="C. J. Sharp · CC BY-SA 4.0" cols="max-w-[1200px] lg:grid-cols-[1.1fr_1fr]" />

            {/* the flower — its petals are already embers in the telling;
                a few drift here for real, and close the chapter into the
                night that follows every 27 November */}
            <Moment
              kind="flower"
              s={s.flower}
              src="/symbols/gloriosa.webp"
              width={1400}
              height={933}
              credit="J. Jose · CC BY-SA 4.0"
              cols="max-w-[1200px] lg:grid-cols-[1fr_1.1fr]"
              flip
              behind={
                <div data-warm aria-hidden="true" className={`pointer-events-none absolute -inset-x-6 -inset-y-10 z-[1] ${sym.warm}`}>
                  <GlEmbers density={16} intensity={0.5} speed={0.8} fallbackDensity={6} />
                </div>
              }
            >
              <a href="#maaveerar" className="reveal mt-12 inline-flex min-h-11 items-center gap-5 border-b border-gold/40 py-3 text-lg text-bone-dim hover:text-flame">
                {maaveerar.link[lang]} <span aria-hidden="true">↓</span>
              </a>
            </Moment>
          </ChBody>
        </div>
      </div>
      <ChapterEnd id="symboles" />
    </section>
  )
}
