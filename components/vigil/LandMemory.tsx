'use client'

import { useEffect, useId, useState, type CSSProperties } from 'react'
import { useLang } from '@/context/LanguageContext'
import { researchCopy } from '@/data/research'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useScrub } from '@/hooks/useScrub'
import s from './LandMemory.module.css'

const text = {
  fr: { line: 'Avant les dates, il y avait des vies.', sub: 'Une langue à la maison. Un chemin familier. Une terre que l’on appelait la sienne.' },
  en: { line: 'Before the dates, there were lives.', sub: 'A language at home. A familiar path. A land people called their own.' },
  ta: { line: 'தேதிகளுக்கு முன், வாழ்வுகள் இருந்தன.', sub: 'வீட்டில் ஒரு மொழி. பழகிய ஒரு பாதை. தமதென அழைத்த ஒரு நிலம்.' },
}

// where the walk stands when nothing moves: the default of --p in the stylesheet is the same number
const REST = 0.64
// the stylesheet holds the scene on screen under this condition; anywhere else it passes by
const HOLD = '(scripting: enabled) and (min-height: 600px)'

const n = (v: number, digits = 1) => +v.toFixed(digits)
// a fixed sequence, not Math.random: the server and the browser must draw the same trees
const dice = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
const star = (cx: number, cy: number, tips: number, from: number, to: number, outer: number, inner: number) =>
  Array.from({ length: tips * 2 + 1 }, (_, i) => {
    const a = ((from + ((to - from) * i) / (tips * 2)) * Math.PI) / 180
    const r = i % 2 ? outer : inner
    return `${n(cx + Math.sin(a) * r)} ${n(cy - Math.cos(a) * r)}`
  }).join('L')

// Palmyra, not coconut: a stiff fan on a stalk, a round head of them on a straight trunk.
const FAN = `M-1.6 0V-34L${star(0, -34, 8, -128, 128, 28, 15)}L1.6 -34V0Z`
const FAR_PALM = `M-1.7 0V-100H1.7V0ZM${star(0, -100, 9, 0, 360, 23, 12)}Z`
const trunk = (h: number) => {
  const b = h * 0.027, t = h * 0.017
  return `M${n(-b * 1.6)} 0Q${n(-b)} ${n(-h * 0.05)} ${n(-b * 0.9)} ${n(-h * 0.14)}L${n(-t)} ${-h}H${n(t)}L${n(b * 0.9)} ${n(-h * 0.14)}Q${n(b)} ${n(-h * 0.05)} ${n(b * 1.6)} 0Z`
}

type Frond = { a: number; s: number; d: number; t: number }
type Tree = { x: number; y: number; h: number; lean: number; k: number; fronds: Frond[] }
const crown = (r: () => number, count: number, spread: number): Frond[] =>
  Array.from({ length: count }, (_, i) => {
    const a = -spread + (2 * spread * i) / (count - 1) + (r() - 0.5) * 14
    // long stalks and short ones in turn, or the head closes into a wheel
    return { a: n(a), s: n((Math.abs(a) > 100 ? 0.88 : i % 2 ? 0.8 : 1.08) + r() * 0.14, 2), d: n(5.4 + r() * 4.2), t: n(r() * 9) }
  })
const grove = (seed: number, spec: [number, number][], top: (x: number) => number, count: number): Tree[] => {
  const r = dice(seed)
  return spec.map(([x, h]) => ({ x, y: n(top(x) + 4), h, lean: n((r() - 0.5) * 5), k: n(0.42 + h / 800, 2), fronds: crown(r, count, 128) }))
}

// Every plane is drawn on the same 2400 × 600 strip, horizon at y = 392.
const midTop = (x: number) => 486 + 9 * Math.sin(x / 310 + 0.6) + 4 * Math.sin(x / 120)
const nearTop = (x: number) => 556 + 8 * Math.sin(x / 260) + 5 * Math.sin(x / 97 + 1)
const ground = (top: (x: number) => number) => {
  let d = 'M-20 640'
  for (let x = -20; x <= 2420; x += 40) d += `L${x} ${n(top(x))}`
  return `${d}V640Z`
}
const MID_GROUND = ground(midTop)
const NEAR_GROUND = ground(nearTop)
const MID_PALMS = grove(3, [[380, 200], [470, 236], [700, 178], [1010, 214], [1150, 188], [1600, 242], [1700, 204], [2050, 222]], midTop, 7)
// both stand right of the centre for the whole walk: the sky behind the words stays empty
const NEAR_PALMS = grove(5, [[1470, 478], [1900, 428]], nearTop, 9)
// a young palmyra has no trunk yet, only fans rising from the ground
const SAPLING = crown(dice(8), 5, 66)
// one house, low under its eaves, a kitchen leaning on its side; nobody is drawn
const HOME = { x: 1250, y: n(midTop(1250) + 2) }
const HOUSE = 'M-23 1V-13H-31L-17 -28H17L31 -13L42 -9V-7H39V1Z'
// worn from where the reader stands, between two palms, to the door
const PATH = 'M1248 477C1236 490 1180 500 1140 525C1100 550 1070 580 1058 640H1120C1126 590 1150 556 1178 532C1206 508 1246 494 1253 477Z'
const FAR_PALMS: [number, number][] = [[60, 38], [135, 30], [160, 46], [300, 34], [420, 28], [455, 44], [470, 33], [610, 40], [760, 31], [790, 48], [905, 29], [1230, 36], [1262, 47], [1390, 30], [1560, 42], [1590, 29], [1612, 37], [1780, 45], [1990, 33], [2015, 41], [2200, 35], [2330, 44]]

