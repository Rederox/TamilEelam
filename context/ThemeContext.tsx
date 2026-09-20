'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

export type Theme = 'vigil' | 'paper'

interface ThemeContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'vigil-theme'

/**
 * Runs before paint (see layout.tsx) so the sheet never flashes the wrong
 * colour. `?theme=paper` wins over the stored choice and is remembered,
 * so a link can open the archive directly on paper.
 */
export const themeBootScript = `(function(){try{var q=new URLSearchParams(location.search).get('theme');var t=(q==='paper'||q==='vigil')?q:localStorage.getItem('${STORAGE_KEY}');if(t==='paper'||t==='vigil'){document.documentElement.dataset.theme=t;if(q)localStorage.setItem('${STORAGE_KEY}',t)}}catch(e){}})()`

/** The stored choice, or the one a `?theme=` link asks for. */
function storedTheme(): Theme {
  try {
    const q = new URLSearchParams(window.location.search).get('theme')
    if (q === 'paper' || q === 'vigil') return q
    const s = localStorage.getItem(STORAGE_KEY)
    if (s === 'paper' || s === 'vigil') return s
  } catch {
    /* no storage: fall through to the vigil */
  }
  return 'vigil'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('vigil')

  // React hydration drops attributes the server never rendered, so the boot
  // script's data-theme can be stripped: re-apply from the stored choice.
  useEffect(() => {
    const wanted = storedTheme()
    document.documentElement.dataset.theme = wanted
    setThemeState(wanted)
  }, [])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    const root = document.documentElement
    root.dataset.theme = next
    root.classList.add('theming')
    window.setTimeout(() => root.classList.remove('theming'), 600)
    // the browser chrome follows the page
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', next === 'paper' ? '#ffffff' : '#000000')
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* private mode: the choice simply does not persist */
    }
  }, [])

  const toggle = useCallback(
    () => setTheme(theme === 'paper' ? 'vigil' : 'paper'),
    [theme, setTheme]
  )

  return <ThemeContext.Provider value={{ theme, setTheme, toggle }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
