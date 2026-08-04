'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { getFlames, onFlamesChanged, setFlameGL } from '@/lib/flames'
import { reader, startReaderTracking } from '@/lib/motion'
import { mountGL, prefersReducedMotion } from './mount'

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

// A flame is hot gas rising: it tapers, it sways, and turbulence tears its
// crown into tongues that cool from white through amber to smoke.
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
  // The quad is laid out top-down in screen space, so height above the wick
  // is 1 - uv.y. x is centred on the wick.
  vec2 p = vec2(vUv.x - 0.5, 1.0 - vUv.y);
  float t = uTime + uSeed * 37.0;

  // the gas rises: the noise field scrolls upward and is warped by itself,
  // which is what gives a flame its curling tongues rather than a smooth cone
  vec2 q = vec2(p.x * 2.6, p.y * 1.7 - t * 1.25);
  float n1 = fbm(q + uSeed * 13.0);
  float n2 = fbm(q * 2.15 + vec2(n1 * 1.5, -t * 0.8));
  float n = mix(n1, n2, 0.55);

  // the column leans: its own convection, plus the draught the reader makes
  float sway = (n1 - 0.5) * 0.34 * pow(p.y, 1.35);
  sway += uDraught * 0.40 * pow(p.y, 1.7);

  // a teardrop: pinched on the wick, widest low down, drawn to a point
  float w = 0.34 * pow(p.y + 0.05, 0.42) * (1.0 - pow(p.y, 1.45));
  float d = abs(p.x - sway) / max(w, 0.0015);

  // a soft-edged body, bitten into tongues by the noise, more so higher up
  float edge = 1.0 - smoothstep(0.25, 1.25, d);
  float bite = smoothstep(0.10, 0.95, p.y) * n * 1.55;
  float body = clamp(edge - bite, 0.0, 1.0);
  body *= smoothstep(0.0, 0.04, p.y);        // welded to the wick
  body *= 1.0 - smoothstep(0.82, 1.0, p.y);  // gone before the top
  body *= 0.9 + 0.1 * sin(t * 2.3) + 0.06 * (n1 - 0.5);

  // the white heart sits just above the wick; everything around it cools
  float core = body
    * smoothstep(0.02, 0.14, p.y)
    * (1.0 - smoothstep(0.10, 0.45, p.y))
    * (1.0 - smoothstep(0.0, 0.70, d));

  vec3 white = vec3(1.000, 0.973, 0.902);
  vec3 hot   = vec3(0.969, 0.831, 0.533);
  vec3 amber = vec3(0.929, 0.651, 0.239);
  vec3 ember = vec3(0.839, 0.310, 0.200);

  vec3 col = mix(ember, amber, smoothstep(0.04, 0.50, body));
  col = mix(col, hot, smoothstep(0.20, 0.70, core));
  col = mix(col, white, smoothstep(0.72, 0.98, core));

  float a = pow(body, 1.2) * uLit;

  // the light it throws, strongest at the wick
  float halo = exp(-d * 0.85) * exp(-p.y * 2.6) * 0.20 * uLit;

  if (uPaper > 0.5) {
    // drawn on the sheet: warm ink, dense at the heart, open at the tongues
    vec3 ink = mix(vec3(0.361, 0.220, 0.086), vec3(0.612, 0.388, 0.114), core);
    gl_FragColor = vec4(ink, (pow(body, 1.35) * 0.7 + halo * 0.45) * uLit);
  } else {
    gl_FragColor = vec4(col * (a + halo), a + halo);
  }
}
`

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

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || prefersReducedMotion()) return

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
            fragmentShader: FRAG,
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
        unsubscribe = onFlamesChanged(() => {})

        let draught = 0
        return {
          scene,
          camera,
          update: (t, dt) => {
            draught += (reader.scroll * -reader.dir - draught) * Math.min(1, dt * 2.5)

            const vw = window.innerWidth
            const vh = window.innerHeight
            let i = 0
            getFlames().forEach((f) => {
              if (i >= MAX_FLAMES) return
              const r = f.el.getBoundingClientRect()
              // skip flames well outside the viewport
              if (r.bottom < -80 || r.top > vh + 80 || r.width === 0) return
              const mesh = meshes[i++]
              const w = f.size * 2.7      // room for the halo and the sway
              const h = f.size * 2.9
              mesh.visible = true
              // top edge of the flame's box; the shader grows it down to the wick
              mesh.position.set(r.left + r.width / 2, r.bottom - h, 0)
              mesh.scale.set(w, h, 1)
              const u = (mesh.material as { uniforms: Record<string, { value: number }> }).uniforms
              u.uTime.value = t
              u.uSeed.value = f.seed
              u.uDraught.value = draught
              // lighting is a swell, not a switch
              const target = f.lit ? 1 : 0
              u.uLit.value += (target - u.uLit.value) * Math.min(1, dt * 2.2)
            })
            for (; i < MAX_FLAMES; i++) meshes[i].visible = false
            void vw
          },
          resize: (w, h) => {
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
  }, [paper])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[83] h-full w-full"
    />
  )
}
