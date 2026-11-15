'use client'

import { useEffect, useId, useState, type CSSProperties } from 'react'
import MemorialLamp from './MemorialLamp'
import KanjiBowl from './KanjiBowl'
import styles from './MullivaikkalScenery.module.css'

/** The frame each passage is filmed in. Two passages on the same number hold
    the same frame, and only what is lit in it changes: the camp before and
    under the shells, the bowl warm and then cold. Frame 4 is the empty shore. */
const FRAME = [0, 1, 1, 2, 3, 3, 4, 5, 6, 7]
/** The cold bowl is not there any more: that change is a cut, not a dissolve. */
const isCut = (a: number, b: number) => Math.min(a, b) === 5 && Math.max(a, b) === 6

const r = (n: number) => Math.round(n * 10) / 10

/* Everything below is drawn in one 600 × 300 set whose y = 90 is the water's
   edge. Three uneven rows of shelters, the nearer ones larger; never a grid. */
const SHELTERS: [x: number, base: number, width: number][] = [
  [52, 97, 24], [104, 99, 20], [171, 96, 26], [236, 100, 22], [318, 97, 25], [392, 99, 21], [455, 96, 23],
  [20, 124, 40], [118, 128, 36], [214, 122, 42], [330, 127, 38], [440, 123, 40],
  [-14, 168, 62], [96, 176, 58], [262, 170, 66], [404, 177, 60],
]
/* Makeshift: no two stand alike. `a` is where the ridge starts, `h` how high the cloth is held. */
const built = SHELTERS.map(([x, y, w], i) => ({ x, y, w, a: .26 + (i * 37 % 9) / 64, h: w * (.33 + (i * 53 % 7) / 50) }))
/* One path per material rather than three nodes per shelter. */
const CLOTH = built.map(({ x, y, w, a, h }) => `M${r(x + (a + .2) * w)} ${y}L${r(x + a * w)} ${r(y - h)}Q${r(x + (a + .26) * w)} ${r(y - .84 * h)} ${r(x + .8 * w)} ${r(y - .93 * h)}L${r(x + w)} ${r(y - .1 * h)}Z`).join('')
const MOUTHS = built.map(({ x, y, w, a, h }) => `M${x} ${y}L${r(x + a * w)} ${r(y - h)}L${r(x + (a + .2) * w)} ${y}Z`).join('')
const STICKS = built.map(({ x, y, w, a, h }) => `M${r(x + .08 * w)} ${y}L${r(x + (a + .04) * w)} ${r(y - h - .1 * w)}M${r(x + (a + .16) * w)} ${y}L${r(x + (a - .03) * w)} ${r(y - h - .1 * w)}M${r(x + .8 * w)} ${r(y - .93 * h - .07 * w)}L${r(x + .8 * w)} ${r(y - .5 * h)}`).join('')
const FIRES: [x: number, y: number][] = [[286, 112], [176, 141], [350, 191]]

/* In the order they come on: scattered, each one out of reach of the others. */
const LIGHTS: [x: number, y: number, delay: number][] = [
  [262, 150, .9], [96, 118, 2.7], [430, 108, 4], [186, 188, 5.9], [352, 176, 7.1], [38, 160, 9.2],
  [508, 146, 10.4], [310, 104, 12.3], [168, 100, 13.3], [458, 186, 15.4], [118, 172, 16.8], [560, 112, 18.9],
]

/** Small lights on the sand. `far`: the same ones years later, seen from further back, already lit. */
function Lights({ far = false }: { far?: boolean }) {
  return (
    <div className={far ? styles.farLights : undefined}>
      {LIGHTS.map(([x, y, delay], i) => {
        const top = far ? 93 + (y - 95) * .3 : y
        const size = (3.2 + (y - 95) * .026) * (far ? .55 : 1)
        return <i key={i} className={styles.light} style={{ left: `${r(x / 6)}%`, top: `${r(top / 3)}%`, width: `${r(size)}%`, '--d': `${delay}s` } as CSSProperties} />
      })}
    </div>
  )
}

/* Three bare steps along the water's edge, seen from close: right, left, right. The last is the one the sea reaches. */
const PRINTS: [x: number, y: number, scale: number, side: 1 | -1, opacity: number][] = [
  [170, 178, .36, 1, 1], [290, 146, .3, -1, .8], [392, 141, .25, 1, .42],
]

