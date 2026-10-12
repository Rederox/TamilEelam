'use client'

/**
 * The visitor's own lamp: an oil wick, which barely speaks.
 *
 * Too quiet to record against a room's noise, so it is made: a soft breath
 * of noise in the middle of the range that flutters as the flame leans,
 * and now and then a tiny tick of oil.
 */

import type { Layer } from '../soundscape'

export const lampLayer: Layer = {
  channel: 'lamp',
  peak: 0.8,
  start(kit, out, level) {
    const { audio } = kit

    const band = audio.createBiquadFilter()
    band.type = 'bandpass'
    band.frequency.value = 650
    band.Q.value = 0.6
    const breath = audio.createGain()
    breath.gain.value = 0.05
    kit.loop('pink').connect(band)
    band.connect(breath)
    breath.connect(out)

    kit.poisson(
      () => 3,
      () => breath.gain.setTargetAtTime(0.02 + Math.random() * 0.07, audio.currentTime, 0.12)
    )

    // the oil: a sliver of noise through a narrow band, gone in a few milliseconds
    kit.poisson(
      () => (level() > 0.05 ? 0.5 : 0),
      () => {
        const when = audio.currentTime + 0.01
        const src = audio.createBufferSource()
        src.buffer = kit.noise('white')
        const ring = audio.createBiquadFilter()
        ring.type = 'bandpass'
        ring.frequency.value = 1800 + Math.random() * 3000
        ring.Q.value = 6
        const g = audio.createGain()
        g.gain.setValueAtTime(0, when)
        g.gain.linearRampToValueAtTime(0.08 + Math.random() * 0.1, when + 0.002)
        g.gain.exponentialRampToValueAtTime(0.0004, when + 0.02 + Math.random() * 0.03)
        src.connect(ring)
        ring.connect(g)
        g.connect(out)
        src.start(when, Math.random() * 3)
        src.stop(when + 0.06)
      }
    )
  },
}
