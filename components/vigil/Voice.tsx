'use client'

import { Fragment, type ReactNode, type RefObject } from 'react'
import { useReveal } from '@/hooks/useReveal'

// The pace of the voice, in milliseconds. Inside a phrase the words follow
// one another closely enough to rise as one breath; the time is spent at the
// punctuation, where a narrator would spend it.
const STEP = 45
const BREATH = 320 // a comma, a dash: the phrase is not over
const REST = 1100 // a full stop: the sentence lands, and the next one waits a little longer than is comfortable

// shortcut: any word ending in a full stop rests, so an abbreviation ("ஐ.நா.")
// holds like the end of a sentence; give the statement explicit beats if one
// ever needs to be said through.
const lands = /[.!?…]["'»”’)\]]*$/
const breathes = /[,;:—–]["'»”’)\]]*$/

type Tag = 'p' | 'h2' | 'h3' | 'h4' | 'span' | 'div'

/**
 * A statement that is said, not shown: it arrives phrase by phrase, with a
 * held beat at each punctuation mark, the first time it comes on screen.
 *
 * The whole sentence is in the server HTML, in order, as plain words. It is
 * split on spaces and nowhere else, so the markup is the same string
 * operation on the server and in the browser, a Tamil word is never cut
 * inside a syllable, and a non-breaking space keeps what it holds together
 * (« 97 000 », « quoi ? ») in one piece. Each word only carries when it
 * starts (--d); the arrival itself is the .reveal / .in of useReveal, on the
 * inner span, so this is the same reveal as everywhere else and without
 * JavaScript nothing is ever hidden (.spoken in globals.css).
 *
 * For display sentences only: reading prose is never animated word by word.
 */
export function Spoken({ text, as = 'p', className = '', id }: { text: string; as?: Tag; className?: string; id?: string }) {
  const ref = useReveal()
  const Tag = as as 'p'
  let at = 0
  return (
    <Tag ref={ref as RefObject<HTMLParagraphElement>} id={id} className={`spoken ${className}`}>
      <span className="reveal">
        {text.split(' ').map((word, i, words) => {
          const d = at
          at += STEP + (lands.test(word) ? REST : breathes.test(word) ? BREATH : 0)
          return (
            <Fragment key={i}>
              <span className="w" style={{ ['--d' as string]: d }}>{word}</span>
              {i < words.length - 1 && ' '}
            </Fragment>
          )
        })}
      </span>
    </Tag>
  )
}

/**
 * The ground a memorial figure stands on. Inside it, the digits carry
 * `reveal fig-n` and the line under them `reveal fig-l`: the number is there
 * from the first frame, dim, and comes up slowly as one block; its label
 * follows a beat later; then it holds. Nothing counts: the characters on
 * screen are the final ones at every moment (.fig-n / .fig-l in globals.css).
 *
 * It only arms the reveal for what it contains, so a figure weighs the same
 * in a chapter that has no useReveal of its own.
 */
export function Weighed({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useReveal()
  return <div ref={ref as RefObject<HTMLDivElement>} className={className}>{children}</div>
}
