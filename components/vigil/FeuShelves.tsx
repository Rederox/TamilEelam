'use client'

import { useCallback, useEffect, useId, useRef, type CSSProperties } from 'react'
import { useLang } from '@/context/LanguageContext'
import { researchCopy } from '@/data/research'
import { useScrub } from '@/hooks/useScrub'
import s from './FeuShelves.module.css'

// the stylesheet holds the scene on screen under this condition; anywhere else it is shown at rest
const HOLD = '(scripting: enabled) and (prefers-reduced-motion: no-preference) and (min-height: 600px)'

const BAYS = 5
const SHELVES = 4
// px of board between two uprights; the stylesheet draws the bay 14px wider
const ROOM = 262
const PILE = 172

type Spine = { w: number; h: number; tone: number; band: number; lean: number; at: number }
type Bundle = { w: number; x: number; at: number }
type Shelf = { sag: number; pile: Bundle[]; spines: Spine[] }

// a fixed sequence, not Math.random: the server and the browser must draw the same shelves
const dice = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
const shuffled = <T,>(list: T[], r: () => number) => list.map((v) => [r(), v] as const).sort((a, b) => a[0] - b[0]).map(([, v]) => v)
const n = (v: number) => +v.toFixed(3)

// Where the palm-leaf manuscripts lie, "bay-shelf", and when each bundle goes,
// from the top of the pile down. They are the last to go, and the pile in
// the middle bay (the one a phone shows whole) is the very last, slowly.
const PILES: Record<string, number[]> = {
  '3-3': [0.612, 0.622, 0.632],
  '2-2': [0.646, 0.66, 0.676, 0.7],
}

const WALL: Shelf[][] = (() => {
  const r = dice(3)
  const wall = Array.from({ length: BAYS }, (_, b) =>
    Array.from({ length: SHELVES }, (_, k): Shelf => {
      const pile = (PILES[`${b}-${k}`] ?? []).map((at) => {
        const w = Math.round(84 + r() * 16)
        return { w, x: Math.round(r() * (100 - w)), at }
      })
      const spines: Spine[] = []
      let room = ROOM - (pile.length ? PILE + 6 : 0)
      while (room >= 12) {
        // the volumes of one work stand together: same cloth, same height
        const tone = Math.floor(r() * 6)
        const band = Math.floor(r() * 3)
        const h = Math.round(60 + r() * 36)
        const w = Math.min(Math.round(13 + r() * r() * 20), room - 1)
        for (let set = 1 + Math.floor(r() * r() * 5); set > 0 && room > w; set--) {
          spines.push({ w, h, tone, band, lean: 0, at: 0 })
          room -= w + 1
        }
      }
      // where the row stops short of the upright, the last book leans into the gap
      if (room >= 5 && spines.length) spines[spines.length - 1].lean = n(Math.min(6, room / 1.5))
      return { sag: n((r() - 0.5) * 1.7), pile, spines }
    })
  )

  // The order of the loss. Shelf after shelf, in runs of neighbours; the two
  // outer bays (hidden on a phone) are dealt in between the inner ones, so a
  // narrow screen never waits on a shelf it cannot see.
  const o = dice(5)
  const shelves = [true, false].flatMap((outer) => {
    const group = shuffled(wall.flatMap((bay, b) => ((b === 0 || b === BAYS - 1) === outer ? bay : [])), o)
    return group.map((shelf, i) => ({ shelf, turn: (i + o()) / group.length }))
  })
  shelves.sort((a, b) => a.turn - b.turn)
  shelves.forEach(({ shelf }, i) => {
    const from = 0.21 + (0.31 * i) / (shelves.length - 1)
    const runs: Spine[][] = []
    for (let at = 0; at < shelf.spines.length; ) {
      const size = 2 + Math.floor(o() * 5)
      runs.push(shelf.spines.slice(at, at + size))
      at += size
    }
    shuffled(runs, o).forEach((run, j) => {
      const t = from + (0.08 * j) / runs.length
      const leftward = o() < 0.5
      run.forEach((spine, k) => {
        // a few go first, alone, before any shelf does
        spine.at = n(o() < 0.07 ? 0.08 + 0.13 * o() : Math.min(0.6, t + (leftward ? run.length - 1 - k : k) * 0.004))
      })
    })
  })
  return wall
})()

/**
 * An evocation, not an archive: no title, no letter, no number on any spine,
 * and the spines drawn are not a count of anything.
 *
 * The reader stands in front of a wall of shelves and walks along it. The
 * books are lost one by one, then in runs, the palm-leaf manuscripts last;
 * each leaves the pale mark of where it stood. Then the shelves are set
 * straight, rebuilt, relit, and stay empty.
 *
 * The markup is the last image: nothing on the shelves. A book stands only
 * while it carries `.here`, and the scroll moves one index along the order of
 * the loss, touching the few books it passes and no other element. No custom
 * property is written above the spines: an inherited one restyled all of
 * them on every frame.
 */
