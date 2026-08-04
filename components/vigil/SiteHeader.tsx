'use client'

import { useLang } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import type { Lang } from '@/data/events'

const LANGS: Lang[] = ['fr', 'en', 'ta']

const THEME_LABEL: Record<Lang, { toPaper: string; toVigil: string }> = {
  fr: { toPaper: 'Lire sur papier ancien', toVigil: 'Revenir à la veillée' },
  en: { toPaper: 'Read on aged paper', toVigil: 'Return to the vigil' },
  ta: { toPaper: 'பழைய தாளில் வாசிக்க', toVigil: 'விழிப்புக்குத் திரும்ப' },
}

export default function SiteHeader() {
  const { lang, setLang, t } = useLang()
  const { theme, toggle } = useTheme()
  const paper = theme === 'paper'

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[80] flex items-center justify-between bg-gradient-to-b from-night/80 to-transparent px-5 py-4 sm:px-7">
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        className="pointer-events-auto flex items-baseline gap-3 text-bone no-underline"
      >
        <span className="font-tamil text-[19px] font-semibold text-flame">தமிழீழம்</span>
        <span className="hidden font-mono text-[9px] uppercase tracking-[0.32em] text-ash sm:block">{t('brand-sub')}</span>
      </a>
      <div className="flex items-stretch gap-2.5">
        <button
          onClick={toggle}
          aria-pressed={paper}
          title={paper ? THEME_LABEL[lang].toVigil : THEME_LABEL[lang].toPaper}
          aria-label={paper ? THEME_LABEL[lang].toVigil : THEME_LABEL[lang].toPaper}
          className="pointer-events-auto grid w-10 place-items-center border border-bone/30 bg-night/50 text-ash backdrop-blur-md transition-colors hover:text-flame"
        >
          {/* an oil lamp: alight for the vigil, at rest on paper */}
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 17h13c2 0 3-1.2 3-2.8 0-1.7-1.3-2.7-3.2-2.7H9"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path d="M4 17c-.7-1.6-.7-3.4 0-5h6l-1.6 5H4Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            <path
              d="M8 9.5c0-1.6 1.4-2.2 1.4-4C10.8 6.7 11 8.2 11 9.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              className={paper ? 'opacity-25' : 'text-flame'}
            />
          </svg>
        </button>

        <div className="pointer-events-auto flex border border-bone/30 bg-night/50 backdrop-blur-md" role="group" aria-label="Language">
          {LANGS.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`border-r border-bone/15 px-3.5 py-2 font-mono text-[11px] tracking-[0.12em] transition-colors last:border-r-0 sm:py-1.5 ${
                lang === l ? 'bg-bone text-night' : 'text-ash hover:text-bone'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
