'use client'

/**
 * Where the reader is, as a few named signals, 0..1.
 *
 * The same contract as the ordeal (lib/ordeal.ts), for things that are not
 * the ordeal: how near the reader is to the fire, to the sea, to the shells.
 * A chapter writes its own reading into a channel; the channel carries only
 * the strongest one, so two chapters overlapping during a scroll never add
 * up. Read by the ambient sound (lib/soundscape.ts), which has to know what
 * the reader should be hearing.
 */

export type Channel =
  | 'fire' // the library burning, the city burning
  | 'lamp' // the visitor's own flame
  | 'sea' // the coast at Mullivaikkal
  | 'shells' // the guns, far off over that coast
  | 'land' // wind, palms and insects over the old kingdom
  | 'absence' // the emptied room of the disappeared
  | 'dawn' // birds and a temple bell, after

const contributors = new Map<Channel, Map<symbol, number>>()
const listeners = new Map<Channel, Set<(v: number) => void>>()
const current = new Map<Channel, number>()

function recompute(channel: Channel) {
  let max = 0
  contributors.get(channel)?.forEach((v) => {
    if (v > max) max = v
  })
  if (max === (current.get(channel) ?? 0)) return
  current.set(channel, max)
  listeners.get(channel)?.forEach((l) => l(max))
}

/** Called every frame by a chapter's own loop while it is on screen. */
export function setPresence(channel: Channel, key: symbol, value: number): void {
  let map = contributors.get(channel)
  if (!map) {
    map = new Map()
    contributors.set(channel, map)
  }
  map.set(key, value)
  recompute(channel)
}

/** Called once, when the chapter that owns `key` leaves the screen for good. */
export function clearPresence(channel: Channel, key: symbol): void {
  if (!contributors.get(channel)?.delete(key)) return
  recompute(channel)
}

export function getPresence(channel: Channel): number {
  return current.get(channel) ?? 0
}

export function onPresence(channel: Channel, fn: (v: number) => void): () => void {
  let set = listeners.get(channel)
  if (!set) {
    set = new Set()
    listeners.set(channel, set)
  }
  set.add(fn)
  fn(getPresence(channel))
  return () => {
    set!.delete(fn)
  }
}
