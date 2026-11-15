'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/context/LanguageContext'
import { researchCopy } from '@/data/research'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useScrub } from '@/hooks/useScrub'
import s from './JuilletExil.module.css'

// the stylesheet holds the room on screen under this condition; anywhere else
// it shows the last image and nothing moves
const HOLD = '(scripting: enabled) and (min-height: 600px)'

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
// every movement starts and ends slowly: a hand, not a mechanism
const ease = (n: number) => { const t = clamp01(n); return t * t * (3 - 2 * t) }
const r = (n: number) => +n.toFixed(3)
// what the lamp leaves on a thing once it has gone: the opacity of .t in the stylesheet
const TRACE = 0.4
// the stylesheet changes layout under this condition, and the numbers below with it
const UPRIGHT = '(max-aspect-ratio: 4/5)'

type Part = { el: HTMLElement | SVGElement; role: string; a: number; d: number; dx: number; dy: number; lift: number; tilt: number; near: number; was: string }
// Each moving part keeps its numbers in the stylesheet, where the two layouts
// are: when it starts (--a), how long it lasts (--d), where it goes.
const measure = (node: HTMLElement): Part[] =>
  Array.from(node.querySelectorAll<HTMLElement | SVGElement>('[data-role]'), (el) => {
    const css = getComputedStyle(el)
    const n = (name: string) => parseFloat(css.getPropertyValue(name)) || 0
    return { el, role: el.dataset.role ?? '', a: n('--a'), d: n('--d') || 1, dx: n('--dx'), dy: n('--dy'), lift: n('--lift'), tilt: n('--tilt'), near: n('--near') || 0.07, was: '' }
  })

// the grille of the radio: five bars cut to the circle they sit in
const GRILLE = [-20, -10, 0, 10, 20].map((dy) => {
  const half = Math.round(Math.sqrt(36 * 36 - dy * dy) * 0.86)
  return `M${66 - half} ${112 + dy}h${half * 2}`
}).join('')
// twelve marks and no numeral: a clock face nobody can read a date into
const HOURS = Array.from({ length: 12 }, (_, i) => {
  const a = (i * Math.PI) / 6
  const r = i % 3 ? 62 : 56
  return `M${+(90 + Math.sin(a) * r).toFixed(1)} ${+(90 - Math.cos(a) * r).toFixed(1)}L${+(90 + Math.sin(a) * 68).toFixed(1)} ${+(90 - Math.cos(a) * 68).toFixed(1)}`
}).join('')

/**
 * The inside of July 1983: a room at night, an open suitcase on the floor,
 * and around it the ordinary things of a household. An evocation, not an
 * archive: no object carries a word, the frame on the wall is empty, and
 * nothing here is given as one family's belongings.
 *
 * The scroll is the hands nobody sees: the exercise book, the folded cloth
 * and the keys go into the case, the pot is lifted, held over it and put back,
 * the lid comes down, and the lamp leaves the room with everything else still
 * on the floor.
 *
 * No `--p` here: the room is 160 elements and an inherited property restyled
 * all of them on every frame. `paint` writes a transform or an opacity on the
 * dozen parts that move ([data-role]) and, only while the lamp is leaving, on
 * the lit sides ([data-tone]). The markup the server sends is the last image.
 */
