'use client'

import GlKaarthigai from './gl/GlKaarthigai'

/**
 * கார்த்திகைப் பூ — the glory lily, opening the vigil.
 *
 * The flower of Maaveerar Naal: it comes into bloom in November, and its
 * petals stand like flames, which is why it is the flower carried on that
 * day. Opening on it rather than on a lamp means the vigil's first fire is
 * a living thing.
 *
 * Without WebGL, without JS, or under reduced motion nothing is drawn here.
 * The chapter's own text carries it, exactly as the other GL layers degrade.
 */
export default function Kaarthigai({
  /** width in px; the flower is a little taller than it is wide */
  size = 260,
  className = '',
}: {
  size?: number
  className?: string
}) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size * 1.06 }}>
      <GlKaarthigai />
    </div>
  )
}
