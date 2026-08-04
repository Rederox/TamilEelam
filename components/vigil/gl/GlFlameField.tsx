'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { isSmallScreen, mountGL, prefersReducedMotion } from './mount'

const VERT = /* glsl */ `
attribute vec3 aSeed;
uniform float uTime;
uniform float uLit;   // seconds since the visitor lit their flame; < 0 while unlit
uniform float uPix;
varying float vOn;
varying float vFlick;

void main() {
  float flick = sin(uTime * mix(5.0, 9.0, aSeed.x) + aSeed.y * 71.0);
  vec3 p = position;
  p.y += 0.015 * flick * aSeed.y;

  // the lighting spreads outward from the visitor's own flame
  float dist = length(p.xz - vec2(0.0, -1.5));
  float delay = dist * 0.30 + aSeed.z * 1.8;
  float ignite = uLit < 0.0 ? 0.0 : smoothstep(delay, delay + 1.6, uLit);

  // a few flames were already burning before we arrived — they always are
  float standing = step(0.968, aSeed.x) * 0.45;
  vOn = max(ignite, standing);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float size = mix(2.2, 4.0, aSeed.y);
  gl_PointSize = size * uPix * (150.0 / -mv.z) * (0.55 + 0.45 * vOn);

  // farther rows sink into the night
  float away = -mv.z;
  vOn *= mix(0.22, 1.0, 1.0 - smoothstep(5.0, 26.0, away));
  vFlick = 0.74 + 0.26 * flick;

  gl_Position = projectionMatrix * mv;
}
`

const FRAG = /* glsl */ `
precision mediump float;
uniform float uPaper;
varying float vOn;
varying float vFlick;

void main() {
  // slightly tall glow: a flame, not a dot
  vec2 p = gl_PointCoord - vec2(0.5, 0.56);
  p.y *= 0.78;
  float d = length(p);
  float glow = 1.0 - smoothstep(0.03, 0.5, d);

  vec3 hot   = vec3(0.969, 0.831, 0.533);
  vec3 amber = vec3(0.929, 0.651, 0.239);
  vec3 col = mix(hot, amber, smoothstep(0.0, 0.4, d));

  float a = pow(glow, 1.7) * vOn * vFlick;

  // on paper each flame is a small mark in warm ink, like a hand-drawn tally
  vec3 pcol = mix(vec3(0.545, 0.322, 0.106), vec3(0.271, 0.180, 0.098), smoothstep(0.0, 0.45, d));
  float pa = pow(glow, 1.5) * vOn * vFlick * 0.55;

  gl_FragColor = uPaper > 0.5 ? vec4(pcol, pa) : vec4(col * a, a);
}
`

// The epilogue's answer made literal: when the visitor lights a flame,
// it joins thousands of others stretching to the horizon.
export default function GlFlameField({ lit }: { lit: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const litRef = useRef(lit)
  litRef.current = lit
  const { theme } = useTheme()
  const paper = theme === 'paper'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || prefersReducedMotion()) return

    return mountGL(canvas, (three) => {
      const scene = new three.Scene()
      const camera = new three.PerspectiveCamera(50, 1, 0.1, 60)
      camera.position.set(0, 1.6, 4.2)

      const count = isSmallScreen() ? 1800 : 4200
      const pos = new Float32Array(count * 3)
      const seeds = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        // denser near the centre line, thinning toward the edges — a gathering
        const spread = Math.pow(Math.random(), 0.7)
        pos[i * 3] = (Math.random() < 0.5 ? -1 : 1) * spread * 15
        pos[i * 3 + 1] = 0
        pos[i * 3 + 2] = 1.5 - Math.random() * 26
        seeds[i * 3] = Math.random()
        seeds[i * 3 + 1] = Math.random()
        seeds[i * 3 + 2] = Math.random()
      }

      const geo = new three.BufferGeometry()
      geo.setAttribute('position', new three.BufferAttribute(pos, 3))
      geo.setAttribute('aSeed', new three.BufferAttribute(seeds, 3))

      const mat = new three.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        blending: paper ? three.NormalBlending : three.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uLit: { value: -1 },
          uPix: { value: 1 },
          uPaper: { value: paper ? 1 : 0 },
        },
      })

      const points = new three.Points(geo, mat)
      points.frustumCulled = false
      scene.add(points)

      const target = new three.Vector3(0, 0.35, -8)
      let litAt = -1
      let born = -1
      const px = { x: 0, y: 0, tx: 0, ty: 0 }

      return {
        scene,
        camera,
        update: (t, dt) => {
          if (born < 0) born = t
          mat.uniforms.uTime.value = t

          if (litRef.current && litAt < 0) {
            // a returning visitor's flame is already burning: skip the wave
            litAt = t - born < 1.2 ? t - 40 : t
          }
          mat.uniforms.uLit.value = litAt < 0 ? -1 : t - litAt

          // breath-slow parallax toward the pointer
          px.x += (px.tx - px.x) * Math.min(1, dt * 2.2)
          px.y += (px.ty - px.y) * Math.min(1, dt * 2.2)
          camera.position.x = px.x * 0.5
          camera.position.y = 1.6 - px.y * 0.22
          camera.lookAt(target)
        },
        resize: (_w, _h, dpr) => {
          mat.uniforms.uPix.value = dpr
        },
        pointer: (x, y) => {
          px.tx = x
          px.ty = y
        },
      }
    })
  }, [paper])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
      aria-hidden="true"
    />
  )
}
