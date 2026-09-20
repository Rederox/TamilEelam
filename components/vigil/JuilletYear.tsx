'use client'

import { useEffect } from 'react'
import { useReveal } from '@/hooks/useReveal'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import BulletHole from './BulletHole'
import BloodDrip from './BloodDrip'
import styles from './Juillet.module.css'

// Preset impact pattern around the year — the wall takes the hits.
// Four, not a dozen: enough to read as riddled, not a fireworks display.
const IMPACTS: Array<{ x: string; y: string; size: number; delay: number; variant: number }> = [
  { x: '58%', y: '14%', size: 40, delay: 1.0, variant: 0 },
  { x: '70%', y: '30%', size: 30, delay: 1.3, variant: 1 },
  { x: '48%', y: '8%', size: 26, delay: 1.6, variant: 2 },
  { x: '82%', y: '16%', size: 34, delay: 1.9, variant: 0 },
]

// Flow origins share the impact coordinates, including on narrow screens.
const DRIPS = [
  { impact: 0, height: '61%', width: 13, dur: 10.5 },
  { impact: 1, height: '39%', width: 10, dur: 8.5 },
  { impact: 3, height: '53%', width: 11, dur: 12 },
]

// The fine spray a bullet actually throws: a dozen flecks flung from each
// wound at the instant it lands, gone within a second — the mist in front
// of the slow blood that follows it.
const SPATTER: Array<{ x: string; y: string; dx: string; dy: string; delay: number }> = [
  { x: '55%', y: '17%', dx: '-11px', dy: '13px', delay: 1.0 },
  { x: '61%', y: '12%', dx: '9px', dy: '10px', delay: 1.0 },
  { x: '56%', y: '22%', dx: '-6px', dy: '19px', delay: 1.02 },
  { x: '65%', y: '11%', dx: '5px', dy: '7px', delay: 1.03 },
  { x: '67%', y: '33%', dx: '11px', dy: '12px', delay: 1.3 },
  { x: '73%', y: '28%', dx: '-8px', dy: '15px', delay: 1.32 },
  { x: '71%', y: '38%', dx: '4px', dy: '8px', delay: 1.33 },
  { x: '45%', y: '10%', dx: '7px', dy: '9px', delay: 1.6 },
  { x: '50%', y: '13%', dx: '-9px', dy: '10px', delay: 1.62 },
  { x: '79%', y: '19%', dx: '10px', dy: '11px', delay: 1.9 },
  { x: '85%', y: '23%', dx: '-7px', dy: '16px', delay: 1.92 },
  { x: '86%', y: '14%', dx: '6px', dy: '8px', delay: 1.9 },
]

function Filters() {
  return (
    <svg aria-hidden="true" focusable="false" className="absolute h-0 w-0 overflow-hidden">
      <defs>
        {[11, 27, 43].map((seed, i) => (
          <filter key={i} id={`bullet-crack-${i}`} x="-40%" y="-40%" width="180%" height="180%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.12 0.17" numOctaves="2" seed={seed} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        ))}
      </defs>
    </svg>
  )
}

export default function JuilletYear() {
  const ref = useReveal()
  const still = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      node.dataset.active = String(entry.isIntersecting)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref])

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`relative w-fit ${styles.yearReveal}`}
    >
      <Filters />
      <div className={`reveal relative ${styles.yearSurface}`} data-still={still}>
        <div className={`relative ${styles.impactSurface}`}>
          <div
            aria-hidden="true"
            className="memorial-year font-display text-[clamp(136px,44vw,200px)] sm:text-[clamp(170px,25vw,340px)] font-light leading-[0.9] tracking-[-0.04em] text-blood"
          >
            1983
          </div>

          {/* the wall is riddled */}
          {IMPACTS.map((h, i) => (
            <BulletHole key={i} x={h.x} y={h.y} size={h.size} delay={h.delay} variant={h.variant} />
          ))}

          {/* the fine spray, thrown the instant each shot lands */}
          {SPATTER.map((s, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="spatter absolute"
              style={{
                left: s.x,
                top: s.y,
                ['--sx' as string]: s.dx,
                ['--sy' as string]: s.dy,
                ['--bd' as string]: `${s.delay}s`,
              }}
            />
          ))}

          {/* blood runs down from three of the four wounds */}
          {DRIPS.map((d, i) => (
            <BloodDrip
              key={i}
              x={IMPACTS[d.impact].x}
              top={IMPACTS[d.impact].y}
              height={d.height}
              width={d.width}
              duration={d.dur}
              delay={IMPACTS[d.impact].delay + 0.22}
              variant={i}
              still={still}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
