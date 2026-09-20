'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/context/LanguageContext'
import { mvScenes } from '@/data/narrative'
import { researchCopy, sources, type SourceId } from '@/data/research'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { clearOrdeal, setOrdeal } from '@/lib/ordeal'
import ChapterOpen from './ChapterOpen'
import ChapterEnd from './ChapterEnd'
import MullivaikkalScenery from './MullivaikkalScenery'
import styles from './MullivaikkalScenery.module.css'
import GlSea from './gl/GlSea'
import KanjiBowl from './KanjiBowl'

const labels = {
  fr: ['La terre se referme', 'Le refuge', 'Sous les obus', 'Les vies', 'Le partage', 'Le silence', 'Le bilan inachevé', 'Nommer', 'La trace', 'Le souvenir'],
  en: ['The land closes in', 'The refuge', 'Under the shells', 'The lives', 'Sharing', 'The silence', 'The unfinished count', 'Naming', 'The trace', 'Remembrance'],
  ta: ['சுருங்கும் நிலம்', 'அடைக்கலம்', 'எறிகணைகளின் கீழ்', 'உயிர்கள்', 'பகிர்வு', 'மௌனம்', 'முடிவுறாத கணக்கு', 'பெயரிடல்', 'தடயம்', 'நினைவு'],
}
const evidence: (SourceId | null)[] = ['panel', 'remembrance', 'oisl', null, 'kanji', 'review', 'panel', 'canada', null, 'kanji']

