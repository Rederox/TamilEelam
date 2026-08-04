/**
 * Children's names, written in ink on skin.
 *
 * An evocation, not a record: these are ordinary Tamil given names, not
 * claimed as those of identified victims. They stand for the practice
 * survivors described — parents inking their children's names onto their
 * arms so the bodies could be named afterwards.
 */
const NAMES = [
  { t: 'நிலா', r: -3.5, o: 0.92 },
  { t: 'கயல்', r: 2.5, o: 0.75 },
  { t: 'தமிழ்', r: -1.5, o: 0.88 },
  { t: 'வாணி', r: 3.5, o: 0.68 },
  { t: 'மாறன்', r: -2.5, o: 0.84 },
  { t: 'செல்வி', r: 1.5, o: 0.72 },
]

export default function InkNames() {
  return (
    <div
      aria-hidden="true"
      className="mt-10 flex max-w-[640px] flex-wrap items-baseline justify-center gap-x-8 gap-y-5 sm:gap-x-12"
    >
      {NAMES.map((n, i) => (
        <span
          key={n.t}
          className="ink-name font-tamil text-[clamp(22px,3.6vw,38px)] text-bone-dim"
          style={{
            transform: `rotate(${n.r}deg)`,
            opacity: n.o,
            ['--id' as string]: `${0.5 + i * 0.45}s`,
          }}
        >
          {n.t}
        </span>
      ))}
    </div>
  )
}
