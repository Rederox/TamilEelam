'use client'

import { useEffect, useId, useRef } from 'react'

// Irregular, mostly vertical courses: gravity draws the flow, not a sine wave.
const PATHS = [
  'M11,0 C10,17 12,28 10,43 C8,59 10,68 9,85 C8,109 11,121 10,145 C9,164 10,182 10,196',
  'M12,0 C13,19 11,29 12,49 C14,68 12,78 13,101 C14,126 12,139 14,160 C15,176 14,186 14,196',
  'M10,0 C9,11 11,26 9,46 C7,65 9,81 8,105 C7,124 9,142 8,164 C7,180 8,189 8,196',
]
const START_X = [11, 12, 10]

export default function BloodDrip({ x, top, height, width = 20, delay = 1.2, duration = 8, variant = 0, still = false }: {
  x: string
  top: string
  height: string
  width?: number
  delay?: number
  duration?: number
  variant?: number
  still?: boolean
}) {
  const v = ((variant % PATHS.length) + PATHS.length) % PATHS.length
  const id = useId()
  const rootRef = useRef<HTMLSpanElement>(null)
  const courseRef = useRef<SVGPathElement>(null)
  const ribbonRef = useRef<SVGPathElement>(null)
  const clipRef = useRef<SVGRectElement>(null)
  const tipRef = useRef<SVGGElement>(null)
  const dropRef = useRef<SVGEllipseElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const course = courseRef.current
    const ribbon = ribbonRef.current
    const clip = clipRef.current
    const tip = tipRef.current
    const drop = dropRef.current
    if (!root || !course || !ribbon || !clip || !tip || !drop) return

    const length = course.getTotalLength()
    // Sample geometry once; rendering a frame only writes a few SVG attributes.
    const points = Array.from({ length: 161 }, (_, i) => course.getPointAtLength(length * i / 160))
    const left: string[] = []
    const right: string[] = []
    points.forEach((p, i) => {
      const t = i / 160
      const thickness = (1.8 - t * 1.15) * (0.87 + Math.sin(t * 21 + v) * 0.13)
        + 0.5 * Math.exp(-Math.pow((t - 0.27 - v * 0.07) / 0.055, 2))
      left.push(`${(p.x - thickness).toFixed(2)},${p.y.toFixed(2)}`)
      right.unshift(`${(p.x + thickness * 0.8).toFixed(2)},${p.y.toFixed(2)}`)
    })
    ribbon.setAttribute('d', `M${left.join(' L')} L${right.join(' L')} Z`)

    let raf = 0
    let elapsed = 0
    let previous = 0
    let visible = false
    const end = points[160]
    const total = delay + duration + 1.6
    const draw = (time: number) => {
      const p = Math.min(1, Math.max(0, (time - delay) / duration))
      // Slow gathering, then gravity; a gentle deceleration at the end.
      const travel = p * p * (3 - 2 * p)
      const index = travel * 160
      const i = Math.min(159, Math.floor(index))
      const mix = index - i
      const px = points[i].x + (points[i + 1].x - points[i].x) * mix
      const py = points[i].y + (points[i + 1].y - points[i].y) * mix
      clip.setAttribute('height', String(py + (p > 0 ? 0.5 : 0)))
      tip.setAttribute('opacity', String(Math.min(1, p * 22)))
      tip.setAttribute('transform', `translate(${px} ${py}) scale(${0.75 + p * 0.25} ${0.85 + Math.sin(p * Math.PI) * 0.3})`)
      const falling = (time - delay - duration - 0.65) / 0.8
      const showDrop = !still && falling > 0 && falling < 1
      drop.setAttribute('opacity', showDrop ? String(0.85 * (1 - falling * falling)) : '0')
      if (showDrop) {
        drop.setAttribute('cx', String(end.x))
        drop.setAttribute('cy', String(end.y + falling * falling * 38))
      }
    }
    draw(still ? total : 0)
    if (still) return

    const tick = (now: number) => {
      raf = 0
      if (!visible || document.hidden) { previous = 0; return }
      if (previous) elapsed += Math.min((now - previous) / 1000, 0.064)
      previous = now
      draw(elapsed)
      if (elapsed < total) raf = requestAnimationFrame(tick)
    }
    const sync = () => {
      if (visible && !document.hidden && elapsed < total) {
        if (!raf) raf = requestAnimationFrame(tick)
      } else {
        cancelAnimationFrame(raf)
        raf = 0
        previous = 0
      }
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    }, { threshold: 0.12 })
    observer.observe(root.closest('.reveal') ?? root)
    document.addEventListener('visibilitychange', sync)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
      cancelAnimationFrame(raf)
    }
  }, [delay, duration, still, v])

  return (
    <span ref={rootRef} aria-hidden="true" className="drip pointer-events-none absolute"
      style={{ left: x, top, height, width, transform: `translateX(-${START_X[v] / 22 * 100}%)` }}>
      <svg viewBox="0 0 22 196" preserveAspectRatio="none" className="block h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}-ink`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgb(var(--c-blood))" stopOpacity="0.95" />
            <stop offset="0.55" stopColor="rgb(var(--c-blood))" stopOpacity="0.72" />
            <stop offset="1" stopColor="rgb(var(--c-blood))" stopOpacity="0.9" />
          </linearGradient>
          <clipPath id={`${id}-clip`}><rect ref={clipRef} x="0" y="0" width="22" height="0" /></clipPath>
        </defs>
        <path ref={courseRef} d={PATHS[v]} fill="none" stroke="none" />
        <g clipPath={`url(#${id}-clip)`}>
          <path ref={ribbonRef} fill={`url(#${id}-ink)`} />
          <path d={PATHS[v]} fill="none" stroke="rgb(var(--c-ember) / 0.24)" strokeWidth="0.65" transform="translate(-0.5 0)" />
        </g>
        <g ref={tipRef} opacity="0">
          <ellipse rx="1.9" ry="2.5" fill="rgb(var(--c-blood))" />
          <ellipse cx="-0.55" cy="-0.65" rx="0.38" ry="0.85" fill="rgb(var(--c-ember) / 0.4)" />
        </g>
        <ellipse ref={dropRef} rx="1.25" ry="2.3" fill="rgb(var(--c-blood))" opacity="0" />
      </svg>
    </span>
  )
}
