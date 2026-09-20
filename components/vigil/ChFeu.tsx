'use client'

import Image from 'next/image'
import { useLang } from '@/context/LanguageContext'
import { events } from '@/data/events'
import { vigil } from '@/data/narrative'
import { experience } from '@/data/experience'
import { useOrdeal } from '@/hooks/useOrdeal'
import { usePresence } from '@/hooks/usePresence'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useReveal } from '@/hooks/useReveal'
import ChapterOpen from './ChapterOpen'
import ChapterEnd from './ChapterEnd'
import { ChBody, Caption, Prose } from './blocks'
import GlPyre from './gl/GlPyre'

/** A subtle heat shimmer over the lost-book count. */
function FireFilters({ still }: { still: boolean }) {
  return (
    <svg aria-hidden="true" focusable="false" className="absolute h-0 w-0 overflow-hidden">
      <defs>
        {/* hot air over the number: the figure wavers the way a wall does over a fire */}
        <filter id="heat-haze" x="-10%" y="-20%" width="120%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.005 0.018" numOctaves="1" seed="3" result="n">
            {!still && (
              <animate
                attributeName="baseFrequency"
                dur="13s"
                values="0.005 0.018;0.007 0.024;0.004 0.020;0.005 0.018"
                repeatCount="indefinite"
              />
            )}
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  )
}

/** The rebuilt library in 2003; the caption distinguishes it from the 1981 fire. */
function ArchivePhoto({ tag, caption, credit }: { tag: string; caption: string; credit: string }) {
  return (
    <figure className="reveal d1 w-full max-w-[440px] justify-self-end lg:row-span-2 lg:mt-16">
      <div className="mb-4 flex items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.2em] text-ash">
        <span className="flex items-center gap-3"><span aria-hidden="true" className="h-px w-7 bg-gold/60" />{tag}</span>
        <span>2003</span>
      </div>
      <div className="relative border border-bone/20 p-1.5">
        <Image
          src="/archive/jaffna-library-2003.jpg"
          width={2325}
          height={1550}
          alt={caption}
          sizes="(max-width: 639px) calc(100vw - 62px), (max-width: 1023px) 426px, 34vw"
          className="block h-auto w-full sepia-[.32] contrast-[1.04] saturate-[.78] brightness-[.96]"
        />
      </div>
      <figcaption className="mt-5 border-l border-gold/30 pl-4">
        <p className="text-[13px] italic leading-[1.7] text-bone-dim">{caption}</p>
        <p className="mt-3 font-mono text-[8px] uppercase leading-[1.8] tracking-[0.12em] text-ash">{credit}</p>
      </figcaption>
    </figure>
  )
}

// Chapter III — fire: the pogroms and the burning of the Jaffna Library.
export default function ChFeu() {
  const { lang, locale } = useLang()
  const v = vigil[lang]
  const ref = useReveal()
  const still = useReducedMotion()
  const ordealRef = useOrdeal<HTMLElement>(0.65)
  // the ambient sound listens for this: the fire is heard only from here
  const fireRef = usePresence<HTMLElement>('fire', 1)
  const pogroms = events[5] // 1958, 1977, 1981

  return (
    <section
      id="feu"
      ref={(el) => {
        ordealRef.current = el
        fireRef.current = el
      }}
      className="relative bg-night bg-[radial-gradient(110%_80%_at_50%_108%,rgb(var(--c-blood)/0.38),rgb(var(--c-ember)/0.08)_55%,transparent_75%)]"
    >
      <FireFilters still={still} />
      {/* the air over the burning library, pinned under the reader for the
          length of the chapter: the bed of coals along the ground, the
          leaves of the books torn loose and burning as they rise, the ash
          they become, the sparks the fire still throws */}
      <GlPyre alpha={0.9} />
      <div className="relative z-[2]">
        <ChapterOpen id="feu" lede={v.feuLede} />
        <div ref={ref as React.RefObject<HTMLDivElement>}>
          <ChBody>
            <div className="mx-auto max-w-[1200px]">
              <div className="grid grid-cols-1 items-start gap-x-[8vw] gap-y-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-y-9">
                <header className="reveal min-w-0">
                  <p className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ember">
                    <span aria-hidden="true" className="h-px w-8 shrink-0 bg-ember/60" />
                    {experience.libraryDate[lang]}
                  </p>
                  <h3 className="lang-title max-w-[19ch] font-display text-[clamp(32px,4.2vw,60px)] font-light leading-[1.12] tracking-[-0.02em]">{experience.library[lang]}</h3>
                </header>

                <ArchivePhoto tag={v.feuArchiveTag} caption={v.feuArchiveCaption} credit={v.feuArchiveCredit} />

                <div className="reveal d2 min-w-0 max-w-[54ch] lg:col-start-1">
                  <Caption>{pogroms.year} — {pogroms.title[lang]}</Caption>
                  <Prose><p>{pogroms.detail[lang]}</p></Prose>
                </div>
              </div>

              <div className="reveal mt-14 grid items-center gap-5 border-t border-bone/20 pt-8 sm:mt-20 sm:grid-cols-[auto_1fr] sm:gap-10 lg:gap-16">
                <p
                  className="whitespace-nowrap font-display text-[clamp(76px,12vw,168px)] font-light leading-none tracking-[-0.045em] text-ember tabular-nums"
                  style={still ? undefined : { filter: 'url(#heat-haze)' }}
                >
                  {(97000).toLocaleString(locale)}
                </p>
                <p className="max-w-[30ch] font-display text-[clamp(20px,2.1vw,29px)] italic leading-[1.45] text-bone-dim">{v.feuBooksLabel}</p>
              </div>
            </div>
          </ChBody>
        </div>
      </div>
      <ChapterEnd id="feu" />
    </section>
  )
}
