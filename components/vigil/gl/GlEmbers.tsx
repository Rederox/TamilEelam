'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { reader, startReaderTracking } from '@/lib/motion'
import Embers from '../Embers'
import { isSmallScreen, mountGL, prefersReducedMotion } from './mount'

const VERT = /* glsl */ `
attribute vec4 aSeed;
uniform float uTime;
uniform vec2 uArea;
uniform float uPix;
uniform float uSpeed;
uniform float uDraft;   // how hard the reader's motion stirs the air
uniform vec2 uLamp;     // where the reader is holding the light
uniform float uPaper;
varying float vFade;
varying float vHeat;
varying float vLife;

void main() {
  float dur = mix(11.0, 22.0, aSeed.z) / uSpeed;
  float life = fract(uTime / dur + aSeed.w);
  vLife = life;

  float x = (aSeed.x * 2.0 - 1.0) * uArea.x * 0.5;
  // a slow, grieving drift — wide sway, no hurry
  x += sin(life * 6.2832 * mix(0.6, 1.4, aSeed.y) + aSeed.y * 43.0) * mix(0.2, 0.7, aSeed.y);
  x += sin(uTime * 0.13 + aSeed.w * 20.0) * 0.15;
  float y = mix(-uArea.y * 0.58, uArea.y * 0.62, life);
  float z = (fract(aSeed.x * 7.31) * 2.0 - 1.0) * 2.4;

  // scrolling draws air through the room: the embers lean and lift
  float pull = uDraft * mix(0.6, 1.6, aSeed.y);
  y += pull * 1.5;
  x += pull * (aSeed.z - 0.5) * 1.2;

  // and they bend gently toward the lamp the reader carries
  vec2 lamp = vec2((uLamp.x - 0.5) * uArea.x, (0.5 - uLamp.y) * uArea.y);
  vec2 toLamp = lamp - vec2(x, y);
  float near = 1.0 - smoothstep(0.0, uArea.x * 0.45, length(toLamp));
  x += toLamp.x * near * 0.05;
  y += toLamp.y * near * 0.03;

  vec4 mv = modelViewMatrix * vec4(x, y, z, 1.0);
  float size = mix(0.9, 2.4, fract(aSeed.w * 5.7)) * mix(1.0, 0.65, uPaper);
  gl_PointSize = max(1.0, size * uPix * (150.0 / -mv.z));

  // born dim, brightest mid-flight, gone at the top — breathing, not sparking
  vFade = sin(life * 3.1416);
  vFade *= 0.8 + 0.2 * sin(uTime * mix(1.5, 3.5, aSeed.y) + aSeed.x * 80.0);
  vHeat = fract(aSeed.z * 3.77);

  gl_Position = projectionMatrix * mv;
}
`

const FRAG = /* glsl */ `
precision mediump float;
uniform float uHeat;
uniform float uIntensity;
uniform float uPaper;
varying float vFade;
varying float vHeat;
varying float vLife;

void main() {
  vec2 p = gl_PointCoord - 0.5;
  p.y *= 0.82; // a hint of rise in the glow
  float d = length(p);
  float glow = 1.0 - smoothstep(0.0, 0.5, d);

  vec3 hot   = vec3(0.969, 0.831, 0.533); // flame-hot #f7d488
  vec3 amber = vec3(0.929, 0.651, 0.239); // flame     #eda63d
  vec3 cool  = vec3(0.561, 0.137, 0.094); // blood     #8f2318 — an ember going out

  // an ember cools as it climbs: amber, then deep red, then gone
  vec3 col = mix(amber, cool, smoothstep(0.25, 0.9, vLife));
  col = mix(mix(hot, col, 0.55), col, smoothstep(0.0, 0.35, d));
  col = mix(col, cool, uHeat * vHeat * 0.6);

  float dying = 1.0 - 0.45 * smoothstep(0.4, 1.0, vLife);
  float a = pow(glow, 2.3) * vFade * uIntensity * dying;

  // on paper an ember is not light but a mark: a speck of ash on the leaf,
  // tight and faint — anything softer reads as a stain, not a cinder
  vec3 ink  = vec3(0.271, 0.196, 0.129);
  vec3 rust = vec3(0.478, 0.239, 0.129);
  vec3 pcol = mix(rust, ink, smoothstep(0.15, 0.85, vLife));
  float pa = pow(glow, 4.5) * vFade * uIntensity * 0.30;

  gl_FragColor = uPaper > 0.5
    ? vec4(pcol, pa)
    : vec4(col * a, a);
}
`

