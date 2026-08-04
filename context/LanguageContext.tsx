'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Lang } from '@/data/events'
import { translations, type TranslationKey } from '@/data/translations'

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr')

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLang
    }
  }, [])

  const t = useCallback(
    (key: TranslationKey) => translations[lang][key] ?? key,
    [lang]
  )

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider')
  return ctx
}
