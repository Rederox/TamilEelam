'use client'

/**
 * Registry of every flame burning on the page.
 *
 * Each <Flame> registers the element that reserves its space; a single
 * WebGL layer then draws a real flame at each of those rectangles. One
 * context for the whole vigil instead of one per flame — browsers cap
 * live contexts at around sixteen, and the diaspora chapter alone has
 * eight flames.
 */
export interface FlameHandle {
  el: HTMLElement
  /** nominal width in CSS pixels; height is 1.6× */
  size: number
  lit: boolean
  /** stable per-flame randomness, so no two flicker alike */
  seed: number
}

const flames = new Set<FlameHandle>()
const listeners = new Set<() => void>()

export function registerFlame(handle: FlameHandle): () => void {
  flames.add(handle)
  listeners.forEach((l) => l())
  return () => {
    flames.delete(handle)
    listeners.forEach((l) => l())
  }
}

export function getFlames(): Set<FlameHandle> {
  return flames
}

/** Notified when flames appear or disappear, so the layer can resize its pool. */
export function onFlamesChanged(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** Set once the GL layer is live, so each <Flame> can hide its CSS stand-in. */
let glActive = false
const glListeners = new Set<(on: boolean) => void>()

export function setFlameGL(on: boolean): void {
  glActive = on
  glListeners.forEach((l) => l(on))
}

export function onFlameGL(fn: (on: boolean) => void): () => void {
  glListeners.add(fn)
  fn(glActive)
  return () => glListeners.delete(fn)
}
