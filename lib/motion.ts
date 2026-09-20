'use client'

/**
 * A single source of reader motion, shared by every effect.
 *
 * One listener for the whole page, written to a plain object: the WebGL
 * layers read it inside their own frame loop, so moving the pointer or
 * scrolling never triggers a React render.
 */
/** True when the reader has asked the system for less movement. */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && (window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.reading === 'quiet')
}

/** Scroll behaviour that honours that request. */
export function scrollBehavior(): ScrollBehavior {
  return prefersReducedMotion() ? 'auto' : 'smooth'
}

export const reader = {
  /** pointer position, 0..1 across the viewport */
  px: 0.5,
  py: 0.5,
  /** smoothed scroll speed, roughly 0 (still) → 1 (fast) */
  scroll: 0,
  /** signed scroll direction, -1 up → 1 down */
  dir: 0,
}

/**
 * Several effects share one set of listeners, so starting is reference
 * counted: the listeners go up on the first caller and only come down when
 * the last one lets go. A plain boolean would hand every later caller a
 * no-op, and the first to unmount would silently blind all the others.
 */
let refs = 0
let uninstall: (() => void) | null = null

export function startReaderTracking(): () => void {
  if (typeof window === 'undefined') return () => {}
  if (++refs === 1) uninstall = install()

  let released = false
  return () => {
    if (released) return
    released = true
    if (--refs === 0) {
      uninstall?.()
      uninstall = null
    }
  }
}

function install(): () => void {
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
    raf = reader.scroll > 0 ? requestAnimationFrame(decay) : 0
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
    if (!raf) raf = requestAnimationFrame(decay)
  }

  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  raf = requestAnimationFrame(decay)

  return () => {
    window.removeEventListener('pointermove', onPointer)
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(raf)
  }
}
