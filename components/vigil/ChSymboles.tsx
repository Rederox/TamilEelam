'use client'

import Image from 'next/image'
import { useLang } from '@/context/LanguageContext'
import { symbols, type SymbolEntry } from '@/data/narrative'
import { useReveal } from '@/hooks/useReveal'
import ChapterOpen from './ChapterOpen'
import { ChBody, Caption, Prose } from './blocks'

function Frame({
  src,
  width,
  height,
  alt,
  label,
  credit,
}: {
  src: string
  width: number
  height: number
  alt: string
  label: string
  credit: string
}) {
  return (
    <figure className="border border-bone/20 bg-[rgb(var(--c-night-2))] p-2 sm:p-2.5">
      <Image src={src} width={width} height={height} alt={alt} className="block h-auto w-full" />
      <figcaption className="flex items-center justify-between gap-3 px-1 pb-0.5 pt-2.5 font-mono text-[9px] uppercase tracking-[0.2em] text-ash-dim">
        <span className="font-tamil normal-case tracking-normal">{label}</span>
        <span>{credit}</span>
      </figcaption>
    </figure>
  )
}

function Body({ s, delay = false }: { s: SymbolEntry; delay?: boolean }) {
  const { lang } = useLang()
  return (
    <div>
      <Caption className={`reveal ${delay ? 'd1' : ''}`}>
        {s.title}
        {lang !== 'ta' && <span className="font-tamil normal-case tracking-normal"> · {s.tamil}</span>}
      </Caption>
      <Prose className={`reveal ${delay ? 'd2' : 'd1'}`}>
        <p>{s.text}</p>
      </Prose>
    </div>
  )
}

// Chapter VIII — the symbols of Tamil Eelam: flag, leopard, coucal, glory lily.
export default function ChSymboles() {
  const { lang } = useLang()
  const s = symbols[lang]
  const ref = useReveal()

  return (
    <section
      id="symboles"
      className="relative bg-night bg-[radial-gradient(110%_80%_at_85%_15%,rgb(var(--c-gold)/0.08),transparent_60%)]"
    >
      <ChapterOpen id="symboles" lede={s.lede} />
      <div ref={ref as React.RefObject<HTMLDivElement>}>
        <ChBody>
          {/* the flag — wide, like a flag */}
          <div className="grid max-w-[1200px] grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-[5vw]">
            <div className="reveal">
              <Frame
                src="/symbols/flag.png"
                width={1400}
                height={933}
                alt="Drapeau national du Tamil Eelam : tigre bondissant dans un cercle de rayons, baïonnettes croisées, sur fond rouge"
                label="தேசியக் கொடி"
                credit="1977 · 1990"
              />
            </div>
            <Body s={s.flag} />
          </div>

          {/* the leopard — portrait image, text first on the left */}
          <div className="mt-16 grid max-w-[1100px] grid-cols-1 gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-[5vw]">
            <div className="order-2 lg:order-1">
              <Body s={s.animal} />
            </div>
            <div className="reveal d2 order-1 lg:order-2">
              <Frame
                src="/symbols/leopard.jpg"
                width={927}
                height={1200}
                alt="Léopard de Sri Lanka (Panthera pardus kotiya) dans un arbre, forêt de Yala"
                label="சிறுத்தை"
                credit="C. J. Sharp · CC BY-SA 4.0"
              />
            </div>
          </div>

          {/* the coucal */}
          <div className="mt-16 grid max-w-[1200px] grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-[5vw]">
            <div className="reveal">
              <Frame
                src="/symbols/coucal.jpg"
                width={1400}
                height={932}
                alt="Grand coucal (Centropus sinensis) : plumage noir bleuté, ailes cuivrées, œil rouge"
                label="செம்போத்து"
                credit="C. J. Sharp · CC BY-SA 4.0"
              />
            </div>
            <Body s={s.bird} delay />
          </div>

          {/* the flower — closing the chapter, pointing to Maaveerar Naal */}
          <div className="mt-16 grid max-w-[1200px] grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-[5vw]">
            <div className="order-2 lg:order-1">
              <Body s={s.flower} />
            </div>
            <div className="reveal d2 order-1 lg:order-2">
              <Frame
                src="/symbols/gloriosa.jpg"
                width={1400}
                height={933}
                alt="Kaarthigai poo — lys de gloire (Gloriosa superba), pétales rouges et or dressés comme des flammes"
                label="கார்த்திகைப் பூ"
                credit="J. Jose · CC BY-SA 4.0"
              />
            </div>
          </div>
        </ChBody>
      </div>
    </section>
  )
}
