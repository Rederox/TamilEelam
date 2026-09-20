'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { reader, startReaderTracking } from '@/lib/motion'
import Embers from '../Embers'
import { isSmallScreen, mountGL, prefersReducedMotion } from './mount'

const VERT = /* glsl */ `
precision highp float;
attribute vec4 aSeed;
uniform float uTime;
uniform vec2 uArea;
uniform float uPix;
uniform float uSpeed;
uniform float uDraft;   // how hard the reader's motion stirs the air
uniform vec2 uLamp;     // where the reader is holding the light
uniform float uPaper;
uniform float uBurst;   // seconds since the visitor lit their flame; < 0 if they have not
uniform vec2 uBurstAt;  // where the wick is, in world units
varying float vFade;
varying float vHeat;
varying float vLife;
varying vec2 vDir;
varying float vStretch;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

// where an ember is at a given moment of its life
vec3 emberPos(float life, vec4 s, float t) {
  float x = (s.x * 2.0 - 1.0) * uArea.x * 0.5;
  // a slow, grieving drift — wide sway, no hurry
  x += sin(life * 6.2832 * mix(0.6, 1.4, s.y) + s.y * 43.0) * mix(0.2, 0.7, s.y);
  x += sin(t * 0.13 + s.w * 20.0) * 0.15;
  float y = mix(-uArea.y * 0.58, uArea.y * 0.62, life);
  // and, inside that, the small quick eddies the warm air makes
  float eddy = sin(life * 31.0 + s.x * 50.0) * sin(t * 0.4 + s.z * 9.0);
  x += eddy * 0.12;
  y += eddy * 0.05;
  float z = (fract(s.x * 7.31) * 2.0 - 1.0) * 2.4;

  // scrolling draws air through the room: the embers lean and lift
  float pull = uDraft * mix(0.6, 1.6, s.y);
  y += pull * 1.5;
  x += pull * (s.z - 0.5) * 1.2;

  // a gust now and then lifts the whole room, then lets it settle
  float gust = smoothstep(0.62, 0.95, noise(vec2(t * 0.18, 2.0)));
  y += gust * mix(0.2, 0.8, s.z);
  x += gust * (s.x - 0.5) * 0.6;

  // and they bend gently toward the lamp the reader carries
  vec2 lamp = vec2((uLamp.x - 0.5) * uArea.x, (0.5 - uLamp.y) * uArea.y);
  vec2 toLamp = lamp - vec2(x, y);
  float near = 1.0 - smoothstep(0.0, uArea.x * 0.45, length(toLamp));
  x += toLamp.x * near * 0.05;
  y += toLamp.y * near * 0.03;
  return vec3(x, y, z);
}

// a spark thrown from the wick the moment it is lit: out, up, and then
// slower and slower as the air takes hold of it, drifting down at the end
vec3 burstPos(float age, vec4 s) {
  float ang = s.x * 6.2832;
  float spd = mix(1.0, 3.2, s.y);
  float ease = (1.0 - exp(-age * 2.4)) / 2.4;
  vec2 v = vec2(cos(ang) * 0.9, sin(ang) * 0.7 + 1.1) * spd * ease;
  vec2 p = uBurstAt + v - vec2(0.0, 0.35 * age * age);
  p.x += sin(age * 9.0 + s.w * 40.0) * 0.06 * age;
  return vec3(p, 0.6);
}

void main() {
  float dur = mix(11.0, 22.0, aSeed.z) / uSpeed;
  float life = fract(uTime / dur + aSeed.w);
  vec3 p = emberPos(life, aSeed, uTime);
  // a moment ago, to know which way it is going
  vec3 q = emberPos(max(life - 0.06 / dur, 0.0), aSeed, uTime - 0.06);

  // born dim, brightest mid-flight, gone at the top — breathing, not sparking
  float fade = sin(life * 3.1416);
  fade *= 0.8 + 0.2 * sin(uTime * mix(1.5, 3.5, aSeed.y) + aSeed.x * 80.0);
  // an ember flares when the air reaches it: rarely, briefly
  fade *= 1.0 + 0.9 * pow(max(0.0, sin(uTime * mix(0.7, 1.3, aSeed.z) + aSeed.w * 90.0)), 14.0);
  float heat = fract(aSeed.z * 3.77);
  float size = mix(0.9, 2.4, fract(aSeed.w * 5.7)) * mix(1.0, 0.65, uPaper);

  // when the visitor lights their flame a fistful of sparks leaps from the
  // wick; a third of the embers are borrowed for it, and given back after
  if (uBurst >= 0.0 && aSeed.w < 0.34) {
    float live = 1.0 - smoothstep(1.4, 3.0, uBurst);
    if (live > 0.0) {
      p = burstPos(uBurst, aSeed);
      q = burstPos(max(uBurst - 0.03, 0.0), aSeed);
      fade = live * (0.75 + 0.25 * sin(uBurst * 40.0 + aSeed.w * 90.0));
      heat = 1.0;
      size *= 1.25;
      life = smoothstep(0.0, 3.0, uBurst);
    }
  }

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vec4 mq = modelViewMatrix * vec4(q, 1.0);
  vec4 cp = projectionMatrix * mv;
  vec4 cq = projectionMatrix * mq;
  vec2 dir = cp.xy / cp.w - cq.xy / cq.w;
  float speed = length(dir);
  vDir = speed > 1e-6 ? dir / speed : vec2(0.0, 1.0);
  // only real speed streaks: an ember drifting is a point, an ember caught
  // in a gust, a scroll or the burst draws a short line behind it
  vStretch = 1.0 + clamp((speed - 0.009) * 90.0, 0.0, 1.6);

  gl_PointSize = max(1.0, size * uPix * (150.0 / -mv.z) * vStretch);

  vFade = fade;
  vHeat = heat;
  vLife = life;
  gl_Position = cp;
}
`

