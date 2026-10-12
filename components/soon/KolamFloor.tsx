import { kolam, KOLAM_UNIT } from '@/lib/kolam'
import styles from './Soon.module.css'

/**
 * The 1-3-5-7-9-11 diamond: sixty-one dots, and one line round all of them.
 * These are the meetings where it turns back instead of crossing; they were
 * chosen from the patterns that close into a single line, which is what makes
 * it a sikku kolam and not a lattice.
 */
const K = kolam(5, [[-5, -4], [-3, -4], [-2, -1], [-1, -6]], 0.05, 7)

/** how wide the drawing is, counted in dot spacings */
export const KOLAM_SPAN = K.box[2] / (2 * KOLAM_UNIT)

/**
 * Rice flour on stone, seen from where one stands at the door.
 *
 * The dots come first, the nearest to the lamp before the farthest, the way
 * light would find them. Then the line is drawn, once, and stays.
 */
export default function KolamFloor() {
  return (
    <svg viewBox={K.box.join(' ')} className={styles.kolam} aria-hidden="true">
      <defs>
        {/* flour takes the colour of the flame beside it, and loses the light with distance */}
        <radialGradient id="soon-flour" gradientUnits="userSpaceOnUse" cx="0" cy="0" r={K.box[2] / 2}>
          <stop offset="0" className={styles.flourLit} />
          <stop offset="0.14" className={styles.flour} stopOpacity="0.92" />
          <stop offset="0.32" className={styles.flour} stopOpacity="0.42" />
          <stop offset="0.56" className={styles.flour} stopOpacity="0.15" />
          <stop offset="0.82" className={styles.flour} stopOpacity="0.06" />
          <stop offset="1" className={styles.flour} stopOpacity="0.03" />
        </radialGradient>
      </defs>
      <g fill="url(#soon-flour)">
        {K.dots.map(([x, y]) => (
          <circle
            key={`${x},${y}`}
            cx={x}
            cy={y}
            r={KOLAM_UNIT * 0.1}
            className={styles.pulli}
            style={{ ['--far' as string]: (Math.hypot(x, y) / KOLAM_UNIT).toFixed(2) }}
          />
        ))}
      </g>
      <path d={K.d} pathLength={1} className={styles.line} stroke="url(#soon-flour)" strokeWidth={KOLAM_UNIT * 0.1} />
    </svg>
  )
}
