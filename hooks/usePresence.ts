'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from './useReducedMotion'
import { clearPresence, setPresence, type Channel } from '@/lib/presence'

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** Nothing at the section's edges, full through its middle: the reader is
 *  "at" a place only once they are properly inside it. */
const envelope = (p: number) => smoothstep(0.08, 0.3, p) * (1 - smoothstep(0.72, 0.96, p))

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
      const rect = el.getBoundingClientRect()
      const p = clamp01((window.innerHeight - rect.top) / (window.innerHeight + rect.height))
      setPresence(channel, key, envelope(p) * peak)
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
