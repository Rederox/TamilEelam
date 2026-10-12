'use client'

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { useLang } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import type { Lang } from '@/data/events'
import { soon } from '@/data/soon'
import { prefersReducedMotion, reader } from '@/lib/motion'
import Lamp from '@/components/vigil/Lamp'
import Vilakku from '@/components/vigil/Vilakku'
import FlameLayer from '@/components/vigil/gl/FlameLayer'
import GlDust from '@/components/vigil/gl/GlDust'
import type { LampView } from '@/components/vigil/gl/GlVilakku'
import KolamFloor, { KOLAM_SPAN } from './KolamFloor'
import styles from './Soon.module.css'

const LANGS: Lang[] = ['fr', 'en', 'ta']

/**
 * One eye for the whole scene. The lamp is drawn by WebGL and the floor by
 * CSS, and a lamp only sits on a floor if both are seen from the same place:
 * standing at the door, looking down, through a long lens.
 */
const VIEW: LampView = { pitch: 32, distance: 6, fov: 9 }
/** from one dot of the kolam to the next, in lamp-widths */
const SPACING = 0.62

// The same camera, restated for CSS. The lamp's canvas is 0.78 of its width
// tall and the eye is aimed 0.24 lamp-widths above the foot of the bowl
// (GlVilakku), so everything here is a multiple of the lamp's width.
const RAD = Math.PI / 180
const UNIT = 0.39 / (Math.tan((VIEW.fov / 2) * RAD) * VIEW.distance)
const RISE = 0.24 * Math.cos(VIEW.pitch * RAD) * UNIT
const SCENE = {
  '--tilt': `${90 - VIEW.pitch}deg`,
  '--depth': (VIEW.distance * UNIT).toFixed(3),
  '--rise': RISE.toFixed(3),
  '--stand': (((0.39 + RISE) / 0.78) * 100).toFixed(2),
  '--floor': (KOLAM_SPAN * SPACING * UNIT).toFixed(3),
} as CSSProperties

/** What the server draws, and what a phone held upright ends up close to. */
const LAMP = 226

/**
 * The lamp is sized in pixels (its flame is drawn by a shader that needs to
 * know), so the room is measured once it exists and the floor follows.
 */
function useLampSize(): number {
  const [size, setSize] = useState(LAMP)
  useEffect(() => {
    const fit = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      // beside the words on a wide screen, under them on a narrow one
      const room = w >= 1024 ? Math.min(w * 0.27, h * 0.4, 400) : Math.min(w * 0.58, h * 0.31, 400)
      setSize(Math.round(Math.max(170, room)))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])
  return size
}

/**
 * A hand passing near a flame moves the air. There is nothing to scroll on
 * this page, so the draught every flame already leans into (lib/motion.ts)
 * is fed from the pointer instead: how fast it travels, and how close.
 */
function useDraught(flame: RefObject<HTMLElement>) {
  useEffect(() => {
    if (prefersReducedMotion()) return
    let lastX = 0
    let lastT = 0
    let raf = 0

    const settle = () => {
      reader.scroll *= 0.94
      if (reader.scroll < 0.002) {
        reader.scroll = 0
        raf = 0
        return
      }
      raf = requestAnimationFrame(settle)
    }

    const onMove = (e: PointerEvent) => {
      const now = performance.now()
      const el = flame.current
      if (lastT && el && now - lastT < 120) {
        const speed = (e.clientX - lastX) / Math.max(now - lastT, 1)
        const box = el.getBoundingClientRect()
        const away = Math.hypot(e.clientX - (box.left + box.width / 2), e.clientY - (box.top + box.height * 0.3))
        // felt at arm's length, lost across the room
        const near = Math.exp(-away / (box.width * 1.4))
        const push = Math.min(Math.abs(speed) / 2.2, 1) * near
        if (push > reader.scroll) {
          reader.scroll = push
          reader.dir = -Math.sign(speed)
          if (!raf) raf = requestAnimationFrame(settle)
        }
      }
      lastX = e.clientX
      lastT = now
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
      reader.scroll = 0
    }
  }, [flame])
}

