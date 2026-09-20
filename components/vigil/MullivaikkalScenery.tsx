'use client'

import type { CSSProperties } from 'react'
import MemorialLamp from './MemorialLamp'
import KanjiBowl from './KanjiBowl'
import styles from './MullivaikkalScenery.module.css'

/** Restrained memorial objects above the coastal landscape. */
export default function MullivaikkalScenery({ active }: { active: number }) {
  const shore = active <= 2
  const bowl = active === 4 || active === 9
  return (
    <div className={styles.world} data-scene={active} aria-hidden="true">
      <div className={styles.haze} />
      <div className={styles.memories} style={{ opacity: shore || bowl ? 0 : active === 5 ? 0.25 : 0.8 }}>
        {Array.from({ length: 32 }, (_, i) => <i key={i} className={styles.memory} style={{ left: `${12 + ((i * 37) % 76)}%`, top: `${12 + ((i * 23) % 72)}%`, '--delay': `${-i * 0.73}s`, '--duration': `${5 + (i % 5)}s` } as CSSProperties} />)}
      </div>
      <div className={styles.object} style={{ opacity: bowl ? 1 : 0, transform: `translateY(${bowl ? 0 : 16}px)` }}><KanjiBowl size={260} /></div>
      <div className={styles.object} style={{ opacity: !shore && !bowl ? 1 : 0 }}>{!shore && !bowl && <MemorialLamp />}</div>
      <span className={styles.place}>முள்ளிவாய்க்கால்</span>
    </div>
  )
}