// highp, not mediump: uPaper is read by both stages and a uniform's
// precision has to agree between them or the program refuses to link
const FRAG = /* glsl */ `
precision highp float;
uniform float uHeat;
uniform float uIntensity;
uniform float uPaper;
varying float vFade;
varying float vHeat;
varying float vLife;
varying vec2 vDir;
varying float vStretch;

void main() {
  vec2 p = gl_PointCoord - 0.5;
  p.y = -p.y;
  float along = dot(p, vDir);
  float across = dot(p, vec2(-vDir.y, vDir.x));
  // long along its flight, tight across it
  float d = length(vec2(along, across * vStretch)) * 2.0;
  float glow = 1.0 - smoothstep(0.0, 1.0, d);
  // a bright grain inside a soft halo: a cinder, not a blur
  float grain = pow(glow, 5.0);
  float halo = pow(glow, 2.2) * 0.25;

  vec3 hot   = vec3(0.969, 0.831, 0.533); // flame-hot #f7d488
  vec3 amber = vec3(0.929, 0.651, 0.239); // flame     #eda63d
  vec3 cool  = vec3(0.561, 0.137, 0.094); // blood     #8f2318 — an ember going out

  // an ember cools as it climbs: amber, then deep red, then gone
  vec3 col = mix(amber, cool, smoothstep(0.25, 0.9, vLife));
  col = mix(mix(hot, col, 0.45), col, smoothstep(0.0, 0.35, d));
  col = mix(col, cool, uHeat * vHeat * 0.6);

  float dying = 1.0 - 0.45 * smoothstep(0.4, 1.0, vLife);
  float a = (grain + halo) * vFade * uIntensity * dying;

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
  /**
   * A counter, not a flag: bump it and a burst of sparks leaps from
   * `burstAt`. A ref so the gesture never re-renders the whole ember field.
   */
  burst?: { current: number }
  /** where the sparks come from, as a fraction of the canvas (y down) */
  burstAt?: { x: number; y: number }
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
  burst,
  burstAt = { x: 0.5, y: 0.55 },
  className = '',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)
  const { theme } = useTheme()
  const paper = theme === 'paper'

  const stillness = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || stillness) return

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
            uBurst: { value: -1 },
            uBurstAt: { value: new three.Vector2(0, 0) },
          },
        })

        const points = new three.Points(geo, mat)
        points.frustumCulled = false
        scene.add(points)

        let draft = 0
        let seenBurst = burst?.current ?? 0
        let burstStart = -1
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

            // the gesture arrives as a bumped counter; the shader gets its age
            if (burst && burst.current !== seenBurst) {
              seenBurst = burst.current
              burstStart = t
            }
            if (burstStart >= 0 && t - burstStart > 3.2) burstStart = -1
            mat.uniforms.uBurst.value = burstStart < 0 ? -1 : t - burstStart
          },
          resize: (w, h, dpr) => {
            const worldH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360)
            const area = mat.uniforms.uArea.value as { set: (x: number, y: number) => void; x: number; y: number }
            area.set(worldH * (w / h), worldH)
            mat.uniforms.uPix.value = dpr
            ;(mat.uniforms.uBurstAt.value as { set: (x: number, y: number) => void }).set(
              (burstAt.x - 0.5) * area.x,
              (0.5 - burstAt.y) * area.y
            )
          },
        }
      },
      () => setFailed(true)
    )

    return () => {
      unmount()
      stopTracking()
    }
  // burst and burstAt are read inside the loop: a change there must not rebuild the field
  }, [density, heat, intensity, speed, paper, stillness])

  if (failed) return <Embers density={fallbackDensity} />

  return (
    <canvas
      key={`${theme}-${stillness}`}
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-[1] h-full w-full ${className}`}
      aria-hidden="true"
    />
  )
}