// the lagoon: broken lines that lengthen toward the reader
const WATER = (() => {
  const r = dice(7)
  let d = ''
  for (let i = 0; i < 8; i++) {
    const y = n(408 + i * 8.5 + i * i * 0.5)
    for (let x = r() * 200 - 100; x < 2400; ) {
      const len = 60 + r() * 320
      d += `M${Math.round(x)} ${y}h${Math.round(len)}`
      x += len + 40 + r() * 260
    }
  }
  return d
})()
// the sun on the water, one broken stroke per row
const GLINTS = (() => {
  const r = dice(11)
  return Array.from({ length: 8 }, (_, i) => {
    const w = 26 + i * 13 + r() * 18
    return { d: `M${n(100 - w / 2 + (r() - 0.5) * 16)} ${4 + i * 10}h${n(w * 0.55)}m${n(w * 0.12)} 0h${n(w * 0.33)}`, t: n(2.6 + r() * 3), o: n(r() * 4) }
  })
})()

const blades = (seed: number, count: number, height: number) => {
  const r = dice(seed)
  let d = ''
  for (let i = 0; i < count; i++) {
    const x = (i - (count - 1) / 2) * 5 + r() * 3
    const lean = (r() - 0.5) * 46
    const h = height * (0.55 + r() * 0.45)
    d += `M${n(x - 1.6)} 0Q${n(x + lean * 0.25)} ${n(-h * 0.6)} ${n(x + lean)} ${n(-h)}Q${n(x + lean * 0.45)} ${n(-h * 0.5)} ${n(x + 1.8)} 0Z`
  }
  return d
}
const TUFTS = [blades(21, 6, 30), blades(22, 5, 36), blades(23, 7, 26)]
type Tuft = { kind: number; x: number; y: number; s: number; d: number; t: number }
const meadow = (seed: number, step: number, y: (x: number) => number, small: number, large: number): Tuft[] => {
  const r = dice(seed)
  const out: Tuft[] = []
  for (let x = 20; x < 2400; x += step * (0.6 + r() * 0.8))
    out.push({ kind: Math.floor(r() * 3), x: Math.round(x), y: n(y(x) + 3), s: n(small + r() * (large - small), 2), d: n(3.8 + r() * 3.4), t: n(r() * 7) })
  return out
}
const NEAR_GRASS = meadow(31, 105, nearTop, 0.8, 1.5)
const FORE_GRASS = meadow(32, 92, () => 604, 2.1, 3.5)

function Palm({ tree, fan }: { tree: Tree; fan: string }) {
  return (
    <g transform={`translate(${tree.x} ${tree.y}) rotate(${tree.lean})`}>
      <path d={trunk(tree.h)} />
      <g transform={`translate(0 ${-tree.h}) scale(${tree.k})`}><circle r="26" /><Fans fronds={tree.fronds} fan={fan} /></g>
    </g>
  )
}
function Fans({ fronds, fan }: { fronds: Frond[]; fan: string }) {
  return <>{fronds.map((f, i) => (
    <use key={i} href={fan} className={s.frond} style={{ '--a': `${f.a}deg`, '--s': f.s, animationDuration: `${f.d}s`, animationDelay: `${-f.t}s` } as CSSProperties} />
  ))}</>
}
function Grass({ tufts, id }: { tufts: Tuft[]; id: string }) {
  return <>{tufts.map((g, i) => (
    <use key={i} href={`#${id}-tuft-${g.kind}`} className={s.tuft} style={{ '--x': `${g.x}px`, '--y': `${g.y}px`, '--s': g.s, animationDuration: `${g.d}s`, animationDelay: `${-g.t}s` } as CSSProperties} />
  ))}</>
}

/**
 * An illustration of remembered landscape, explicitly distinguished from
 * documentary images: no identified place, no monument.
 *
 * The scroll is the reader's walk along a lagoon at the end of a day. Five
 * planes drift past at their own speed while the sun goes down behind the far
 * shore; `--p` on the track is the whole of it, the stylesheet does the rest.
 */
