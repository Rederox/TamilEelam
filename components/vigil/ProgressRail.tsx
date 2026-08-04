'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/context/LanguageContext'
import { chapters } from '@/data/narrative'
import { useScrollProgress } from '@/hooks/useSceneProgress'

/**
 * The thread of light.
 * Desktop: vertical golden rail on the left with one stop per chapter.
 * Mobile: thin progress bar on top + a chapter pill at the bottom that
 * opens a full navigation overlay.
 */
export default function ProgressRail() {
  const { lang } = useLang()
  const progress = useScrollProgress()
  const [active, setActive] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const sections = chapters
      .map((c) => document.getElementById(c.id))
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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const activeIdx = chapters.findIndex((c) => c.id === active)
  const activeChapter = activeIdx >= 0 ? chapters[activeIdx] : null

  const jump = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* ——— desktop rail ——— */}
      <nav className="pointer-events-none fixed inset-y-0 left-[26px] z-[70] hidden flex-col justify-center lg:flex" aria-label="Chapters">
        <div className="relative h-[56vh] w-px bg-bone/15">
          <div
            className="absolute left-0 top-0 w-px bg-gradient-to-b from-flame to-ember shadow-[0_0_8px_rgb(var(--c-flame)/0.7)] transition-[height] duration-150 ease-linear"
            style={{ height: `${progress * 100}%` }}
          />
          <div
            className="absolute left-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-flame-hot shadow-[0_0_10px_3px_rgb(var(--c-flame)/0.75)] transition-[top] duration-150 ease-linear"
            style={{ top: `${progress * 100}%` }}
          />
          {chapters.map((c, i) => (
            <button
              key={c.id}
              onClick={() => jump(c.id)}
              aria-label={c.title[lang]}
              className="group pointer-events-auto absolute left-1/2 grid h-[15px] w-[15px] -translate-x-1/2 -translate-y-1/2 place-items-center"
              style={{ top: `${((i + 0.5) / chapters.length) * 100}%` }}
            >
              <span
                className={`h-[5px] w-[5px] rounded-full transition-all duration-300 ${
                  c.id === active
                    ? 'bg-flame-hot shadow-[0_0_8px_2px_rgb(var(--c-flame)/0.6)]'
                    : activeIdx > i
                      ? 'bg-flame'
                      : 'bg-ash-dim'
                }`}
              />
              <span
                className="absolute left-[18px] top-1/2 -translate-y-1/2 whitespace-nowrap bg-night/90 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-bone-dim opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                {c.num} — {c.title[lang]} {c.titleAccent[lang]}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* ——— mobile: top progress bar ——— */}
      <div className="fixed inset-x-0 top-0 z-[85] h-[2px] bg-transparent lg:hidden">
        <div
          className="h-full bg-gradient-to-r from-flame to-ember shadow-[0_0_6px_rgb(var(--c-flame)/0.7)]"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* ——— mobile: chapter pill ——— */}
      {activeChapter && (
        <button
          onClick={() => setMenuOpen(true)}
          className="fixed bottom-5 left-1/2 z-[85] flex -translate-x-1/2 items-center gap-2.5 border border-bone/25 bg-night/80 px-4 py-2.5 backdrop-blur-md lg:hidden"
          aria-label="Chapters"
        >
          <span className="font-display text-[15px] italic text-gold">{activeChapter.num}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-dim">
            {activeChapter.title[lang]} {activeChapter.titleAccent[lang]}
          </span>
        </button>
      )}

      {/* ——— mobile: chapter overlay ——— */}
      {menuOpen && (
        <div className="fixed inset-0 z-[95] flex flex-col bg-night/95 backdrop-blur-lg lg:hidden">
          <div className="flex items-center justify-between px-6 pb-2 pt-5">
            <span className="font-tamil text-[17px] font-semibold text-flame">தமிழீழம்</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="grid h-10 w-10 place-items-center border border-bone/30 font-mono text-sm text-bone"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-6 py-4">
            {chapters.map((c, i) => (
              <button
                key={c.id}
                onClick={() => jump(c.id)}
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
