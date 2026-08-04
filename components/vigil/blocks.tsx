import type { ReactNode } from 'react'

/** Padded body area below a chapter opener. */
export function ChBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`relative px-6 pb-24 pt-5 sm:px-[9vw] lg:pb-28 ${className}`}>{children}</div>
}

/** Small mono caption with a golden tick, above prose blocks. */
export function Caption({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ash ${className}`}>
      <span className="h-px w-7 shrink-0 bg-gold" />
      <span>{children}</span>
    </div>
  )
}

/** Long-form reading prose. */
export function Prose({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`text-[16.5px] leading-[1.85] text-bone-dim ${className}`}>{children}</div>
}

/** Very large memorial number with an italic caption. */
export function MemFigure({
  value,
  label,
  tone = 'bone',
  className = '',
}: {
  value: ReactNode
  label: string
  tone?: 'bone' | 'ember' | 'gold'
  className?: string
}) {
  const toneCls = tone === 'ember' ? 'text-ember' : tone === 'gold' ? 'text-gold' : 'text-bone'
  return (
    <div className={className}>
      <div className={`font-display text-[clamp(64px,11vw,170px)] font-light leading-[0.95] tracking-[-0.03em] ${toneCls}`}>{value}</div>
      <div className="mt-3.5 max-w-[340px] text-sm italic leading-[1.6] text-ash">{label}</div>
    </div>
  )
}

/** Memorial quote with ember guillemets. */
export function Quote({
  text,
  author,
  accent = 'flame',
  className = '',
}: {
  text: string
  author: string
  accent?: 'flame' | 'ember'
  className?: string
}) {
  const mark = accent === 'ember' ? 'text-ember' : 'text-flame'
  return (
    <figure className={className}>
      <blockquote className="font-body text-[clamp(19px,2.5vw,26px)] italic leading-[1.6] text-bone">
        <span className={mark}>« </span>
        {text}
        <span className={mark}> »</span>
      </blockquote>
      <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ash">{author}</figcaption>
    </figure>
  )
}
