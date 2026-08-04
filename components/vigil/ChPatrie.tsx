'use client'

import { useState } from 'react'
import { useLang } from '@/context/LanguageContext'
import { locations, type LocationKey } from '@/data/locations'
import { vigil } from '@/data/narrative'
import { useReveal } from '@/hooks/useReveal'
import ChapterOpen from './ChapterOpen'

// ————— Stylised cartography (equirectangular projection) —————
const project = (lon: number, lat: number): [number, number] => [
  (lon - 79.4) * 165,
  (10.05 - lat) * 165,
]

// Simplified island coastline, clockwise from Point Pedro
const COAST: [number, number][] = [
  [80.23, 9.83], [80.45, 9.60], [80.72, 9.42], [80.82, 9.27], [80.95, 8.95],
  [81.20, 8.60], [81.24, 8.44], [81.36, 8.28], [81.55, 7.90], [81.70, 7.70],
  [81.85, 7.40], [81.88, 7.00], [81.85, 6.55], [81.62, 6.28], [81.25, 6.10],
  [80.90, 6.03], [80.58, 5.93], [80.24, 6.02], [79.98, 6.35], [79.86, 6.80],
  [79.83, 7.20], [79.80, 7.60], [79.72, 7.98], [79.80, 8.26], [79.73, 8.62],
  [79.86, 8.88], [79.92, 9.00], [79.70, 9.06], [79.68, 9.14], [80.06, 9.28],
  [79.87, 9.60], [80.00, 9.68], [80.10, 9.76],
]

// ————— Control zones at the 2002 ceasefire —————
// Polygons overshoot into the sea on their coastal sides; the island
// clip-path trims them back to the shoreline.

// LTTE-controlled: the Vanni, from the Mannar coast to the Mullaitivu coast
const VANNI: [number, number][] = [
  [79.55, 9.58], [80.08, 9.50], [80.42, 9.56], [80.60, 9.50], [80.80, 9.42],
  [81.00, 9.30], [80.95, 9.00], [80.72, 8.92], [80.55, 8.70], [80.20, 8.60],
  [79.95, 8.55], [79.55, 8.80],
]
// GOSL-controlled, claimed for Tamil Eelam
const JAFFNA_Y: [number, number][] = [
  [79.40, 10.00], [80.55, 10.00], [80.55, 9.62], [80.42, 9.56], [80.08, 9.52],
  [79.95, 9.58], [79.80, 9.42], [79.60, 9.30], [79.40, 9.28],
]
const MANNAR_Y: [number, number][] = [
  [79.55, 9.10], [79.95, 9.10], [79.98, 8.94], [79.60, 8.88],
]
const VAVUNIYA_Y: [number, number][] = [
  [80.28, 8.92], [80.62, 8.94], [80.74, 8.76], [80.60, 8.58], [80.34, 8.56], [80.20, 8.74],
]
const WEST_Y: [number, number][] = [
  [79.55, 8.58], [80.00, 8.58], [80.02, 8.42], [80.06, 8.06], [79.92, 7.80], [79.55, 7.80],
]
// Partially GOSL-controlled, LTTE pockets: the eastern coastal belt
const EAST_O: [number, number][] = [
  [80.98, 8.92], [81.60, 8.88], [82.10, 8.20], [82.10, 7.40], [82.00, 6.80],
  [81.70, 6.78], [81.45, 6.95], [81.28, 7.25], [81.10, 7.62], [81.02, 8.02],
  [80.92, 8.40], [80.88, 8.65],
]

const toPath = (pts: [number, number][]) =>
  'M' + pts.map(([lon, lat]) => project(lon, lat).map((n) => n.toFixed(1)).join(',')).join(' L') + ' Z'

const ISLAND_PATH = toPath(COAST)

const ZONE_STYLE = {
  ltte: { fill: 'rgb(var(--c-ember)/0.45)', stroke: 'rgb(var(--c-ember))' },
  claimed: { fill: 'rgb(var(--c-gold)/0.28)', stroke: 'rgb(var(--map-claimed))' },
  partial: { fill: 'rgb(var(--c-flame)/0.36)', stroke: 'rgb(var(--map-partial))' },
} as const

