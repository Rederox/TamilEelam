'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from './useReducedMotion'
import { clearPresence, setPresence, type Channel } from '@/lib/presence'

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/**
 * How far inside a place the reader is, 0..1, from where the middle of the
 * screen sits: nothing while that line is outside the section, full once it
 * is a little over half a screen in from either edge. Measured in pixels of
 * scroll rather than a share of the section, so the sound arrives and leaves
 * over the same stretch of scrolling whether the chapter is one screen tall
 * or ten — the sea is never a screen late, nor still there a screen after.
 */
export function proximity(el: HTMLElement): number {
  const rect = el.getBoundingClientRect()
  const vh = window.innerHeight
  const inside = Math.min(vh / 2 - rect.top, rect.bottom - vh / 2)
  if (inside <= 0) return 0
  return smoothstep(0, Math.max(1, Math.min(vh * 0.6, rect.height * 0.4)), inside)
}

/**
 * Ties a section's own scroll traversal to one of the shared presence
 * channels (lib/presence.ts), the way useOrdeal ties the heavy chapters to
 * the ordeal. Silent under reduced motion, like everything else that moves.
 */
export function usePresence<T extends HTMLElement>(channel: Channel, peak = 1) {
  const ref = useRef<T | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return

    const key = Symbol(channel)
    let raf = 0
    let onScreen = false

    const update = () => {
      raf = 0
      setPresence(channel, key, proximity(el) * peak)
    }
    const onScroll = () => {
      if (onScreen && !raf) raf = requestAnimationFrame(update)
    }

    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0].isIntersecting
        if (onScreen) update()
        else clearPresence(channel, key)
      },
      { rootMargin: '15% 0px' }
    )
    io.observe(el)

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
      clearPresence(channel, key)
    }
  }, [channel, peak, reduced])

  return ref
}
