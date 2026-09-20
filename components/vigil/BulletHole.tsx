/**
 * A bullet impact in the wall: a torn crater, fracture lines that disagree
 * with each other, a burst of sparks and knocked-loose chips at the
 * instant of impact, a shockwave that passes through the wall, and a wisp
 * of smoke that drifts off and is gone. The crater and its cracks are run
 * through a seeded turbulence filter (see ImpactFilters in ChJuillet) so
 * no two holes share one broken edge, even though they share one drawing.
 *
 * Hidden until the surrounding .reveal element gets .in, then lands with
 * the wall itself (see .bullet / .shot-target rules in globals.css).
 */

// eight uneven radii: real fracture does not radiate in a clean spread —
// some cracks run far, most stop short, and none of them agree
const CRACK_ANGLES = [-72, -35, 4, 42, 88, 129, 168, -158]
const CRACK_LENGTHS = [17, 9, 15, 8, 13, 6, 16, 10]
// which of those directions also throw a spark, and which drop a chip
const SPARK_AT = [0, 2, 4, 5, 7]
const DEBRIS_AT = [1, 3, 4, 6]

export default function BulletHole({
  x,
  y,
  size = 34,
  delay = 0.8,
  variant = 0,
}: {
  x: string
  y: string
  size?: number
  delay?: number
  /** picks one of three seeded crack distortions and a rotation, so a
   *  repeated pattern never reads as a stamp */
  variant?: number
}) {
  const v = ((variant % 3) + 3) % 3
  const rotation = v * 53 - 40

  return (
    <span
      aria-hidden="true"
      className="bullet pointer-events-none absolute"
      style={{ left: x, top: y, width: `clamp(18px, 3.2vw, ${size}px)`, height: `clamp(18px, 3.2vw, ${size}px)`, translate: '-50% -50%', zIndex: 1, ['--bd' as string]: `${delay}s` }}
    >
      {/* the wave that passes through the wall at the moment of impact */}
      <span className="bullet-shock" />
      {/* the wisp of smoke the impact leaves, drifting off on its own clock */}
      <span className="bullet-smoke" />

      <svg viewBox="0 0 40 40" className="relative h-full w-full">
        {/* crater and cracks: torn by a seeded turbulence, not drawn clean */}
        <g style={{ filter: `url(#bullet-crack-${v})`, transform: `rotate(${rotation}deg)`, transformOrigin: '20px 20px' }}>
          <g stroke="rgb(var(--c-bone)/0.20)" strokeWidth="0.8">
            {CRACK_ANGLES.map((angle, i) => {
              const rad = (angle * Math.PI) / 180
              const len = CRACK_LENGTHS[i]
              return (
                <line
                  key={i}
                  x1="20"
                  y1="20"
                  x2={20 + Math.cos(rad) * len}
                  y2={20 + Math.sin(rad) * len}
                />
              )
            })}
          </g>
          {/* scorched ring */}
          <circle cx="20" cy="20" r="8.5" fill="none" stroke="rgb(var(--c-ember)/0.4)" strokeWidth="2.4" />
          {/* the puncture itself */}
          <circle cx="20" cy="20" r="5" fill="rgb(var(--c-night))" stroke="rgb(var(--c-bone)/0.16)" strokeWidth="0.8" />
        </g>

        {/* chips knocked loose, left lying where they fell — not warped,
            they sit on top of the torn wall rather than being part of it */}
        <g className="bullet-debris" fill="rgb(var(--c-bone)/0.4)">
          {DEBRIS_AT.map((idx, i) => {
            const rad = ((CRACK_ANGLES[idx] + rotation) * Math.PI) / 180
            const d = 9 + (i % 3) * 2.2
            return (
              <circle
                key={idx}
                cx={20 + Math.cos(rad) * d}
                cy={20 + Math.sin(rad) * d}
                r={0.55 + (i % 2) * 0.35}
              />
            )
          })}
        </g>

        {/* the burst: a few sparks thrown clear of the wall, drawn outward
            rather than faded in, so the shot reads as a direction not a glow */}
        <g className="bullet-sparks" stroke="rgb(var(--c-flame-hot)/0.9)" strokeWidth="1.1" strokeLinecap="round">
          {SPARK_AT.map((idx, i) => {
            const rad = ((CRACK_ANGLES[idx] + rotation) * Math.PI) / 180
            const inner = 6
            const outer = 12 + (i % 3) * 3
            return (
              <line
                key={idx}
                x1={20 + Math.cos(rad) * inner}
                y1={20 + Math.sin(rad) * inner}
                x2={20 + Math.cos(rad) * outer}
                y2={20 + Math.sin(rad) * outer}
              />
            )
          })}
        </g>
      </svg>
    </span>
  )
}