const ZONES: { d: string; kind: keyof typeof ZONE_STYLE }[] = [
  { d: toPath(VANNI), kind: 'ltte' },
  { d: toPath(EAST_O), kind: 'partial' },
  { d: toPath(JAFFNA_Y), kind: 'claimed' },
  { d: toPath(MANNAR_Y), kind: 'claimed' },
  { d: toPath(VAVUNIYA_Y), kind: 'claimed' },
  { d: toPath(WEST_Y), kind: 'claimed' },
]

const LEGEND: Record<'fr' | 'en' | 'ta', { claimed: string; ltte: string; partial: string; caption: string }> = {
  fr: {
    claimed: 'Contrôlé par le GOSL, revendiqué pour le Tamil Eelam',
    ltte: 'Contrôlé par le LTTE',
    partial: 'Partiellement contrôlé par le GOSL, poches LTTE',
    caption: 'Zones de contrôle au cessez-le-feu de 2002',
  },
  en: {
    claimed: 'Controlled by GOSL, claimed for Tamil Eelam',
    ltte: 'Controlled by LTTE',
    partial: 'Partially controlled by GOSL, LTTE pockets',
    caption: 'Zones of control at the 2002 ceasefire',
  },
  ta: {
    claimed: 'அரசுக் கட்டுப்பாட்டில், தமிழீழத்திற்கு கோரப்பட்டது',
    ltte: 'விடுதலைப் புலிகளின் கட்டுப்பாட்டில்',
    partial: 'பகுதி அரசுக் கட்டுப்பாடு, புலிகளின் பகுதிகள்',
    caption: '2002 போர்நிறுத்தத்தின் கட்டுப்பாட்டு எல்லைகள்',
  },
}

