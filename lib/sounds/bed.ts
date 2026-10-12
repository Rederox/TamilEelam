'use client'

/**
 * A recording that never loops audibly, and a place heard from afar.
 *
 * `bed` plays a fresh stretch of its recording, from a random point, for a
 * random length, and crossfades it into the next (equal power, so the
 * crossfade does not dip): a minute of surf becomes surf that never repeats
 * the same way twice. Starts silently whenever the file arrives.
 *
 * `distance` is a low-pass that opens as the reader comes nearer: at the
 * edge of a chapter the fire is a dull roar through walls, in its middle
 * every crackle is there. It is what makes arriving somewhere sound like
 * arriving.
 */

import type { Kit } from '../soundscape'

const rand = (a: number, b: number) => a + Math.random() * (b - a)

const FADE_IN = Float32Array.from({ length: 64 }, (_, i) => Math.sin((i / 63) * (Math.PI / 2)))
const FADE_OUT = Float32Array.from({ length: 64 }, (_, i) => Math.cos((i / 63) * (Math.PI / 2)))

interface BedOptions {
  /** loudness of the recording in the layer */
  gain?: number
  /** seconds each stretch overlaps the next */
  crossfade?: number
  /** shortest and longest stretch, in seconds */
  span?: [number, number]
}

export function bed(kit: Kit, out: AudioNode, file: string, { gain = 1, crossfade = 3, span = [14, 26] }: BedOptions = {}) {
  const { audio } = kit
  kit.sample(file).then((buf) => {
    if (!buf || !kit.alive()) return
    const fade = Math.min(crossfade, buf.duration / 4)

    const play = (when: number) => {
      const len = Math.min(buf.duration, rand(span[0], span[1]))
      const offset = Math.random() * (buf.duration - len)
      const src = audio.createBufferSource()
      src.buffer = buf
      const g = audio.createGain()
      g.gain.value = 0
      g.gain.setValueCurveAtTime(FADE_IN.map((v) => v * gain), when, fade)
      g.gain.setValueCurveAtTime(FADE_OUT.map((v) => v * gain), when + len - fade, fade)
      src.connect(g)
      g.connect(out)
      src.start(when, offset, len)
      kit.own(src)
      const next = when + len - fade
      kit.later(() => play(next), Math.max(0, (next - audio.currentTime - 1) * 1000))
    }
    play(audio.currentTime + 0.05)
  })
}

/** A low-pass that follows the reader in: `near(level)` sets it, `node` goes in the chain. */
export function distance(kit: Kit, far = 500, close = 18000) {
  const node = kit.audio.createBiquadFilter()
  node.type = 'lowpass'
  node.Q.value = 0.5
  node.frequency.value = far
  const ratio = close / far
  return {
    node,
    near(level: number) {
      node.frequency.value = far * Math.pow(ratio, Math.min(1, level))
    },
  }
}

/** One stretch of a recording, faded in and out: a call, a shot, a strike. */
export function excerpt(
  kit: Kit,
  out: AudioNode,
  buf: AudioBuffer,
  { from, length, gain = 1, fadeIn = 0.02, fadeOut = 0.5, rate = 1, when = kit.audio.currentTime + 0.02 }: {
    from: number
    length: number
    gain?: number
    fadeIn?: number
    fadeOut?: number
    rate?: number
    when?: number
  }
) {
  const { audio } = kit
  const len = Math.min(length, buf.duration - from)
  const real = len / rate
  const src = audio.createBufferSource()
  src.buffer = buf
  src.playbackRate.value = rate
  const g = audio.createGain()
  g.gain.setValueAtTime(0, when)
  g.gain.linearRampToValueAtTime(gain, when + fadeIn)
  g.gain.setValueAtTime(gain, when + Math.max(fadeIn, real - fadeOut))
  g.gain.linearRampToValueAtTime(0, when + real)
  src.connect(g)
  g.connect(out)
  src.start(when, from, len)
  kit.own(src)
}
