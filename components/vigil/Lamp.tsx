'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'

import { useEffect, useRef } from 'react'
import { prefersReducedMotion, reader, startReaderTracking } from '@/lib/motion'
import { getOrdeal } from '@/lib/ordeal'

/**
 * The reader carries the lamp.
 *
 * A pool of warm light follows the pointer across the whole vigil, breathing
 * like a flame and swelling slightly as the page is scrolled. Skipped on touch
 * devices (no pointer to follow) and under reduced motion.
 */
export default function Lamp() {
  const ref = useRef<HTMLDivElement>(null)

  const stillness = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (stillness) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const stop = startReaderTracking()
    let raf = 0
    // start centred so the first frames do not slide in from a corner
    let x = 0.5
    let y = 0.42
    let lastDraught = ''

    const frame = (t: number) => {
      // the lamp trails the hand rather than snapping to it — and the
      // heavier the chapter, the heavier the hand: at the worst of it the
      // lamp answers at little better than half its usual willingness
      const drag = 0.045 * (1 - getOrdeal() * 0.55)
      x += (reader.px - x) * drag
      y += (reader.py - y) * drag

      const breath = 0.94 + 0.06 * Math.sin(t / 1500)
      const lift = 1 + reader.scroll * 0.35

      el.style.setProperty('--lx', `${(x * 100).toFixed(2)}%`)
      el.style.setProperty('--ly', `${(y * 100).toFixed(2)}%`)
      el.style.setProperty('--lr', `${(breath * lift).toFixed(3)}`)

      // Every flame on the page leans into the draught the reader makes.
      // This one lives on <html>, so writing it invalidates style for the
      // whole document: only write it when it has actually changed, which
      // is never while the reader is holding still.
      const draught = (reader.scroll * -reader.dir).toFixed(2)
      if (draught !== lastDraught) {
        lastDraught = draught
        document.documentElement.style.setProperty('--draught', draught)
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      stop()
    }
  }, [stillness])

  // the paper theme is handled entirely by [data-theme='paper'] .lamp in CSS
  return <div ref={ref} aria-hidden="true" className="lamp pointer-events-none fixed inset-0 z-[84]" />
}