// Chapter VII — the homeland: a hand-drawn night atlas of Tamil Eelam.
export default function ChPatrie() {
  const { lang } = useLang()
  const v = vigil[lang]
  const ref = useReveal()
  const [selected, setSelected] = useState<LocationKey>('jaffna')
  const loc = locations[selected]
  const [selX, selY] = project(loc.coords[0], loc.coords[1])

  return (
    <section id="patrie" className="relative bg-night-2">
      <ChapterOpen id="patrie" lede={v.patrieLede} />
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="grid max-w-[1300px] grid-cols-1 gap-8 px-5 pb-24 sm:px-[6vw] lg:grid-cols-[1.2fr_1fr] lg:gap-[4vw] lg:pb-28"
      >
        {/* ——— the atlas ——— */}
        <div className="reveal relative border border-bone/20 bg-[rgb(var(--c-night-2))] px-3 py-4 sm:px-6 sm:py-6">
          <div className="pointer-events-none absolute left-4 top-4 font-mono text-[9px] uppercase tracking-[0.28em] text-ash-dim sm:left-6 sm:top-5">
            79°E — 82°E · 6°N — 10°N
          </div>
          <svg
            viewBox="0 0 440 700"
            className="mx-auto block h-auto max-h-[74svh] w-full"
            role="img"
            aria-label="Tamil Eelam"
          >
            {/* graticule */}
            <g stroke="rgb(var(--c-bone)/0.05)" strokeWidth="1">
              {[0, 1, 2, 3].map((i) => (
                <line key={`v${i}`} x1={33 + i * 123.75} y1="0" x2={33 + i * 123.75} y2="700" />
              ))}
              {[0, 1, 2, 3, 4].map((i) => (
                <line key={`h${i}`} x1="0" y1={8.25 + i * 165} x2="440" y2={8.25 + i * 165} />
              ))}
            </g>

            {/* island */}
            <defs>
              <clipPath id="island-clip">
                <path d={ISLAND_PATH} />
              </clipPath>
            </defs>
            <path d={ISLAND_PATH} fill="rgb(var(--c-soot))" stroke="rgb(var(--c-bone)/0.28)" strokeWidth="1.2" />

            {/* zones of control at the 2002 ceasefire, clipped to the coastline */}
            <g clipPath="url(#island-clip)">
              {ZONES.map((z, i) => (
                <path
                  key={i}
                  d={z.d}
                  fill={ZONE_STYLE[z.kind].fill}
                  stroke={ZONE_STYLE[z.kind].stroke}
                  strokeWidth="1"
                  strokeOpacity="0.6"
                />
              ))}
            </g>

            {/* city markers */}
            {(Object.keys(locations) as LocationKey[]).map((key) => {
              const l = locations[key]
              const [x, y] = project(l.coords[0], l.coords[1])
              const r = l.type === 'capital' ? 6 : l.type === 'major' ? 4.5 : 3.5
              const active = key === selected
              return (
                <g key={key} className="cursor-pointer" onClick={() => setSelected(key)}>
                  {/* pulse ring */}
                  <circle cx={x} cy={y} r={r} fill="none" stroke={active ? 'rgb(var(--c-flame-hot))' : 'rgb(var(--c-ember))'} strokeWidth="1">
                    <animate attributeName="r" values={`${r};${r + 9}`} dur="2.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0" dur="2.6s" repeatCount="indefinite" />
                  </circle>
                  {/* memorial heartbeat over Mullivaikkal */}
                  {key === 'mullivaikkal' && (
                    <circle cx={x} cy={y} r={r} fill="none" stroke="rgb(var(--c-blood))" strokeWidth="1.6">
                      <animate attributeName="r" values={`${r};${r + 16};${r + 16}`} keyTimes="0;0.55;1" dur="1.9s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.9;0;0" keyTimes="0;0.55;1" dur="1.9s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    cx={x} cy={y} r={r}
                    fill={l.type === 'capital' ? 'rgb(var(--c-night))' : 'rgb(var(--c-ember))'}
                    stroke={active ? 'rgb(var(--c-flame-hot))' : l.type === 'capital' ? 'rgb(var(--c-flame))' : 'rgb(var(--c-bone)/0.5)'}
                    strokeWidth={l.type === 'capital' ? 2.4 : 1}
                  />
                  {/* generous invisible hit area */}
                  <circle cx={x} cy={y} r="14" fill="transparent" />
                </g>
              )
            })}

            {/* selected label */}
            <g pointerEvents="none">
              <line
                x1={selX + 8} y1={selY - 8} x2={selX + 26} y2={selY - 26}
                stroke="rgb(var(--c-flame-hot))" strokeWidth="1"
              />
              <text
                x={selX + 30} y={selY - 30}
                fill="rgb(var(--c-bone))"
                fontSize="15"
                fontStyle="italic"
                fontFamily="Fraunces, serif"
                textAnchor={selX > 300 ? 'end' : 'start'}
              >
                {loc.name[lang]}
              </text>
            </g>
          </svg>
          {/* legend, in the empty sea to the north-east */}
          <div className="pointer-events-none absolute right-3 top-10 flex w-[150px] flex-col gap-2 sm:right-6 sm:top-12 sm:w-[190px]">
            {(['claimed', 'ltte', 'partial'] as const).map((kind) => (
              <div key={kind} className="flex items-start gap-2">
                <span
                  className="mt-[2px] inline-block h-2.5 w-5 shrink-0 border"
                  style={{ background: ZONE_STYLE[kind].fill, borderColor: ZONE_STYLE[kind].stroke }}
                />
                <span className="font-mono text-[8px] uppercase leading-[1.5] tracking-[0.08em] text-ash">
                  {LEGEND[lang][kind]}
                </span>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-ash-dim sm:bottom-5 sm:right-6">
            தமிழீழம் · {LEGEND[lang].caption}
          </div>
        </div>

        {/* ——— side panel ——— */}
        <div className="flex flex-col gap-5">
          <div className="reveal font-mono text-[10px] uppercase tracking-[0.2em] text-ash">{v.patrieHint}</div>
          <div className="reveal d1 flex flex-wrap gap-2">
            {(Object.keys(locations) as LocationKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className={`border px-3 py-2 font-mono text-[11px] tracking-[0.06em] transition-all duration-200 ${
                  key === selected
                    ? 'border-ember bg-ember/10 text-bone'
                    : 'border-bone/15 text-bone-dim hover:border-ember hover:text-bone'
                }`}
              >
                {locations[key].name[lang]}
              </button>
            ))}
          </div>
          <div
            key={selected}
            className="reveal d2 animate-rise-in border border-bone/15 border-l-2 border-l-ember bg-bone/[0.02] px-6 py-5"
            style={{ animationDuration: '0.7s' }}
          >
            <div className="font-display text-[26px] italic leading-tight text-flame">{loc.name[lang]}</div>
            <div className="mb-3 mt-1 font-tamil text-sm text-ash">{loc.tamil}</div>
            <div className="text-[14.5px] leading-[1.7] text-bone-dim">{loc.desc[lang]}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
