'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { useLang } from '@/context/LanguageContext'
import { events } from '@/data/events'
import { experience } from '@/data/experience'
import { vigil } from '@/data/narrative'
import { usePresence } from '@/hooks/usePresence'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useReveal } from '@/hooks/useReveal'
import { useScrub } from '@/hooks/useScrub'
import ChapterOpen from './ChapterOpen'
import ChapterEnd from './ChapterEnd'
import { ChBody } from './blocks'
import Flame from './Flame'
import styles from './Disparus.module.css'

const FRAME_COUNT = 24
// the same wall hung three ways, columns × rows: a phone (which shows the
// first sixteen), a tablet, a desk. The CSS picks one pair of coordinates.
const HANGINGS = [[4, 4], [6, 4], [8, 3]] as const
// the light held on the middle of the wall; Disparus.module.css reads var(--p, 0.46)
const REST = 0.46
// how long the last word of the statement is kept back, in steps of .stagger's 0.14s
const HELD = 12

// Time still passing. The server, and a page without JavaScript, do not know
// what day it is: they say only since when. The number is today's, read once.
const SINCE: Record<'fr' | 'en' | 'ta', [string, (n: string) => string]> = {
  fr: ['Depuis le 18 mai 2009.', (n) => `${n} jours ont passé depuis le 18 mai 2009.`],
  en: ['Since 18 May 2009.', (n) => `${n} days have passed since 18 May 2009.`],
  ta: ['2009 மே 18 முதல்.', (n) => `2009 மே 18 முதல் ${n} நாட்கள் கடந்துவிட்டன.`],
}
/** Whole days from 18 May 2009 to the reader's own date, both taken at UTC midnight. */
const daysSince = () => {
  const now = new Date()
  return Math.round((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(2009, 4, 18)) / 86_400_000)
}

const round = (n: number) => Math.round(n * 1000) / 1000

/** Where each frame hangs. Nothing here is data: no frame stands for anyone. */
const FRAMES = Array.from({ length: FRAME_COUNT }, (_, i) => {
  const place: Record<string, string | number> = {
    '--d': round(((i * 7 + 3) % 10) / 9), // how far off the wall, 0..1
    '--hang': `${((i * 5) % 7) - 3}px`, // hung by hand, not by a ruler
  }
  for (const [cols, rows] of HANGINGS) {
    place[`--x${cols}`] = round(((i % cols) + 0.5) / cols)
    place[`--y${cols}`] = round((Math.floor(i / cols) + 0.5) / rows)
  }
  return place as CSSProperties
})

/** Dust in the light: [across the light, seconds to settle, seconds already fallen, size]. */
const DUST: [number, number, number, number][] = [
  [41, 38, 5, 2], [45, 46, 21, 1.5], [48, 34, 13, 2], [50.5, 52, 37, 1.5],
  [53, 40, 29, 2], [56, 44, 8, 1.5], [59, 36, 24, 2], [44, 50, 43, 1.5],
]

/** One frame as the light sees it: where it hangs, and the parts that answer. */
type Hung = { x: number; y: number; d: number; hang: number; shadow: HTMLElement; frame: HTMLElement; glass: HTMLElement; sheen: HTMLElement }
type Wall = { width: number; k: number; reach: number; cast: number; light: HTMLElement; frames: Hung[] }

const clamp = (n: number, lo: number, hi: number) => (n < lo ? lo : n > hi ? hi : n)
const px = (n: number) => `${n.toFixed(1)}px`

/** The wall as it is hung at this width, read back from the CSS that hangs it. */
function readWall(room: HTMLElement): Wall {
  const read = (el: Element, name: string) => parseFloat(getComputedStyle(el).getPropertyValue(name))
  return {
    width: window.innerWidth,
    k: read(room, '--k'),
    reach: read(room, '--reach'),
    cast: read(room, '--throw'),
    light: room.querySelector<HTMLElement>(`.${styles.light}`)!,
    frames: Array.from(room.querySelectorAll<HTMLElement>(`.${styles.cell}`))
      .filter((cell) => cell.offsetParent) // a phone leaves the last eight off the wall
      .map((cell) => {
        const [shadow, frame] = Array.from(cell.children) as HTMLElement[]
        const glass = frame.firstElementChild as HTMLElement
        return { x: read(cell, '--x'), y: read(cell, '--y'), d: read(cell, '--d'), hang: read(cell, '--hang'), shadow, frame, glass, sheen: glass.firstElementChild as HTMLElement }
      }),
  }
}

/**
 * The room at `p` of its passage. This is Disparus.module.css said again in
 * JavaScript, number for number: the stylesheet draws the room at rest (and
 * is all there is without scripting); this draws it while the reader moves.
 * Written straight onto each part rather than through `--p` on the room:
 * a custom property is inherited, so one write there restyled all hundred
 * parts and their long calc()s on every frame (measured: 1.3 to 3.4 ms a
 * frame on a desk, 10 to 15 ms on a throttled phone).
 */
