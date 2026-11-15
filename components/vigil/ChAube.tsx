'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/context/LanguageContext'
import { events } from '@/data/events'
import { vigil } from '@/data/narrative'
import { experience } from '@/data/experience'
import { sources } from '@/data/research'
import { usePresence } from '@/hooks/usePresence'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { prefersReducedMotion } from '@/lib/motion'
import { useReveal } from '@/hooks/useReveal'
import { useScrub } from '@/hooks/useScrub'
import Air from './Air'
import styles from './Aube.module.css'
import ChapterOpen from './ChapterOpen'
import ChapterEnd from './ChapterEnd'
import { ChBody, Caption, Prose } from './blocks'
import Flame from './Flame'

const cities = ['Toronto', 'London', 'Paris', 'Zurich', 'Oslo', 'Sydney', 'Chennai', 'Berlin']
const milestones = [
  { year: '2011', source: 'panel', fr: 'Documenter les crimes', en: 'Documenting the crimes', ta: 'குற்றங்களை ஆவணப்படுத்துதல்' },
  { year: '2015', source: 'oisl', fr: 'Établir les responsabilités', en: 'Establishing accountability', ta: 'பொறுப்புக்கூறலை நிறுவுதல்' },
  { year: '2022', source: 'canada', fr: 'Reconnaître le génocide', en: 'Recognising the genocide', ta: 'இனப்படுகொலையை அங்கீகரித்தல்' },
  { year: '2024', source: 'disappearances', fr: 'Chercher les disparus', en: 'Searching for the disappeared', ta: 'காணாமலாக்கப்பட்டவர்களைத் தேடுதல்' },
] as const

// The order the windows light in: from the east to the west, the way a
// morning goes round. Sydney, Chennai, Berlin, Oslo, Zurich, Paris, London, Toronto.
const wake = [5, 6, 7, 4, 3, 2, 1, 0]
/** one window, then a held beat before the next */
const BEAT = 1900

/**
 * The thread that joins them afterwards does not retrace that order: it goes
 * round, from the first window lit back to it, so that it closes. Drawn on a
 * grid `cols` wide where a column is one unit across and a row one unit down
 * (Aube.module.css stretches the drawing to the real grid): straight between
 * two flames one above the other, and between neighbours an arch over the
 * names of the top row, a sag under the sills of the bottom one, never
 * through a name. Cut into short pieces so it can be drawn by opacity alone.
 */
function thread(cols: number, ring: number[]) {
  const pieces: string[] = []
  for (let k = 1; k < ring.length; k++) {
    const [ax, ay] = [ring[k - 1] % cols, Math.floor(ring[k - 1] / cols)]
    const [bx, by] = [ring[k] % cols, Math.floor(ring[k] / cols)]
    const bow = ay !== by ? 0 : ay === 0 ? -0.62 : 0.62
    const cuts = bow ? 18 : 4
    const at = (t: number) => {
      const u = 1 - t
      const near = u * u * u + 3 * u * u * t
      return `${(ax * near + bx * (1 - near)).toFixed(3)} ${(ay * near + by * (1 - near) + 3 * u * t * bow).toFixed(3)}`
    }
    for (let c = 0; c < cuts; c++) pieces.push(`M${at(c / cuts)}L${at((c + 1) / cuts)}`)
  }
  return pieces
}
const threads = [
  { cols: 2, rows: 4, className: styles.tall, pieces: thread(2, [5, 7, 6, 4, 2, 0, 1, 3, 5]) },
  { cols: 4, rows: 2, className: styles.wide, pieces: thread(4, [5, 6, 7, 3, 2, 1, 0, 4, 5]) },
]

/**
 * Eight rooms in eight countries, the same small gesture at the same hour.
 * Rendered lit (that is the page without scripting, and the page at rest);
 * a reader who arrives from above finds the windows dark, and each is lit in
 * its turn once they are there: eight state changes, and the thread comes
 * last, on its own (CSS, from `data-lit`).
 */
function Cities() {
  const ref = useRef<HTMLDivElement>(null)
  const still = useReducedMotion()
  const [lit, setLit] = useState(cities.length)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (still || prefersReducedMotion()) { setLit(cities.length); return }
    // already among them (a restored position): they were lit before the reader came
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return
    setLit(0)
    let timer = 0
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      let n = 0
      const next = () => {
        setLit(++n)
        if (n < cities.length) timer = window.setTimeout(next, BEAT)
      }
      timer = window.setTimeout(next, 900)
    }, { threshold: 0.6 })
    io.observe(el)
    return () => { io.disconnect(); window.clearTimeout(timer) }
  }, [still])

  return (
    <div ref={ref} data-lit={lit} className={`${styles.cities} mt-16 grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4`}>
      {threads.map(({ cols, rows, className, pieces }) => (
        <div key={cols} aria-hidden="true" className={`${styles.thread} ${className}`}>
          <svg viewBox={`0 0 ${cols - 1} ${rows - 1}`} preserveAspectRatio="none" focusable="false">
            {pieces.map((d, n) => <path key={n} d={d} style={{ ['--n' as string]: (n / pieces.length).toFixed(3) }} />)}
          </svg>
        </div>
      ))}
      {cities.map((city, i) => {
        const on = wake.indexOf(i) < lit
        return (
          <div key={city} data-lit={on} className={`${styles.city} flex items-end gap-4 border-b border-gold/15 pb-5`}>
            <Flame size={16} lit={on} /><span className={`${styles.name} font-display text-[clamp(21px,2.5vw,32px)] italic text-flame`}>{city}</span>
          </div>
        )
      })}
    </div>
  )
}