interface Props {
  /** particle count on desktop (halved on small screens) */
  density?: number
  /** 0 amber vigil embers → 1 red sparks of the fire */
  heat?: number
  /** overall brightness 0..1 */
  intensity?: number
  /** upward speed multiplier */
  speed?: number
  /** density for the 2D canvas fallback when WebGL is unavailable */
  fallbackDensity?: number
  className?: string
}

// GPU ember field — every particle lives entirely in the vertex shader,
// so a thousand embers cost no more CPU than none. Falls back to the
// original 2D canvas Embers when WebGL (or motion) is unavailable.
export default function GlEmbers({
  density = 120,
  heat = 0,
  intensity = 1,
  speed = 1,
  fallbackDensity = 18,
  className = '',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)
  const { theme } = useTheme()
  const paper = theme === 'paper'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || prefersReducedMotion()) return

    const stopTracking = startReaderTracking()
    const unmount = mountGL(
      canvas,
      (three) => {
        const scene = new three.Scene()
        const camera = new three.PerspectiveCamera(55, 1, 0.1, 30)
        camera.position.z = 6

        const count = isSmallScreen() ? Math.floor(density / 2) : density
        const seeds = new Float32Array(count * 4)
        for (let i = 0; i < count * 4; i++) seeds[i] = Math.random()

        const geo = new three.BufferGeometry()
        // three.js requires a position attribute even when the shader ignores it
        geo.setAttribute('position', new three.BufferAttribute(new Float32Array(count * 3), 3))
        geo.setAttribute('aSeed', new three.BufferAttribute(seeds, 4))

        const mat = new three.ShaderMaterial({
          vertexShader: VERT,
          fragmentShader: FRAG,
          transparent: true,
          depthWrite: false,
          // light adds on the night sheet; ink darkens the paper one
          blending: paper ? three.NormalBlending : three.AdditiveBlending,
          uniforms: {
            uTime: { value: 0 },
            uArea: { value: new three.Vector2(8, 6.5) },
            uPix: { value: 1 },
            uSpeed: { value: speed },
            uHeat: { value: heat },
            uIntensity: { value: intensity },
            uPaper: { value: paper ? 1 : 0 },
            uDraft: { value: 0 },
            uLamp: { value: new three.Vector2(0.5, 0.45) },
          },
        })

        const points = new three.Points(geo, mat)
        points.frustumCulled = false
        scene.add(points)

        let draft = 0
        return {
          scene,
          camera,
          update: (t, dt) => {
            mat.uniforms.uTime.value = t
            // the draft builds and settles more slowly than the scroll itself
            draft += (reader.scroll - draft) * Math.min(1, dt * 3)
            mat.uniforms.uDraft.value = draft
            const lamp = mat.uniforms.uLamp.value as { x: number; y: number }
            lamp.x += (reader.px - lamp.x) * Math.min(1, dt * 1.5)
            lamp.y += (reader.py - lamp.y) * Math.min(1, dt * 1.5)
          },
          resize: (w, h, dpr) => {
            const worldH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360)
            mat.uniforms.uArea.value.set(worldH * (w / h), worldH)
            mat.uniforms.uPix.value = dpr
          },
        }
      },
      () => setFailed(true)
    )

    return () => {
      unmount()
      stopTracking()
    }
  }, [density, heat, intensity, speed, paper])

  if (failed) return <Embers density={fallbackDensity} />

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-[1] h-full w-full ${className}`}
      aria-hidden="true"
    />
  )
}
