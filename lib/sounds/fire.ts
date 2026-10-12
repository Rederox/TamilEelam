'use client'

/**
 * Fire, heard — the library burning, and the city in July.
 *
 * A real fire, recorded: a large one, timber and draught, every crack and
 * collapse in it its own. Heard through `distance`, so at the edge of the
 * chapter it is a dull roar beyond the walls and only in the middle of it
 * does each crackle come through. In July the fires are streets away: the
 * chapter writes a lower presence, and the same filter keeps them muffled.
 */

import type { Layer } from '../soundscape'
import { bed, distance } from './bed'

export const fireLayer: Layer = {
  channel: 'fire',
  peak: 0.65,
  start(kit, out) {
    const far = distance(kit, 450)
    far.node.connect(out)
    // a little of the fire in the room, as if from inside the reading hall
    const send = kit.audio.createGain()
    send.gain.value = 0.12
    far.node.connect(send)
    send.connect(kit.room)
    bed(kit, far.node, 'fire.mp3')
    return far.near
  },
}
