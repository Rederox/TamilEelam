'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useLang } from '@/context/LanguageContext'
import { chapters } from '@/data/narrative'
import { useScrollProgress } from '@/hooks/useSceneProgress'
import { scrollBehavior } from '@/lib/motion'

/**
 * The thread of light.
 * Desktop: vertical golden rail on the left with one stop per chapter.
 * Mobile: thin progress bar on top + a chapter pill at the bottom that
 * opens a full navigation overlay.
 */
export default function ProgressRail() {
  const { lang, t } = useLang()
  const progress = useScrollProgress()
  const [active, setActive] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const sections = [...chapters.map((c) => c.id), 'prologue', 'epilogue', 'sources']
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  // remember how far the reader got, so a return visit can offer to resume
  useEffect(() => {
    if (!active) return
    try {
      localStorage.setItem('vigil-progress', active)
    } catch {
      /* private mode: the vigil simply starts over each time */
    }
  }, [active])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // the overlay is a real dialog: Escape closes it, Tab stays inside it,
  // and the pill that opened it gets the focus back on the way out
  useEffect(() => {
    if (!menuOpen) return
    const panel = overlayRef.current
    if (!panel) return

    const focusable = () =>
      Array.from(panel.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])'))

    focusable()[0]?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setMenuOpen(false)
        return
      }
      if (e.key !== 'Tab') return
      const items = focusable()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      openerRef.current?.focus()
    }
  }, [menuOpen])

  const activeIdx = chapters.findIndex((c) => c.id === active)
  const activeChapter = activeIdx >= 0 ? chapters[activeIdx] : null

  const jump = useCallback((id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: scrollBehavior() })
  }, [])

  // Move chapter to chapter from the keyboard. J/K rather than the arrows:
  // the chapters span a long page, but taking the arrow keys away
  // from someone who is simply trying to scroll would be worse.
  useEffect(() => {
    if (menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const el = document.activeElement
      if (el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return

      const shifted = e.shiftKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp')
      const down = e.key === 'j' || e.key === 'J' || (shifted && e.key === 'ArrowDown')
      const up = e.key === 'k' || e.key === 'K' || (shifted && e.key === 'ArrowUp')
      if (!down && !up) return
      if (!shifted && e.shiftKey) return

      e.preventDefault()
      const here = chapters.findIndex((c) => c.id === active)
      const next = here < 0 ? 0 : Math.min(chapters.length - 1, Math.max(0, here + (down ? 1 : -1)))
      jump(chapters[next].id)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [active, menuOpen, jump])

  return (
    <>
      {/* ——— desktop rail ——— */}
      <nav className="pointer-events-none fixed inset-y-0 left-[26px] z-[70] hidden flex-col justify-center lg:flex" aria-label={t('ui-chapters')}>
        <div className="relative h-[56vh] w-px bg-bone/15">
          {/* the thread grows by transform, never by height: the rail must not
              relayout on every scroll frame */}
          <div
            className="absolute left-0 top-0 h-full w-px origin-top bg-gradient-to-b from-flame to-ember shadow-[0_0_8px_rgb(var(--c-flame)/0.7)] transition-transform duration-150 ease-linear"
            style={{ transform: `scaleY(${progress})` }}
          />
          <div
            className="absolute left-1/2 top-0 h-[7px] w-[7px] rounded-full bg-flame-hot shadow-[0_0_10px_3px_rgb(var(--c-flame)/0.75)] transition-transform duration-150 ease-linear"
            style={{ transform: `translate(-50%, -50%) translateY(calc(${progress} * 56vh))` }}
          />
          {chapters.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => jump(c.id)}
              aria-label={`${c.num} — ${c.title[lang]} ${c.titleAccent[lang]}`}
              aria-current={c.id === active ? 'true' : undefined}
              className="group pointer-events-auto absolute left-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center"
              style={{ top: `${((i + 0.5) / chapters.length) * 100}%` }}
            >
              <span
                className={`h-[5px] w-[5px] rounded-full transition-[background-color,box-shadow] duration-300 ${
                  c.id === active
                    ? 'bg-flame-hot shadow-[0_0_8px_2px_rgb(var(--c-flame)/0.6)]'
                    : activeIdx > i
                      ? 'bg-flame'
                      : 'bg-ash-dim'
                }`}
              />
              <span
                className="absolute left-[30px] top-1/2 -translate-y-1/2 whitespace-nowrap bg-night/90 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-bone-dim opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                {c.num} — {c.title[lang]} {c.titleAccent[lang]}
              </span>
            </button>
          ))}
        </div>
        {/* the rail says how to walk it */}
        <div className="pointer-events-none absolute bottom-8 left-0 font-mono text-[8px] uppercase leading-[1.6] tracking-[0.2em] text-ash-dim/70">
          J<span className="mx-1 opacity-50">/</span>K
        </div>
      </nav>

      {/* ——— mobile: top progress bar ——— */}
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[85] h-[2px] bg-transparent lg:hidden">
        <div
          className="h-full w-full origin-left bg-gradient-to-r from-flame to-ember shadow-[0_0_6px_rgb(var(--c-flame)/0.7)]"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {/* ——— mobile: chapter pill ——— */}
      {activeChapter && (
        <button
          ref={openerRef}
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          aria-label={`${t('ui-chapters')} — ${activeChapter.title[lang]}`}
          /* clear of the iPhone home indicator */
          className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-[85] flex min-h-[44px] w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2.5 border border-bone/25 bg-night/80 px-4 py-2.5 backdrop-blur-md lg:hidden"
        >
          <span className="font-display text-[15px] italic text-gold">{activeChapter.num}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-dim">
            {activeChapter.title[lang]} {activeChapter.titleAccent[lang]}
          </span>
        </button>
      )}

      {/* ——— mobile: chapter overlay ——— */}
      {menuOpen && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label={t('ui-chapters')}
          className="fixed inset-0 z-[95] flex flex-col bg-night/95 backdrop-blur-lg lg:hidden"
        >
          <div className="flex items-center justify-between px-6 pb-2 pt-5">
            <span className="font-tamil text-[17px] font-semibold text-flame">தமிழீழம்</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="grid h-11 w-11 place-items-center border border-bone/30 font-mono text-sm text-bone"
              aria-label={t('ui-close')}
            >
              ✕
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-6 py-4">
            {chapters.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => jump(c.id)}
                aria-current={c.id === active ? 'true' : undefined}
                className={`flex w-full items-baseline gap-4 border-b border-bone/10 py-4 text-left transition-colors ${
                  c.id === active ? 'text-bone' : 'text-bone-dim'
                }`}
              >
                <span className={`w-8 shrink-0 font-display text-lg italic ${activeIdx >= i ? 'text-flame' : 'text-ash-dim'}`}>{c.num}</span>
                <span>
                  <span className="lang-title block font-display text-xl">
                    {c.title[lang]} <em className="italic text-ember">{c.titleAccent[lang]}</em>
                  </span>
                  <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.22em] text-ash">{c.years[lang]}</span>
                </span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
