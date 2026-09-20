'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { reader, startReaderTracking } from '@/lib/motion'
import { isSmallScreen, mountGL } from './mount'

/**
 * The night of Black July, seen from a room in Colombo.
 *
 * Nothing here is the violence itself. It is what reached the people who
 * hid from it: the fires elsewhere in the city lighting the sky from
 * below, unevenly, the way a fire does; the ash that came down out of
 * that sky for hours; the embers the wind carried over the rooftops.
 *
 * One canvas, three materials, pinned under the reader for the length of
 * the chapter, like the pyre under the library. It deepens as the reader
 * descends, together with the veil of blood.
 */

const NOISE = (octaves: number) => /* glsl */ `
#define OCTAVES ${octaves}
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < OCTAVES; i++) { v += a * noise(p); p = p * 2.03 + vec2(13.0, 5.0); a *= 0.5; }
  return v;
}
`

// ————————————————————————————————————————————————————————————————
// The firelight
// ————————————————————————————————————————————————————————————————

const LIGHT_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

// Fires beyond the rooftops, each breathing on its own: the sky over the
// city is lit from below, and the whole room with it, faintly, unevenly.
const LIGHT_FRAG = (octaves: number) => /* glsl */ `
precision mediump float;
varying vec2 vUv;
uniform float uTime;
uniform float uAspect;
uniform float uAlpha;
uniform float uPaper;
uniform float uPhase;
${NOISE(octaves)}

void main() {
  vec2 uv = vUv;
  float t = uTime;

  // five fires along the horizon, at their own distances and their own pace
  float glow = 0.0;
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float x0 = 0.08 + 0.21 * fi + sin(fi * 7.3) * 0.06;
    float pace = mix(1.2, 2.8, hash(vec2(fi, 1.0)));
    float flick = 0.45 + 0.55 * noise(vec2(t * pace + fi * 9.0, fi * 3.0));
    // now and then one flares up and sinks back
    flick += pow(noise(vec2(t * 0.35 + fi * 5.0, 7.0)), 5.0) * 0.8;
    float dx = (uv.x - x0) * uAspect;
    float spread = mix(0.9, 2.2, hash(vec2(fi, 2.0)));
    glow += exp(-dx * dx * spread) * flick * mix(0.5, 1.0, hash(vec2(fi, 3.0)));
  }

  // it climbs the sky and dies away; the air it crosses is not still
  float fall = exp(-uv.y * 4.2);
  // Two scales of drifting smoke break up the light into receding layers.
  vec2 air = vec2(uv.x * uAspect * 2.2 + t * 0.025, uv.y * 2.8 - t * 0.055);
  float distant = fbm(air);
  float nearSmoke = fbm(air * 1.7 + vec2(distant * 1.4, -t * 0.025));
  float folds = smoothstep(0.28, 0.76, nearSmoke);
  float haze = mix(0.38, 1.0, distant) * (1.0 - folds * 0.48);
  float body = glow * fall * haze;
  float smokeLight = folds * exp(-uv.y * 2.0) * 0.16;

  // and the room itself flickers, the whole of it, with every fire at once
  float room = (0.4 + 0.6 * noise(vec2(t * 1.3, 5.0))) * 0.045 * (0.5 + 0.5 * (1.0 - uv.y));

  vec3 blood = vec3(0.561, 0.137, 0.094);
  vec3 ember = vec3(0.839, 0.310, 0.200);
  vec3 amber = vec3(0.929, 0.651, 0.239);
  float b = clamp(body, 0.0, 1.0);
  vec3 col = mix(blood, ember, b);
  col = mix(col, amber, b * b * 0.45);

  float a = clamp(body * 0.48 + smokeLight + room, 0.0, 1.0) * uAlpha * mix(0.3, 1.0, uPhase);

  if (uPaper > 0.5) {
    // by daylight the sky is a rust stain rising from the foot of the sheet
    gl_FragColor = vec4(mix(vec3(0.48, 0.24, 0.13), vec3(0.35, 0.22, 0.12), b), a * 0.55);
  } else {
    gl_FragColor = vec4(col * a, a);
  }
}
`

