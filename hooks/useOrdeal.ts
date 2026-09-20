'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from './useReducedMotion'
import { clearOrdeal, setOrdeal } from '@/lib/ordeal'

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/**
 * How present the ordeal is while the reader dwells inside the section:
 * nothing at the edges, full through the middle. The two shoulders do not
 * touch, so leaving one heavy chapter for the next never means carrying
 * both at once.
 */
const envelope = (p: number) => smoothstep(0.12, 0.4, p) * (1 - smoothstep(0.72, 0.94, p))

/**
 * Ties a chapter's own scroll traversal to the shared ordeal signal (see
 * lib/ordeal.ts) and writes the same number onto the section itself as
 * `--ordeal`, for the vignette wash, the grain, and any reveal or text
 * inside it that wants to read the room. Silent under reduced motion,
 * exactly like the GL layers.
 *
 * `peak` is how heavy this particular chapter gets at its worst — the
 * suffering chapters escalate rather than repeat the same weight.
 */
export function useOrdeal<T extends HTMLElement>(peak: number) {
  const ref = useRef<T | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return

    const key = Symbol('ordeal')
    let raf = 0
    let onScreen = false

    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const p = clamp01((window.innerHeight - rect.top) / (window.innerHeight + rect.height))
      const v = envelope(p) * peak
      el.style.setProperty('--ordeal', v.toFixed(3))
      setOrdeal(key, v)
    }
    const onScroll = () => {
      if (onScreen && !raf) raf = requestAnimationFrame(update)
    }

    // generous margin: the shoulders of the envelope already fade to
    // nothing well before the section's true edges
    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0].isIntersecting
        if (onScreen) update()
        else { clearOrdeal(key); el.style.setProperty('--ordeal', '0') }
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
      el.style.setProperty('--ordeal', '0')
      clearOrdeal(key)
    }
  }, [peak, reduced])

  return ref
}
