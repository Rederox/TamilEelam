'use client'

/**
 * A single source of reader motion, shared by every effect.
 *
 * One listener for the whole page, written to a plain object: the WebGL
 * layers read it inside their own frame loop, so moving the pointer or
 * scrolling never triggers a React render.
 */
export const reader = {
  /** pointer position, 0..1 across the viewport */
  px: 0.5,
  py: 0.5,
  /** smoothed scroll speed, roughly 0 (still) → 1 (fast) */
  scroll: 0,
  /** signed scroll direction, -1 up → 1 down */
  dir: 0,
}

let started = false

export function startReaderTracking(): () => void {
  if (started || typeof window === 'undefined') return () => {}
  started = true

  let lastY = window.scrollY
  let lastT = performance.now()
  let raf = 0

  const onPointer = (e: PointerEvent) => {
    reader.px = e.clientX / window.innerWidth
    reader.py = e.clientY / window.innerHeight
  }

  const decay = () => {
    // the world settles when the reader stops
    reader.scroll *= 0.92
    if (reader.scroll < 0.001) reader.scroll = 0
    raf = requestAnimationFrame(decay)
  }

  const onScroll = () => {
    const now = performance.now()
    const dt = Math.max(now - lastT, 1)
    const dy = window.scrollY - lastY
    lastY = window.scrollY
    lastT = now
    const v = Math.min(Math.abs(dy) / dt / 2.2, 1)
    reader.scroll = Math.max(reader.scroll, v)
    reader.dir = Math.sign(dy)
  }

  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  raf = requestAnimationFrame(decay)

  return () => {
    window.removeEventListener('pointermove', onPointer)
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(raf)
    started = false
  }
}
