"use client"

import { useEffect, useId, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './KarthigaiFlower.module.css'

type Point = [number, number]
// Each blade curls back from the receptacle, with an independently ruffled
// margin. Geometry is fixed; only small transforms animate in the browser.
const COURSES: { points: [Point, Point, Point, Point]; width: number }[] = [
  { points: [[100, 112], [68, 106], [60, 35], [78, 18]], width: 8 },
  { points: [[101, 111], [121, 90], [82, 24], [108, 15]], width: 9 },
  { points: [[103, 112], [147, 95], [123, 41], [149, 24]], width: 10 },
  { points: [[100, 113], [36, 123], [55, 48], [28, 34]], width: 11 },
  { points: [[103, 113], [178, 116], [142, 62], [176, 41]], width: 10 },
  { points: [[101, 115], [62, 107], [109, 67], [91, 43]], width: 8 },
]
const PETALS = COURSES.map(({ points: [a, b, c, d], width }, index) => {
  const left: string[] = [], right: string[] = [], fold: string[] = [], vein: string[] = []
  for (let i = 0; i <= 64; i++) {
    const t = i / 64, u = 1 - t
    const x = u ** 3 * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t ** 3 * d[0]
    const y = u ** 3 * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t ** 3 * d[1]
    const dx = 3 * u * u * (b[0] - a[0]) + 6 * u * t * (c[0] - b[0]) + 3 * t * t * (d[0] - c[0])
    const dy = 3 * u * u * (b[1] - a[1]) + 6 * u * t * (c[1] - b[1]) + 3 * t * t * (d[1] - c[1])
    const length = Math.hypot(dx, dy)
    const body = Math.sin(Math.PI * t) ** 0.85
    const w = width * body * (0.7 + t * 0.3)
    const ripple = Math.sin(t * 43 + index * 1.7) * 1.35 * body
    const coord = (offset: number) => `${(x - dy / length * offset).toFixed(2)},${(y + dx / length * offset).toFixed(2)}`
    left.push(coord(-w + ripple))
    right.push(coord(w + ripple * 0.65))
    fold.push(coord(w * 0.53 + ripple * 0.4))
    vein.push(coord(-w * 0.12))
  }
  return {
    outline: `M${left.join(' L')} L${[...right].reverse().join(' L')}Z`,
    shadow: `M${fold.join(' L')} L${[...right].reverse().join(' L')}Z`,
    vein: `M${vein.join(' L')}`,
  }
})

const STAMENS = [
  { d: 'M101 112 Q74 111 39 123', x: 37, y: 123, angle: -20 },
  { d: 'M101 112 Q79 123  60 143', x: 58, y: 144, angle: -40 },
  { d: 'M102 113 Q102 135 91 152', x: 90, y: 153, angle: -60 },
  { d: 'M103 113 Q121 122 134 147', x: 135, y: 149, angle: 48 },
  { d: 'M103 113 Q135 111 165 124', x: 168, y: 125, angle: 22 },
  { d: 'M102 112 Q124 104 155 106', x: 158, y: 106, angle: 5 },
]


const BLOOMS = [
  { x: 109, y: 8, scale: 0.78, turn: -17 },
  { x: 8, y: 180, scale: 0.64, turn: -32 },
  { x: 225, y: 120, scale: 0.61, turn: 29 },
]
// Unequal internodes and paired leaves follow the actual bends of the stem.
const LEAVES = [
  { x: 159, y: 411, angle: -148, size: 1.16 },
  { x: 201, y: 379, angle: -22, size: 0.91 },
  { x: 227, y: 346, angle: -172, size: 1.3 },
  { x: 218, y: 318, angle: -27, size: 0.92 },
  { x: 174, y: 291, angle: -157, size: 0.83 },
  { x: 143, y: 250, angle: -143, size: 0.75 },
  { x: 161, y: 226, angle: -32, size: 1.02 },
  { x: 204, y: 185, angle: -151, size: 0.94 },
  { x: 211, y: 162, angle: -41, size: 0.8 },
  { x: 192, y: 124, angle: -172, size: 0.6 },
]
const TENDRILS = [
  'M60 -3 C74 -5 73 -18 83 -17 C94 -15 86 -4 81 -9 C76 -15 87 -20 90 -14',
  'M60 -3 C76 1 86 -5 85 -14 C84 -24 74 -21 77 -14 C79 -8 90 -11 90 -18',
  'M60 -3 C73 -4 79 -15 78 -24 Q77 -32 71 -28',
]

function Blossom({ id, phase }: { id: string; phase: number }) {
  return <>
        {PETALS.map((petal, i) => (
          <g key={i} className={styles.petal} style={{ animationDelay: `${-i * 1.37 - phase}s`, animationDuration: `${3.6 + i * 0.37}s` }}>
            <path d={petal.outline} fill={`url(#${id}-petal-${i})`} stroke="#d5ac4e" strokeWidth="0.85" strokeLinejoin="round" />
            <path d={petal.shadow} fill="#491416" opacity="0.28" />
            <path d={petal.vein} fill="none" stroke="#f2b060" strokeOpacity="0.22" strokeWidth="0.55" />
          </g>
        ))}
        <ellipse cx="102" cy="113" rx="4" ry="2.3" fill="#8b873f" />
        {STAMENS.map((s, i) => (
          <g key={i} className={styles.stamen} style={{ animationDelay: `${-i * 1.8 - phase}s`, animationDuration: `${4.2 + i * 0.43}s` }}>
            <path d={s.d} fill="none" stroke="#bfad67" strokeWidth="0.85" strokeLinecap="round" />
            <g transform={`rotate(${s.angle} ${s.x} ${s.y})`}>
              <ellipse cx={s.x} cy={s.y} rx="4" ry="1.45" fill="#b89a49" />
              <path d={`M${s.x - 3} ${s.y} h6`} stroke="#655024" strokeWidth="0.6" />
            </g>
          </g>
        ))}
        <path d="M102 112 Q91 118 76 113 l-3 -2 m3 2 l-3 2" fill="none" stroke="#9ca363" strokeWidth="1" strokeLinecap="round" />
  </>
}

export default function KarthigaiFlower({ size = 300 }: { size?: number }) {
  const id = useId()
  const ref = useRef<SVGSVGElement>(null)
  const still = useReducedMotion()
  useEffect(() => {
    const node = ref.current
    if (!node) return
    let visible = false
    const sync = () => { node.dataset.running = String(visible && !document.hidden) }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    observer.observe(node)
    document.addEventListener('visibilitychange', sync)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync) }
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 360 460" width={size} height={size * 460 / 360} data-karthigai-plant className={styles.flower} data-still={still} aria-hidden="true" focusable="false">
      <defs>
        {PETALS.map((_, i) => (
          <linearGradient key={i} id={`${id}-petal-${i}`} gradientUnits="userSpaceOnUse" x1="100" y1="116" x2={COURSES[i].points[3][0]} y2={COURSES[i].points[3][1]}>
            <stop offset="0" stopColor="#b49c46" />
            <stop offset="0.17" stopColor="#dab554" />
            <stop offset="0.38" stopColor="#c74924" />
            <stop offset="0.7" stopColor={i < 3 ? '#9c241c' : '#ca3023'} />
            <stop offset="1" stopColor="#781c1b" />
          </linearGradient>
        ))}
        <linearGradient id={`${id}-stem`}><stop stopColor="#41452b" /><stop offset="0.5" stopColor="#85834a" /><stop offset="1" stopColor="#44482b" /></linearGradient>
        <linearGradient id={`${id}-leaf`} x2="1" y2="1"><stop stopColor="#747341" /><stop offset="0.55" stopColor="#3d482b" /><stop offset="1" stopColor="#232e20" /></linearGradient>
      </defs>
      {/* A faint twig gives the leaf-tip tendrils something to catch. */}
      <path d="M253 444 C246 367 270 301 253 239 C242 194 264 156 255 124 M260 285 Q289 263 301 231 M254 231 Q238 211 236 198" fill="none" stroke="#65523b" strokeOpacity="0.28" strokeWidth="1.25" strokeLinecap="round" />
      <g className={styles.plant}>
        {/* A climbing stem with irregular branching, leaves and terminal tendrils. */}
        <path d="M150 442 C137 412 176 393 201 379 C240 353 237 323 205 305 C167 285 137 287 143 250 C149 218 197 211 207 181 C223 145 180 126 188.56 96.14"
          fill="none" stroke={`url(#${id}-stem)`} strokeWidth="2.5" strokeLinecap="round" />
        <g fill="none" stroke={`url(#${id}-stem)`} strokeWidth="2" strokeLinecap="round">
          <path d="M148 275 C119 280 89 291 73.28 252.32" />
          <path d="M197 199 C230 220 301 237 287.22 188.93" />
          <path d="M209 164 C236 170 284 144 267 98" />
          <path d="M222 357 C185 335 102 365 85 318" />
        </g>
        {LEAVES.map((leaf, i) => (
          <g key={i} transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.angle}) scale(${leaf.size})`}>
            <g className={styles.leaf} style={{ animationDelay: `${-i * 0.9}s` }}>
              <path d="M0 0 C13 -10 35 -13 60 -3 C40 0 23 12 0 0Z" fill={`url(#${id}-leaf)`} />
              <path d={`M0 0 Q28 -3 60 -3 ${TENDRILS[i % TENDRILS.length]}`} fill="none" stroke="#858451" strokeWidth="0.8" />
              <path d="M3 0 Q28 -12 57 -3 M3 1 Q28 8 57 -3 M5 0 Q30 -7 58 -3" fill="none" stroke="#a09a5c" strokeOpacity="0.25" strokeWidth="0.6" />
            </g>
          </g>
        ))}
        {/* Unopened buds make the plant's stages of growth legible. */}
        <g transform="translate(267 98) rotate(31)">
          <g className={styles.bud}>
            <path d="M0 0 C-12 -7 -12 -25 -4 -36 C7 -27 12 -9 0 0Z" fill={`url(#${id}-petal-0)`} stroke="#a29a4a" strokeWidth="0.75" />
            <path d="M0 -1 Q-4 -20 -4 -34 M0 -1 Q4 -19 -4 -34" fill="none" stroke="#b3a355" strokeWidth="0.6" />
          </g>
        </g>
        <g transform="translate(85 318) rotate(-54) scale(0.65)">
          <g className={styles.bud}>
            <path d="M0 0 C-12 -7 -12 -25 -4 -36 C7 -27 12 -9 0 0Z" fill={`url(#${id}-leaf)`} stroke="#80864b" strokeWidth="0.75" />
            <path d="M0 -1 Q-4 -20 -4 -34" fill="none" stroke="#92975a" strokeWidth="0.6" />
          </g>
        </g>
        {BLOOMS.map((bloom, i) => (
          <g key={i} transform={`translate(${bloom.x} ${bloom.y}) scale(${bloom.scale})`}>
            <g transform={`rotate(${bloom.turn} 102 113)`}>
              <Blossom id={id} phase={i * 1.9} />
            </g>
          </g>
        ))}
      </g>
    </svg>
  )
}
