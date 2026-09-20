'use client'

import { useLang } from '@/context/LanguageContext'
import { researchCopy } from '@/data/research'

const text = {
  fr: { line: 'Avant les dates, il y avait des vies.', sub: 'Une langue à la maison. Un chemin familier. Une terre que l’on appelait la sienne.' },
  en: { line: 'Before the dates, there were lives.', sub: 'A language at home. A familiar path. A land people called their own.' },
  ta: { line: 'தேதிகளுக்கு முன், வாழ்வுகள் இருந்தன.', sub: 'வீட்டில் ஒரு மொழி. பழகிய ஒரு பாதை. தமதென அழைத்த ஒரு நிலம்.' },
}

function Palmyra({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-5 160 Q-12 82 0 0 Q5 75 4 160Z" fill="currentColor" />
    {[-95, -62, -31, 0, 35, 67, 96].map((a) => <path key={a} d="M0 0 Q-31 -57 0 -82 Q29 -52 0 0Z" transform={`rotate(${a})`} fill="currentColor" opacity=".9" />)}
    <path d="M-8 5 Q-52 -11 -75 26 M7 4 Q52 -13 78 28" fill="none" stroke="currentColor" strokeWidth="4" />
  </g>
}

/** An illustration of remembered landscape, explicitly distinguished from documentary images. */
export default function LandMemory() {
  const { lang } = useLang()
  const c = text[lang]
  return (
    <figure className="reveal relative mb-20 min-h-[430px] overflow-hidden border-y border-gold/20 bg-[rgb(var(--ch-dawn-1))] sm:min-h-[520px]">
      <svg viewBox="0 0 1200 560" preserveAspectRatio="xMidYMax slice" className="pointer-events-none absolute inset-0 h-full w-full text-[rgb(var(--c-ash-dim))]" aria-hidden="true">
        <circle cx="850" cy="200" r="115" fill="rgb(var(--c-gold)/0.07)" stroke="rgb(var(--c-gold)/0.17)" />
        <g fill="none" stroke="rgb(var(--c-gold)/0.09)">{Array.from({length:10},(_,i)=><path key={i} d={`M0 ${350+i*16} Q280 ${315+i*19} 600 ${365+i*15} T1200 ${345+i*19}`} />)}</g>
        <path d="M0 450 Q240 400 460 468 T1200 430 V560 H0Z" fill="rgb(var(--c-night-2))" />
        <g opacity=".32"><Palmyra x={910} y={275} scale={1.25} /><Palmyra x={1050} y={320} scale={.9} /><Palmyra x={1125} y={295} scale={1.1} /></g>
        <path d="M0 515 Q320 470 700 525 T1200 485 V560 H0Z" fill="rgb(var(--c-night))" />
        <g opacity=".5"><Palmyra x={125} y={340} scale={1.5} /><Palmyra x={25} y={390} scale={1.1} /></g>
      </svg>
      <figcaption className="relative z-[2] max-w-[650px] px-7 py-16 sm:px-12 sm:py-20">
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-gold">01 · {researchCopy.illustration[lang]}</span>
        <p className="lang-title mt-8 max-w-[17ch] font-display text-[clamp(30px,4.4vw,54px)] font-light leading-[1.15]">{c.line}</p>
        <p className="mt-6 max-w-[34ch] text-lg italic leading-relaxed text-bone-dim">{c.sub}</p>
      </figcaption>
    </figure>
  )
}