function Shot({ shot, leaving, cut }: { shot: number; leaving: boolean; cut: boolean }) {
  const id = useId().replace(/:/g, '')
  const frame = FRAME[shot]
  if (frame === 4) return null
  return (
    <div className={styles.shot} data-shot={shot} data-leaving={leaving} data-cut={cut}>
      {frame === 0 && (
        <svg className={styles.strand} viewBox="0 0 100 22" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`${id}-sand`} x2="0" y2="1"><stop className={styles.strandWet} /><stop offset=".5" className={styles.strandDry} /></linearGradient>
            <filter id={`${id}-soft`} x="-5%" y="-20%" width="110%" height="140%"><feGaussianBlur stdDeviation=".12 .45" /></filter>
          </defs>
          <path d="M0 3.5C10 2.2 20 2.8 30 4.2S50 7.5 60 9.2 68 10.6 71 11C66 12.2 58 13.6 48 15.2S30 18.6 18 19 6 19.6 0 19.4Z" fill={`url(#${id}-sand)`} filter={`url(#${id}-soft)`} />
        </svg>
      )}
      {frame === 1 && <>
        <div className={styles.underFire}><div className={styles.farGlow} /></div>
        <div className={`${styles.set} ${styles.drift}`}>
          <svg viewBox="0 0 600 300">
            <path d={MOUTHS} className={styles.mouth} />
            <path d={CLOTH} className={styles.cloth} />
            <path d={STICKS} className={styles.stick} />
          </svg>
          <div className={styles.fires}>{FIRES.map(([x, y], i) => <i key={i} className={styles.fire} style={{ left: `${r(x / 6)}%`, top: `${r(y / 3)}%`, '--d': `${-i * 1.3}s` } as CSSProperties} />)}</div>
          <div className={styles.underFire}><svg viewBox="0 0 600 300" className={styles.lash}><path d={CLOTH} /></svg></div>
        </div>
      </>}
      {frame === 2 && <div className={`${styles.set} ${styles.drift}`}><Lights /></div>}
      {frame === 3 && (
        <div className={styles.set}>
          <div className={styles.bowlSpot}>
            <div className={styles.warmth} />
            <div className={styles.contact} />
            <KanjiBowl size={320} steam={shot === 4} />
          </div>
        </div>
      )}
      {frame === 5 && <div className={styles.horizon} />}
      {frame === 6 && <>
        <div className={`${styles.set} ${styles.drift}`}>
          <svg viewBox="0 0 600 300" className={styles.prints}>
            <defs>
              <g id={`${id}-print`}>
                <path d="M0 50C-8 50-12 44-11 36-10 26-3 18-4 6-5-4-16-10-15-24-14-34-7-38 1-37 10-36 18-31 17-20 16-8 13 2 13 14 13 26 13 36 11 42 9 48 5 50 0 50Z" />
                <ellipse cx="-10" cy="-46" rx="5.5" ry="7" /><circle cx="-1" cy="-49" r="4" /><circle cx="6" cy="-47" r="3.6" /><circle cx="12" cy="-43" r="3.2" /><circle cx="17" cy="-38" r="2.8" />
              </g>
            </defs>
            {PRINTS.map(([x, y, scale, side, opacity], i) => <use key={i} href={`#${id}-print`} opacity={opacity} transform={`translate(${x} ${y}) scale(${scale} ${r(scale * .6)}) rotate(78) scale(${side} 1)`} />)}
          </svg>
        </div>
        <div className={styles.wash} />
      </>}
      {frame === 7 && (
        <div className={styles.set}>
          <Lights far />
          <div className={`${styles.bowlSpot} ${styles.bowlAgain}`}>
            <div className={styles.contact} />
            <KanjiBowl size={320} />
          </div>
          <div className={styles.lampSpot}>
            <div className={styles.warmth} />
            <MemorialLamp />
          </div>
        </div>
      )}
    </div>
  )
}

/** Ten shots of one film on the strip of sand: one still image per passage, dissolving into the next. */
export default function MullivaikkalScenery({ active }: { active: number }) {
  const [shown, setShown] = useState(active)
  const [leaving, setLeaving] = useState<number | null>(null)
  const [cut, setCut] = useState(false)
  // Derived while rendering, so the outgoing frame never unmounts for a tick before it dissolves.
  if (shown !== active) {
    setShown(active)
    setCut(isCut(shown, active))
    if (FRAME[shown] !== FRAME[active]) setLeaving(isCut(shown, active) ? null : shown)
  }
  useEffect(() => {
    if (leaving === null) return
    // just past the 1.5 s dissolve: at most two frames are ever composited
    const timer = window.setTimeout(() => setLeaving(null), 1700)
    return () => window.clearTimeout(timer)
  }, [leaving, shown])

  const shots = leaving !== null && FRAME[leaving] !== FRAME[active] ? [leaving, active] : [active]
  // Fixed order in the DOM: moving a node would restart its dissolve.
  shots.sort((a, b) => FRAME[a] - FRAME[b])
  return (
    <div className={styles.world} data-shot={active} aria-hidden="true">
      <div className={styles.ground} />
      {shots.map(shot => <Shot key={FRAME[shot]} shot={shot} leaving={shot !== active} cut={cut} />)}
    </div>
  )
}
