'use client'

import { useViewProgress } from '@/hooks/useSceneProgress'

const smoothstep = (a: number, b: number, value: number) => {
  const t = Math.min(1, Math.max(0, (value - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// Keep scroll updates inside this decorative leaf, away from the narrative
// and the SVG impact sequence. The absolute wrapper spans the whole chapter.
export default function JuilletVeil() {
  const { ref, progress } = useViewProgress<HTMLDivElement>()
  const opacity = smoothstep(0.1, 0.4, progress) * (1 - smoothstep(0.72, 0.94, progress))
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]">
      <div
        className="sticky top-0 h-[46svh] w-full bg-gradient-to-b from-blood/25 via-blood/5 to-transparent transition-opacity duration-300 motion-reduce:transition-none"
        style={{ opacity }}
      />
    </div>
  )
}
