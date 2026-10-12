'use client'

/**
 * A drone the reader has to ask for.
 *
 * Two low, close-tuned tones beat softly against each other — the beating
 * itself reads as a slow pulse, so there is no separate LFO to reason
 * about. They are triangles, not sines: a 54 Hz sine is below what a laptop
 * speaker can play, while the first odd harmonics of a triangle are not.
 * Its only input is the same ordeal signal the vignette and the grain
 * already read (see lib/ordeal.ts): the drone breathes with whichever
 * chapter is heaviest, opens up as it gets heavier, and falls silent the
 * moment nothing is.
 *
 * Never starts itself. Every browser refuses to make sound before a user
 * gesture, and a vigil for the dead should refuse to as well.
 *
 * The places (lib/soundscape.ts — the fire, the sea, the dawn…) ride on the
 * same context and the same toggle: one gesture, one ambience.
 */

import { getOrdeal, onOrdeal } from './ordeal'
import { startSoundscape, stopSoundscape, type Layer } from './soundscape'
import { absenceLayer } from './sounds/absence'
import { dawnLayer } from './sounds/dawn'
import { fireLayer } from './sounds/fire'
import { lampLayer } from './sounds/lamp'
import { landLayer } from './sounds/land'
import { seaLayer, shellsLayer } from './sounds/sea'

/** every place that has a sound, each silent until the reader is there */
const LAYERS: Layer[] = [landLayer, fireLayer, shellsLayer, seaLayer, absenceLayer, dawnLayer, lampLayer]

type LegacyWindow = Window & { webkitAudioContext?: typeof AudioContext }

let ctx: AudioContext | null = null
let master: GainNode | null = null
let oscillators: OscillatorNode[] = []
let raf = 0
let unsubscribe: (() => void) | null = null
let level = 0
let target = 0

/** Two tones this close beat roughly once a second — a heartbeat, not a note. */
const BASE_HZ = 54
const DETUNE_HZ = 1.1
const FLOOR = 0.003
const PEAK = 0.05
/** the drone's low-pass, at rest and at the worst of it */
const LOW = 200
const HIGH = 420

export function isOrdealAudioAvailable(): boolean {
  if (typeof window === 'undefined') return false
  return !!(window.AudioContext || (window as LegacyWindow).webkitAudioContext)
}

export function isOrdealAudioRunning(): boolean {
  return ctx !== null
}

/** Must be called from inside a user gesture (a click), or the browser refuses it. */
export async function startOrdealAudio(): Promise<void> {
  if (ctx || typeof window === 'undefined') return
  const Ctor = window.AudioContext || (window as LegacyWindow).webkitAudioContext
  if (!Ctor) throw new Error('Audio unavailable')

  const audio = new Ctor()
  ctx = audio
  try { await audio.resume() } catch (error) { stopOrdealAudio(); throw error }
  if (ctx !== audio) return

  const kit = startSoundscape(audio, LAYERS)

  const filter = audio.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = LOW

  const gain = audio.createGain()
  gain.gain.value = FLOOR
  master = gain

  oscillators = [BASE_HZ, BASE_HZ + DETUNE_HZ].map((hz) => {
    const osc = audio.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = hz
    osc.connect(filter)
    osc.start()
    return osc
  })

  filter.connect(gain)
  gain.connect(kit.out)

  target = getOrdeal()
  level = target
  unsubscribe = onOrdeal((v) => {
    target = v
  })

  const tick = () => {
    if (!master) return
    level += (target - level) * 0.05
    master.gain.value = FLOOR + level * (PEAK - FLOOR)
    // the heavier the moment, the more of the drone's upper body comes through
    filter.frequency.value = LOW + level * (HIGH - LOW)
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
}

export function stopOrdealAudio(): void {
  if (!ctx) return
  stopSoundscape()
  const audio = ctx
  const dying = oscillators
  ctx = null
  oscillators = []
  if (raf) cancelAnimationFrame(raf)
  raf = 0
  unsubscribe?.()
  unsubscribe = null

  const gain = master
  master = null
  if (gain) {
    const now = audio.currentTime
    gain.gain.cancelScheduledValues(now)
    gain.gain.setValueAtTime(gain.gain.value, now)
    gain.gain.linearRampToValueAtTime(0, now + 0.5)
  }
  // let the fade finish before tearing the graph down under it
  window.setTimeout(() => {
    dying.forEach((o) => {
      try {
        o.stop()
      } catch {
        /* already stopped */
      }
    })
    audio.close().catch(() => {})
  }, 600)
}
