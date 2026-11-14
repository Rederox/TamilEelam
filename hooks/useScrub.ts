'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from './useReducedMotion'

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

/**
 * Scrubs a scene with the scroll: writes how far the element has travelled
 * to `--p` (0..1) on the element itself, for its CSS to turn into transforms
 * and opacities.
 *
 * - default: 0 as its top touches the bottom of the screen, 1 as its bottom
 *   leaves the top (a scene passing by);
 * - `pinned`: for a tall track with a sticky child, 0 as the track's top
 *   reaches the top of the screen, 1 as its bottom reaches the bottom (the
 *   length of the pin).
 *
 * On the element, never on <html>: a custom property restyles the subtree it
 * is set on, every frame, so the scrubbed element should hold the scene and
 * nothing else. One rAF per scroll frame, only while the element is near the
 * screen. In quiet reading and reduced motion it writes `rest` once and stops;
 * CSS should read `var(--p, <the same rest>)` so that the page without
 * JavaScript also shows the scene at rest.
 */
export function useScrub<T extends HTMLElement>({
  pinned = false,
  rest = 1,
  onChange,
}: { pinned?: boolean; rest?: number; /** for what CSS cannot read: a canvas, a sound */ onChange?: (p: number) => void } = {}) {
  const ref = useRef<T | null>(null)
  const still = useReducedMotion()
  const listener = useRef(onChange)
  listener.current = onChange

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (still) {
      el.style.setProperty('--p', String(rest))
      listener.current?.(rest)
      return
    }

    let raf = 0
    let onScreen = false
    let written = ''
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = clamp01(pinned ? -r.top / Math.max(1, r.height - vh) : (vh - r.top) / (vh + r.height))
      const v = p.toFixed(4)
      if (v === written) return
      el.style.setProperty('--p', (written = v))
      listener.current?.(p)
    }
    const onScroll = () => {
      if (onScreen && !raf) raf = requestAnimationFrame(update)
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        if (onScreen) update()
      },
      { rootMargin: '20% 0px' }
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
    }
  }, [pinned, rest, still])

  return ref
}
