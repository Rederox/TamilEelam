'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from '@/context/ThemeContext'

interface Ember {
  x: number; y: number
  vx: number; vy: number
  r: number
  life: number
  max: number
}

// Sparse embers drifting upward — the burning of the Jaffna Library.
// Canvas only animates while visible; respects prefers-reduced-motion.
export default function Embers({ density = 26 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // canvas cannot resolve CSS variables: read the live token instead
    const flame = getComputedStyle(document.documentElement)
      .getPropertyValue('--c-flame')
      .trim()
      .replace(/\s+/g, ',') || '237,166,61'

    let raf = 0
    let running = false
    let embers: Ember[] = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const spawn = (): Ember => ({
      x: Math.random() * canvas.offsetWidth,
      y: canvas.offsetHeight + Math.random() * 60,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -(0.35 + Math.random() * 0.85),
      r: 0.8 + Math.random() * 1.8,
      life: 0,
      max: 240 + Math.random() * 200,
    })

    const tick = () => {
      if (!running) return
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      embers.forEach((e) => {
        e.life++
        e.x += e.vx + Math.sin((e.life + e.y) * 0.02) * 0.25
        e.y += e.vy
        const fade = 1 - e.life / e.max
        if (fade <= 0 || e.y < -10) Object.assign(e, spawn(), { y: canvas.offsetHeight + 10 })
        const glow = Math.max(0, fade)
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${flame}, ${0.55 * glow})`
        ctx.shadowColor = `rgba(${flame}, 0.8)`
        ctx.shadowBlur = 6
        ctx.fill()
        ctx.shadowBlur = 0
      })
      raf = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver((entries) => {
      const visible = entries[0].isIntersecting
      if (visible && !running) {
        running = true
        resize()
        if (embers.length === 0) embers = Array.from({ length: density }, spawn)
        tick()
      } else if (!visible) {
        running = false
        cancelAnimationFrame(raf)
      }
    })
    observer.observe(canvas)
    window.addEventListener('resize', resize)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', resize)
      running = false
      cancelAnimationFrame(raf)
    }
  }, [density, theme])

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-[1] h-full w-full" aria-hidden="true" />
}
