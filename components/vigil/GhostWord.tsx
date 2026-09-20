'use client'

import { useEffect, useRef, type CSSProperties } from 'react'

/** Grapheme clusters, so Tamil vowel signs count with the letter they modify. */
function clusterCount(text: string): number {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    return Array.from(
      new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text)
    ).length
  }
  return Array.from(text).length
}

/**
 * The Tamil word standing behind a chapter.
 *
 * Long words like முள்ளிவாய்க்கால் are several times wider than short ones at
 * the same size, so a fixed `vw` size either dwarfs the short words or runs the
 * long ones off both edges. The cluster count gives a first size for the server
 * render, then the real width is measured and the size trimmed so the whole
 * word always fits on screen.
 */
export default function GhostWord({
  word,
  className = '',
  style,
  /** share of the viewport width the word may span */
  fill = 0.92,
  minPx = 34,
  maxPx = 230,
}: {
  word: string
  className?: string
  style?: CSSProperties
  fill?: number
  minPx?: number
  maxPx?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)

  // measured: a Tamil cluster in this face advances up to ~1.35em
  const n = Math.max(clusterCount(word), 1)
  const initial = `clamp(${minPx}px, ${((fill * 100) / (n * 1.35)).toFixed(1)}vw, ${maxPx}px)`

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const fit = () => {
      el.style.fontSize = initial
      const available = window.innerWidth * fill
      const width = el.scrollWidth
      if (width > available) {
        // text width is linear in font size, so one correction is exact
        const current = parseFloat(getComputedStyle(el).fontSize)
        el.style.fontSize = `${Math.max(current * (available / width), 12)}px`
      }
    }

    // fit() forces layout twice. There is one of these behind every chapter,
    // so a raw resize listener would thrash layout a couple of dozen times
    // per drag of the window edge.
    let raf = 0
    const onResize = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        fit()
      })
    }

    let mounted = true
    fit()
    document.fonts.ready.then(() => { if (mounted) onResize() })
    window.addEventListener('resize', onResize)
    return () => {
      mounted = false
      window.removeEventListener('resize', onResize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [initial, fill])

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`ghost-word pointer-events-none select-none whitespace-nowrap font-tamil font-bold leading-none text-transparent ${className}`}
      style={{ fontSize: initial, ...style }}
    >
      {word}
    </span>
  )
}
