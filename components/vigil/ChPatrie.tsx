'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/context/LanguageContext'
import { COASTLINE } from '@/data/coastline'
import { districts } from '@/data/districts'
import styles from './PatrieMap.module.css'
import { locations, type LocationKey } from '@/data/locations'
import { experience } from '@/data/experience'
import { vigil } from '@/data/narrative'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useReveal } from '@/hooks/useReveal'
import Air from './Air'
import ChapterOpen from './ChapterOpen'
import ChapterEnd from './ChapterEnd'

// ————— Stylised cartography (equirectangular projection) —————
const project = (lon: number, lat: number): [number, number] => [
  (lon - 79.4) * 165,
  (10.05 - lat) * 165,
]

/** Natural Earth shoreline; this is a locator, not a political or military map. */
const ISLAND_PATH = COASTLINE

const districtPlaces: Record<string, LocationKey> = {
  jaffna: 'jaffna', kilinochchi: 'kilinochchi', mannar: 'mannar',
  mullaitivu: 'mullaitivu', vavuniya: 'vavuniya', trincomalee: 'trincomalee',
  batticaloa: 'batticaloa', ampara: 'amparai', puttalam: 'puttalam',
}
type Selection = { kind: 'place'; key: LocationKey } | { kind: 'district'; id: string }
const districtForPlace = (key: LocationKey) => key === 'mullivaikkal' ? 'mullaitivu' : key === 'amparai' ? 'ampara' : key
const mapCopy = {
  fr: { zones: 'Districts mis en évidence', other: 'Autres districts', district: 'District', source: 'Limites des districts', places: 'Villes et lieux', districts: 'Districts', place: 'Lieu du récit', within: 'Lieux du récit dans ce district', hint: 'Une zone désigne un district. Un point désigne une ville ou un lieu.', coordinates: 'Coordonnées du lieu', districtHint: 'Sélectionnez un lieu ci-dessous pour découvrir son histoire.', belonging: 'Dans le district' },
  en: { zones: 'Highlighted districts', other: 'Other districts', district: 'District', source: 'District boundaries', places: 'Towns and places', districts: 'Districts', place: 'Story location', within: 'Story locations in this district', hint: 'An area represents a district. A point represents a town or place.', coordinates: 'Location coordinates', districtHint: 'Select a place below to discover its story.', belonging: 'In the district' },
  ta: { zones: 'நிறமிடப்பட்ட மாவட்டங்கள்', other: 'பிற மாவட்டங்கள்', district: 'மாவட்டம்', source: 'மாவட்ட எல்லைகள்', places: 'நகரங்களும் இடங்களும்', districts: 'மாவட்டங்கள்', place: 'கதையின் இடம்', within: 'இந்த மாவட்டத்தில் உள்ள இடங்கள்', hint: 'நிறப்பகுதி ஒரு மாவட்டம். புள்ளி ஒரு நகரம் அல்லது இடம்.', coordinates: 'இடத்தின் ஆயத்தொலைவுகள்', districtHint: 'வரலாற்றை அறிய கீழே ஓர் இடத்தைத் தேர்ந்தெடுக்கவும்.', belonging: 'மாவட்டம்' },
}

