'use client'

import { useEffect, useRef, useState } from 'react'
import { onFlameGL, registerFlame } from '@/lib/flames'

/**
 * A flame. It reserves its space in the layout and, when the shared WebGL
 * layer is running, hands that rectangle over for a real shader flame to be
 * drawn into. Without WebGL (or under reduced motion) the CSS flame that has
 * always been here keeps burning.
 */
export default function Flame({ size = 28, lit = true }: { size?: number; lit?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [gl, setGl] = useState(false)
  const handle = useRef({ el: null as unknown as HTMLElement, size, lit, seed: Math.random() })

  handle.current.size = size
  handle.current.lit = lit

  useEffect(() => onFlameGL(setGl), [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    handle.current.el = el
    return registerFlame(handle.current)
  }, [])

  return (
    <div
      ref={ref}
      className={`flame${lit ? '' : ' unlit'}${gl ? ' flame-gl' : ''}`}
      style={{ ['--fs' as string]: `${size}px` }}
      aria-hidden="true"
    >
      <div className="f-glow" />
      <div className="f-outer" />
      <div className="f-inner" />
      <div className="f-core" />
    </div>
  )
}
