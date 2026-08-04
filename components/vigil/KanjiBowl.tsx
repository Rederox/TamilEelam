/**
 * A bowl of kanji — the thin rice gruel shared on the strip of sand in 2009,
 * and cooked in the streets of every diaspora city each 18 May since.
 * The one object that links the trapped and those who remember them.
 */
export default function KanjiBowl({ size = 96 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 120 100"
      width={size}
      height={(size * 100) / 120}
      aria-hidden="true"
      className="overflow-visible"
    >
      {/* steam */}
      <g fill="none" stroke="rgb(var(--c-bone)/0.32)" strokeWidth="1.6" strokeLinecap="round">
        {[
          { d: 'M46 40 C 40 30, 52 24, 46 12', delay: '0s' },
          { d: 'M60 38 C 54 26, 66 20, 60 6', delay: '1.1s' },
          { d: 'M74 40 C 68 30, 80 24, 74 12', delay: '2.1s' },
        ].map((s, i) => (
          <path key={i} d={s.d} className="steam" style={{ ['--sd' as string]: s.delay }} />
        ))}
      </g>

      {/* gruel surface */}
      <ellipse cx="60" cy="55" rx="35" ry="6.5" fill="rgb(var(--ch-clay))" opacity="0.55" />

      {/* clay bowl */}
      <path
        d="M25 55 C 25 78, 40 92, 60 92 C 80 92, 95 78, 95 55 Z"
        fill="rgb(var(--ch-clay-2))"
        stroke="rgb(var(--c-bone)/0.4)"
        strokeWidth="1.6"
      />
      {/* rim */}
      <ellipse cx="60" cy="55" rx="35" ry="7" fill="none" stroke="rgb(var(--c-bone)/0.45)" strokeWidth="1.6" />
      {/* warm light caught on the clay */}
      <path
        d="M33 62 C 36 76, 46 86, 60 87"
        fill="none"
        stroke="rgb(var(--c-flame)/0.35)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
