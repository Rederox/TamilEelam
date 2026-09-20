'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'

import { useEffect, useRef } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { getFlames, onFlamesChanged, setFlameGL } from '@/lib/flames'
import { reader, startReaderTracking } from '@/lib/motion'
import { createBoxCache, mountGL, prefersReducedMotion } from './mount'

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

// A flame is hot gas rising: it tapers, it sways, and turbulence tears its
// crown into tongues that cool from white through amber to smoke. At the
// foot of the wick the gas has not caught yet and burns blue; above the tip
// a thread of soot, lit from below, is all that is left of it.
const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uSeed;
uniform float uLit;      // 0 out, 1 burning — the epilogue lights up
uniform float uDraught;  // the reader's scroll pushes the air
uniform float uPaper;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.02 + vec2(11.0, 7.0); a *= 0.5; }
  return v;
}

void main() {
  // The quad is laid out top-down in screen space. The flame proper fills
  // the lower FLAME_SPAN of it; the room above is for the heat and the soot.
  vec2 p = vec2(vUv.x - 0.5, (1.0 - vUv.y) / FLAME_SPAN);
  float t = uTime + uSeed * 37.0;

  // the flame breathes on its own: slow noise, not a metronome — with the
  // odd gutter when a draught reaches the wick, and a stretch when it passes
  float breath = fbm(vec2(t * 0.9, uSeed * 7.0));
  float gutter = smoothstep(0.80, 0.92, noise(vec2(t * 0.33 + 3.0, uSeed * 11.0)));
  float height = 0.90 + (breath - 0.5) * 0.44 - gutter * 0.30 + abs(uDraught) * 0.10;
  float hy = p.y / height;

  // the gas rises: the noise field scrolls upward and is warped by itself,
  // which is what gives a flame its curling tongues rather than a smooth cone
  vec2 q = vec2(p.x * 2.6, hy * 1.7 - t * 1.35);
  float n1 = fbm(q + uSeed * 13.0);
  float n2 = fbm(q * 2.15 + vec2(n1 * 1.5, -t * 0.9));
  float n = mix(n1, n2, 0.55);

  // the column leans: its own convection, plus the draught the reader makes
  float sway = (n1 - 0.5) * 0.34 * pow(hy, 1.35);
  sway += uDraught * 0.42 * pow(hy, 1.6);
  sway += (breath - 0.5) * 0.12 * hy;

  // a teardrop: pinched on the wick, widest low down, drawn to a point
  float w = 0.34 * pow(hy + 0.05, 0.42) * (1.0 - pow(clamp(hy, 0.0, 1.0), 1.45));
  float d = abs(p.x - sway) / max(w, 0.0015);

  // a soft-edged body, bitten into tongues by the noise, more so higher up
  float edge = 1.0 - smoothstep(0.25, 1.25, d);
  float bite = smoothstep(0.10, 0.95, hy) * n * 1.55;
  float body = clamp(edge - bite, 0.0, 1.0);
  body *= smoothstep(0.0, 0.04, hy);        // welded to the wick
  body *= 1.0 - smoothstep(0.82, 1.0, hy);  // gone before the top
  body *= 0.92 + 0.08 * (n1 - 0.5) * 2.0;

  // the inner cone: narrower, steadier, its own slightly smaller sway —
  // the pale heart sits just above the wick and everything around it cools
  float wi = w * 0.58;
  float di = abs(p.x - sway * 0.85) / max(wi, 0.0015);
  float core = (1.0 - smoothstep(0.10, 1.0, di))
    * smoothstep(0.02, 0.14, hy)
    * (1.0 - smoothstep(0.16, 0.60, hy));
  core = clamp(core - smoothstep(0.25, 0.9, hy) * n * 0.9, 0.0, 1.0);
  core *= smoothstep(0.0, 0.25, body);

  // at the very foot the gas has not caught: it burns blue, faintly
  float blue = (1.0 - smoothstep(0.0, 1.0, d))
    * smoothstep(0.0, 0.025, hy) * (1.0 - smoothstep(0.03, 0.17, hy));

  vec3 white  = vec3(1.000, 0.973, 0.902);
  vec3 hot    = vec3(0.969, 0.831, 0.533);
  vec3 amber  = vec3(0.929, 0.651, 0.239);
  vec3 ember  = vec3(0.839, 0.310, 0.200);
  vec3 cobalt = vec3(0.30, 0.42, 0.95);

  vec3 col = mix(ember, amber, smoothstep(0.04, 0.50, body));
  col = mix(col, hot, smoothstep(0.20, 0.70, core));
  col = mix(col, white, smoothstep(0.72, 0.98, core));
  col = mix(col, cobalt, blue * 0.55);

  float a = pow(body, 1.2) * uLit;
  a = max(a, blue * 0.30 * uLit);

  // the light it throws, strongest at the wick, breathing with the flame
  float halo = exp(-d * 0.85) * exp(-hy * 2.6) * 0.20 * uLit * (0.85 + 0.30 * breath);

  // the thread above the tip: soot lit by the flame under it, thin and
  // broken, widening and losing itself as it climbs
  float above = smoothstep(0.85, 1.12, hy);
  float sootN = fbm(vec2(p.x * 6.0 + uSeed * 5.0, hy * 2.2 - t * 0.85));
  float sootW = 0.05 + 0.12 * max(hy - 1.0, 0.0);
  float sootX = sway * 1.25 + (sootN - 0.5) * 0.30 * max(hy - 0.8, 0.0);
  float soot = (1.0 - smoothstep(0.0, sootW, abs(p.x - sootX)));
  soot *= above * (1.0 - smoothstep(1.15, 1.58, hy));
  soot *= smoothstep(0.38, 0.72, sootN) * 0.14 * uLit;

  if (uPaper > 0.5) {
    // drawn on the sheet: warm ink, dense at the heart, open at the tongues,
    // and the soot a grey smudge where the nib was lifted
    vec3 ink = mix(vec3(0.361, 0.220, 0.086), vec3(0.612, 0.388, 0.114), core);
    ink = mix(ink, vec3(0.30, 0.26, 0.22), soot * 4.0);
    gl_FragColor = vec4(ink, (pow(body, 1.35) * 0.7 + halo * 0.45 + soot * 2.2) * uLit);
  } else {
    vec3 sootCol = vec3(0.42, 0.34, 0.27);
    gl_FragColor = vec4(col * (a + halo) + sootCol * soot, a + halo + soot);
  }
}
`

/** How much of each flame's quad the flame itself fills; the rest is soot. */
const FLAME_SPAN = 0.62

const MAX_FLAMES = 20

/**
 * One canvas, every flame. Each frame the layer reads where the registered
 * flame elements currently sit and draws a shader flame into each rectangle,
 * so flames stay welded to the layout while they scroll.
 */
export default function FlameLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const paper = theme === 'paper'

  const stillness = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || stillness) return

    const stopTracking = startReaderTracking()
    let unsubscribe: (() => void) | undefined

    const unmount = mountGL(
      canvas,
      (three) => {
        const scene = new three.Scene()
        // pixel-space camera: 1 world unit = 1 CSS pixel, origin top-left
        const camera = new three.OrthographicCamera(0, 1, 0, 1, -10, 10)

        // unit quad spanning y 0..1 downward from its own origin, so a mesh
        // placed at the top of the flame's box covers it exactly
        const geo = new three.PlaneGeometry(1, 1)
        geo.translate(0, 0.5, 0)

        const meshes = Array.from({ length: MAX_FLAMES }, () => {
          const mat = new three.ShaderMaterial({
            vertexShader: VERT,
            fragmentShader: FRAG.replace(/FLAME_SPAN/g, FLAME_SPAN.toFixed(2)),
            transparent: true,
            depthWrite: false,
            depthTest: false,
            // the quad is flipped vertically to grow upward, which reverses
            // its winding: without both sides it would be culled away
            side: three.DoubleSide,
            blending: paper ? three.NormalBlending : three.AdditiveBlending,
            uniforms: {
              uTime: { value: 0 },
              uSeed: { value: Math.random() },
              uLit: { value: 0 },
              uDraught: { value: 0 },
              uPaper: { value: paper ? 1 : 0 },
            },
          })
          const mesh = new three.Mesh(geo, mat)
          mesh.frustumCulled = false
          mesh.visible = false
          scene.add(mesh)
          return mesh
        })

        setFlameGL(true)
        const boxes = createBoxCache()
        // a flame appearing or leaving changes the layout under us
        unsubscribe = onFlamesChanged(() => boxes.invalidate())

        let draught = 0
        return {
          scene,
          camera,
          update: (t, dt) => {
            draught += (reader.scroll * -reader.dir - draught) * Math.min(1, dt * 2.5)

            boxes.tick(performance.now())
            const vh = window.innerHeight
            const scrollX = window.scrollX
            const scrollY = window.scrollY
            let i = 0
            getFlames().forEach((f) => {
              if (i >= MAX_FLAMES) return
              const b = boxes.get(f.el)
              const top = b.top - scrollY
              // skip flames well outside the viewport
              if (top + b.height < -80 || top > vh + 80 || b.width === 0) return
              const mesh = meshes[i++]
              const w = f.size * 2.7                // room for the halo and the sway
              const h = (f.size * 2.9) / FLAME_SPAN  // and, above the tip, for the soot
              mesh.visible = true
              // top edge of the flame's box; the shader grows it down to the wick
              mesh.position.set(b.left - scrollX + b.width / 2, top + b.height - h, 0)
              mesh.scale.set(w, h, 1)
              const u = (mesh.material as { uniforms: Record<string, { value: number }> }).uniforms
              u.uTime.value = t
              u.uSeed.value = f.seed
              u.uDraught.value = draught
              // lighting is a swell, not a switch
              const target = f.lit ? 1 : 0
              u.uLit.value += (target - u.uLit.value) * Math.min(1, dt * 2.2)
            })
            for (let j = i; j < MAX_FLAMES; j++) meshes[j].visible = false
            // most chapters carry no flame at all
            return i > 0
          },
          resize: (w, h) => {
            boxes.invalidate()
            const cam = camera as unknown as {
              left: number; right: number; top: number; bottom: number
              updateProjectionMatrix: () => void
            }
            cam.left = 0
            cam.right = w
            cam.top = 0
            cam.bottom = h
            cam.updateProjectionMatrix()
          },
          dispose: () => {
            setFlameGL(false)
            geo.dispose()
            meshes.forEach((m) => (m.material as { dispose: () => void }).dispose())
          },
        }
      },
      () => setFlameGL(false)
    )

    return () => {
      unmount()
      unsubscribe?.()
      stopTracking()
      setFlameGL(false)
    }
  }, [paper, stillness])

  return (
    <canvas
      key={`${theme}-${stillness}`}
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[83] h-full w-full"
    />
  )
}