function paint(wall: Wall, p: number) {
  const light = -0.5 + 2 * clamp((p - 0.29) / 0.34, 0, 1)
  const walk = p - 0.5
  wall.light.style.transform = `translate3d(${((light - 0.5) * 100).toFixed(2)}%,0,0) skewX(-12deg)`
  for (const f of wall.frames) {
    const dx = f.x - light + wall.k * (f.y - 0.5)
    const lit = clamp(1 - Math.abs(dx) / wall.reach, 0, 1)
    f.frame.style.transform = `translate3d(${px(walk * f.d * -14)},${px(f.hang + walk * f.d * -7)},0) scale(${1 + f.d * 0.03})`
    f.shadow.style.transform = `translate3d(${px(clamp(dx * 3, -1, 1) * (wall.cast + f.d * wall.cast) + walk * f.d * -9)},${px(3 + f.d * 4 + f.hang + walk * f.d * -4)},0)`
    f.shadow.style.opacity = (0.15 + 0.85 * lit).toFixed(3)
    f.glass.style.opacity = lit.toFixed(3)
    if (lit > 0) f.sheen.style.transform = `translate3d(${((dx / wall.reach) * -105).toFixed(1)}%,0,0)`
  }
}

// Chapter VIII — the disappeared: a room where someone is expected. A wall
// of empty frames, a light that crosses it and finds no one, and the vigil
// of the Mothers of the North.
export default function ChDisparus() {
  const { lang, locale, t } = useLang()
  const v = vigil[lang]
  const ref = useReveal()
  // the ambient sound listens for this: an empty room, and a clock
  const absenceRef = usePresence<HTMLElement>('absence', 0.85)
  const room = useRef<HTMLDivElement>(null)
  const wall = useRef<Wall | null>(null)
  const move = useCallback((p: number) => {
    if (!room.current) return
    if (wall.current?.width !== window.innerWidth) wall.current = readWall(room.current)
    paint(wall.current, p)
  }, [])
  // measured on a childless element laid over the room: `--p` restyles nothing
  const passage = useScrub<HTMLSpanElement>({ rest: REST, onChange: move })
  const still = useReducedMotion()
  // the room only holds the reader once scripting is there to move the light:
  // the server's page, and a page without JavaScript, keep it in ordinary flow
  const [awake, setAwake] = useState(false)
  const [days, setDays] = useState<number | null>(null)
  useEffect(() => { setAwake(true); setDays(daysSince()) }, [])
  const disappeared = events[10]
  const words = experience.absence[lang].split(' ')

  // the dust settles only while the room is on screen
  useEffect(() => {
    const el = room.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => { el.dataset.running = String(entry.isIntersecting) })
    io.observe(el)
    return () => io.disconnect()
  }, [room])

  return (
    <section id="disparus" ref={absenceRef} className="relative bg-gradient-to-b from-[rgb(var(--ch-void))] via-[rgb(var(--ch-void-2))] to-night">
      <ChapterOpen id="disparus" lede={v.disparusLede} />
      <div ref={ref as React.RefObject<HTMLDivElement>}>
        <ChBody>
          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <h3 className={`stagger reveal lang-title max-w-[17ch] font-display text-[clamp(32px,4.5vw,58px)] font-light leading-tight ${styles.statement}`}>
              {words.map((word, i) => (
                <span key={i}>
                  <span className="w" style={{ ['--wi' as string]: i === words.length - 1 ? i + HELD : i }}>{word}</span>
                  {i < words.length - 1 && ' '}
                </span>
              ))}
            </h3>
            <div className={`reveal ${styles.answer}`}>
              <p className="text-lg italic text-ash">{experience.waiting[lang]}</p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ash">
                {days === null ? SINCE[lang][0] : SINCE[lang][1](new Intl.NumberFormat(locale).format(days))}
              </p>
            </div>
          </div>

          <div ref={room} className={styles.room} data-live={awake && !still ? '' : undefined}>
            <span ref={passage} aria-hidden="true" className={styles.passage} />
            <div className={styles.stage}>
              <div className={`reveal ${styles.wall}`} role="img" aria-label={v.disparusFrames}>
                <span aria-hidden="true" className={styles.light}>
                  {DUST.map(([x, fall, fallen, size], i) => (
                    <i key={i} style={{ '--mx': `${x}%`, '--mt': `${fall}s`, '--md': `-${fallen}s`, '--ms': `${size}px` } as CSSProperties} />
                  ))}
                </span>
                <div className={styles.frames}>
                  {FRAMES.map((place, i) => (
                    <div key={i} className={styles.cell} style={place}>
                      <span aria-hidden="true" className={styles.shadow} />
                      <span className={styles.frame}>
                        <span aria-hidden="true" className={styles.glass}>
                          <span className={styles.sheen} />
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <p className={`reveal d1 text-sm italic text-ash ${styles.note}`}>{v.disparusFrames}</p>
            </div>
          </div>

          <div className={`reveal d2 max-w-[820px] ${styles.sill}`}>
            <div className={styles.lamp}>
              <Flame size={22} />
            </div>
            <div className={styles.words}>
              <p className="font-display text-2xl italic leading-relaxed text-bone">{t('t2-quote')}</p>
              <p className="mt-4 font-mono text-[9px] uppercase tracking-wide text-ash">{t('t2-author')} · {t('t2-role')}</p>
              <p className="mt-6 max-w-[56ch] text-[15px] leading-[1.75] text-bone-dim">{v.disparusVigil}</p>
              <p className="mt-4 max-w-[56ch] text-[15px] leading-[1.75] text-bone-dim">{disappeared.detail[lang]}</p>
            </div>
          </div>
        </ChBody>
      </div>
      <ChapterEnd id="disparus" />
    </section>
  )
}
