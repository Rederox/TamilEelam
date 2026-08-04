'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Progress (0..1) of a tall scroll container passing through the viewport.
 * Used for sticky "pinned scene" sequences: the container is N × 100vh tall,
 * a sticky child fills the viewport, and scenes cross-fade based on progress.
 */
export function useSceneProgress<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0

    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0
      setProgress(p)
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

  return { ref, progress }
}

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

    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const p = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
      setProgress(Math.min(1, Math.max(0, p)))
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
