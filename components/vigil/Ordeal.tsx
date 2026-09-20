'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'

import { useEffect } from 'react'
import { prefersReducedMotion } from '@/lib/motion'
import { onOrdeal } from '@/lib/ordeal'

/**
 * The document's own reading of how heavy the moment is.
 *
 * Every suffering chapter writes into the one shared signal (lib/ordeal.ts).
 * This component only carries it to .vignette, which lives outside any
 * chapter and so cannot read a chapter's own local --ordeal: the room
 * closes in a little further, nothing else. Smoothed here rather than at
 * the source, so it never jumps crossing from one chapter's shoulder into
 * the next. One gesture, not an effects rack — the lamp (Lamp.tsx) and the
 * reveal timing (globals.css) read the signal on their own, and nothing
 * else does.
 */
export default function Ordeal() {
  const stillness = useReducedMotion()

  useEffect(() => {
    if (stillness) return
    const root = document.documentElement
    let raf = 0
    let level = 0
    let target = 0

    const tick = () => {
      level += (target - level) * 0.06
      root.style.setProperty('--ordeal', level.toFixed(3))
      raf = Math.abs(target - level) > 0.001 ? requestAnimationFrame(tick) : 0
    }

    const unsubscribe = onOrdeal((v) => {
      target = v
      if (!raf) raf = requestAnimationFrame(tick)
    })

    return () => {
      unsubscribe()
      if (raf) cancelAnimationFrame(raf)
      root.style.removeProperty('--ordeal')
    }
  }, [stillness])

  return null
}
