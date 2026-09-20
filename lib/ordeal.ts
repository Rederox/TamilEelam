'use client'

/**
 * How heavy the moment is, 0..1 — read by whatever wants to lean into it:
 * the vignette, the grain, the lamp's own hand, the ambient drone if the
 * reader has asked for one.
 *
 * Chapters II, III, V and VI (the vice, the fire, Black July, Mullivaikkal)
 * each write their own local reading into this one shared number, exactly as
 * every flame draws from one canvas. The document only ever carries the
 * heaviest chapter currently on screen — the ordeal does not sum, a reader
 * is never made to carry two atrocities' weight because their sections
 * happen to overlap during a scroll transition.
 */

const contributors = new Map<symbol, number>()
const listeners = new Set<(v: number) => void>()
let current = 0

function recompute() {
  let max = 0
  contributors.forEach((v) => {
    if (v > max) max = v
  })
  if (max === current) return
  current = max
  listeners.forEach((l) => l(current))
}

/** Called every frame by a chapter's own tension loop. */
export function setOrdeal(key: symbol, value: number): void {
  contributors.set(key, value)
  recompute()
}

/** Called once, when the chapter that owns `key` unmounts or leaves screen for good. */
export function clearOrdeal(key: symbol): void {
  if (!contributors.delete(key)) return
  recompute()
}

export function getOrdeal(): number {
  return current
}

export function onOrdeal(fn: (v: number) => void): () => void {
  listeners.add(fn)
  fn(current)
  return () => listeners.delete(fn)
}