// ————————————————————————————————————————————————————————————————
// The ash
// ————————————————————————————————————————————————————————————————

const ASH_VERT = (octaves: number) => /* glsl */ `
precision mediump float;
attribute vec4 aSeed;
uniform float uTime;
uniform vec2 uArea;
uniform float uPix;
uniform float uDraft;
uniform float uPhase;
varying float vFade;
varying float vSeed;
varying float vGlow;
varying float vLit;
${NOISE(octaves)}

void main() {
  float dur = mix(14.0, 26.0, aSeed.z);
  float life = fract(uTime / dur + aSeed.w);

  // it came down out of the sky for hours: let go high up, settling on everything
  float x = (aSeed.x * 2.0 - 1.0) * uArea.x * 0.54;
  float y = mix(uArea.y * 0.62, -uArea.y * 0.62, life);
  x += sin(life * 6.2832 * mix(1.2, 2.6, aSeed.y) + aSeed.x * 30.0) * mix(0.25, 0.8, aSeed.y);
  x += (noise(vec2(uTime * 0.07 + aSeed.w * 40.0, aSeed.y * 7.0)) - 0.5) * 2.8;
  // a slow wind from one side, which changes its mind
  x += sin(uTime * 0.05) * 0.8 * life;
  y += sin(uTime * mix(0.8, 1.6, aSeed.x) + aSeed.w * 60.0) * 0.06;
  // a scroll stirs it back up
  y += uDraft * mix(0.5, 1.4, aSeed.x) * 1.6;
  float z = (fract(aSeed.y * 9.13) * 2.0 - 1.0) * 2.5;

  vec4 mv = modelViewMatrix * vec4(x, y, z, 1.0);
  float size = mix(0.09, 0.26, fract(aSeed.z * 6.3));
  gl_PointSize = max(1.0, size * uPix * (150.0 / -mv.z));

  vFade = smoothstep(0.0, 0.08, life) * (1.0 - smoothstep(0.8, 1.0, life));
  vFade *= 0.5 + 0.5 * sin(uTime * mix(2.0, 5.0, aSeed.y) + aSeed.x * 90.0);
  // fewer flakes early in the chapter, the sky full of them by its heart
  vFade *= 1.0 - smoothstep(mix(0.4, 1.0, uPhase), mix(0.4, 1.0, uPhase) + 0.15, fract(aSeed.w * 2.9));
  // a few are still embers when they reach us
  vGlow = step(0.86, fract(aSeed.w * 3.7)) * (1.0 - smoothstep(0.0, 0.5, life));
  // lit from below by the fires, the lower they fall
  vLit = 1.0 - smoothstep(-uArea.y * 0.55, uArea.y * 0.3, y);
  vSeed = aSeed.w;
  gl_Position = projectionMatrix * mv;
}
`

const ASH_FRAG = /* glsl */ `
precision mediump float;
uniform float uPaper;
uniform float uAlpha;
varying float vFade;
varying float vSeed;
varying float vGlow;
varying float vLit;

void main() {
  vec2 p = gl_PointCoord - 0.5;
  float ang = atan(p.y, p.x);
  float r = 0.32 + 0.11 * sin(ang * 3.0 + vSeed * 40.0) + 0.06 * sin(ang * 7.0 + vSeed * 90.0);
  float flake = 1.0 - smoothstep(r - 0.10, r + 0.04, length(p));

  // soot is dark; what shows of it is the firelight it catches
  vec3 dark = vec3(0.22, 0.20, 0.19);
  vec3 lit  = vec3(0.60, 0.40, 0.27);
  vec3 ember = vec3(0.84, 0.31, 0.20);
  vec3 col = mix(dark, lit, vLit * 0.8);
  col = mix(col, ember, vGlow);
  float a = flake * vFade * uAlpha * mix(0.55, 1.0, max(vLit, vGlow));

  if (uPaper > 0.5) {
    gl_FragColor = vec4(vec3(0.27, 0.20, 0.13), flake * vFade * uAlpha * 0.35);
  } else {
    gl_FragColor = vec4(col, a);
  }
}
`

