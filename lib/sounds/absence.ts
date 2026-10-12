'use client'

/**
 * The room of the disappeared: a wall of empty frames, and mothers who wait.
 *
 * Nothing happens in it, and that is what it sounds like. The walls of a
 * still room resonate faintly at a few low pitches, and the air in it
 * breathes in and out over about a quarter of a minute. Somewhere in the
 * house an old clock ticks — a real one, slowed a little, as time is when
 * you are waiting for someone — and the room carries it.
 */

import type { Layer } from '../soundscape'

/** The room's own resonances: [hz, Q, loudness]. */
const WALLS: [number, number, number][] = [
  [188, 16, 0.5],
  [247, 20, 0.38],
  [331, 24, 0.25],
]

export const absenceLayer: Layer = {
  channel: 'absence',
  peak: 0.5,
  start(kit, out) {
    const { audio } = kit

    const walls = audio.createGain()
    walls.gain.value = 0.7
    const air = kit.loop('pink')
    for (const [hz, q, amp] of WALLS) {
      const band = audio.createBiquadFilter()
      band.type = 'bandpass'
      band.frequency.value = hz
      band.Q.value = q
      const g = audio.createGain()
      g.gain.value = amp
      air.connect(band)
      band.connect(g)
      g.connect(walls)
    }
    walls.connect(out)
    const breath = audio.createGain()
    breath.gain.value = 0.3
    kit.osc('sine', 0.07).connect(breath)
    breath.connect(walls.gain)

    // the clock is in the next room: off to one side, dull, mostly heard by its echo
    kit.sample('clock.mp3').then((buf) => {
      if (!buf || !kit.alive()) return
      const src = audio.createBufferSource()
      src.buffer = buf
      src.loop = true
      src.playbackRate.value = 0.88
      const wall = audio.createBiquadFilter()
      wall.type = 'lowpass'
      wall.frequency.value = 2400
      const g = audio.createGain()
      g.gain.value = 0.5
      const pan = kit.pan(-0.35)
      const send = audio.createGain()
      send.gain.value = 0.9
      src.connect(wall)
      wall.connect(g)
      g.connect(pan)
      pan.connect(out)
      pan.connect(send)
      send.connect(kit.room)
      src.start(audio.currentTime + 0.05, Math.random() * buf.duration)
      kit.own(src)
    })
  },
}
