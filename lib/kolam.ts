/**
 * சிக்கு கோலம் — a kolam drawn the way it is drawn on a doorstep: the dots
 * first, then one line that goes round every one of them and comes home.
 *
 * The dots (pulli) sit on a square lattice, cut to a diamond. The line runs
 * on the diagonals between them. Wherever two neighbouring dots face each
 * other it has a choice: cross the other strand, or turn back round its own
 * dot. At the rim there is no choice, it turns. Which meetings are turns is
 * the whole design, and a pattern only counts if following the line from any
 * point brings it back having passed everything once.
 *
 * The lattice is counted in half-spacings so nothing is a fraction: dots at
 * (even, even), the meeting point between two dots at (odd, even) or
 * (even, odd).
 */

export interface Kolam {
  /** the line, as SVG path data: one closed subpath per loop */
  d: string
  /** how many separate lines the pattern needs; a true sikku kolam needs 1 */
  loops: number
  dots: [number, number][]
  /** viewBox, with room for the outermost loops */
  box: [number, number, number, number]
}

type Pt = [number, number]

/**
 * Drawing units to the half-spacing. The curves are a lattice unit across,
 * and a browser measuring a path that small to lay dashes along it is out by
 * several percent; at this size it is exact.
 */
export const KOLAM_UNIT = 100

const key = (x: number, y: number) => `${x},${y}`

/** A small deterministic generator: the same hand draws it on server and client. */
function mulberry(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const n = (v: number) => Math.round(v * KOLAM_UNIT).toString()

/**
 * @param reach  dots from the centre to a tip; 4 gives the 1-3-5-7-9 diamond
 * @param turns  the meetings where the line turns back, one per family: each
 *               is mirrored left to right and near to far
 * @param wobble how unsteady the hand is, in half-spacings; 0 is a compass
 */
export function kolam(reach: number, turns: Pt[] = [], wobble = 0, seed = 1): Kolam {
  const dotSet = new Set<string>()
  const dots: Pt[] = []
  for (let j = -reach; j <= reach; j++) {
    for (let i = -reach; i <= reach; i++) {
      if (Math.abs(i) + Math.abs(j) > reach) continue
      dotSet.add(key(2 * i, 2 * j))
      dots.push([2 * i, 2 * j])
    }
  }

  const turnSet = new Set<string>()
  turns.forEach(([x, y]) => {
    turnSet.add(key(x, y)).add(key(-x, y)).add(key(x, -y)).add(key(-x, -y))
  })

  /** Does the line turn here? At the rim always; inside, only where asked. */
  const turnsAt = (x: number, y: number) => {
    const upright = Math.abs(x) % 2 === 1 // the two dots are left and right of it
    const a = upright ? dotSet.has(key(x - 1, y)) : dotSet.has(key(x, y - 1))
    const b = upright ? dotSet.has(key(x + 1, y)) : dotSet.has(key(x, y + 1))
    return !(a && b) || turnSet.has(key(x, y))
  }

  // Every dot has four short runs of line around it. Walk them all: each walk
  // is one closed line, and the number of walks is the number of lines.
  const starts: { x: number; y: number; dx: number; dy: number }[] = []
  dots.forEach(([X, Y]) => {
    starts.push({ x: X, y: Y - 1, dx: 1, dy: 1 }, { x: X + 1, y: Y, dx: -1, dy: 1 })
    starts.push({ x: X, y: Y + 1, dx: -1, dy: -1 }, { x: X - 1, y: Y, dx: 1, dy: -1 })
  })

  const seen = new Set<string>()
  const rand = mulberry(seed)
  let loops = 0
  let d = ''

  for (const s of starts) {
    if (seen.has(key(s.x * 2 + s.dx, s.y * 2 + s.dy))) continue
    loops++

    // the run from one meeting to the next: where its middle is, which way
    // it is heading there, and whether it bent at the meeting it came from
    const mid: Pt[] = []
    const dir: Pt[] = []
    const bent: boolean[] = []
    let { x, y, dx, dy } = s
    let turned = turnsAt(x, y)
    for (;;) {
      const k = key(x * 2 + dx, y * 2 + dy)
      if (seen.has(k)) break
      seen.add(k)
      mid.push([x + dx / 2 + (rand() - 0.5) * wobble, y + dy / 2 + (rand() - 0.5) * wobble])
      dir.push([dx * Math.SQRT1_2, dy * Math.SQRT1_2])
      bent.push(turned)
      x += dx
      y += dy
      turned = turnsAt(x, y)
      if (turned) {
        if (Math.abs(x) % 2 === 1) dx = -dx
        else dy = -dy
      }
    }

    // A turn is a quarter circle round the dot; a crossing is a straight run.
    // Both leave and arrive along the diagonal, so the line never kinks.
    const ARC = 0.3905 // handle length for a quarter circle of radius √½
    const RUN = Math.SQRT2 / 3
    d += `M${n(mid[0][0])} ${n(mid[0][1])}`
    for (let i = 0; i < mid.length; i++) {
      const j = (i + 1) % mid.length
      const h = bent[j] ? ARC : RUN
      d += `C${n(mid[i][0] + dir[i][0] * h)} ${n(mid[i][1] + dir[i][1] * h)} ${n(mid[j][0] - dir[j][0] * h)} ${n(mid[j][1] - dir[j][1] * h)} ${n(mid[j][0])} ${n(mid[j][1])}`
    }
    d += 'Z'
  }

  const span = (2 * reach + 1.9) * KOLAM_UNIT
  return {
    d,
    loops,
    dots: dots.map(([x, y]) => [x * KOLAM_UNIT, y * KOLAM_UNIT]),
    box: [-span, -span, span * 2, span * 2],
  }
}
