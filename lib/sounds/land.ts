'use client'

/**
 * The old kingdom, before the war: open ground, wind moving through the
 * trees, and under it, the high shimmer of crickets in the dry grass.
 * Both recorded; the wind opens up as the reader comes in.
 */

import type { Layer } from '../soundscape'
import { bed, distance } from './bed'

export const landLayer: Layer = {
  channel: 'land',
  peak: 0.75,
  start(kit, out) {
    const far = distance(kit, 900)
    far.node.connect(out)
    bed(kit, far.node, 'wind.mp3')

    const insects = kit.audio.createGain()
    insects.gain.value = 0.22
    insects.connect(far.node)
    bed(kit, insects, 'crickets.mp3', { crossfade: 4 })
    return far.near
  },
}
