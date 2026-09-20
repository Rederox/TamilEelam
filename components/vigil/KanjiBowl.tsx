'use client'

import { useId, useState } from 'react'
import Image from 'next/image'
import styles from './MemorialObjects.module.css'

/** Thin rice porridge in a worn clay bowl, with locally scoped SVG materials. */
function KanjiIllustration({ size = 96 }: { size?: number }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 240 200" width={size} height={size * 200 / 240} aria-hidden="true" className={styles.bowl}>
      <defs>
        <linearGradient id={`${id}-clay`} x1="0" y1="0" x2="1" y2=".5">
          <stop stopColor="#a57b51" /><stop offset=".25" stopColor="#765033" /><stop offset=".7" stopColor="#39281d" /><stop offset="1" stopColor="#64462e" />
        </linearGradient>
        <radialGradient id={`${id}-rice`} cx=".38" cy=".32" r=".75">
          <stop stopColor="#e0d4b1" /><stop offset=".65" stopColor="#b7a784" /><stop offset="1" stopColor="#796a4c" />
        </radialGradient>
        <linearGradient id={`${id}-rim`} x2=".2" y2="1"><stop stopColor="#c09a6a" /><stop offset="1" stopColor="#543a26" /></linearGradient>
        <radialGradient id={`${id}-shadow`}><stop stopColor="#15120f" stopOpacity=".65" /><stop offset="1" stopColor="#15120f" stopOpacity="0" /></radialGradient>
        <clipPath id={`${id}-surface`}><ellipse cx="120" cy="103" rx="76" ry="20" /></clipPath>
      </defs>
      <ellipse cx="123" cy="182" rx="100" ry="15" fill={`url(#${id}-shadow)`} />
      <path d="M36 101 C39 150 67 177 116 180 C164 183 198 153 204 101Z" fill={`url(#${id}-clay)`} />
      <path d="M46 116 C52 150 78 168 114 170" fill="none" stroke="#ba9060" strokeOpacity=".24" strokeWidth="2" />
      {[0, 1, 2, 3].map(i => <path key={i} d={`M${49 + i * 7} ${129 + i * 10} Q120 ${154 + i * 9} ${190 - i * 8} ${130 + i * 10}`} fill="none" stroke="#ceaa77" strokeOpacity=".09" strokeWidth="1" />)}
      <ellipse cx="120" cy="102" rx="84" ry="26" fill={`url(#${id}-rim)`} />
      <ellipse cx="120" cy="103" rx="78" ry="22" fill="#3a2e20" />
      <ellipse cx="120" cy="105" rx="76" ry="20" fill={`url(#${id}-rice)`} />
      <g clipPath={`url(#${id}-surface)`}>
        {Array.from({ length: 42 }, (_, i) => {
          const x = 47 + (i * 37) % 146
          const y = 88 + (i * 13) % 35
          return <ellipse key={i} cx={x} cy={y} rx={2.3 + (i % 3) * .5} ry="1.15" transform={`rotate(${(i * 43) % 180} ${x} ${y})`} fill={i % 3 ? '#e8ddbd' : '#9d8e70'} opacity={.35 + (i % 4) * .12} />
        })}
        <path d="M55 102 Q91 88 137 96 M143 112 Q166 116 184 105" fill="none" stroke="#f0e4c6" strokeWidth="1" opacity=".35" />
      </g>
      <path d="M39 99 C52 73 180 73 201 99" fill="none" stroke="#d6b17d" strokeOpacity=".5" strokeWidth="1.3" />
      <g fill="none" strokeLinecap="round" className={styles.steam}>
        <path d="M91 91 C65 68 112 54 93 18" />
        <path d="M121 87 C143 61 107 45 126 6" />
        <path d="M150 92 C170 69 143 58 156 31" />
      </g>
    </svg>
  )
}

/** Photographic material with animated steam; vector fallback stays available offline. */
export default function KanjiBowl({ size = 96 }: { size?: number }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  if (failed) return <div className={styles.photoBowl} style={{ width: size }} aria-hidden="true"><KanjiIllustration size={size} /></div>
  return (
    <div className={styles.photoBowl} style={{ width: size }} aria-hidden="true" data-loaded={loaded}>
      {!loaded && <div className={styles.bowlLoading} />}
      <Image src="/images/kanji-bowl-realistic.png" alt="" fill sizes={`${size}px`} className={styles.bowlImage} onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />
      <svg viewBox="0 0 240 240" className={styles.photoSteam} fill="none">
        <g className={styles.steam} strokeLinecap="round">
          <path d="M92 114 C70 90 110 67 95 35" />
          <path d="M123 107 C143 87 109 60 126 15" />
          <path d="M151 115 C170 92 143 80 157 51" />
        </g>
      </svg>
    </div>
  )
}
