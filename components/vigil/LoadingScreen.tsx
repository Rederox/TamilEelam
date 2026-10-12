'use client'

import { useEffect } from 'react'
import { useLang } from '@/context/LanguageContext'
import { finishLoading } from '@/lib/loading'

const copy = {
  fr: { title: 'La Veillée', loading: 'Préparation de votre lecture', skip: 'Commencer la lecture' },
  en: { title: 'The Vigil', loading: 'Preparing your reading', skip: 'Start reading' },
  ta: { title: 'விழிப்பு', loading: 'வாசிப்புக்குத் தயாராகிறது', skip: 'வாசிக்கத் தொடங்கு' },
}

export default function LoadingScreen() {
  const { lang } = useLang()
  const c = copy[lang]

  useEffect(() => {
    let cancelled = false
    let frame = 0
    const hero = document.querySelector<HTMLImageElement>('[data-opening-image]')
    const ready = hero?.decode().catch(() => {}) ?? Promise.resolve()
    const deadline = window.setTimeout(finishLoading, 4500)
    // Font servers can be slow or unavailable: never wait indefinitely.
    let fontDeadline = 0
    const fonts = Promise.race([
      document.fonts.ready,
      new Promise<void>((resolve) => { fontDeadline = window.setTimeout(resolve, 1000) }),
    ])
    Promise.all([ready, fonts]).then(() => {
      if (!cancelled) frame = requestAnimationFrame(finishLoading)
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      clearTimeout(deadline)
      clearTimeout(fontDeadline)
    }
  }, [])

  return (
    <div className="vigil-loading fixed inset-0 z-[200] flex min-h-[100dvh] items-center justify-center bg-night px-8 text-bone">
      <div className="w-full max-w-[280px]">
        <span aria-hidden="true" className="mb-7 block h-9 w-px bg-blood" />
        <p className="font-display text-4xl font-light">{c.title}</p>
        <p role="status" className="mt-5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-ash">{c.loading}</p>
        <div aria-hidden="true" className="mt-6 h-px overflow-hidden bg-bone/15"><span className="vigil-loading-line block h-full w-1/3 bg-gold" /></div>
        <button onClick={finishLoading} className="mt-8 min-h-11 text-sm text-ash underline decoration-bone/25 underline-offset-4 hover:text-bone">{c.skip}</button>
      </div>
    </div>
  )
}
