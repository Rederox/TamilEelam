'use client'

import type { ReactNode } from 'react'
import { useLang } from '@/context/LanguageContext'
import { mvScenes } from '@/data/narrative'
import { useSceneProgress } from '@/hooks/useSceneProgress'
import ChapterOpen from './ChapterOpen'
import Flame from './Flame'
import GlSea from './gl/GlSea'
import InkNames from './InkNames'
import KanjiBowl from './KanjiBowl'

// 0 sand · 1 safe zone · 2 shells · 3 the names · 4 kanji · 5 silence
// 6 the count · 7 naming it · 8 a survivor · 9 the 18th of May
const SCENES = 10

function Scene({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 grid place-items-center px-6 text-center transition-opacity duration-700 ${on ? 'opacity-100' : 'opacity-0'}`}
    >
      {children}
    </div>
  )
}

const SHELLS = [
  { x: '12%', st: 2.6, sd: 0 },
  { x: '28%', st: 3.4, sd: 1.1 },
  { x: '41%', st: 2.9, sd: 0.5 },
  { x: '55%', st: 3.8, sd: 1.9 },
  { x: '67%', st: 2.7, sd: 0.9 },
  { x: '79%', st: 3.2, sd: 2.3 },
  { x: '90%', st: 2.9, sd: 1.5 },
]

// Chapter VI — Mullivaikkal.
// Told through gestures rather than declarations: the sand, the promise,
// the shelling, the names inked on children's arms, the shared gruel,
// the silence, the count, the word for it, a voice, and the ritual that
// carries all of it into every 18 May since.
export default function ChMullivaikkal() {
  const { lang, t } = useLang()
  const s = mvScenes[lang]
  const { ref, progress } = useSceneProgress<HTMLDivElement>()

  const scene = Math.min(SCENES - 1, Math.floor(progress * SCENES))

  // the "safe zone" narrowing beneath the words
  const stripWidths = ['64%', '40%', '14%', '0%', '0%', '0%', '0%', '0%', '0%', '0%']
  const onStrip = scene <= 2
  const shellsOn = scene === 2

  // the count scrubs with the scroll through scene 6
  const countP = Math.min(1, Math.max(0, (progress - 6 / SCENES) / (1 / SCENES)))
  const count = Math.floor((1 - Math.pow(1 - countP, 3)) * 40000)
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US'

  const line = 'max-w-[680px] font-body text-[clamp(19px,2.7vw,28px)] leading-[1.7] text-bone'

  return (
    <section id="mullivaikkal" className="relative bg-[rgb(var(--ch-void))]">
      <ChapterOpen id="mullivaikkal" lede={s.lede} />
      <div ref={ref} className="relative h-[700svh]">
        <div className="sticky top-0 grid h-[100svh] place-items-center overflow-hidden">
          {/* the sea itself — the other side of the trap */}
          <GlSea agitation={shellsOn ? 1 : 0} alpha={0.85} />

          {/* artillery */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 motion-reduce:hidden ${shellsOn ? 'opacity-100' : 'opacity-0'}`}
          >
            {SHELLS.map((sh, i) => (
              <span
                key={i}
                className="shell"
                style={{ left: sh.x, ['--st' as string]: `${sh.st}s`, ['--sd' as string]: `${sh.sd}s` }}
              />
            ))}
          </div>

          {/* the strip of sand */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-2 -translate-x-1/2 -translate-y-1/2 rounded bg-gradient-to-r from-transparent via-[rgb(var(--ch-sand))] to-transparent transition-all duration-700"
            style={{ width: stripWidths[scene], opacity: onStrip ? 0.55 : 0 }}
          />
          {/* the people on it, pressed closer as it narrows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-3 -translate-x-1/2 -translate-y-[calc(50%+8px)] transition-all duration-700"
            style={{ width: stripWidths[scene], opacity: onStrip ? 1 : 0 }}
          >
            {Array.from({ length: 34 }, (_, i) => (
              <span
                key={i}
                className="figure"
                style={{
                  left: `${(i * 61) % 100}%`,
                  height: `${7 + ((i * 37) % 5)}px`,
                  opacity: 0.35 + ((i * 13) % 10) * 0.05,
                }}
              />
            ))}
          </div>
          {/* where the shells landed */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 -translate-x-1/2 -translate-y-1/2 rounded blur-[1.5px] transition-all duration-700"
            style={{
              width: stripWidths[scene],
              opacity: shellsOn ? 0.8 : 0,
              background:
                'radial-gradient(circle at 24% 50%, rgb(var(--c-blood)/0.95), transparent 22%), radial-gradient(circle at 47% 50%, rgb(var(--c-blood)/0.8), transparent 16%), radial-gradient(circle at 68% 50%, rgb(var(--c-blood)/0.9), transparent 20%), radial-gradient(circle at 86% 50%, rgb(var(--c-blood)/0.7), transparent 14%)',
            }}
          />

          <Scene on={scene === 0}><p className={line}>{s.sand}</p></Scene>
          <Scene on={scene === 1}><p className={line}>{s.zone}</p></Scene>
          <Scene on={scene === 2}><p className={line}>{s.shells}</p></Scene>

          {/* the names — held in silence, nothing else on screen */}
          <Scene on={scene === 3}>
            <div className="flex flex-col items-center">
              <p className="max-w-[680px] font-body text-[clamp(20px,3vw,32px)] leading-[1.55] text-bone">
                {s.namesLine}
              </p>
              <p className="mt-5 font-body text-[clamp(16px,2.1vw,22px)] italic text-ash">{s.namesSub}</p>
              {scene === 3 && <InkNames />}
            </div>
          </Scene>

          {/* the shared bowl */}
          <Scene on={scene === 4}>
            <div className="flex flex-col items-center gap-8">
              {scene === 4 && <KanjiBowl size={104} />}
              <p className={line}>{s.kanji}</p>
            </div>
          </Scene>

          {/* nobody was watching */}
          <Scene on={scene === 5}>
            <div>
              <p className="max-w-[680px] font-body text-[clamp(19px,2.7vw,28px)] leading-[1.9] text-ash">
                {s.silence}
              </p>
              <p className="mt-7 max-w-[680px] font-display text-[clamp(22px,3.4vw,40px)] italic leading-[1.35] text-bone">
                {s.silenceSub}
              </p>
            </div>
          </Scene>

          {/* what it cost */}
          <Scene on={scene === 6}>
            <div>
              <div className="font-display text-[clamp(64px,14vw,200px)] font-light leading-none tracking-[-0.03em] text-ember tabular-nums">
                {count.toLocaleString(locale)}
              </div>
              <div className="mt-2 font-display text-[clamp(20px,3vw,34px)] italic text-bone-dim">{s.countSuffix}</div>
              <p className="mx-auto mt-5 max-w-[480px] text-[15px] italic leading-[1.6] text-ash">{s.countLabel}</p>
              <div className="mt-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ash-dim">{s.countSource}</div>
            </div>
          </Scene>

          {/* the stain spreading behind the word */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[70svh] w-[70svh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all ease-out"
            style={{
              transitionDuration: '3000ms',
              background: 'radial-gradient(circle, rgb(var(--c-blood)/0.5), rgb(var(--c-blood)/0.2) 45%, transparent 70%)',
              opacity: scene === 7 ? 1 : 0,
              transform: `translate(-50%, -50%) scale(${scene === 7 ? 1 : 0.25})`,
            }}
          />
          <Scene on={scene === 7}>
            <p className="lang-title mx-auto max-w-[18ch] font-display text-[clamp(30px,5.4vw,64px)] font-[320] leading-[1.2] text-bone">
              {s.naming}
            </p>
          </Scene>

          {/* a voice from the sand */}
          <Scene on={scene === 8}>
            <div className="max-w-[620px]">
              <p className="font-body text-[clamp(20px,3vw,30px)] italic leading-[1.6] text-bone">
                <span className="text-ember">« </span>{t('t1-quote')}<span className="text-ember"> »</span>
              </p>
              <div className="mt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-ash">
                {t('t1-author')} · {t('t1-role')}
              </div>
            </div>
          </Scene>

          {/* the same bowl, every 18 May, everywhere */}
          <Scene on={scene === 9}>
            <div className="flex flex-col items-center gap-7">
              <div className="flex items-end gap-16 sm:gap-20">
                {scene === 9 && <KanjiBowl size={92} />}
                <Flame size={26} lit={scene === 9} />
              </div>
              <p className="max-w-[620px] font-body text-[clamp(18px,2.6vw,26px)] italic leading-[1.6] text-flame">
                {s.dayLine}
              </p>
              <p className="max-w-[520px] text-[15px] leading-[1.7] text-bone-dim">{s.daySub}</p>
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-ash">
                Mullivaikkal Remembrance Day — 18.05
              </div>
            </div>
          </Scene>

          {/* scene progress */}
          <div className="absolute bottom-24 left-1/2 flex -translate-x-1/2 items-center gap-2 lg:bottom-8">
            {Array.from({ length: SCENES }, (_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
                  i === scene ? 'scale-125 bg-flame shadow-[0_0_8px_rgb(var(--c-flame)/0.7)]' : i < scene ? 'bg-ember/70' : 'bg-bone/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
