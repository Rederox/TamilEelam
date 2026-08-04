/**
 * A burning city at the bottom of Black July: black rooftops against a
 * flickering fire glow, windows lit ember one by one. Colombo, July 1983.
 */
const WINDOWS: Array<{ x: number; y: number; d: number }> = [
  { x: 48, y: 92, d: 0 }, { x: 55, y: 100, d: 0.7 },
  { x: 143, y: 74, d: 1.3 }, { x: 150, y: 84, d: 0.3 },
  { x: 238, y: 96, d: 1.9 }, { x: 246, y: 104, d: 0.9 },
  { x: 345, y: 66, d: 0.5 }, { x: 352, y: 78, d: 2.2 },
  { x: 458, y: 88, d: 1.1 }, { x: 466, y: 98, d: 0.2 },
  { x: 570, y: 72, d: 1.6 }, { x: 578, y: 84, d: 2.7 },
  { x: 682, y: 94, d: 0.4 }, { x: 690, y: 104, d: 1.4 },
  { x: 795, y: 70, d: 2.0 }, { x: 803, y: 80, d: 0.8 },
  { x: 902, y: 90, d: 1.2 }, { x: 910, y: 100, d: 2.4 },
  { x: 1010, y: 76, d: 0.6 }, { x: 1018, y: 88, d: 1.8 },
  { x: 1122, y: 94, d: 1.0 }, { x: 1130, y: 102, d: 0.1 },
  { x: 1238, y: 78, d: 2.5 }, { x: 1246, y: 90, d: 1.5 },
  { x: 1352, y: 92, d: 0.9 }, { x: 1360, y: 100, d: 2.1 },
]

export default function Skyline() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[1]">
      {/* fire glow behind the rooftops */}
      <div className="absolute inset-x-0 bottom-0 h-[26svh] animate-[lamp-breathe_3.2s_ease-in-out_infinite] bg-gradient-to-t from-ember/30 via-blood/15 to-transparent motion-reduce:animate-none" />
      <svg
        viewBox="0 0 1440 130"
        preserveAspectRatio="none"
        className="relative block h-[90px] w-full sm:h-[120px]"
      >
        {/* rooftop silhouette */}
        <path
          d="M0 130 L0 96 L36 96 L36 82 L70 82 L70 98 L110 98 L110 64 L128 64 L128 56 L166 56 L166 92 L204 92 L204 78 L232 78 L232 108 L268 108 L268 88 L318 88 L318 58 L338 58 L338 50 L372 50 L372 90 L420 90 L420 74 L452 74 L452 96 L488 96 L488 80 L530 80 L530 100 L562 100 L562 62 L596 62 L596 92 L640 92 L640 76 L672 76 L672 102 L714 102 L714 84 L760 84 L760 60 L790 60 L790 94 L828 94 L828 70 L862 70 L862 98 L896 98 L896 82 L936 82 L936 104 L976 104 L976 68 L1004 68 L1004 90 L1046 90 L1046 74 L1088 74 L1088 96 L1120 96 L1120 66 L1152 66 L1152 88 L1198 88 L1198 72 L1232 72 L1232 100 L1272 100 L1272 84 L1310 84 L1310 94 L1348 94 L1348 76 L1382 76 L1382 98 L1416 98 L1416 88 L1440 88 L1440 130 Z"
          fill="rgb(var(--c-night))"
          stroke="rgb(var(--c-bone)/0.06)"
          strokeWidth="1"
        />
        {/* windows catching fire */}
        {WINDOWS.map((w, i) => (
          <rect
            key={i}
            x={w.x}
            y={w.y}
            width="5"
            height="6"
            fill="rgb(var(--c-ember))"
            className="window-fire motion-reduce:opacity-40"
            style={{ ['--wd' as string]: `${w.d}s` }}
          />
        ))}
      </svg>
    </div>
  )
}
