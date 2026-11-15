'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { useLang } from '@/context/LanguageContext'
import { researchCopy } from '@/data/research'
import { useScrub } from '@/hooks/useScrub'
import s from './MaaveerarLamps.module.css'

// the stylesheet holds the scene on screen under this condition; anywhere else it passes by
const HOLD = '(scripting: enabled) and (min-height: 600px)'

const n = (v: number, digits = 3) => +v.toFixed(digits)
// a fixed sequence, not Math.random: the server and the browser must lay out the same ground
const dice = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646

// Each row is drawn at STEP of the one before it. The six nearest are lamps one
// can tell apart; the five beyond are points. HALF is how far the ground runs
// to either side, in gaps of the nearest row; LEAN keeps any column from
// running straight up the middle of the frame.
const STEP = 0.72, ROWS = 6, FAR_ROWS = 5, HALF = 3.4, LEAN = 0.38
// the lighting, on --p: the reader's lamp, a while alone, then the wave
const ALONE = 0.04, WAVE = 0.17, REACH = 0.5

// How late a lamp catches: its distance from the first one, by rows away and by
// width across, and a little of its own. A circle spreading, never a line.
const when = (r: () => number, row: number, x: number, own: number) =>
  n(WAVE + REACH * Math.hypot(row / (ROWS + FAR_ROWS - 1), ((x - LEAN) / HALF) * 0.5) + (r() - 0.5) * own)

type Light = { x: number; s: number; t: number; d: number; o: number }
type Lamp = Light & { row: number; first: boolean }

const LAMPS: Lamp[] = (() => {
  const r = dice(27)
  const out: Lamp[] = []
  // the far rows first, so that a nearer lamp is painted over the ones behind it
  for (let row = ROWS - 1; row >= 0; row--) {
    const depth = STEP ** row
    const reach = Math.ceil(HALF / depth)
    for (let c = -reach; c <= reach; c++) {
      const first = row === 0 && c === 0
      // set down by hand: no two gaps alike, no row quite straight
      const x = (c + LEAN + (first ? 0 : (r() - 0.5) * 0.46)) * depth
      const size = depth * (first ? 1 : 0.88 + r() * 0.24)
      const t = first ? ALONE : when(r, row, x, 0.07)
      const d = n(3.4 + r() * 3.6, 1), o = n(-r() * 6, 1)
      if (Math.abs(x) <= HALF + 0.3) out.push({ x: n(x), s: n(size), t, d, o, row, first })
    }
  }
  return out
})()

type Stretch = Light & { left: number; width: number; bx: number; by: number; dim: number }
const FAR: Stretch[] = (() => {
  const r = dice(1807)
  const out: Stretch[] = []
  for (let j = FAR_ROWS - 1; j >= 0; j--) {
    const depth = STEP ** (ROWS + j)
    // uneven stretches, overlapping where one fades into the next; wider than the frame
    const cuts = Array.from({ length: 8 }, (_, k) => (k === 0 ? -6 : k === 7 ? 106 : -6 + (112 * (k + (r() - 0.5) * 0.5)) / 7))
    for (let k = 0; k < 7; k++) {
      const left = cuts[k] - 3, width = cuts[k + 1] - cuts[k] + 6
      // 5.9: the width of the frame in gaps of the nearest row
      const x = ((left + width / 2 - 50) / 100) * 5.9 + LEAN
      out.push({ x: 0, s: n(depth), t: when(r, ROWS + j, x, 0.05), d: n(4 + r() * 4, 1), o: n(-r() * 7, 1), left: n(left, 1), width: n(width, 1), bx: n(r(), 2), by: n(r(), 2), dim: n(0.74 - j * 0.08, 2) })
    }
  }
  return out
})()

// A glory lily, simply: six petals swept back like a flame, the stamens
// spread under them, a length of stem. Drawn head up around 0 0.
const turn = (x: number, y: number, deg: number, k = 1) => {
  const a = (deg * Math.PI) / 180
  return `${n((x * Math.cos(a) - y * Math.sin(a)) * k, 1)} ${n((x * Math.sin(a) + y * Math.cos(a)) * k, 1)}`
}
const PETALS: [number, number, number, number][] = [[-58, 44, 7, -5], [-34, 51, 7.5, 4], [-12, 55, 8, -4], [9, 54, 8, 5], [31, 50, 7.5, -4], [55, 45, 7, 5]]
const petals = (k: number) =>
  PETALS.map(([a, len, w, curl]) => {
    const p = (x: number, y: number) => turn(x, y, a, k)
    return `M0 0Q${p(-w, -len * 0.35)} ${p(-w * 0.55, -len * 0.7)}Q${p(-w * 0.15 + curl * 0.5, -len * 0.92)} ${p(curl, -len)}Q${p(w * 0.5 + curl * 0.6, -len * 0.9)} ${p(w * 0.6, -len * 0.68)}Q${p(w, -len * 0.33)} 0 0Z`
  }).join('')
