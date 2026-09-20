'use client'

import { useLang } from '@/context/LanguageContext'
import { prologue } from '@/data/narrative'
import EmptyHome from './EmptyHome'
import styles from './Prologue.module.css'

const STAGES = [
  { year: '1981', href: '#feu' },
  { year: '1983', href: '#juillet' },
  { year: '2009', href: '#mullivaikkal' },
]

export default function Prologue() {
  const { lang } = useLang()
  const p = prologue[lang]
  return (
    <section id="prologue" className={`${styles.opening} min-h-[100dvh] px-6 pb-10 pt-28 sm:px-[9vw] lg:flex lg:flex-col lg:justify-center lg:pt-32`}>
      <div className="mx-auto w-full max-w-[1280px]">
        <div className={styles.panorama}>
          <div className={`${styles.openingCopy} ${styles.arrival}`}>
            <p className="mb-7 flex items-center gap-3 font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] text-ash sm:text-[10px]">
              <span aria-hidden="true" className="h-px w-7 shrink-0 bg-blood" />{p.whisper}
            </p>
            <div className={styles.memoryTitle}>
              <span aria-hidden="true" className={styles.memoryThread} />
              <h1 className={`lang-title font-display font-light ${styles.title}`}>
                <span className={styles.titlePrelude}>{p.line1}</span>
                <em className={styles.absence}>{p.line2}</em>
              </h1>
            </div>
          </div>
          <div className={`${styles.panoramaImage} ${styles.arrival}`} style={{ animationDelay: '180ms' }}>
            <EmptyHome caption={p.scene} />
          </div>
        </div>
            <div className={styles.readingNote}>
              <p className="max-w-[42ch] text-[15px] leading-[1.85] text-bone-dim sm:text-[16px]">{p.sub}</p>
              <a href="#terre" className={`group ${styles.enter}`}>
                <span aria-hidden="true" className={styles.entryArrow}>↓</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em]">{p.enter}</span>
              </a>
              <a href="#sources" className="inline-flex min-h-11 items-center text-[13px] italic text-ash underline decoration-bone/20 underline-offset-4 transition-colors hover:text-bone">{p.sources}</a>
            </div>

        <nav aria-label={p.enter} className="mt-10 grid grid-cols-1 border-t border-bone/15 sm:grid-cols-3 lg:mt-12">
          {STAGES.map((stage, i) => (
            <a key={stage.year} href={stage.href} className="group flex min-h-20 items-center justify-between gap-4 border-b border-bone/10 py-5 sm:border-b-0 sm:pr-6 sm:pl-6 sm:first:pl-0 sm:last:pr-0">
              <span><span className="block font-mono text-[10px] tracking-[0.16em] text-gold">{stage.year}</span><span className="mt-2 block font-display text-[20px] text-bone-dim transition-colors group-hover:text-bone">{p.stages[i]}</span></span>
              <span aria-hidden="true" className="text-ash transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none">↗</span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  )
}
