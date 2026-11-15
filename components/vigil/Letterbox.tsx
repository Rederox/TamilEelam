'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { scrollBehavior } from '@/lib/motion'

// The page moves when the frame is black, not when a clock says it should be:
// on a slow phone the fade can start late, and a timer would then jump under
// a veil still half open. DIP only stands in if that moment is never
// announced. HOLD is how long the black stays over the page that has just
// moved; LIMIT is the hour at which the black lifts whatever else happened.
const DIP = 500
const HOLD = 240
const LIMIT = 2000
let pending: number[] = []
let land: ((e?: Event) => void) | null = null

function arrive(target: HTMLElement, behavior: ScrollBehavior) {
  target.scrollIntoView({ behavior })
  // a link would carry the keyboard with it; a cut has to do it by hand. The
  // chapter's title takes the focus, so a screen reader says where this is
  // and the next Tab goes into the chapter instead of back to the rail.
  const title = document.getElementById(`${target.id}-title`) ?? target
  if (!title.hasAttribute('tabindex')) {
    title.tabIndex = -1
    title.style.outline = 'none' // a place, not a control: no ring around a whole title
  }
  title.focus({ preventScroll: true })
}

/**
 * A cut through black, for every jump the reader asks for (the rail, J/K, a
 * link to another chapter). Scrolling there would drag thousands of pixels of
 * other chapters across the screen; instead the frame dips to black, the page
 * moves at once underneath, and the destination comes up out of the dark with
 * its own title already rising.
 *
 * Where there is no film frame (quiet reading, reduced motion, the paper
 * theme, print) nothing dips: the page goes there as it always did.
 */
export function cutTo(target: HTMLElement) {
  const frame = document.querySelector<HTMLElement>('.letterbox')
  if (!frame || getComputedStyle(frame).display === 'none') {
    arrive(target, scrollBehavior())
    return
  }
  const dip = frame.firstElementChild
  pending.forEach(clearTimeout)
  if (land) dip?.removeEventListener('transitionend', land)
  const lift = () => delete frame.dataset.cut
  let landed = false
  const here = (e?: Event) => {
    if (landed || (e && (e as TransitionEvent).propertyName !== 'opacity')) return
    landed = true
    dip?.removeEventListener('transitionend', here)
    // armed before the jump, not after: if the jump throws, the black still lifts
    pending.push(window.setTimeout(lift, HOLD))
    arrive(target, 'instant')
  }
  land = here
  frame.dataset.cut = 'true'
  dip?.addEventListener('transitionend', here)
  pending = [window.setTimeout(here, DIP), window.setTimeout(lift, LIMIT)]
}

/**
 * The frame narrows to scope for a title.
 *
 * Two black bars close in from the top and bottom edges while a chapter's
 * title card holds the middle of the screen, and open
 * again once the reader is in the body of the chapter. The bars themselves
 * are the ::before / ::after of this one element (.letterbox in globals.css).
 * The same frame goes fully black for a moment when the reader jumps to
 * another chapter (cutTo, below): one film-frame layer, not two.
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

    // Links inside the page stay plain href="#id" in the HTML, and work
    // without any of this. Here they become cuts. React's own handlers have
    // already run by the time the click reaches the document: a link that
    // has dealt with itself is left alone.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const hash = (e.target as Element).closest?.('a[href^="#"]')?.getAttribute('href')
      const target = hash && hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
      if (!target) return
      e.preventDefault()
      // what the link would have done: the address says where the reader is
      history.pushState(null, '', hash)
      cutTo(target)
    }
    document.addEventListener('click', onClick)
    return () => {
      io.disconnect()
      document.removeEventListener('click', onClick)
      setClosed(false)
    }
  }, [stillness])

  // quiet reading and reduced motion read the page as a page, not a film
  if (stillness) return null
  return (
    <div aria-hidden="true" data-closed={closed} className="letterbox">
      {/* the black a cut goes through; cutTo sets data-cut on the frame */}
      <span className="letterbox-dip" />
    </div>
  )
}
