'use client'

/**
 * The lighting of a lamp: a match taken to the wick, and a bell, as at any
 * lighting of a lamp. The bell is a real ghanta, a brass ritual bell, struck
 * once; the flare of the match is made.
 */

import { playOnce } from '../soundscape'
import { excerpt } from './bed'

/** Silent unless the ambience is on. */
export function lightLamp(): void {
  playOnce((kit, out) => {
    const { audio } = kit
    const t = audio.currentTime + 0.01

    const flare = audio.createBufferSource()
    flare.buffer = kit.noise('white')
    const band = audio.createBiquadFilter()
    band.type = 'bandpass'
    band.Q.value = 0.9
    band.frequency.setValueAtTime(2600, t)
    band.frequency.exponentialRampToValueAtTime(900, t + 0.6)
    const g = audio.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.15, t + 0.07)
    g.gain.exponentialRampToValueAtTime(0.0004, t + 0.6)
    flare.connect(band)
    band.connect(g)
    g.connect(out)
    flare.start(t, Math.random() * 3)
    flare.stop(t + 0.65)

    // one strike of the ghanta, left to ring out, a little of it in the room
    const room = audio.createGain()
    room.gain.value = 0.5
    room.connect(kit.room)
    const ring = audio.createGain()
    ring.connect(out)
    ring.connect(room)
    kit.sample('bell.mp3').then((buf) => {
      if (buf && kit.alive()) excerpt(kit, ring, buf, { from: 0.05, length: 3.6, gain: 1.4, fadeIn: 0.005, fadeOut: 1.4, when: Math.max(t + 0.26, audio.currentTime + 0.02) })
    })
  })
}
