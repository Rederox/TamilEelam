'use client'

import { useEffect, useRef, useState } from 'react'
import { onStageGL, registerAir, type AirKind } from '@/lib/atmosphere'

/**
 * The air in a chapter.
 *
 * Reserves a rectangle and hands it to the shared <AtmosphereStage>, which
 * draws the material into it. Renders nothing itself: without WebGL, without
 * JS, or under reduced motion the chapter simply keeps the ground it already
 * had, which is the whole point of the fallback.
 *
 * Placed inside a `relative` section, above its background and below its
 * text — the stage draws at z-1 and chapter prose sits at z-2.
 */
export default function Air({
  kind,
  intensity = 0.8,
  warmth = 0.5,
  /** where in the chapter the air hangs; defaults to the whole section */
  className = 'inset-0',
}: {
  kind: AirKind
  intensity?: number
  warmth?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)

  useEffect(() => onStageGL(setOn), [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    return registerAir({
      el,
      kind,
      intensity,
      warmth,
      // stable for the life of the placement, so the chapter always breathes
      // the same way rather than reshuffling on every re-render
      seed: Math.random(),
      progress: 0,
    })
  }, [kind, intensity, warmth])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-air={on ? kind : undefined}
      className={`pointer-events-none absolute ${className}`}
    />
  )
}