// ————————————————————————————————————————————————————————————————
// The embers
// ————————————————————————————————————————————————————————————————

const EMBER_VERT = (octaves: number) => /* glsl */ `
precision highp float;
attribute vec4 aSeed;
uniform float uTime;
uniform vec2 uArea;
uniform float uPix;
uniform float uDraft;
uniform float uPhase;
varying float vFade;
varying float vLife;
${NOISE(octaves)}

void main() {
  // the fires are streets away: what arrives is slow, high, and cooling
  float dur = mix(7.0, 14.0, aSeed.z);
  float life = fract(uTime / dur + aSeed.w);
  float x = (aSeed.x * 2.0 - 1.0) * uArea.x * 0.5;
  float y = -uArea.y * 0.6 + pow(life, 0.8) * uArea.y * mix(0.7, 1.25, aSeed.y);
  x += (noise(vec2(life * 3.0 + aSeed.w * 40.0, aSeed.x * 20.0)) - 0.5) * 2.6 * life;
  x += sin(life * 14.0 * mix(0.6, 1.4, aSeed.z) + aSeed.w * 30.0) * 0.18;
  x += sin(uTime * 0.05) * 1.2 * life;
  x += uDraft * (aSeed.z - 0.5) * 1.5;
  y += uDraft * mix(0.5, 1.5, aSeed.y);
  float z = (fract(aSeed.y * 6.71) * 2.0 - 1.0) * 1.8;

  vec4 mv = modelViewMatrix * vec4(x, y, z, 1.0);
  float size = mix(0.16, 0.34, fract(aSeed.w * 5.7));
  gl_PointSize = max(1.0, size * uPix * (150.0 / -mv.z));

  float gust = smoothstep(0.3, 0.8, noise(vec2(uTime * 0.25, aSeed.x * 3.0)));
  vFade = smoothstep(0.0, 0.08, life) * (1.0 - smoothstep(0.5, 1.0, life));
  vFade *= mix(0.3, 1.0, gust) * mix(0.35, 1.0, uPhase);
  vFade *= 0.7 + 0.3 * pow(max(0.0, sin(uTime * 11.0 + aSeed.w * 90.0)), 3.0);
  vLife = life;
  gl_Position = projectionMatrix * mv;
}
`

const EMBER_FRAG = /* glsl */ `
precision mediump float;
uniform float uPaper;
uniform float uAlpha;
varying float vFade;
varying float vLife;

void main() {
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p) * 2.0;
  float glow = pow(1.0 - smoothstep(0.0, 1.0, d), 1.8);
  vec3 amber = vec3(0.93, 0.65, 0.24);
  vec3 cool = vec3(0.60, 0.15, 0.09);
  vec3 col = mix(amber, cool, smoothstep(0.1, 0.9, vLife));
  float a = glow * vFade * uAlpha;
  if (uPaper > 0.5) {
    gl_FragColor = vec4(vec3(0.48, 0.24, 0.13), glow * vFade * uAlpha * 0.4);
  } else {
    gl_FragColor = vec4(col * a, a);
  }
}
`

interface Props {
  /** overall strength 0..1 */
  alpha?: number
  className?: string
}

/**
 * The air over Colombo that night. Placed inside a `relative` section; it
 * pins itself to the viewport for as long as the section is under the
 * reader, exactly like the pyre under the library.
 */
