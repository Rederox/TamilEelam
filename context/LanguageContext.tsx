'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { Lang } from '@/data/events'
import { translations, type TranslationKey } from '@/data/translations'

interface LanguageContextValue {
  lang: Lang
  /** BCP 47 tag for Intl: number grouping differs per reading language. */
  locale: string
  setLang: (lang: Lang) => void
  t: (key: TranslationKey) => string
}

const LOCALES: Record<Lang, string> = { fr: 'fr-FR', en: 'en-GB', ta: 'ta-IN' }

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'vigil-lang'

export function LanguageProvider({ children }: { children: ReactNode }) {
  // the server renders French; the stored choice is applied after hydration,
  // the same way <ThemeProvider> restores the sheet
  const [lang, setLangState] = useState<Lang>('fr')

  const apply = useCallback((next: Lang) => {
    setLangState(next)
    document.documentElement.lang = next
  }, [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'fr' || stored === 'en' || stored === 'ta') apply(stored)
    } catch {
      /* private mode: the vigil simply opens in French */
    }
  }, [apply])

  const setLang = useCallback(
    (next: Lang) => {
      apply(next)
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* the choice holds for this visit only */
      }
    },
    [apply]
  )

  const t = useCallback(
    (key: TranslationKey) => translations[lang][key] ?? key,
    [lang]
  )

  return (
    <LanguageContext.Provider value={{ lang, locale: LOCALES[lang], setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider')
  return ctx
}