export default function FeuShelves() {
  const { lang } = useLang()
  const id = useId()
  const wall = useRef<HTMLDivElement>(null)
  const held = useRef(true)
  const loss = useRef<{ books: { el: HTMLElement; at: number }[]; gone: number; x: number } | null>(null)

  const walk = useCallback((p: number) => {
    const node = ref.current
    if (!node || !wall.current) return
    // a screen that cannot hold the scene shows it at rest, whatever the scroll says
    if (!held.current) p = 1
    let l = loss.current
    if (!l) {
      const books = Array.from(node.querySelectorAll<HTMLElement>('[data-at]'), (el) => ({ el, at: Number(el.dataset.at) })).sort((a, b) => a.at - b.at)
      l = loss.current = { books, gone: books.length, x: 0 }
      // the first placing is not an event: the fades are allowed once it has been painted
      requestAnimationFrame(() => requestAnimationFrame(() => { node.dataset.live = 'true' }))
    }
    while (l.gone < l.books.length && l.books[l.gone].at <= p) l.books[l.gone++].el.classList.remove(s.here)
    while (l.gone > 0 && l.books[l.gone - 1].at > p) l.books[--l.gone].el.classList.add(s.here)
    // the two repairs, one after the other: the boards are set true, then the shelves come back new and lit
    const askew = String(p < 0.76)
    const worn = String(p < 0.8)
    if (node.dataset.askew !== askew) node.dataset.askew = askew
    if (node.dataset.worn !== worn) node.dataset.worn = worn
    // the reader's own steps along the shelves; they have stopped by the time
    // the last manuscripts go, and nothing moves sideways after that
    const x = Math.round(Math.max(0, 0.63 - p) * (window.innerWidth < 640 ? 220 : 150) * 10) / 10
    if (x !== l.x) wall.current.style.transform = (l.x = x) ? `translate3d(calc(-50% + ${x}px), 0, 0)` : ''
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refs only
  }, [])
  const ref = useScrub<HTMLDivElement>({ pinned: true, rest: 1, variable: false, onChange: walk })

  useEffect(() => {
    const hold = window.matchMedia(HOLD)
    const fit = () => {
      held.current = hold.matches
      if (!hold.matches) walk(1)
    }
    fit()
    hold.addEventListener('change', fit)
    return () => hold.removeEventListener('change', fit)
  }, [walk])

  return (
    <div ref={ref} className={s.track}>
      <figure className={s.stage}>
        <figcaption className={`${s.label} font-mono text-[9px] uppercase tracking-[0.22em] text-gold`}>02 · {researchCopy.illustration[lang]}</figcaption>
        <div className={s.room} aria-hidden="true">
          <svg className={s.defs} focusable="false">
            {/* an ola: narrow leaves stacked between two boards, held by a cord wound through them */}
            <symbol id={`${id}-ola`} viewBox="0 0 170 21" preserveAspectRatio="none">
              <path className={s.leaf} d="M2 5.2H168M1 8.4H169M2.5 11.6H167M1.5 14.8H168.5" />
              <path className={s.leaf2} d="M1 6.8H169M3 10H168.5M1.5 13.2H167.5M2 16.3H169" />
              <path className={s.cover} d="M0 1.4Q0 .4 1 .4H169Q170 .4 170 1.4V4H0ZM0 17H170V19.6Q170 20.6 169 20.6H1Q0 20.6 0 19.6Z" />
              <path className={s.cord} d="M45 0L45.6 21M47 0L47.6 21M123 0L123.6 21M125 0L125.6 21" />
            </symbol>
          </svg>
          <div ref={wall} className={s.wall}>
            {WALL.map((bay, b) => (
              <div key={b} className={s.bay} style={{ '--tilt': `${b % 2 ? 0.28 : -0.22}deg` } as CSSProperties}>
                {bay.map((shelf, k) => (
                  <div key={k} className={s.shelf} style={{ '--sag': `${shelf.sag}deg` } as CSSProperties}>
                    {shelf.pile.length > 0 && (
                      <div className={s.pile}>
                        {shelf.pile.map((ola, i) => (
                          <i key={i} className={s.ola} data-at={ola.at} style={{ '--w': ola.w, '--x': ola.x } as CSSProperties}>
                            <svg focusable="false"><use href={`#${id}-ola`} /></svg>
                          </i>
                        ))}
                      </div>
                    )}
                    {shelf.spines.map((spine, i) => (
                      <i
                        key={i}
                        className={`${s.spine} ${s[`t${spine.tone}`]}${spine.band ? ` ${s[`b${spine.band}`]}` : ''}${spine.lean ? ` ${s.lean}` : ''}`}
                        data-at={spine.at}
                        style={{ '--w': spine.w, '--h': spine.h, ...(spine.lean ? { '--lean': `${spine.lean}deg` } : null) } as CSSProperties}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </figure>
    </div>
  )
}