export default function GlJuillet({ alpha = 1, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const paper = theme === 'paper'
  const stillness = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || stillness) return

    const stopTracking = startReaderTracking()
    const section = canvas.closest('section')

    const unmount = mountGL(canvas, (three) => {
      const scene = new three.Scene()
      const camera = new three.PerspectiveCamera(55, 1, 0.1, 30)
      camera.position.z = 6

      const small = isSmallScreen()
      const octaves = small ? 3 : 4
      const ashCount = small ? 90 : 220
      const emberCount = small ? 30 : 70

      const seeds = (n: number) => {
        const s = new Float32Array(n * 4)
        for (let i = 0; i < n * 4; i++) s[i] = Math.random()
        return s
      }

      const shared = {
        uTime: { value: 0 },
        uArea: { value: new three.Vector2(8, 6.5) },
        uPix: { value: 1 },
        uDraft: { value: 0 },
        uPaper: { value: paper ? 1 : 0 },
        uAlpha: { value: alpha },
        uPhase: { value: 0 },
        uAspect: { value: 1 },
      }

      // ——— the firelight: the whole viewport, drawn straight in clip space ———
      const lightGeo = new three.PlaneGeometry(2, 2)
      const lightMat = new three.ShaderMaterial({
        vertexShader: LIGHT_VERT,
        fragmentShader: LIGHT_FRAG(octaves),
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: paper ? three.NormalBlending : three.AdditiveBlending,
        uniforms: shared,
      })
      const light = new three.Mesh(lightGeo, lightMat)
      light.frustumCulled = false
      light.renderOrder = -1
      scene.add(light)

      // ——— the ash ———
      const ashGeo = new three.BufferGeometry()
      ashGeo.setAttribute('position', new three.BufferAttribute(new Float32Array(ashCount * 3), 3))
      ashGeo.setAttribute('aSeed', new three.BufferAttribute(seeds(ashCount), 4))
      const ashMat = new three.ShaderMaterial({
        vertexShader: ASH_VERT(octaves),
        fragmentShader: ASH_FRAG,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: three.NormalBlending,
        uniforms: shared,
      })
      const ash = new three.Points(ashGeo, ashMat)
      ash.frustumCulled = false
      ash.renderOrder = 1
      scene.add(ash)

      // ——— the embers ———
      const emberGeo = new three.BufferGeometry()
      emberGeo.setAttribute('position', new three.BufferAttribute(new Float32Array(emberCount * 3), 3))
      emberGeo.setAttribute('aSeed', new three.BufferAttribute(seeds(emberCount), 4))
      const emberMat = new three.ShaderMaterial({
        vertexShader: EMBER_VERT(octaves),
        fragmentShader: EMBER_FRAG,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: paper ? three.NormalBlending : three.AdditiveBlending,
        uniforms: shared,
      })
      const embers = new three.Points(emberGeo, emberMat)
      embers.frustumCulled = false
      embers.renderOrder = 2
      scene.add(embers)

      let draft = 0
      let phase = 0
      return {
        scene,
        camera,
        update: (t, dt) => {
          shared.uTime.value = t
          draft += (reader.scroll * -reader.dir - draft) * Math.min(1, dt * 3)
          shared.uDraft.value = draft
          if (section) {
            // the night deepens as the reader goes down into it, with the veil
            const r = section.getBoundingClientRect()
            const vh = window.innerHeight
            const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)))
            const target = smoothstep(0.04, 0.42, p)
            phase += (target - phase) * Math.min(1, dt * 2)
            shared.uPhase.value = phase
          }
        },
        resize: (w, h, dpr) => {
          const worldH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360)
          shared.uArea.value.set(worldH * (w / h), worldH)
          shared.uPix.value = dpr
          shared.uAspect.value = w / h
        },
        dispose: () => {
          lightGeo.dispose()
          lightMat.dispose()
          ashGeo.dispose()
          ashMat.dispose()
          emberGeo.dispose()
          emberMat.dispose()
        },
      }
    })

    return () => {
      unmount()
      stopTracking()
    }
  }, [alpha, paper, stillness])

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 z-[1] ${className}`}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <canvas key={`${theme}-${stillness}`} ref={canvasRef} className="block h-full w-full" />
      </div>
    </div>
  )
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