/** Every scene is real document content. A sticky sea accompanies it; scrolling never hides the text. */
export default function ChMullivaikkal() {
  const { lang, locale, t } = useLang()
  const s = mvScenes[lang]
  const reduced = useReducedMotion()
  const track = useRef<HTMLDivElement>(null)
  const agitation = useRef(0)
  const chapterScene = useRef(0)
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = track.current
    if (!el) return
    const key = Symbol('mullivaikkal')
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const index = Number((entry.target as HTMLElement).dataset.scene)
        setActive(index)
        chapterScene.current = index
        agitation.current = !reduced && index === 2 ? 1 : 0
        setOrdeal(key, reduced ? 0 : index === 2 ? 0.85 : index === 6 || index === 7 ? 0.5 : 0.15)
      }
    }, { rootMargin: '-55% 0px -44% 0px', threshold: 0 })
    el.querySelectorAll('article[data-scene]').forEach((scene) => observer.observe(scene))
    const bounds = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting)
      if (!entry.isIntersecting) { clearOrdeal(key); agitation.current = 0 }
    })
    bounds.observe(el)
    return () => { observer.disconnect(); bounds.disconnect(); clearOrdeal(key) }
  }, [reduced])

  const passages = [s.sand, s.zone, s.shells, s.namesLine, s.kanji, s.silence, s.countLabel, s.naming, t('t1-quote'), s.dayLine]
  const supporting = ['', '', '', s.namesSub, '', s.silenceSub, s.countSource, researchCopy.qualification[lang], researchCopy.editorial[lang], s.daySub]

  return (
    <section id="mullivaikkal" className="relative bg-[rgb(var(--ch-void))]">
      <ChapterOpen id="mullivaikkal" lede={s.lede} />
      <div ref={track} className={`mv-sequence relative ${styles.sequence}`} data-quiet={reduced} data-visible={visible} data-chapter-scene={active}>
        <div className="mv-scenery pointer-events-none sticky top-0 h-[100svh] overflow-hidden">
          <div className={styles.seaFallback} aria-hidden="true" />
          <GlSea agitation={agitation} chapterScene={chapterScene} alpha={1} />
          <div className={styles.redVeil} aria-hidden="true" />
          <div className={styles.seaShade} aria-hidden="true" />
          {!reduced && <MullivaikkalScenery active={active} />}

          <div className={styles.sceneCaption} aria-hidden="true">
            <span>Mullivaikkal</span><span>2009 · 18.05</span>
          </div>
        </div>
        <div className={styles.controls}>
          <nav className={styles.navigation} aria-label={lang === 'fr' ? 'Les scènes de Mullivaikkal' : lang === 'ta' ? 'முள்ளிவாய்க்கால் காட்சிகள்' : 'Mullivaikkal scenes'}>
            <label className={styles.mobileSelect}>
              <span>{String(active + 1).padStart(2, '0')} / 10</span>
              <select value={active} aria-label={lang === 'fr' ? 'Choisir une scène' : lang === 'ta' ? 'காட்சியைத் தேர்ந்தெடு' : 'Choose a scene'} onChange={event => {
                const index = Number(event.target.value)
                document.getElementById(`mv-scene-${index}`)?.scrollIntoView({ behavior: 'instant', block: 'start' })
              }}>
                {labels[lang].map((label, i) => <option key={i} value={i}>{label}</option>)}
              </select>
            </label>
            <div className={styles.steps}>
              {passages.map((_, i) => <a key={i} href={`#mv-scene-${i}`} aria-label={`${i + 1}. ${labels[lang][i]}`} aria-current={i === active ? 'step' : undefined} title={labels[lang][i]} className={styles.step} data-passed={i <= active}><span /></a>)}
            </div>
            <p className={styles.currentScene}><span>{String(active + 1).padStart(2, '0')} / 10</span><span key={`${lang}-${active}`} className={styles.caption}>{labels[lang][active]}</span></p>
          </nav>
        </div>
        <div className="mv-passages relative mx-auto max-w-[1440px] px-6 sm:px-[9vw]">
          {passages.map((passage, i) => (
            <article key={i} id={`mv-scene-${i}`} data-scene={i} data-active={i === active} className="mv-passage relative grid min-h-[85svh] content-center py-20 lg:ml-[46%] lg:min-h-[90svh]">
              <p className="mb-7 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ash"><span className="text-gold">{String(i + 1).padStart(2, '0')}</span><span className="h-px w-8 bg-bone/25" />{labels[lang][i]}</p>
              {i === 6 && <div className="mb-6"><span className="block font-display text-[clamp(62px,8vw,112px)] font-light leading-none tracking-[-0.04em] text-ember">{new Intl.NumberFormat(locale).format(40000)}</span><p className="mt-3 text-base italic text-ash">{s.countSuffix}</p></div>}
              {i === 4 && <div className="mb-8 lg:hidden"><KanjiBowl size={150} /></div>}
              <h3 className={`lang-title max-w-[25ch] font-display font-light leading-[1.4] ${i === 7 ? 'text-[clamp(29px,3.7vw,48px)] text-ember' : 'text-[clamp(25px,3vw,39px)] text-bone'}`}>{passage}</h3>
              {supporting[i] && <p className="mt-7 max-w-[48ch] text-[16px] leading-[1.8] text-bone-dim">{supporting[i]}</p>}
              {evidence[i] && <a href={sources[evidence[i]!].href} target="_blank" rel="noopener noreferrer" className="mt-6 w-fit border-b border-bone/25 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-ash hover:text-flame">{sources[evidence[i]!].institution} · {sources[evidence[i]!].year} ↗</a>}
              {i < passages.length - 1 && <a href={`#mv-scene-${i + 1}`} className={styles.continueLink}>
                <span>{lang === 'fr' ? 'Poursuivre' : lang === 'ta' ? 'தொடர்க' : 'Continue'}</span>
                <span>{labels[lang][i + 1]}</span>
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none" aria-hidden="true"><path d="M8 2v14m-5-5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" /></svg>
              </a>}
              {i === 9 && <p className="mt-8 font-mono text-[11px] tracking-[0.2em] text-flame">18.05 · முள்ளிவாய்க்கால்</p>}
            </article>
          ))}
        </div>
      </div>
      <div className={styles.chapterEnd}><ChapterEnd id="mullivaikkal" /></div>
    </section>
  )
}
