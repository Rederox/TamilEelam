'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './Prologue.module.css'

/** A symbolic empty threshold, never presented as a documentary image. */
export default function EmptyHome({ caption }: { caption: string }) {
  const ref = useRef<HTMLElement>(null)
  const still = useReducedMotion()
  useEffect(() => {
    const node = ref.current
    if (!node) return
    let visible = false
    const update = () => { node.dataset.running = String(visible && !document.hidden) }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() })
    observer.observe(node)
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [])

  return (
    <figure ref={ref} className={styles.scene} data-still={still}>
      <div className={styles.imageWindow}>
        <Image data-opening-image src="/images/prologue/empty-home-landscape.webp" alt="" width={1672} height={941}
          priority sizes="(min-width: 1560px) 1280px, 90vw" className={styles.photograph} />
      </div>
      <figcaption className="mt-1 text-right font-mono text-[8px] uppercase leading-relaxed tracking-[0.16em] text-ash">{caption}</figcaption>
    </figure>
  )
}
