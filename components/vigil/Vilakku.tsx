'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import Flame from './Flame'
import GlVilakku from './gl/GlVilakku'

/**
 * விளக்கு — the lamp itself, not just its flame.
 *
 * The vigil used to show a flame burning on nothing. This is the brass it
 * actually stands on: the lamp lit on Maaveerar Naal and on every 18 May,
 * turned in 3D from its real profile.
 *
 * Degrading honestly matters here more than anywhere: without WebGL, without
 * JS, or under reduced motion the flame is still lit — it simply floats as it
 * did before, rather than the chapter losing its lamp entirely.
 */
export default function Vilakku({
  /** width of the lamp in px; a diya is wide and low, so height follows */
  size = 240,
  lit = true,
  className = '',
}: {
  size?: number
  lit?: boolean
  className?: string
}) {
  const [wick, setWick] = useState<{ x: number; y: number } | null>(null)
  const raf = useRef(0)
  const reduced = useReducedMotion()
  // the id must be cleared as well as cancelled: under StrictMode the effect
  // runs twice, and a stale id left behind made every later report of the
  // wick's position return early — the prologue's flame never found its spout
  useEffect(() => () => {
    cancelAnimationFrame(raf.current)
    raf.current = 0
  }, [])

  // the wick moves only on resize, but the callback fires from a frame loop
  const onWick = useCallback((x: number, y: number) => {
    if (raf.current) return
    raf.current = requestAnimationFrame(() => {
      raf.current = 0
      setWick((p) => (p && Math.abs(p.x - x) < 0.002 && Math.abs(p.y - y) < 0.002 ? p : { x, y }))
    })
  }, [])

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size * 0.78 }}
    >
      <GlVilakku onWick={onWick} />
      {(!wick || reduced) && <svg aria-hidden="true" viewBox="0 0 240 187" className="absolute inset-0 h-full w-full text-gold/70"><path d="M51 99 Q120 162 189 99 Q120 116 51 99Z" fill="currentColor" opacity=".45"/><ellipse cx="120" cy="100" rx="69" ry="12" fill="none" stroke="currentColor"/><path d="M115 135 L125 135 L130 159 L110 159Z M95 162 Q120 153 145 162" fill="currentColor" opacity=".5"/></svg>}

      {/* Stood on the spout once the lamp reports where that is. Until then it
          sits where a lone flame always sat, so nothing pops into place. */}
      <div
        className="absolute -translate-x-1/2 -translate-y-full transition-[left,top] duration-300 ease-vigil"
        style={{
          left: `${(reduced ? 0.5 : wick?.x ?? 0.5) * 100}%`,
          top: `${(reduced ? 0.5 : wick?.y ?? 0.5) * 100}%`,
        }}
      >
        <Flame size={Math.round(size * 0.12)} lit={lit} />
      </div>
    </div>
  )
}
