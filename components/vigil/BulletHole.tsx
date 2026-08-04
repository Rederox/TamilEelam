/**
 * A bullet impact in the wall: dark puncture, fracture lines, ember ring.
 * Hidden until the surrounding .reveal element gets .in, then punches in
 * with a brief flash (see .bullet rules in globals.css).
 */
export default function BulletHole({
  x,
  y,
  size = 34,
  delay = 0.8,
}: {
  x: string
  y: string
  size?: number
  delay?: number
}) {
  return (
    <span
      aria-hidden="true"
      className="bullet pointer-events-none absolute"
      style={{ left: x, top: y, width: size, height: size, ['--bd' as string]: `${delay}s` }}
    >
      <svg viewBox="0 0 40 40" className="h-full w-full">
        {/* fracture lines */}
        <g stroke="rgb(var(--c-bone)/0.20)" strokeWidth="0.8">
          <line x1="20" y1="20" x2="34" y2="14" />
          <line x1="20" y1="20" x2="30" y2="32" />
          <line x1="20" y1="20" x2="8" y2="30" />
          <line x1="20" y1="20" x2="5" y2="16" />
          <line x1="20" y1="20" x2="14" y2="5" />
          <line x1="20" y1="20" x2="28" y2="6" />
        </g>
        {/* scorched ring */}
        <circle cx="20" cy="20" r="8.5" fill="none" stroke="rgb(var(--c-ember)/0.4)" strokeWidth="2.4" />
        {/* puncture */}
        <circle cx="20" cy="20" r="5" fill="rgb(var(--c-night))" stroke="rgb(var(--c-bone)/0.16)" strokeWidth="0.8" />
      </svg>
    </span>
  )
}