/**
 * The sky of the chapter: night where it opens, the grey-gold of first light
 * where it ends, by the reader's own scroll. Only opacities and one transform
 * follow `--p`; the element holds the sky and nothing else.
 */
function Sky() {
  const ref = useScrub<HTMLDivElement>({ pinned: true })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => { el.dataset.run = String(entry.isIntersecting) })
    io.observe(el)
    return () => io.disconnect()
  }, [ref])

  return (
    <div ref={ref} className={styles.sky} aria-hidden="true">
      <div className={styles.grey} />
      <div className={styles.gold} />
      <div className={styles.view}>
        <div className={styles.haze} />
        <div className={styles.glow} />
        <div className={styles.flock}>
          {[[0, 8], [22, 0], [41, 15]].map(([x, y], i) => (
            <svg key={i} viewBox="0 0 12 6" className={styles.bird} style={{ left: x, top: y, animationDelay: `${i * -0.23}s` }} focusable="false">
              <path d="M0.5 1.5Q3.5 0.5 6 4.5Q8.5 0.5 11.5 1.5" />
            </svg>
          ))}
        </div>
        <div className={styles.ground} />
      </div>
      <div className={styles.dusk} />
    </div>
  )
}

export default function ChAube() {
  const { lang } = useLang()
  const v = vigil[lang]
  const ref = useReveal()
  // the ambient sound listens for this: birds and a far bell
  const dawnRef = usePresence<HTMLElement>('dawn', 1)
  // the day's work arrives with the scroll: `--p` on the list alone
  const daysRef = useScrub<HTMLOListElement>()

  return (
    <section id="aube" ref={dawnRef} className="relative bg-night">
      <Sky />
      <Air kind="rake" intensity={0.8} warmth={0.95} />
      <div className="relative z-[2]">
        <ChapterOpen id="aube" lede={v.aubeLede} />
        <div ref={ref as React.RefObject<HTMLDivElement>}>
          <ChBody>
            <div className="reveal relative max-w-[1200px] overflow-hidden border-y border-gold/25 py-14 sm:py-20">
              <p className="lang-title max-w-[16ch] font-display text-[clamp(38px,5.8vw,78px)] font-light leading-[1.12]">{experience.diaspora[lang]}</p>
              <p className="mt-7 max-w-[40ch] text-xl italic leading-relaxed text-bone-dim">{experience.diasporaSub[lang]}</p>
              <Cities />
            </div>
            <div className="mt-16 grid max-w-[1200px] gap-12 lg:grid-cols-2 lg:gap-20">
              <div className="reveal"><Caption>{events[11].title[lang]}</Caption><Prose><p>{events[11].detail[lang]}</p></Prose></div>
              <div className="reveal d1"><Caption>{events[15].title[lang]} · 27.11</Caption><Prose><p>{events[15].detail[lang]}</p></Prose></div>
            </div>
            <div className="reveal mt-24 max-w-[1200px]">
              <h3 className="lang-title mb-12 max-w-[20ch] font-display text-[clamp(30px,4vw,52px)] font-light leading-tight">{experience.justice[lang]}</h3>
              <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
                <ol ref={daysRef} className={styles.days}>
                  {milestones.map((item, i) => <li key={item.year} className={`${styles.day} relative pb-9 last:pb-0`} style={{ ['--i' as string]: i }}>
                    <span aria-hidden="true" className={`${styles.dot} absolute -left-[32.5px] top-1.5 h-2 w-2 rounded-full bg-gold`} />
                    <span className={`${styles.arrive} block font-mono text-[11px] text-gold`}>{item.year}</span>
                    <a href={sources[item.source].href} target="_blank" rel="noopener noreferrer" className={`${styles.arrive} mt-2 block w-fit font-display text-2xl text-bone-dim underline decoration-bone/20 underline-offset-4 hover:text-flame`}>{item[lang]} ↗</a>
                  </li>)}
                </ol>
                <Prose><p>{events[12].detail[lang]}</p></Prose>
              </div>
            </div>
          </ChBody>
        </div>
      </div>
      <ChapterEnd id="aube" />
    </section>
  )
}
