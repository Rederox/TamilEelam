'use client'

import { useEffect, useState } from 'react'
import { isOrdealAudioAvailable, isOrdealAudioRunning, startOrdealAudio, stopOrdealAudio } from '@/lib/ordealAudio'

export const ambienceCopy = {
  fr: { sound: 'Activer l’ambiance sonore', mute: 'Couper le son', failed: 'Le son est indisponible dans ce navigateur.' },
  en: { sound: 'Enable ambient sound', mute: 'Mute sound', failed: 'Sound is unavailable in this browser.' },
  ta: { sound: 'பின்னணி ஒலியை இயக்கு', mute: 'ஒலியை நிறுத்து', failed: 'இந்த உலாவியில் ஒலி கிடைக்கவில்லை.' },
}

/**
 * The ambient sound as React state. There is one soundscape and several
 * places to switch it (the header, the strip under the prologue): each one
 * reads the same truth, so a reader ten chapters in can silence it without
 * walking back to where they turned it on.
 */
export function useAmbience() {
  const [on, setOn] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const sync = () => setOn(isOrdealAudioRunning())
    sync()
    window.addEventListener('vigil-audio-change', sync)
    return () => window.removeEventListener('vigil-audio-change', sync)
  }, [])

  /** Must be called from a click: browsers refuse sound without a gesture. */
  const toggle = async () => {
    setFailed(false)
    if (isOrdealAudioRunning()) { stopOrdealAudio(); return }
    if (!isOrdealAudioAvailable()) { setFailed(true); return }
    try { await startOrdealAudio() } catch { stopOrdealAudio(); setFailed(true) }
  }

  return { on, failed, toggle }
}