/**
 * The holding page. Before a house is opened for the day its threshold is
 * drawn, and a lamp may be set at the heart of it: that is all there is here,
 * and the line that says the vigil is coming.
 */
export default function Soon() {
  const { lang, setLang, t } = useLang()
  const c = soon[lang]
  const lamp = useLampSize()
  const stand = useRef<HTMLDivElement>(null)
  useDraught(stand)

  // The door is only ever seen at night: there is no leaf to turn here, so a
  // `?theme=paper` link must not leave the reader on a page nobody drew.
  const { theme, setTheme } = useTheme()
  useEffect(() => {
    if (theme === 'paper') setTheme('vigil')
  }, [theme, setTheme])

  return (
    <>
      {/* the same air as the vigil itself: the reader's light, the dust it finds, the flame */}
      <Lamp />
      <GlDust intensity={0.9} />
      <FlameLayer emissive />
      <div aria-hidden="true" className="vignette pointer-events-none fixed inset-0 z-[86]" />

      <header className="pointer-events-none fixed inset-x-0 top-0 z-[80] flex items-center justify-between bg-gradient-to-b from-night/80 to-transparent px-5 py-4 sm:px-7">
        <p className="flex items-baseline gap-3 py-2">
          <span lang="ta" className="font-tamil text-[19px] font-semibold text-flame">தமிழீழம்</span>
          <span className={`${styles.label} hidden font-mono text-[9px] uppercase tracking-[0.32em] text-ash sm:block`}>{t('brand-sub')}</span>
        </p>
        <div className="pointer-events-auto flex border border-bone/30 bg-night/50 backdrop-blur-md" role="group" aria-label={t('ui-language')}>
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              lang={l}
              className={`min-h-[44px] border-r border-bone/15 px-3.5 font-mono text-[11px] tracking-[0.12em] transition-colors last:border-r-0 sm:min-h-0 sm:py-1.5 ${
                lang === l ? 'bg-bone text-night' : 'text-ash hover:text-bone'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <main className={styles.room} style={{ ...SCENE, ['--lamp' as string]: `${lamp}px` }}>
        <div aria-hidden="true" className={styles.stage}>
          {/* the name, cut into the wall behind: read by whatever light reaches it */}
          <span lang="ta" className={styles.inscription}>தமிழீழம்</span>
          <span lang="ta" className={`${styles.inscription} ${styles.inscriptionLit}`}>தமிழீழம்</span>

          <div className={styles.floor}>
            <KolamFloor />
          </div>

          <div ref={stand} className={styles.stand}>
            <Vilakku size={lamp} view={VIEW} flame={0.15} />
          </div>
        </div>

        <div className={styles.copy}>
          <p className={`${styles.arrive} ${styles.label} mb-6 flex items-center gap-3 font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] text-ash sm:mb-7 sm:text-[10px]`}>
            <span aria-hidden="true" className="h-px w-7 shrink-0 bg-blood" />
            {c.whisper}
          </p>
          <h1 className={`lang-title font-display font-light ${styles.title}`}>
            <span className={styles.arrive} style={{ ['--i' as string]: 1 }}>{c.line1}</span>{' '}
            <em className={styles.arrive} style={{ ['--i' as string]: 2 }}>{c.line2}</em>
          </h1>
          <p className={`${styles.arrive} ${styles.sub} text-bone-dim`} style={{ ['--i' as string]: 3 }}>{c.sub}</p>
          <p className={`${styles.arrive} ${styles.label} mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-gold sm:mt-10 sm:text-[11px]`} style={{ ['--i' as string]: 4 }}>
            <span aria-hidden="true" className="h-px w-7 shrink-0 bg-gold" />
            {c.status}
          </p>
        </div>

        <p className={`${styles.caption} ${styles.label} font-mono text-[9px] uppercase tracking-[0.18em] text-ash sm:text-[10px]`}>{c.caption}</p>
      </main>
    </>
  )
}
