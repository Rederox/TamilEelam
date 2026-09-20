'use client'

import { useId } from 'react'
import styles from './MemorialObjects.module.css'

/** Local flame: stays attached to its sticky lamp and inherits scene opacity. */
export default function MemorialLamp() {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 180 210" width="150" height="175" className={styles.lamp} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-fire`} x2="0" y2="1"><stop stopColor="#b34c20" stopOpacity=".15" /><stop offset=".45" stopColor="#de923a" /><stop offset=".8" stopColor="#f7d88c" /><stop offset="1" stopColor="#d27527" /></linearGradient>
        <linearGradient id={`${id}-clay`} x2=".8" y2="1"><stop stopColor="#ac8551" /><stop offset=".5" stopColor="#765236" /><stop offset="1" stopColor="#32261c" /></linearGradient>
      </defs>
      <ellipse cx="90" cy="181" rx="61" ry="6" fill="#171410" opacity=".25" />
      <path d="M34 151 Q90 136 145 151 Q131 182 88 181 Q49 177 34 151Z" fill={`url(#${id}-clay)`} />
      <ellipse cx="89" cy="151" rx="55" ry="10" fill="#32271b" stroke="#a7804e" strokeWidth="1.4" />
      <ellipse cx="89" cy="150" rx="44" ry="6" fill="#b78339" opacity=".22" />
      <path d="M91 151 Q94 141 91 135" fill="none" stroke="#28201a" strokeWidth="4" />
      <g className={styles.flame}>
        <path d="M91 141 C57 123 99 79 88 37 C114 73 103 89 114 111 C122 131 109 144 91 141Z" fill={`url(#${id}-fire)`} />
        <path d="M93 140 C76 130 96 109 96 91 C108 112 113 134 93 140Z" fill="#ffe6ac" opacity=".85" />
        <path d="M94 141 Q84 132 96 121 Q104 136 94 141Z" fill="#fff2cb" />
      </g>
      <path d="M41 155 Q88 171 138 155" fill="none" stroke="#d1a062" opacity=".36" />
    </svg>
  )
}
