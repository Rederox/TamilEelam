'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { reader, startReaderTracking } from '@/lib/motion'

/**
 * The reader carries the lamp.
 *
 * A pool of warm light follows the pointer across the whole vigil, breathing
 * like a flame and swelling slightly as the page is scrolled. Skipped on touch
 * devices (no pointer to follow) and under reduced motion.
 */
export default function Lamp() {
  const ref = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const paper = theme === 'paper'

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const stop = startReaderTracking()
    let raf = 0
    // start centred so the first frames do not slide in from a corner
    let x = 0.5
    let y = 0.42

    const frame = (t: number) => {
      // the lamp trails the hand rather than snapping to it
      x += (reader.px - x) * 0.045
      y += (reader.py - y) * 0.045

      const breath = 0.94 + 0.06 * Math.sin(t / 1500)
      const lift = 1 + reader.scroll * 0.35

      el.style.setProperty('--lx', `${(x * 100).toFixed(2)}%`)
      el.style.setProperty('--ly', `${(y * 100).toFixed(2)}%`)
      el.style.setProperty('--lr', `${(breath * lift).toFixed(3)}`)

      // every flame on the page leans into the draught the reader makes
      document.documentElement.style.setProperty(
        '--draught',
        (reader.scroll * -reader.dir).toFixed(3)
      )
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      stop()
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="lamp pointer-events-none fixed inset-0 z-[84]"
      data-paper={paper ? '' : undefined}
    />
  )
}
