'use client'

/**
 * The coast at Mullivaikkal: the sea, and what was heard over it.
 *
 * The sea is a recording of surf on a tropical shore, heard through
 * `distance`: from the top of the chapter it is a low, far wash, and it
 * opens out as the reader goes down to the water.
 *
 * The shells are real artillery, recorded at a demonstration, and only ever
 * heard from very far: their highs taken away by the distance, a weight
 * under them that a phone speaker cannot play but a body feels on
 * headphones, a long tail in the room, and the dunes sending it back once.
 * Never a close sound: the page is a vigil, not a reconstruction.
 */

import type { Kit, Layer } from '../soundscape'
import { bed, distance, excerpt } from './bed'

const rand = (a: number, b: number) => a + Math.random() * (b - a)

export const seaLayer: Layer = {
  channel: 'sea',
  peak: 0.85,
  start(kit, out) {
    const far = distance(kit, 350)
    far.node.connect(out)
    bed(kit, far.node, 'sea.mp3', { crossfade: 4, span: [18, 30] })
    return far.near
  },
}

/** Where each shot starts in shells.mp3, in seconds. */
const SHOTS = [0.85, 9.25, 12.85]

/** One shot, far off. `echo` lets the dunes answer it once. */
function shot(kit: Kit, out: AudioNode, buf: AudioBuffer, echo: boolean, scale = 1) {
  const { audio } = kit
  const t = audio.currentTime + 0.02
  const near = rand(0.4, 1) // 1 is as near as it ever comes
  const pan = kit.pan(rand(-0.8, 0.8))
  const send = audio.createGain()
  send.gain.value = 1
  pan.connect(out)
  pan.connect(send)
  send.connect(kit.room)

  // the air between: the farther, the less of the crack survives
  const damp = audio.createBiquadFilter()
  damp.type = 'lowpass'
  damp.Q.value = 0.6
  damp.frequency.value = 350 + 650 * near
  damp.connect(pan)
  excerpt(kit, damp, buf, {
    from: SHOTS[Math.floor(Math.random() * SHOTS.length)],
    length: 2.2,
    gain: 1.6 * near * scale,
    fadeIn: 0.005,
    fadeOut: 1.2,
    // a slightly slower playback is a slightly larger gun, slightly farther
    rate: rand(0.78, 0.95),
    when: t,
  })

  // the pressure: a sine falling through the floor of hearing
  const thump = audio.createOscillator()
  thump.frequency.setValueAtTime(30 + 50 * near, t)
  thump.frequency.exponentialRampToValueAtTime(26, t + 0.6)
  const tg = audio.createGain()
  tg.gain.setValueAtTime(0, t)
  tg.gain.linearRampToValueAtTime(0.35 * near * scale, t + 0.015)
  tg.gain.exponentialRampToValueAtTime(0.001, t + 0.9)
  thump.connect(tg)
  tg.connect(pan)
  thump.start(t)
  thump.stop(t + 1)

  if (echo) kit.later(() => shot(kit, out, buf, false, 0.3), rand(400, 900))
}

export const shellsLayer: Layer = {
  channel: 'shells',
  peak: 0.4,
  start(kit, out, level) {
    let buf: AudioBuffer | null = null
    kit.sample('shells.mp3').then((b) => (buf = b))
    kit.poisson(
      () => (buf && level() > 0.05 ? 0.08 + 0.25 * level() : 0),
      () => {
        if (buf) shot(kit, out, buf, Math.random() < 0.6)
      }
    )
  },
}
