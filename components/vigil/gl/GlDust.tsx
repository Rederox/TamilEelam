'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'

import { useEffect, useRef } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { reader, startReaderTracking } from '@/lib/motion'
import { isSmallScreen, mountGL, prefersReducedMotion } from './mount'

const VERT = /* glsl */ `
attribute vec3 aSeed;
uniform float uTime;
uniform vec2 uArea;
uniform float uPix;
uniform vec2 uLamp;     // pointer, 0..1 with y down
uniform float uAspect;
uniform float uDraft;
varying float vLit;
varying float vSoft;

void main() {
  // an almost still drift: dust hangs, it does not fly
  float t = uTime * 0.06;
  vec3 p = position;
  p.x += sin(t * (0.6 + aSeed.x) + aSeed.y * 30.0) * 0.55;
  p.y += cos(t * (0.5 + aSeed.y) + aSeed.x * 21.0) * 0.40;
  p.y += uDraft * mix(0.4, 1.3, aSeed.z) * 1.4;   // stirred when the reader moves
  p.y = mod(p.y + uArea.y * 0.5, uArea.y) - uArea.y * 0.5;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vec4 clip = projectionMatrix * mv;

  // where this mote lands on screen, in the same space as the lamp
  vec2 ndc = clip.xy / clip.w;
  vec2 lamp = vec2(uLamp.x * 2.0 - 1.0, 1.0 - uLamp.y * 2.0);
  float dist = length((ndc - lamp) * vec2(uAspect, 1.0));

  // dust is only ever visible inside the light: this is the whole effect
  vLit = exp(-dist * 1.75);
  vLit *= 0.55 + 0.45 * sin(uTime * (1.2 + aSeed.x * 2.0) + aSeed.y * 40.0);

  // motes nearer the reader are larger and softer, which reads as depth
  float near = smoothstep(-9.0, -2.0, mv.z);
  vSoft = near;
  gl_PointSize = mix(1.2, 3.6, near) * uPix * (150.0 / -mv.z);

  gl_Position = clip;
}
`

const FRAG = /* glsl */ `
precision mediump float;
uniform float uPaper;
uniform float uIntensity;
varying float vLit;
varying float vSoft;

void main() {
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p);
  float grain = 1.0 - smoothstep(0.0, 0.5, d);
  grain = pow(grain, mix(3.0, 1.6, vSoft));

  // lit dust is warm, never white: it is lamplight caught on a particle
  vec3 col = mix(vec3(1.0, 0.831, 0.0), vec3(1.0, 0.965, 0.8), vSoft);
  float a = grain * vLit * uIntensity;

  if (uPaper > 0.5) {
    // by daylight there is no beam to catch: only the faintest motes remain
    gl_FragColor = vec4(vec3(0.25, 0.25, 0.25), grain * vLit * uIntensity * 0.16);
  } else {
    gl_FragColor = vec4(col * a, a);
  }
}
`

/**
 * Dust hanging in the air of the room, revealed only where the reader's lamp
 * falls on it. Nothing is drawn outside the light, so the page gains depth
 * without gaining clutter.
 */
export default function GlDust({ intensity = 1 }: { intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const paper = theme === 'paper'

  const stillness = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || stillness) return
    // no pointer, no beam: the effect would have nothing to reveal
    if (window.matchMedia('(pointer: coarse)').matches) return

    const stopTracking = startReaderTracking()

    const unmount = mountGL(canvas, (three) => {
      const scene = new three.Scene()
      const camera = new three.PerspectiveCamera(58, 1, 0.1, 40)
      camera.position.z = 7

      const count = isSmallScreen() ? 260 : 700
      const pos = new Float32Array(count * 3)
      const seeds = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 26
        pos[i * 3 + 1] = (Math.random() - 0.5) * 16
        pos[i * 3 + 2] = -Math.random() * 9      // a slab of air in front of the page
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
          uArea: { value: new three.Vector2(26, 16) },
          uPix: { value: 1 },
          uLamp: { value: new three.Vector2(0.5, 0.42) },
          uAspect: { value: 1 },
          uDraft: { value: 0 },
          uPaper: { value: paper ? 1 : 0 },
          uIntensity: { value: intensity },
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
          draft += (reader.scroll * -reader.dir - draft) * Math.min(1, dt * 2)
          mat.uniforms.uDraft.value = draft
          const lamp = mat.uniforms.uLamp.value as { x: number; y: number }
          // trail the pointer exactly as <Lamp> does, so light and dust agree
          lamp.x += (reader.px - lamp.x) * Math.min(1, dt * 2.7)
          lamp.y += (reader.py - lamp.y) * Math.min(1, dt * 2.7)
        },
        resize: (w, h, dpr) => {
          mat.uniforms.uPix.value = dpr
          mat.uniforms.uAspect.value = w / h
        },
      }
    })

    return () => {
      unmount()
      stopTracking()
    }
  }, [paper, intensity, stillness])

  return (
    <canvas
      key={`${theme}-${stillness}`}
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[82] h-full w-full"
    />
  )
}
