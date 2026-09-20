'use client'

/**
 * Registry of the air in each chapter.
 *
 * The vigil already draws every flame from one WebGL context (see
 * `lib/flames.ts`); this is the same bargain for chapter atmosphere. A
 * chapter reserves a rectangle, says what kind of air fills it, and one
 * shared stage draws into that rectangle while it is on screen.
 *
 * The alternative — a canvas per chapter — costs one live GL context each.
 * Browsers cap those at around sixteen and the vigil already spends seven.
 */

/** The four materials the vigil's air is made of. */
export type AirKind =
  /** raking light over slow ground: land, and the relief under a map */
  | 'ground'
  /** particulate hanging in a shaft of light: archive dust, cold embers */
  | 'motes'
  /** heavy cloth breathing in a still room */
  | 'cloth'
  /** low light sweeping across, the way dawn arrives */
  | 'rake'

export interface AirHandle {
  el: HTMLElement
  kind: AirKind
  /** 0..1 overall strength */
  intensity: number
  /** biases the palette from cold ash (0) to lamplight (1) */
  warmth: number
  /** stable per-placement randomness, so no two chapters breathe alike */
  seed: number
  /** written each frame by the stage: how far the reader is through this rect */
  progress: number
}

const air = new Set<AirHandle>()

export function registerAir(handle: AirHandle): () => void {
  air.add(handle)
  return () => {
    air.delete(handle)
  }
}

export function getAir(): Set<AirHandle> {
  return air
}

/** Set once the stage is live, so a placement can drop its CSS stand-in. */
let stageOn = false
const listeners = new Set<(on: boolean) => void>()

export function setStageGL(on: boolean): void {
  stageOn = on
  listeners.forEach((l) => l(on))
}

export function onStageGL(fn: (on: boolean) => void): () => void {
  listeners.add(fn)
  fn(stageOn)
  return () => listeners.delete(fn)
}
