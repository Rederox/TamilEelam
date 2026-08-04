import type { Config } from 'tailwindcss'

/** Token backed by a CSS variable, so `/opacity` modifiers keep working. */
const v = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        night: { DEFAULT: v('night'), 2: v('night-2') },
        soot: { DEFAULT: v('soot'), 2: v('soot-2') },
        bone: { DEFAULT: v('bone'), dim: v('bone-dim') },
        ash: { DEFAULT: v('ash'), dim: v('ash-dim') },
        ember: v('ember'),
        blood: v('blood'),
        flame: { DEFAULT: v('flame'), hot: v('flame-hot') },
        gold: v('gold'),
      },
      fontFamily: {
        display: ['Fraunces', 'Noto Serif Tamil', 'serif'],
        body: ['Newsreader', 'Noto Serif Tamil', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        tamil: ['Noto Serif Tamil', 'serif'],
      },
      keyframes: {
        'flicker-outer': {
          '0%, 100%': { transform: 'scaleY(1) rotate(-1deg)' },
          '30%': { transform: 'scaleY(1.08) scaleX(0.94) rotate(1.4deg)' },
          '55%': { transform: 'scaleY(0.94) rotate(-2deg)' },
          '80%': { transform: 'scaleY(1.05) scaleX(0.97) rotate(0.8deg)' },
        },
        'flicker-inner': {
          '0%, 100%': { transform: 'scaleY(1)', opacity: '0.96' },
          '40%': { transform: 'scaleY(1.12) scaleX(0.9)', opacity: '1' },
          '70%': { transform: 'scaleY(0.9) scaleX(1.05)', opacity: '0.9' },
        },
        'flicker-core': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.95' },
          '50%': { transform: 'scale(1.15) translateY(-6%)', opacity: '1' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.85', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.12)' },
        },
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(34px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'cue-drop': {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'top', opacity: '1' },
          '70%': { transform: 'scaleY(1)', transformOrigin: 'top', opacity: '1' },
          '100%': { transform: 'scaleY(1)', opacity: '0' },
        },
        'ghost-drift': {
          from: { transform: 'translate(-52%, -50%) scale(1)' },
          to: { transform: 'translate(-48%, -51%) scale(1.04)' },
        },
        'ghost-sway': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(-26px)' },
        },
        'blood-pulse': {
          '0%, 100%': { textShadow: '0 0 80px rgb(var(--c-blood) / 0.5)' },
          '50%': { textShadow: '0 0 130px rgb(var(--c-ember) / 0.75)' },
        },
      },
      animation: {
        'flicker-outer': 'flicker-outer 2.7s ease-in-out infinite',
        'flicker-inner': 'flicker-inner 1.9s ease-in-out infinite',
        'flicker-core': 'flicker-core 1.3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3.4s ease-in-out infinite',
        'rise-in': 'rise-in 1.8s cubic-bezier(0.22,1,0.36,1) both',
        'cue-drop': 'cue-drop 2.2s ease-in-out infinite',
        'ghost-drift': 'ghost-drift 26s ease-in-out infinite alternate',
        'ghost-sway': 'ghost-sway 14s ease-in-out infinite alternate',
        'blood-pulse': 'blood-pulse 5s ease-in-out infinite',
      },
      transitionTimingFunction: {
        vigil: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
export default config
