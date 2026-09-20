'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './NeighbourhoodTrees.module.css'

const PALMS = [
  { x: '6%', height: '27svh', lean: -1, depth: true },
  { x: '24%', height: '22svh', lean: 1, depth: false },
  { x: '81%', height: '30svh', lean: -1, depth: false },
  { x: '94%', height: '20svh', lean: 1, depth: true },
]

function Palm({ flip }: { flip: number }) {
  return (
    <svg viewBox="0 0 180 300" className={styles.palm} focusable="false">
      <g transform={flip < 0 ? 'translate(180 0) scale(-1 1)' : undefined}>
        <path d="M77 300 C85 234 104 160 99 82 L105 81 C115 164 99 240 91 300Z" />
        <g className={styles.fronds}>
          <path d="M102 85 C78 53 39 50 8 73 C37 58 68 67 91 82 C61 68 28 87 14 115 C38 88 64 87 98 89 C68 91 48 118 49 148 C57 117 78 101 103 92 C97 122 110 142 128 154 C113 127 113 105 109 89 C134 95 153 114 162 139 C161 107 142 83 114 84 C137 67 161 68 179 82 C161 56 136 53 110 76 C123 47 140 34 155 27 C127 27 108 47 103 75 C99 49 83 29 59 22 C78 40 90 58 98 79Z" />
          <path d="M99 85 C76 54 40 48 8 73 M100 87 C66 73 31 87 14 115 M104 84 C118 52 134 36 154 27" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <ellipse cx="101" cy="90" rx="8" ry="7" />
        </g>
      </g>
    </svg>
  )
}

export default function NeighbourhoodTrees() {
  const ref = useRef<HTMLDivElement>(null)
  const still = useReducedMotion()
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      node.dataset.active = String(entry.isIntersecting)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} aria-hidden="true" className={styles.trees} data-still={still}>
      {PALMS.map((p, i) => (
        <div key={p.x} className={`${styles.palmPlace} ${p.depth ? styles.distant : ''}`}
          style={{ left: p.x, height: p.height, animationDelay: `${-i * 2.7}s` }}>
          <Palm flip={p.lean} />
        </div>
      ))}
      <svg viewBox="0 0 640 420" className={styles.banyan} focusable="false">
        {/* The trunk divides into spreading limbs; prop roots reach the soil. */}
        <path d="M293 420 C309 368 303 306 318 246 L330 192 L310 158 L323 149 L343 192 C347 222 333 249 336 277 C348 323 345 375 359 420Z" />
        <path d="M326 272 C300 229 243 229 191 182 L177 162 L188 152 C229 199 290 197 327 238Z M335 261 C362 216 413 207 471 153 L482 163 C438 222 381 238 341 292Z" />
        <path d="M211 176 C203 228 215 316 201 420 L209 420 C220 333 210 246 219 179Z M457 169 C464 249 443 336 452 420 L459 420 C454 340 473 236 465 165Z M156 170 C150 211 159 251 150 289 L154 290 C164 249 155 208 160 170Z M503 169 C496 213 504 249 497 272 L501 272 C511 235 502 206 509 167Z" />
        <g className={styles.canopy}>
          <path d="M54 172 C27 161 31 139 56 127 C45 109 67 90 96 94 C96 72 123 58 151 70 C163 46 190 43 212 52 C229 24 272 22 291 39 C316 17 351 24 370 44 C399 27 426 38 439 57 C469 48 498 61 504 79 C535 69 563 89 556 110 C587 115 605 139 587 153 C617 171 597 198 569 193 C550 218 520 206 505 210 C486 235 457 217 436 225 C411 239 390 214 369 224 C343 239 319 219 300 229 C277 248 252 222 231 230 C206 240 183 215 164 223 C137 231 114 207 96 215 C69 222 43 202 54 172Z" />
          <path d="M82 175 C115 161 140 183 162 170 M242 90 C266 71 296 80 309 96 M400 165 C428 146 459 157 473 173" fill="none" stroke="rgb(var(--c-bone) / 0.025)" strokeWidth="2" />
        </g>
      </svg>
    </div>
  )
}
