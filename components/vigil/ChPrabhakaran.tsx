'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useLang } from '@/context/LanguageContext'
import { prabhakaran as p } from '@/data/historyChapters'
import { useReveal } from '@/hooks/useReveal'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useScrub } from '@/hooks/useScrub'
import ChapterOpen from './ChapterOpen'
import ChapterEnd from './ChapterEnd'
import { ChBody, Caption } from './blocks'
import camera from './Camera.module.css'
import scene from './Prabhakaran.module.css'
import HistoryPassages, { HistorySources } from './HistoryPassages'

// The calendar is the data's own: the year each milestone is dated, and
// nothing in between but the integers.
const YEARS = p.timeline.map((entry) => Number(entry.date.slice(-4)))
const SPAN = `${YEARS[0]}–${YEARS[YEARS.length - 1]}`

const READ = 0.5 // the reading line, as a share of the screen: where the year sits
const HOLD = 0.3 // of a screen: how long the count stays on a milestone before the years resume
const MARK = 8 // px from the top of a milestone to the middle of its mark (Prabhakaran.module.css)

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

export default function ChPrabhakaran() {
  const { lang } = useLang()
  const ref = useReveal()
  const still = useReducedMotion()
  const year = useRef<HTMLSpanElement>(null)
  const geo = useRef<{ stops: HTMLElement[]; segs: Array<HTMLElement | null>; marks: number[] } | null>(null)
  const shown = useRef({ live: false, year: '', reached: -1, segs: [] as string[] })

  // Writes the year into one text node when the integer changes, one scaleY on
  // the length of line being drawn, one attribute when a mark is crossed. No
  // state: fifty-five renders of the chapter would be the cost of a number.
  const paint = () => {
    const el = track.current
    const figure = year.current
    if (!el || !figure) return
    const was = shown.current
    if (still) {
      if (!was.live) return
      // back to what the server sent: everything present, the span
      delete el.dataset.live
      figure.textContent = SPAN
      el.querySelectorAll<HTMLElement>('[data-stop]').forEach((stop) => stop.removeAttribute('data-reached'))
      el.querySelectorAll<HTMLElement>('[data-seg]').forEach((seg) => { seg.style.transform = '' })
      shown.current = { live: false, year: '', reached: -1, segs: [] }
      return
    }
    if (!geo.current) {
      const stops = Array.from(el.querySelectorAll<HTMLElement>('[data-stop]'))
      geo.current = { stops, segs: stops.map((stop) => stop.querySelector<HTMLElement>('[data-seg]')), marks: stops.map((stop) => stop.offsetTop + MARK) }
    }
    const { stops, segs, marks } = geo.current
    const vh = window.innerHeight
    const y = READ * vh - el.getBoundingClientRect().top // the reading line, measured down the track
    let now = YEARS[0]
    let reached = 0
    for (let i = 0; i < marks.length; i++) {
      const from = marks[i]
      const to = marks[i + 1]
      if (y >= from) { reached = i + 1; now = YEARS[i] }
      if (to === undefined) break
      const len = to - from
      const drawn = clamp01((y - from) / len).toFixed(4)
      if (drawn !== was.segs[i]) { was.segs[i] = drawn; const seg = segs[i]; if (seg) seg.style.transform = `scaleY(${drawn})` }
      if (y >= from && y < to) {
        const hold = Math.min(HOLD * vh, len / 2)
        now = Math.floor(YEARS[i] + clamp01((y - from - hold) / (len - hold)) * (YEARS[i + 1] - YEARS[i]))
      }
    }
    if (!was.live) { was.live = true; el.dataset.live = '' }
    const text = String(now)
    if (text !== was.year) { was.year = text; figure.textContent = text }
    if (reached !== was.reached) {
      was.reached = reached
      stops.forEach((stop, i) => (i < reached ? stop.removeAttribute('data-reached') : stop.setAttribute('data-reached', 'false')))
    }
  }
  const track = useScrub<HTMLDivElement>({ variable: false, onChange: paint })
  const latest = useRef(paint)
  latest.current = paint

  // the marks move when the text reflows (fonts, language, width)
  useEffect(() => {
    const el = track.current
    if (!el || still) return
    const observer = new ResizeObserver(() => { geo.current = null; latest.current() })
    observer.observe(el)
    return () => observer.disconnect()
  }, [track, still])

  return (
    <section id="prabhakaran" aria-labelledby="prabhakaran-title" className="relative bg-night">
      <ChapterOpen id="prabhakaran" lede={p.lede[lang]} />
      <div ref={ref as React.RefObject<HTMLDivElement>}>
        <ChBody>
          <div className="mx-auto grid max-w-[1200px] items-start gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div className="min-w-0 lg:sticky lg:top-28">
              <figure className="reveal mb-10">
                <div className="border border-bone/20 bg-night-2 p-1.5">
                  <div className={camera.gate}>
                    <Image
                      src="/archive/prabhakaran-portrait.jpg"
                      alt={p.photoAlt[lang]}
                      width={1200}
                      height={800}
                      sizes="(max-width: 639px) calc(100vw - 62px), (max-width: 1023px) 82vw, 440px"
                      className={`${camera.settle} ${camera.portrait} block h-auto w-full`}
                    />
                  </div>
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
            </div>
            <div className={`min-w-0 ${scene.column}`}>
              <div ref={track} className={scene.track}>
                <div aria-hidden="true" className={scene.gutter}>
                  <span ref={year} className={`font-display font-light ${scene.year}`}>{SPAN}</span>
                </div>
                {/* each milestone, then the passage that belongs to the years after it */}
                <ol aria-label={p.timelineLabel[lang]}>
                  {p.timeline.map((entry, i) => <li key={entry.date} data-stop className={scene.stop}>
                    {i < p.timeline.length - 1 && <span aria-hidden="true" data-seg className={scene.seg} />}
                    <span aria-hidden="true" className={scene.mark} />
                    <div className={scene.entry}>
                      <p className="font-mono text-[11px] tracking-[0.12em] text-gold">{entry.date}</p>
                      <p className="mt-3 text-base leading-relaxed text-bone-dim">{entry.text[lang]}</p>
                      <HistorySources ids={[entry.source]} />
                    </div>
                    {p.passages[i] && <div className="mt-10">
                      <HistoryPassages passages={[p.passages[i]]} lang={lang} />
                    </div>}
                  </li>)}
                </ol>
              </div>
              <p className={`reveal ${scene.closing} border-l border-gold/40 pl-6 text-lg italic leading-relaxed text-bone-dim break-words`}>{p.closing[lang]}</p>
            </div>
          </div>
        </ChBody>
      </div>
      <ChapterEnd id="prabhakaran" />
    </section>
  )
}
