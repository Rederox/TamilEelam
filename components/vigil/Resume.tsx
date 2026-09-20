'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/context/LanguageContext'
import { chapters } from '@/data/narrative'
import { scrollBehavior } from '@/lib/motion'

const KEY = 'vigil-progress'

/**
 * A returning reader is offered their place back.
 *
 * The vigil is eleven chapters long and Mullivaikkal alone runs seven
 * screens; starting over every visit is a real cost. But this only ever
 * offers — it never moves anyone. Dropping a visitor into the middle of a
 * massacre because a previous session ended there would be the opposite of
 * what this site is for.
 */
export default function Resume() {
  const { t, lang } = useLang()
  const [at, setAt] = useState<(typeof chapters)[number] | null>(null)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    // only at the top: further down, the reader has already chosen their place
    if (window.scrollY > 200) return
    let stored: string | null = null
    try {
      stored = localStorage.getItem(KEY)
    } catch {
      return
    }
    if (!stored || stored === 'prologue') return
    const chapter = chapters.find((c) => c.id === stored)
    if (chapter) setAt(chapter)
  }, [])

  // scrolling away is itself an answer
  useEffect(() => {
    if (!at || leaving) return
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.8) setLeaving(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [at, leaving])

  // one timer for the fade, owned by the state that started it
  useEffect(() => {
    if (!leaving) return
    const id = window.setTimeout(() => setAt(null), 400)
    return () => window.clearTimeout(id)
  }, [leaving])

  const dismiss = () => setLeaving(true)

  if (!at) return null

  return (
    <div
      className={`fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-[86] max-w-[min(20rem,calc(100vw-2.5rem))] border border-bone/20 bg-night/85 px-4 py-3.5 backdrop-blur-md transition-[opacity,transform] duration-[400ms] ease-vigil sm:right-7 ${
        leaving ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-ash-dim">{t('ui-resume-label')}</p>
      <p className="mt-1.5 font-display text-[17px] italic leading-tight text-bone">
        {at.num} <span className="lang-title">{at.title[lang]}</span>
      </p>
      <div className="mt-3 flex items-center gap-4">
        <button
          type="button"
          onClick={() => {
            document.getElementById(at.id)?.scrollIntoView({ behavior: scrollBehavior() })
            dismiss()
          }}
          className="min-h-[36px] border-b border-flame/50 font-mono text-[10px] uppercase tracking-[0.2em] text-flame transition-colors hover:border-flame"
        >
          {t('ui-resume')}
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="min-h-[36px] font-mono text-[10px] uppercase tracking-[0.2em] text-ash transition-colors hover:text-bone"
        >
          {t('ui-from-start')}
        </button>
      </div>
    </div>
  )
}
