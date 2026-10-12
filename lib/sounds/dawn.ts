'use client'

/**
 * Dawn: the day after, as it comes up over the diaspora and the long search.
 *
 * A forest in Tamil Nadu at first light, recorded. Now and then over it the
 * koel, *kuyil*, every Tamil morning's voice, calling in rising pairs from
 * one side or the other; and far off, a temple where a bell is being rung
 * for the morning puja.
 */

import type { Kit, Layer } from '../soundscape'
import { bed, distance, excerpt } from './bed'

const rand = (a: number, b: number) => a + Math.random() * (b - a)

/** A recording somewhere around the reader: panned, a little of it in the room. */
function placed(kit: Kit, out: AudioNode, pan: number, room: number) {
  const p = kit.pan(pan)
  const send = kit.audio.createGain()
  send.gain.value = room
  p.connect(out)
  p.connect(send)
  send.connect(kit.room)
  return p
}

export const dawnLayer: Layer = {
  channel: 'dawn',
  peak: 0.7,
  start(kit, out, level) {
    const { audio } = kit
    const far = distance(kit, 1200)
    far.node.connect(out)
    bed(kit, far.node, 'birds.mp3', { crossfade: 4, span: [20, 32] })

    // the koel: a run of calls, from wherever it is perched this time
    const koel = () => {
      kit.sample('koel.mp3').then((buf) => {
        if (buf && level() > 0.2) {
          const length = rand(6, 11)
          excerpt(kit, placed(kit, far.node, rand(-0.7, 0.7), 0.25), buf, {
            from: rand(0, buf.duration - length),
            length,
            gain: rand(0.35, 0.6),
            fadeIn: 0.4,
            fadeOut: 1.2,
          })
        }
        kit.later(koel, rand(22000, 40000))
      })
    }
    kit.later(koel, rand(3000, 7000))

    // the temple: far enough that only the ring of the bell carries
    const temple = audio.createBiquadFilter()
    temple.type = 'lowpass'
    temple.frequency.value = 3200
    temple.connect(placed(kit, far.node, rand(-0.4, 0.4), 0.9))
    const puja = () => {
      kit.sample('bell.mp3').then((buf) => {
        if (buf && level() > 0.3) {
          excerpt(kit, temple, buf, { from: 0, length: buf.duration, gain: 0.2, fadeIn: 0.01, fadeOut: 2 })
        }
        kit.later(puja, rand(45000, 75000))
      })
    }
    kit.later(puja, rand(9000, 16000))

    return far.near
  },
}