export default function LandMemory() {
  const { lang } = useLang()
  const c = text[lang]
  const id = useId()
  const fan = `#${id}-fan`
  const still = useReducedMotion()
  const [held, setHeld] = useState(true)
  const ref = useScrub<HTMLDivElement>({ pinned: held, rest: REST })

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
    <div ref={ref} className={`reveal ${s.track}`} data-still={still}>
      <figure className={s.stage}>
        <figcaption className={s.caption}>
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-gold">01 · {researchCopy.illustration[lang]}</span>
          <p className="lang-title mt-8 max-w-[17ch] font-display text-[clamp(30px,4.4vw,54px)] font-light leading-[1.15]">{c.line}</p>
          <p className="mt-6 max-w-[34ch] text-lg italic leading-relaxed text-bone-dim">{c.sub}</p>
        </figcaption>

        <div className={s.land} aria-hidden="true">
          <span className={s.day} />
          <span className={s.dusk} />
          {/* the well ends at the horizon, so the sun sets behind the water */}
          <span className={s.well}><span className={s.sun}><span className={s.glow} /></span></span>
          {[s.flock, s.loner].map((flight, k) => (
            <svg key={flight} viewBox="0 0 90 40" className={flight} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              {([[20, 27], [49, 12], [72, 25]] as const).slice(0, k ? 1 : 3).map(([x, y], i) => (
                <g key={i} transform={`translate(${x} ${y})`}><path className={s.wing} style={{ animationDelay: `${-i * 0.37}s` }} d="M-8 0Q-4 -5 0 0Q4 -5 8 0" /></g>
              ))}
            </svg>
          ))}

          <svg viewBox="0 0 2400 600" className={`${s.plane} ${s.far}`}>
            <defs>
              <path id={`${id}-fan`} d={FAN} />
              <path id={`${id}-far`} d={FAR_PALM} />
              {TUFTS.map((d, i) => <path key={i} id={`${id}-tuft-${i}`} d={d} />)}
            </defs>
            <path d={WATER} className={s.water} />
            <path d="M-20 403V397Q200 387 420 393T800 395Q900 396 990 401V403ZM1170 403Q1300 392 1500 394T1900 390T2420 394V403Z" />
            {FAR_PALMS.map(([x, h]) => <use key={x} href={`#${id}-far`} transform={`translate(${x} 397) scale(${h / 100})`} />)}
          </svg>
          <svg viewBox="0 0 200 84" preserveAspectRatio="none" className={s.glitter} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            {GLINTS.map((g, i) => <path key={i} d={g.d} className={s.glint} vectorEffect="non-scaling-stroke" style={{ animationDuration: `${g.t}s`, animationDelay: `${-g.o}s` }} />)}
          </svg>
          <svg viewBox="0 0 2400 600" className={`${s.plane} ${s.mid}`}>
            <path d={MID_GROUND} />
            <path d={PATH} className={s.path} />
            <path d={HOUSE} transform={`translate(${HOME.x} ${HOME.y})`} />
            {MID_PALMS.map((tree) => <Palm key={tree.x} tree={tree} fan={fan} />)}
          </svg>
          <span className={s.mist} />
          {/* its own strip, travelling with the house: the land's ink must not dim the lamp */}
          <svg viewBox="0 0 2400 600" className={`${s.plane} ${s.hearth}`}>
            <defs>
              <radialGradient id={`${id}-halo`}>
                <stop offset="0" style={{ stopColor: 'rgb(var(--sun))', stopOpacity: 0.36 }} />
                <stop offset="1" style={{ stopColor: 'rgb(var(--sun))', stopOpacity: 0 }} />
              </radialGradient>
            </defs>
            <g transform={`translate(${HOME.x} ${HOME.y})`}>
              <g transform="translate(36 -9)">
                <g className={s.smoke}>
                  <path d="M-1.2 0C-5 -14 5 -26 0 -40C-4 -52 6 -62 3 -74C8 -62 0 -52 3 -40C8 -26 -1 -14 1.5 0Z" />
                  <path d="M3 -74C-3 -88 10 -100 6 -116C2 -130 15 -140 13 -154C21 -138 8 -130 13 -116C18 -100 5 -88 7 -74Z" opacity="0.5" />
                </g>
              </g>
              <g className={s.lamp}>
                <circle cy="-6" r="34" fill={`url(#${id}-halo)`} />
                <ellipse cx="-2" cy="4" rx="9" ry="2.4" opacity="0.3" />
                <path className={s.flame} d="M-3 0V-11H3V0ZM11 -5.5V-10H15.5V-5.5Z" />
              </g>
            </g>
          </svg>
          <svg viewBox="0 0 2400 600" className={`${s.plane} ${s.near}`}>
            <path d={NEAR_GROUND} />
            {NEAR_PALMS.map((tree) => <Palm key={tree.x} tree={tree} fan={fan} />)}
            <g transform={`translate(900 ${n(nearTop(900) + 6)})`}><Fans fronds={SAPLING} fan={fan} /></g>
            <Grass tufts={NEAR_GRASS} id={id} />
          </svg>
          <svg viewBox="0 0 2400 600" className={`${s.plane} ${s.fore}`}>
            <Grass tufts={FORE_GRASS} id={id} />
          </svg>
        </div>
      </figure>
    </div>
  )
}
