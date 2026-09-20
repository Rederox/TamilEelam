'use client'

import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '@/lib/motion'

/**
 * Whether the reader has asked for less movement, as React state.
 *
 * The CSS media query covers transitions and keyframes, but not SMIL
 * (`<animate>` inside SVG) and not anything a component decides not to
 * render at all. Those need the answer in JavaScript.
 *
 * Starts false so the server render and the first client render agree; the
 * real answer arrives on the first effect.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(prefersReducedMotion())
    const onChange = () => setReduced(prefersReducedMotion())
    mq.addEventListener('change', onChange)
    window.addEventListener('vigil-reading-change', onChange)
    return () => { mq.removeEventListener('change', onChange); window.removeEventListener('vigil-reading-change', onChange) }
  }, [])

  return reduced
}
