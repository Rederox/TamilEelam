'use client'

import { useEffect, useRef, useState } from 'react'

/*
 * `useSceneProgress` used to live here: it pushed a scroll position into
 * React state every frame so a pinned sequence could cross-fade on it. Its
 * only caller was Mullivaikkal, where it meant re-rendering a very heavy
 * component sixty times a second and reading the sequence as ten hard cuts.
 * That chapter now scrubs straight to the DOM from its own rAF loop, so the
 * hook is gone rather than left as a trap for the next pinned scene.
 */

/**
 * Visibility progress (0..1) of an element travelling through the viewport:
 * 0 when its top touches the bottom edge, 1 when its bottom leaves the top.
 * Used for parallax effects.
 */
export function useViewProgress<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null)
  const [progress, setProgress] = useState(0.5)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    let onScreen = false
    let last = -1

    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const p = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
      const next = Math.min(1, Math.max(0, p))
      // a parallax offset of a few hundred pixels cannot show more than about
      // 300 steps, so anything finer is a React render nobody can see
      const q = Math.round(next * 300) / 300
      if (q === last) return
      last = q
      setProgress(q)
    }
    const onScroll = () => {
      if (onScreen && !raf) raf = requestAnimationFrame(update)
    }

    // every chapter opener uses this hook. Without the gate, all ten measure
    // and re-render on every frame of a scroll that only two of them are in.
    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0].isIntersecting
        if (onScreen) update()
      },
      { rootMargin: '100px' }
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
  }, [])

  return { ref, progress }
}

/** Overall document scroll progress (0..1). */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const doc = document.documentElement
      const total = doc.scrollHeight - window.innerHeight
      setProgress(total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return progress
}
