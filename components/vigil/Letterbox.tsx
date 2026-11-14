'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * The frame narrows to scope for a title.
 *
 * Two black bars close in from the top and bottom edges while a chapter's
 * title card holds the middle of the screen, and open
 * again once the reader is in the body of the chapter. The bars themselves
 * are the ::before / ::after of this one element (.letterbox in globals.css).
 *
 * The answer lives in state here and on this element's own data attribute,
 * never on <html>: an observer callback fires twice per title card, not per
 * frame, and what it restyles is two bars.
 */
export default function Letterbox() {
  const stillness = useReducedMotion()
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    if (stillness) return
    const held = new Set<Element>()
    // the root is squeezed to the middle tenth of the viewport, so
    // "intersecting" reads as "this card is what the reader is looking at"
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) held.add(e.target)
          else held.delete(e.target)
        }
        setClosed(held.size > 0)
      },
      { rootMargin: '-45% 0px -45% 0px' }
    )
    // title cards only: the epilogue's lamp button sits where the lower bar would close
    document.querySelectorAll('[data-chapter-open]').forEach((el) => io.observe(el))
    return () => {
      io.disconnect()
      setClosed(false)
    }
  }, [stillness])

  // quiet reading and reduced motion read the page as a page, not a film
  if (stillness) return null
  return <div aria-hidden="true" data-closed={closed} className="letterbox" />
}
