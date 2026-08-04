/**
 * A kolam — the auspicious threshold pattern drawn each dawn in Tamil homes.
 * Four looping petals around a dot grid, drawing themselves in gold when the
 * chapter reveals (see .kolam rules in globals.css).
 */
export default function Kolam({ size = 150 }: { size?: number }) {
  const petal =
    'M50 50 C 36 40, 26 24, 36 16 C 46 8, 58 20, 50 32 C 46 38, 48 46, 50 50 Z'

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className="kolam"
      aria-hidden="true"
      fill="none"
      stroke="rgb(var(--c-gold))"
      strokeWidth="1.1"
      strokeLinecap="round"
    >
      {[0, 90, 180, 270].map((angle, i) => (
        <path
          key={angle}
          d={petal}
          pathLength={100}
          transform={`rotate(${angle} 50 50)`}
          style={{ ['--kd' as string]: `${i * 0.55}s` }}
        />
      ))}
      {/* center diamond woven between the petals */}
      <path
        d="M50 40 L60 50 L50 60 L40 50 Z"
        pathLength={100}
        style={{ ['--kd' as string]: '2.2s' }}
      />
      {/* pulli — the dots the line dances around */}
      {[
        [50, 50], [50, 24], [76, 50], [50, 76], [24, 50],
        [33, 33], [67, 33], [67, 67], [33, 67],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="1.4"
          fill="rgb(var(--c-gold))"
          stroke="none"
          style={{ ['--kd' as string]: `${1.2 + i * 0.12}s` }}
        />
      ))}
    </svg>
  )
}