const PETAL = petals(1)
const HEART = petals(0.4)
const STAMENS = [105, 130, 158, 202, 230, 255].map((a) => `M0 0Q${turn(4, -13, a)} ${turn(0, -24, a)}M${turn(-3.2, -24.6, a)}L${turn(3.2, -23.4, a)}`).join('')
// each lies beside a lamp of the nearest rows and is seen by its light
const beside = (row: number, c: number) => LAMPS.find((l) => l.row === row && Math.abs(l.x / STEP ** row - LEAN - c) < 0.2)!
const LILIES = [
  { by: beside(0, 0), dx: -0.36, lean: -66 },
  { by: beside(0, -1), dx: -0.34, lean: 74 },
  { by: beside(1, 1), dx: -0.26, lean: -82 },
].map(({ by, dx, lean }) => ({ x: n(by.x + dx * by.s), s: n(by.s * 1.03), t: by.t, lean }))

// Palmyras on the skyline: a straight trunk, a round head of stiff fans.
const TREES = ([[70, 22], [96, 31], [250, 18], [410, 26], [432, 35], [452, 21], [640, 16], [790, 29], [815, 20], [980, 32], [1004, 24], [1130, 19]] as const).map(([x, h]) => {
  const head = Array.from({ length: 16 }, (_, i) => turn(0, i % 2 ? -h * 0.1 : -h * 0.27, i * 22.5).split(' ').map((v, axis) => n(+v + (axis ? 50 - h : x), 1)).join(' ')).join('L')
  return `M${x - 0.7} 50V${50 - h}h1.4V50ZM${head}Z`
}).join('')

const vars = (v: Record<string, string | number>) => v as CSSProperties

/**
 * An evocation of the evening of 27 November: a ground where lamps are being
 * lit. Lamps only — no stone, no portrait, no emblem — and their number says
 * nothing: it is how many the frame holds.
 *
 * The reader's scroll lights them. The one at their feet first, then from
 * hand to hand outward until the far rows are a band at the horizon; then
 * nothing moves but the flames. `--p` on the track is the whole of it. Without
 * scripting, in quiet reading and in reduced motion, every lamp is lit.
 */
export default function MaaveerarLamps() {
  const { lang } = useLang()
  const [held, setHeld] = useState(true)
  const ref = useScrub<HTMLDivElement>({ pinned: held, rest: 1 })

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const hold = window.matchMedia(HOLD)
    const fit = () => setHeld(hold.matches)
    fit()
    let visible = false
    const sync = () => { node.dataset.running = String(visible && !document.hidden) }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    observer.observe(node)
    hold.addEventListener('change', fit)
    document.addEventListener('visibilitychange', sync)
    return () => { observer.disconnect(); hold.removeEventListener('change', fit); document.removeEventListener('visibilitychange', sync) }
  }, [ref])

  return (
    <div ref={ref} className={s.track}>
      <figure className={s.stage}>
        <figcaption className={`${s.label} font-mono text-[9px] uppercase tracking-[0.22em] text-gold`}>{researchCopy.illustration[lang]}</figcaption>
        <div className={s.scene} aria-hidden="true">
          <span className={s.dusk} />
          <span className={s.glow} />
          <svg viewBox="0 0 1200 50" preserveAspectRatio="xMidYMax slice" className={s.trees}><path d={TREES} /></svg>
          <div className={s.ground}>
            {FAR.map((f, i) => (
              <span key={i} className={s.far} style={vars({ left: `${f.left}%`, width: `${f.width}%`, '--s': f.s, '--t': f.t, '--bx': f.bx, '--by': f.by, '--dim': f.dim, '--d': `${f.d}s`, '--o': `${f.o}s` })} />
            ))}
            {LAMPS.map((l, i) => (
              <span
                key={i}
                className={`${s.lamp}${l.row < 3 ? ` ${s.near}` : ''}${l.first ? ` ${s.first}` : ''}${Math.abs(l.x) > 1.9 ? ` ${s.wide}` : ''}`}
                style={vars({ '--x': l.x, '--s': l.s, '--t': l.t, '--d': `${l.d}s`, '--o': `${l.o}s` })}
              ><span /></span>
            ))}
            {LILIES.map((f, i) => (
              <svg key={i} viewBox="-80 -80 160 160" className={s.lily} style={vars({ '--x': f.x, '--s': f.s, '--t': f.t })}>
                <g transform={`rotate(${f.lean})`}>
                  <path className={s.stem} d="M0 2Q5 34 -8 72" />
                  <path className={s.stamen} d={STAMENS} />
                  <path className={s.petal} d={PETAL} />
                  <path className={s.heart} d={HEART} />
                </g>
              </svg>
            ))}
          </div>
        </div>
      </figure>
    </div>
  )
}