export default function JuilletExil() {
  const { lang } = useLang()
  const still = useReducedMotion()
  const [held, setHeld] = useState(true)
  const parts = useRef<Part[] | null>(null)
  const tones = useRef<{ els: SVGElement[]; was: string } | null>(null)
  const at = useRef(1)
  const holding = useRef(true)

  const paint = (progress: number) => {
    const node = ref.current
    if (!node) return
    at.current = progress
    // a screen too short to hold the room shows the last image
    const p = holding.current ? progress : 1
    const lit = clamp01((0.94 - p) / 0.12)
    for (const q of (parts.current ??= measure(node))) {
      const t = clamp01((p - q.a) / q.d)
      // taken off the floor, carried, lowered: three movements that overlap,
      // so that nothing ever slides. The pot goes up, across, stays a long
      // while over the case, and comes back where it was.
      const pot = q.role === 'held' || q.role === 'back' || q.role === 'under'
      const up = pot ? ease(t / 0.18) - ease((t - 0.82) / 0.18) : ease(t / 0.28) - ease((t - 0.72) / 0.28)
      const go = pot ? ease((t - 0.1) / 0.2) - ease((t - 0.64) / 0.22) : ease((t - 0.18) / 0.62)
      let transform = ''
      let opacity = ''
      switch (q.role) {
        case 'lifted':
        case 'held':
          transform = `translate3d(calc(var(--u) * ${r(q.dx * go)}), calc(var(--u) * ${r(q.dy * go - q.lift * up)}), 0) rotate(${r(q.tilt * up)}deg) scale(${r(1 + q.near * up)})`
          break
        // shadows: of a thing that goes into the case, of the pot on the floor,
        // of the pot over the case, of what never moves
        case 'gone': opacity = `${r(lit * (1 - ease(t / 0.28)))}`; break
        case 'back': opacity = `${r(lit * (1 - up))}`; break
        case 'under': opacity = `${r(lit * go)}`; break
        case 'cast': opacity = `${r(lit)}`; break
        case 'lid': transform = `scaleY(${r(1 - ease(t / 0.55))})`; break
        case 'top': transform = `scaleY(${r(ease((t - 0.45) / 0.55))})`; break
        // the lamp is carried out by the side it stood on
        case 'wash': opacity = `${r(lit)}`; transform = `translate3d(${r((lit - 1) * 16)}%, 0, 0)`; break
        case 'veil': opacity = `calc(${r(1 - lit)} * var(--dark))`; break
      }
      const now = `${transform}|${opacity}`
      if (now === q.was) continue
      q.was = now
      if (transform) q.el.style.transform = transform
      if (opacity) q.el.style.opacity = opacity
    }
    const tone = `${r(TRACE + (1 - TRACE) * lit)}`
    const lamp = (tones.current ??= { els: Array.from(node.querySelectorAll<SVGElement>('[data-tone]')), was: '' })
    if (tone === lamp.was) return
    lamp.was = tone
    for (const el of lamp.els) el.style.opacity = tone
  }
  const ref = useScrub<HTMLDivElement>({ pinned: true, rest: 1, variable: false, onChange: paint })

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const hold = window.matchMedia(HOLD)
    const upright = window.matchMedia(UPRIGHT)
    const fit = () => {
      holding.current = hold.matches
      setHeld(hold.matches)
      parts.current = null
      paint(at.current)
    }
    fit()
    // the pendulum is the only thing here that moves by itself
    let visible = false
    const sync = () => { node.dataset.running = String(visible && !document.hidden) }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    observer.observe(node)
    hold.addEventListener('change', fit)
    upright.addEventListener('change', fit)
    document.addEventListener('visibilitychange', sync)
    return () => { observer.disconnect(); hold.removeEventListener('change', fit); upright.removeEventListener('change', fit); document.removeEventListener('visibilitychange', sync) }
    // paint only reads refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref])

  return (
    <div ref={ref} className={s.track} data-held={held} data-still={still}>
      <figure className={s.stage}>
        <figcaption className={s.caption}>
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-gold">03 · {researchCopy.illustration[lang]}</span>
        </figcaption>

        <div className={s.room} aria-hidden="true">
          <div className={s.set}>
            <span className={s.floor} />
            {/* the lamp is out of frame, to the left: this is what it reaches */}
            <span className={s.wash} data-role="wash" />

            {/* ————— on the wall: none of it comes down ————— */}
            <svg viewBox="0 0 180 270" className={`${s.obj} ${s.clock}`} focusable="false">
              <g className={s.t} data-tone="">
                <circle cx="90" cy="90" r="70" className={s.w1} />
                <path d="M26 44A84 84 0 0 0 26 136" className={s.hi} />
              </g>
              <rect x="58" y="160" width="64" height="100" rx="3" className={s.b} />
              <rect x="68" y="182" width="44" height="68" rx="1" />
              <g className={s.pendulum}>
                <path d="M90 176V228" />
                <circle cx="90" cy="237" r="10" className={s.b} />
                <g className={s.t} data-tone=""><circle cx="90" cy="237" r="10" className={s.g1} /></g>
              </g>
              <circle cx="90" cy="90" r="84" className={s.b} />
              <g className={s.t} data-tone=""><circle cx="90" cy="90" r="84" className={s.g2} /><path d="M22 52A80 80 0 0 0 22 128" className={s.hi} /></g>
              <circle cx="90" cy="90" r="70" />
              <path d={HOURS} />
              <path d="M90 90L64 52M90 90L138 112" className={s.thick} />
              <circle cx="90" cy="90" r="3.5" className={s.dot} />
            </svg>

            <svg viewBox="0 0 150 222" className={`${s.obj} ${s.frame}`} focusable="false">
              {/* hung a little askew, and empty: the wall shows through it */}
              <g transform="rotate(-1.6 75 8)">
                <path d="M75 8L22 40M75 8L128 40" />
                <circle cx="75" cy="8" r="3" className={s.dot} />
                <path d="M6 40H144V214H6ZM28 62V192H122V62Z" fillRule="evenodd" className={s.b} />
                <g className={s.t} data-tone="">
                  <path d="M6 40H144V214H6ZM28 62V192H122V62Z" fillRule="evenodd" className={s.g2} />
                  <path d="M6 40V214H28V192V62H122L144 40Z" className={s.g2} />
                  <path d="M10 44V210" className={s.hi} />
                </g>
                <path d="M6 40L28 62M144 40L122 62M6 214L28 192M144 214L122 192" />
              </g>
            </svg>

            <svg viewBox="0 0 150 320" className={`${s.obj} ${s.umbrella}`} focusable="false">
              <g transform="rotate(11 40 304)">
                <path d="M40 78V34C40 6 76 6 76 34V42" className={s.thick} />
                <path d="M40 304C28 236 20 140 27 90Q40 74 53 90C60 140 52 236 40 304Z" className={s.b} />
                <g className={s.t} data-tone=""><path d="M40 304C28 236 20 140 27 90Q32 82 36 80C28 150 34 240 40 304Z" className={s.w2} /></g>
                <path d="M36 82C34 150 36 240 40 300M46 82C50 150 46 240 40 300M24 150Q40 160 56 150" />
              </g>
            </svg>

            {/* ————— what each thing on the floor does to the lamplight ————— */}
            <span className={`${s.shade} ${s.potShade}`} data-role="back" />
            <span className={`${s.shade} ${s.radioShade}`} data-role="cast" />
            <span className={`${s.shade} ${s.caseShade}`} data-role="cast" />
            <span className={`${s.shade} ${s.bookShade}`} data-role="gone" />
            <span className={`${s.shade} ${s.clothShade}`} data-role="gone" />
            <span className={`${s.shade} ${s.keysShade}`} data-role="gone" />

            {/* ————— the case, open ————— */}
            <div className={s.case}>
              <svg viewBox="0 0 440 200" className={s.lid} data-role="lid" focusable="false">
                <path d="M4 200V14Q4 4 14 4H426Q436 4 436 14V200Z" className={s.b} />
                <g className={s.t} data-tone="">
                  <path d="M4 200V14Q4 4 14 4H426Q436 4 436 14V200Z" className={s.g2} />
                  <path d="M26 200V26H414V200Z" className={s.w1} />
                  <path d="M10 196V16" className={s.hi} />
                </g>
                <path d="M26 200V26H414V200M26 150Q220 132 414 150M150 142V200M290 142V200" />
              </svg>
              <svg viewBox="0 0 440 262" className={s.tray} focusable="false">
                <path d="M4 0H436V196H4Z" className={s.b} />
                <g className={s.t} data-tone=""><path d="M4 0H436V196H4Z" className={s.w1} /><path d="M4 0H436L414 40H26Z" className={s.w1} /></g>
                <path d="M26 40H414V186H26ZM4 0L26 40M436 0L414 40" />
                <path d="M4 196H436V230Q436 240 426 240H14Q4 240 4 230Z" className={s.b} />
                <g className={s.t} data-tone="">
                  <path d="M4 196H436V230Q436 240 426 240H14Q4 240 4 230Z" className={s.g2} />
                  <path d="M10 200V234" className={s.hi} />
                </g>
                <path d="M184 216V224Q184 256 220 256Q256 256 256 224V216" className={s.thick} />
                <path d="M104 196V214H126V196M314 196V214H336V196" />
              </svg>
            </div>

            <svg viewBox="0 0 232 166" className={`${s.obj} ${s.radio}`} focusable="false">
              <path d="M196 44L224 6" />
              <circle cx="225" cy="5" r="3" className={s.dot} />
              <path d="M44 44C44 10 176 10 176 44" className={s.thick} />
              <path d="M10 52Q10 42 20 42H200Q210 42 210 52V150Q210 160 200 160H20Q10 160 10 150Z" className={s.b} />
              <g className={s.t} data-tone="">
                <path d="M10 52Q10 42 20 42H200Q210 42 210 52V150Q210 160 200 160H20Q10 160 10 150Z" className={s.g2} />
                <circle cx="66" cy="112" r="36" className={s.w1} />
                <rect x="124" y="74" width="72" height="24" rx="2" className={s.g1} />
                <path d="M16 50V152" className={s.hi} />
              </g>
              <path d="M10 58H210" />
              <circle cx="66" cy="112" r="36" />
              <path d={GRILLE} />
              <rect x="124" y="74" width="72" height="24" rx="2" />
              <path d="M134 92v-6M146 92v-6M158 92v-6M170 92v-6M182 92v-6M152 74V98" />
              <circle cx="140" cy="130" r="11" /><circle cx="180" cy="130" r="11" />
              <path d="M140 130L146 122M180 130L174 122" />
            </svg>

            {/* ————— what goes into the case ————— */}
            <svg viewBox="0 0 160 118" className={`${s.obj} ${s.lifted} ${s.book}`} data-role="lifted" focusable="false">
              <g transform="rotate(-6 80 60)">
                <path d="M16 20H130V96H16Z" className={s.b} transform="translate(5 6)" />
                <path d="M21 98H135M135 26V102H21" />
                <path d="M16 20H130V96H16Z" className={s.b} />
                <g className={s.t} data-tone="">
                  <path d="M16 20H130V96H16Z" className={s.g2} />
                  <path d="M16 20H34V96H16Z" className={s.e1} />
                  <rect x="56" y="36" width="54" height="26" rx="1.5" className={s.w2} />
                </g>
                <path d="M34 20V96" />
                <rect x="56" y="36" width="54" height="26" rx="1.5" />
              </g>
              {/* the pencil goes with it */}
              <path d="M30 112L128 90L133 97L32 118L20 117Z" className={s.b} />
              <g className={s.t} data-tone=""><path d="M30 112L128 90L133 97L32 118Z" className={s.g1} /></g>
              <path d="M30 112L32 118" />
            </svg>

            <svg viewBox="0 0 200 136" className={`${s.obj} ${s.lifted} ${s.cloth}`} data-role="lifted" focusable="false">
              <path d="M6 82V116Q6 128 18 128H184Q194 128 194 118V82Z" className={s.b} />
              <path d="M12 6H188Q196 6 196 14V84Q196 92 188 92H12Q4 92 4 84V14Q4 6 12 6Z" className={s.b} />
              <g className={s.t} data-tone="">
                <path d="M12 6H188Q196 6 196 14V84Q196 92 188 92H12Q4 92 4 84V14Q4 6 12 6Z" className={s.w1} />
                <path d="M144 6H174V92H144Z" className={s.e1} />
                <path d="M144 92H174V128H144Z" className={s.e1} />
                <path d="M150 6V128M168 6V128" className={s.hi} />
                <path d="M10 14V84" className={s.hi} />
              </g>
              <path d="M6 104H194M6 116H194M4 50Q100 58 196 50" />
            </svg>

            <svg viewBox="0 0 130 92" className={`${s.obj} ${s.lifted} ${s.keys}`} data-role="lifted" focusable="false">
              <g className={s.t} data-tone=""><ellipse cx="32" cy="30" rx="22" ry="15" className={`${s.hi} ${s.thick}`} /></g>
              <ellipse cx="32" cy="30" rx="22" ry="15" className={s.thick} />
              {([[52, 34, 118, 46], [48, 42, 104, 74], [38, 46, 70, 86]] as const).map(([x1, y1, x2, y2], i) => {
                const a = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
                const len = Math.round(Math.hypot(x2 - x1, y2 - y1))
                return (
                  <g key={i} transform={`translate(${x1} ${y1}) rotate(${a.toFixed(1)})`}>
                    <ellipse cx="6" cy="0" rx="9" ry="6.5" className={s.b} />
                    <g className={s.t} data-tone=""><ellipse cx="6" cy="0" rx="9" ry="6.5" className={s.g1} /></g>
                    <path d={`M15 0H${len}M${len - 12} 0v9h5v-5h4v5h3V0`} className={s.thick} />
                  </g>
                )
              })}
            </svg>

            {/* ————— the lid, coming down over what was chosen ————— */}
            <div className={s.case}>
              <svg viewBox="0 0 440 240" className={s.top} data-role="top" focusable="false">
                <path d="M14 4H426Q436 4 436 14V228Q436 238 426 238H14Q4 238 4 228V14Q4 4 14 4Z" className={s.b} />
                <g className={s.t} data-tone="">
                  <path d="M14 4H426Q436 4 436 14V228Q436 238 426 238H14Q4 238 4 228V14Q4 4 14 4Z" className={s.g2} />
                  <path d="M4 200H436V228Q436 238 426 238H14Q4 238 4 228Z" className={s.g2} />
                  <path d="M10 14V230" className={s.hi} />
                </g>
                <path d="M4 200H436M4 44L40 4M436 44L400 4M4 160L40 200M436 160L400 200" />
                <path d="M100 206H130V238H100ZM310 206H340V238H310Z" className={s.b} />
                <g className={s.t} data-tone=""><path d="M100 206H130V238H100ZM310 206H340V238H310Z" className={s.w2} /></g>
              </svg>
            </div>

            {/* ————— lifted, held over the case, put back ————— */}
            <span className={`${s.shade} ${s.hoverShade}`} data-role="under" />
            <svg viewBox="0 0 200 196" className={`${s.obj} ${s.held} ${s.pot}`} data-role="held" focusable="false">
              <path d="M38 50C30 64 8 88 8 122C8 164 50 188 100 188C150 188 192 164 192 122C192 88 170 64 162 50Z" className={s.b} />
              <g className={s.t} data-tone="">
                <path d="M38 50C30 64 8 88 8 122C8 164 50 188 100 188C150 188 192 164 192 122C192 88 170 64 162 50Z" className={s.g2} />
                <path d="M30 70C12 96 6 140 44 172C20 140 26 100 46 72Z" className={s.g1} />
              </g>
              <path d="M17 100Q100 124 183 100" />
              <ellipse cx="100" cy="48" rx="68" ry="20" className={s.b} />
              <g className={s.t} data-tone=""><ellipse cx="100" cy="48" rx="68" ry="20" className={s.g2} /></g>
              <path d="M44 44C58 20 142 20 156 44" className={s.b} />
              <g className={s.t} data-tone=""><path d="M44 44C58 20 142 20 156 44C120 54 80 54 44 44Z" className={s.g2} /><path d="M52 40C62 28 80 24 92 24" className={s.hi} /></g>
              <path d="M44 44Q100 60 156 44M94 25V16M106 25V16" />
              <ellipse cx="100" cy="13" rx="11" ry="6" className={s.b} />
              <g className={s.t} data-tone=""><ellipse cx="100" cy="13" rx="11" ry="6" className={s.g1} /></g>
            </svg>
          </div>
          {/* what is left of the light once the lamp has gone */}
          <span className={s.veil} data-role="veil" />
        </div>
      </figure>
    </div>
  )
}
