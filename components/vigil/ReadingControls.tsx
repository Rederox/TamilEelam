'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/context/LanguageContext'
import { isOrdealAudioAvailable, startOrdealAudio, stopOrdealAudio } from '@/lib/ordealAudio'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const copy = {
  fr: { welcome: 'Une histoire à traverser, à votre rythme.', quiet: 'Lecture calme', immersive: 'Lecture immersive', sound: 'Activer l’ambiance sonore', mute: 'Couper le son', failed: 'Le son est indisponible dans ce navigateur.', sources: 'Les sources', hint: 'La lecture calme retire les animations et déroule toutes les scènes.' },
  en: { welcome: 'A story to move through, at your own pace.', quiet: 'Quiet reading', immersive: 'Immersive reading', sound: 'Enable ambient sound', mute: 'Mute sound', failed: 'Sound is unavailable in this browser.', sources: 'The sources', hint: 'Quiet reading removes animation and displays every scene in order.' },
  ta: { welcome: 'உங்கள் வேகத்தில் வாசிக்க ஒரு வரலாறு.', quiet: 'அமைதியான வாசிப்பு', immersive: 'அனுபவ வாசிப்பு', sound: 'பின்னணி ஒலியை இயக்கு', mute: 'ஒலியை நிறுத்து', failed: 'இந்த உலாவியில் ஒலி கிடைக்கவில்லை.', sources: 'ஆதாரங்கள்', hint: 'அமைதியான வாசிப்பு அசைவுகளை நிறுத்தி எல்லாக் காட்சிகளையும் வரிசையாகக் காட்டும்.' },
}

export default function ReadingControls() {
  const { lang } = useLang()
  const c = copy[lang]
  const reduced = useReducedMotion()
  const [quiet, setQuiet] = useState(false)
  const [audio, setAudio] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const hide = () => { if (document.hidden) { stopOrdealAudio(); setAudio(false) } }
    document.addEventListener('visibilitychange', hide)
    return () => { document.removeEventListener('visibilitychange', hide); stopOrdealAudio() }
  }, [])

  const toggleReading = () => {
    const next = !quiet
    setQuiet(next)
    document.documentElement.dataset.reading = next ? 'quiet' : 'immersive'
    window.dispatchEvent(new Event('vigil-reading-change'))
    if (next) { stopOrdealAudio(); setAudio(false) }
  }

  const toggleAudio = async () => {
    setError(false)
    if (audio) { stopOrdealAudio(); setAudio(false); return }
    if (!isOrdealAudioAvailable()) { setError(true); return }
    try { await startOrdealAudio(); setAudio(true) } catch { stopOrdealAudio(); setError(true) }
  }

  return (
    <aside className="relative z-[2] border-y border-bone/15 bg-night-2 px-6 py-7 sm:px-[9vw]">
      <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <p className="text-lg italic text-bone-dim">{c.welcome}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ash">
          <button onClick={toggleReading} aria-pressed={quiet} title={c.hint} className="min-h-11 border-b border-bone/25 hover:text-flame">{quiet ? c.immersive : c.quiet}</button>
          <button onClick={toggleAudio} aria-pressed={audio} disabled={reduced} className="min-h-11 border-b border-bone/25 hover:text-flame disabled:cursor-default disabled:opacity-40">{audio ? c.mute : c.sound}</button>
          <a href="#sources" className="inline-flex min-h-11 items-center border-b border-bone/25 hover:text-flame">{c.sources}</a>
        </div>
      </div>
      {error && <p role="status" className="mt-3 text-sm text-ember">{c.failed}</p>}
    </aside>
  )
}
