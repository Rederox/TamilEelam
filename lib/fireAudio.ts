'use client'

/**
 * The fire, heard.
 *
 * A crackle is not a tone. It is paper and timber giving way: hundreds of
 * small snaps, each one a burst of band-passed noise with an instant
 * attack and a quick die-off, at no fixed rhythm, over the low roar of the
 * draught the fire makes for itself. Both follow the `fire` presence
 * signal (lib/presence.ts): silent until the reader is at the library,
 * gone again once they have left it.
 *
 * It borrows the ambient toggle's AudioContext and lives and dies with it,
 * so it can never start unasked.
 */

import { getPresence, onPresence } from './presence'

let ctx: AudioContext | null = null
let master: GainNode | null = null
let roar: AudioBufferSourceNode | null = null
let snapBuffer: AudioBuffer | null = null
let timer = 0
let raf = 0
let unsubscribe: (() => void) | null = null
let level = 0
let target = 0

/** loud enough to be heard under the drone, never over the reader's thoughts */
const PEAK = 0.22
/** snaps per second at the heart of the fire, and at its far edge */
const RATE_NEAR = 26
const RATE_FAR = 3

function whiteNoise(audio: AudioContext, seconds: number): AudioBuffer {
  const buf = audio.createBuffer(1, Math.ceil(audio.sampleRate * seconds), audio.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  return buf
}

/** Brown noise: white noise integrated, which is what a draught sounds like. */
function brownNoise(audio: AudioContext, seconds: number): AudioBuffer {
  const buf = audio.createBuffer(1, Math.ceil(audio.sampleRate * seconds), audio.sampleRate)
  const d = buf.getChannelData(0)
  let last = 0
  for (let i = 0; i < d.length; i++) {
    const white = Math.random() * 2 - 1
    last = (last + 0.02 * white) / 1.02
    d[i] = last * 3.5
  }
  return buf
}

/** One snap: a sliver of noise through a narrow band, gone in a few dozen ms. */
function snap(audio: AudioContext, dest: AudioNode) {
  if (!snapBuffer) return
  const when = audio.currentTime + 0.005
  const src = audio.createBufferSource()
  src.buffer = snapBuffer

  const band = audio.createBiquadFilter()
  band.type = 'bandpass'
  // most snaps are small and high; the odd one is a beam, low and heavy
  const heavy = Math.random() < 0.08
  band.frequency.value = heavy ? 180 + Math.random() * 300 : 1100 + Math.random() * 4200
  band.Q.value = heavy ? 2 : 3 + Math.random() * 7

  const gain = audio.createGain()
  const r = Math.random()
  const amp = (heavy ? 0.9 : 0.15 + r * r * 0.85) * (0.6 + 0.4 * level)
  const dur = heavy ? 0.09 + Math.random() * 0.12 : 0.012 + Math.random() * 0.06
  gain.gain.setValueAtTime(0, when)
  gain.gain.linearRampToValueAtTime(amp, when + 0.002)
  gain.gain.exponentialRampToValueAtTime(0.0004, when + dur)

  src.connect(band)
  band.connect(gain)
  gain.connect(dest)
  src.start(when, Math.random() * (snapBuffer.duration - 0.3))
  src.stop(when + dur + 0.03)
}

/** Snaps arrive at random, more often the nearer the fire: a Poisson process. */
function schedule() {
  if (!ctx || !master) return
  const audio = ctx
  const dest = master
  const rate = RATE_FAR + level * (RATE_NEAR - RATE_FAR)
  const gap = -Math.log(1 - Math.random()) / rate
  timer = window.setTimeout(() => {
    if (level > 0.02) snap(audio, dest)
    schedule()
  }, gap * 1000)
}

/** Called by the ambient toggle once its context is running. */
export function startFireAudio(audio: AudioContext): void {
  if (ctx) return
  ctx = audio

  const gain = audio.createGain()
  gain.gain.value = 0
  gain.connect(audio.destination)
  master = gain

  snapBuffer = whiteNoise(audio, 1.5)

  // the roar: brown noise, low-passed, swelling and falling with its own breath
  const src = audio.createBufferSource()
  src.buffer = brownNoise(audio, 4)
  src.loop = true
  const low = audio.createBiquadFilter()
  low.type = 'lowpass'
  low.frequency.value = 160
  const roarGain = audio.createGain()
  roarGain.gain.value = 0.5
  const breath = audio.createOscillator()
  breath.type = 'sine'
  breath.frequency.value = 0.17
  const breathDepth = audio.createGain()
  breathDepth.gain.value = 0.22
  breath.connect(breathDepth)
  breathDepth.connect(roarGain.gain)
  src.connect(low)
  low.connect(roarGain)
  roarGain.connect(gain)
  src.start()
  breath.start()
  roar = src

  target = getPresence('fire')
  level = target
  unsubscribe = onPresence('fire', (v) => {
    target = v
  })

  const tick = () => {
    if (!master) return
    level += (target - level) * 0.04
    master.gain.value = level * PEAK
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
  schedule()
}

export function stopFireAudio(): void {
  if (!ctx) return
  const audio = ctx
  const dying = roar
  ctx = null
  roar = null
  snapBuffer = null
  window.clearTimeout(timer)
  timer = 0
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
  window.setTimeout(() => {
    try {
      dying?.stop()
    } catch {
      /* already stopped */
    }
    gain?.disconnect()
  }, 550)
}