// Chapter VII — the homeland: a hand-drawn night atlas of Tamil Eelam.
export default function ChPatrie() {
  const { lang } = useLang()
  const v = vigil[lang]
  const ref = useReveal()
  const stillness = useReducedMotion()
  const [selection, setSelection] = useState<Selection>({ kind: 'place', key: 'jaffna' })
  const [mode, setMode] = useState<'place' | 'district'>('place')
  const selectPlace = (key: LocationKey) => { setSelection({ kind: 'place', key }); setMode('place') }
  const selectDistrict = (id: string) => { setSelection({ kind: 'district', id }); setMode('district') }
  const coastRef = useRef<SVGPathElement>(null)

  // the dash length is the path's own length, whatever the coastline becomes
  useEffect(() => {
    const el = coastRef.current
    if (!el) return
    el.style.setProperty('--len', String(Math.ceil(el.getTotalLength())))
  }, [])
  const selectedDistrict = selection.kind === 'district' ? selection.id : districtForPlace(selection.key)
  const c = mapCopy[lang]
  const loc = selection.kind === 'place' ? locations[selection.key] : null
  const districtName = locations[districtPlaces[selectedDistrict]].name[lang]
  const selectedGeometry = districts.find(district => district.id === selectedDistrict)!
  const districtLocations = (Object.keys(locations) as LocationKey[]).filter(key => districtForPlace(key) === selectedDistrict)
  const [selX, selY] = loc ? project(loc.coords[0], loc.coords[1]) : [0, 0]
  const selectionKey = selection.kind === 'place' ? `place-${selection.key}` : `district-${selection.id}`

  return (
    <section id="patrie" className="relative bg-night-2">
      <ChapterOpen id="patrie" lede={v.patrieLede} />
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-5 pb-24 sm:px-[9vw] lg:grid-cols-[1.2fr_1fr] lg:gap-[4vw] lg:pb-28"
      >
        {/* ——— the atlas ——— */}
        <div className={`reveal relative border border-bone/20 bg-[rgb(var(--c-night-2))] px-3 py-4 sm:px-6 sm:py-6 ${styles.atlas}`}>
          {/* relief under the drawing: a map is a claim about ground */}
          <Air kind="ground" intensity={0.55} warmth={0.35} />
          <div className="pointer-events-none absolute left-4 top-4 z-[2] font-mono text-[9px] uppercase tracking-[0.28em] text-ash-dim sm:left-6 sm:top-5">
            79°E — 82°E · 6°N — 10°N
          </div>
          <svg
            viewBox="0 0 440 700"
            className="relative z-[2] mx-auto block h-auto max-h-[74svh] w-full"
            role="group"
            aria-label={experience.map[lang]}
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
              {/* a drawn edge: the ink refuses to follow a perfect vector */}
              <filter id="ink-bleed" x="-8%" y="-8%" width="116%" height="116%">
                <feTurbulence type="fractalNoise" baseFrequency="0.019" numOctaves="3" seed="4" result="n" />
                <feDisplacementMap in="SourceGraphic" in2="n" scale="2.1" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>

            {/* the landmass, then the coastline drawing itself in */}
            <path d={ISLAND_PATH} fill="rgb(var(--c-soot))" filter="url(#ink-bleed)" />
            <g clipPath="url(#island-clip)" className={styles.districts}>
              {districts.map((district, i) => {
                const place = districtPlaces[district.id]
                const active = district.id === selectedDistrict
                return <path key={district.id} d={district.path} fillRule="evenodd"
                  className={styles.district} data-highlighted={Boolean(place)} data-active={active} data-tone={i % 3}
                  vectorEffect="non-scaling-stroke"
                  role={place ? 'button' : undefined} tabIndex={place ? 0 : undefined}
                  aria-label={place ? `${c.district} · ${locations[place].name[lang]}` : undefined}
                  aria-pressed={place ? selection.kind === 'district' && active : undefined}
                  onClick={place ? () => selectDistrict(district.id) : undefined}
                  onKeyDown={place ? e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectDistrict(district.id) } } : undefined}
                />
              })}
            </g>
            <defs>
              <clipPath id="selected-district-clip"><path d={selectedGeometry.path} fillRule="evenodd" /></clipPath>
              <linearGradient id="district-sweep"><stop stopColor="rgb(var(--c-gold))" stopOpacity="0" /><stop offset=".5" stopColor="rgb(var(--c-gold))" stopOpacity=".24" /><stop offset="1" stopColor="rgb(var(--c-gold))" stopOpacity="0" /></linearGradient>
            </defs>
            <g key={`outline-${selectionKey}`} pointerEvents="none" aria-hidden="true" clipPath="url(#island-clip)">
              <path d={selectedGeometry.path} fill="none" className={styles.selectedOutline} pathLength="1" vectorEffect="non-scaling-stroke" data-quiet={stillness} />
              {!stillness && <g clipPath="url(#selected-district-clip)"><rect width="220" height="700" fill="url(#district-sweep)" className={styles.sweep} /></g>}
            </g>
            <path
              ref={coastRef}
              className="coast"
              d={ISLAND_PATH}
              fill="none"
              stroke="rgb(var(--c-bone)/0.42)"
              strokeWidth="1.4"
              strokeLinejoin="round"
              pointerEvents="none"
            />

            {/* city markers */}
            {(Object.keys(locations) as LocationKey[]).map((key) => {
              const l = locations[key]
              const [x, y] = project(l.coords[0], l.coords[1])
              const r = l.type === 'capital' ? 6 : l.type === 'major' ? 4.5 : 3.5
              const active = selection.kind === 'place' && key === selection.key
              return (
                <g
                  key={key}
                  /* the map was reachable by mouse only: it is a control, so
                     it answers to the keyboard and says its own name */
                  role="button"
                  tabIndex={0}
                  aria-label={`${c.place} · ${l.name[lang]}`}
                  aria-pressed={active}
                  className="cursor-pointer"
                  onClick={() => selectPlace(key)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      selectPlace(key)
                    }
                  }}
                >
                  {active && !stillness && <g transform={`translate(${x} ${y})`} pointerEvents="none" aria-hidden="true">
                    <circle r={r + 3} fill="none" stroke="rgb(var(--c-flame-hot))" strokeWidth="1" className={styles.placePulse} />
                  </g>}
                  {/* focus is shown by the global :focus-visible outline, which
                      tracks this group's box — one ring, no bespoke variant */}
                  <circle
                    cx={x} cy={y} r={r}
                    fill={active ? 'rgb(var(--c-flame-hot))' : 'rgb(var(--c-bone))'}
                    stroke={active ? 'rgb(var(--c-flame-hot))' : 'rgb(var(--c-night)/0.85)'}
                    strokeWidth={l.type === 'capital' ? 2.4 : 1}
                    className="transition-[r,stroke] duration-300 ease-vigil"
                  />
                  {/* generous hit area, comfortably past the 44px guidance */}
                  <circle cx={x} cy={y} r="16" fill="transparent" />
                </g>
              )
            })}

            {/* selected label */}
            {loc && <g pointerEvents="none" key={`label-${selectionKey}`} className={styles.mapLabel} data-quiet={stillness}>
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
                stroke="rgb(var(--c-night-2))" strokeWidth="3" paintOrder="stroke" strokeLinejoin="round"
                textAnchor={selX > 300 ? 'end' : 'start'}
              >
                {loc.name[lang]}
              </text>
            </g>}
          </svg>
          <div className={styles.mapSelection}>
            <span>{loc ? c.place : c.district}</span>
            <strong>{loc ? loc.name[lang] : districtName}</strong>
            {loc && <span>{c.district} · {districtName}</span>}
          </div>
          <div className={styles.legend} aria-label={c.zones}>
            <span><i className={styles.zoneSwatch} aria-hidden="true" />{c.zones}</span>
            <span><i className={styles.placeSwatch} aria-hidden="true" />{c.places}</span>
            <span><i className={styles.otherSwatch} aria-hidden="true" />{c.other}</span>
          </div>
          <p className="relative z-[2] border-t border-bone/15 px-1 pt-4 text-xs leading-relaxed text-ash">{experience.mapNote[lang]}</p>
          <p className={styles.credit}>{c.source} · <a href="https://www.geoboundaries.org/api/current/gbOpen/LKA/ADM2/" target="_blank" rel="noopener noreferrer">geoBoundaries</a> / <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap</a> · ODbL</p>
        </div>

        {/* ——— side panel ——— */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
          <p className="reveal text-sm leading-relaxed text-bone-dim">{c.hint}</p>
          <div className={styles.modeSwitch} role="group" aria-label={experience.map[lang]}>
            <button type="button" onClick={() => selectDistrict(selectedDistrict)} aria-pressed={mode === 'district'}>{c.districts}</button>
            <button type="button" onClick={() => selectPlace(selection.kind === 'place' ? selection.key : districtLocations[0])} aria-pressed={mode === 'place'}>{c.places}</button>
          </div>
          <div className={styles.choices} role="group" aria-label={mode === 'district' ? c.districts : c.places}>
            {mode === 'district' ? Object.entries(districtPlaces).map(([id, key]) => (
              <button key={id} type="button" onClick={() => selectDistrict(id)} aria-pressed={selection.kind === 'district' && selection.id === id}>{locations[key].name[lang]}</button>
            )) : (Object.keys(locations) as LocationKey[]).map(key => (
              <button key={key} type="button" onClick={() => selectPlace(key)} aria-pressed={selection.kind === 'place' && selection.key === key}>{locations[key].name[lang]}</button>
            ))}
          </div>
          <div aria-live="polite" aria-atomic="true">
            <div key={`${selectionKey}-${lang}`} className={styles.detailPanel} data-quiet={stillness}>
              <p className={styles.detailKind}>{loc ? c.place : c.district}</p>
              <h3 className="lang-title font-display text-[32px] italic leading-tight text-flame">{loc ? loc.name[lang] : districtName}</h3>
              {loc ? <>
                <p className="mb-3 mt-1 font-tamil text-sm text-ash">{loc.tamil}</p>
                <button type="button" className={styles.districtLink} onClick={() => selectDistrict(selectedDistrict)}>{c.belonging} · {districtName} <span aria-hidden="true">↗</span></button>
                <p className="mt-5 text-[17px] leading-[1.8] text-bone-dim">{loc.desc[lang]}</p>
                <p className="mt-6 font-mono text-[10px] leading-relaxed tracking-wide text-ash"><span className="mb-2 block">{c.coordinates}</span>{loc.coords[1].toFixed(4)}° N · {loc.coords[0].toFixed(4)}° E</p>
              </> : <>
                <p className="mt-4 text-base leading-relaxed text-bone-dim">{c.districtHint}</p>
                <p className="mb-3 mt-7 font-mono text-[10px] uppercase tracking-[0.1em] text-ash">{c.within}</p>
                <div className={styles.districtLocations}>{districtLocations.map(key => <button key={key} type="button" onClick={() => selectPlace(key)}><span>{locations[key].name[lang]}</span><span aria-hidden="true">↗</span></button>)}</div>
              </>}
            </div>
          </div>
        </div>
      </div>
      <ChapterEnd id="patrie" />
    </section>
  )
}
