'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'

import { useEffect, useRef } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { mountGL, prefersReducedMotion } from './mount'

/**
 * அகல் விளக்கு — the earthen lamp, in profile, from the underside up.
 *
 * A diya is a solid of revolution everywhere except its spout, which is why
 * it can be turned honestly: the bowl is lathed from this curve, then the
 * front of the rim is pinched forward and down into the beak the wick lies
 * in. Everything below is in lamp-widths — the bowl is 1.0 across and about
 * 0.40 tall, which is the squat proportion that makes it read as clay rather
 * than as a cup.
 *
 * x is radius, y is height.
 */
const PROFILE: [number, number][] = [
  // the underside, slightly flattened so it sits on a table
  [0.000, 0.000],
  [0.090, 0.004],
  [0.170, 0.018],
  [0.245, 0.045],
  [0.310, 0.082],
  [0.365, 0.128],
  [0.410, 0.180],
  [0.446, 0.238],
  [0.472, 0.296],
  [0.489, 0.346],
  [0.497, 0.382],
  // the rim, rolled over
  [0.500, 0.400],
  [0.492, 0.412],
  [0.476, 0.410],
  // and back down the inside
  [0.462, 0.392],
  [0.436, 0.356],
  [0.400, 0.316],
  [0.348, 0.276],
  [0.282, 0.243],
  [0.200, 0.220],
  [0.110, 0.208],
  [0.000, 0.204],
]

/** Where the beak points: +z, toward the reader. */
const SPOUT_ANGLE = Math.PI / 2
/** How far round the rim the pinch reaches. */
const SPOUT_SPREAD = 0.62
const RIM_Y = 0.400
const RIM_R = 0.500
/** The oil sits a little below the rim. */
const OIL_Y = 0.300
/** The lamp stands low in frame. */
const BASE_Y = -0.14

const VERT = /* glsl */ `
precision mediump float;
varying vec3 vN;
varying vec3 vPos;
varying vec3 vLocal;
void main() {
  vN = normalize(normalMatrix * normal);
  vLocal = position;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`

/**
 * Fired clay, lit only by its own wick.
 *
 * Terracotta is not metal: it scatters rather than reflects, so there is a
 * broad soft falloff and only the faintest sheen where the glaze catches.
 * The banding is deliberately restrained — an ornate diya belongs to Diwali,
 * which is a festival. This lamp is lit at a vigil.
 */
const FRAG = /* glsl */ `
precision mediump float;
varying vec3 vN;
varying vec3 vPos;
varying vec3 vLocal;
uniform float uPaper;
uniform vec3 uLight;
uniform float uFlicker;

#define PI 3.14159265

void main() {
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(-vPos);
  vec3 L = uLight - vPos;
  float dist = length(L);
  L /= max(dist, 0.0001);

  // Gentle falloff. A physically tight 1/d² put the whole underside of the
  // bowl below the black point, so the lamp read as a saucer rather than a
  // vessel — the belly has to keep enough light to hold its shape.
  float fall = 1.0 / (1.0 + dist * dist * 1.35);
  float lambert = max(dot(N, L), 0.0);
  // clay scatters: a good deal of light survives on the shadowed side
  float wrap = max((dot(N, L) + 0.55) / 1.55, 0.0);

  vec3 H = normalize(L + V);
  float sheen = pow(max(dot(N, H), 0.0), 18.0) * 0.30;
  float ring = pow(1.0 - abs(dot(N, V)), 3.0);

  vec3 clay  = vec3(0.541, 0.286, 0.129);
  vec3 warm  = vec3(0.729, 0.427, 0.180);
  vec3 shade = vec3(0.086, 0.055, 0.039);

  float key = wrap * fall * uFlicker;
  vec3 col = mix(shade, clay, clamp(key * 1.9, 0.0, 1.0));
  col = mix(col, warm, clamp(lambert * fall * uFlicker * 1.15, 0.0, 1.0));
  col += warm * sheen * fall * uFlicker;
  // the grazing edge is what separates the belly from the night behind it
  col += vec3(0.635, 0.373, 0.153) * ring * 0.40;
  // and the faintest ambient, so the silhouette never vanishes entirely
  col += clay * 0.055;

  // one quiet band of dots around the belly, the way the clay is marked
  float ang = atan(vLocal.z, vLocal.x);
  float band = 0.150 + 0.020 * sin(ang * 3.0);
  float onBand = 1.0 - smoothstep(0.0, 0.016, abs(vLocal.y - band));
  float phase = fract(ang / (2.0 * PI) * 26.0);
  float pip = 1.0 - smoothstep(0.20, 0.34, abs(phase - 0.5));
  vec3 gold = vec3(0.788, 0.608, 0.184);
  col += gold * onBand * pip * (0.20 + 0.55 * fall * uFlicker);

  if (uPaper > 0.5) {
    float ink = 1.0 - clamp(wrap * 0.8 + ring * 0.4, 0.0, 1.0);
    gl_FragColor = vec4(vec3(0.169, 0.129, 0.094), ink * 0.70);
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`

/** The oil: a still amber disc that takes the flame's light straight on. */
const OIL_FRAG = /* glsl */ `
precision mediump float;
varying vec3 vLocal;
uniform float uFlicker;
uniform float uPaper;
void main() {
  float r = length(vLocal.xz) / 0.40;
  // darker at the rim where the clay shades it, bright under the wick
  float lit = (1.0 - smoothstep(0.35, 1.0, r)) * uFlicker;
  vec3 oil = mix(vec3(0.192, 0.106, 0.043), vec3(0.867, 0.596, 0.212), lit);
  float a = uPaper > 0.5 ? 0.35 : 1.0;
  gl_FragColor = vec4(uPaper > 0.5 ? vec3(0.271, 0.208, 0.145) : oil, a);
}
`
const OIL_VERT = /* glsl */ `
precision mediump float;
varying vec3 vLocal;
void main() {
  vLocal = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

/**
 * Where the eye stands. The vigil looks at its lamps from just above the rim;
 * a lamp set down on a floor is looked down on, from further back.
 */
export interface LampView {
  /** degrees below the horizontal */
  pitch: number
  /** how far back, in lamp-widths */
  distance: number
  /** vertical field of view, in degrees */
  fov: number
}

/**
 * An அகல் விளக்கு, turned in 3D, where a bare flame used to float.
 *
 * The flame itself is still drawn by the shared <FlameLayer>; this is the
 * clay it burns on. It does not spin with the pointer: a lamp set down is
 * still, and a memorial object that follows the mouse is a toy.
 *
 * `onWick` reports where the spout lands on screen, as a fraction of the
 * canvas box, so the caller can stand the flame exactly on it.
 */
export default function GlVilakku({
  onWick,
  view,
  className = '',
}: {
  onWick?: (x: number, y: number) => void
  view?: LampView
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wickCb = useRef(onWick)
  wickCb.current = onWick
  const { theme } = useTheme()
  const paper = theme === 'paper'

  const stillness = useReducedMotion()
  const { pitch, distance, fov } = view ?? {}

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || stillness) return

    return mountGL(canvas, (three) => {
      const scene = new three.Scene()
      const camera = new three.PerspectiveCamera(fov ?? 30, 1, 0.1, 40)
      if (pitch === undefined || distance === undefined) {
        // just above the rim, so the bowl reads as a bowl and the oil shows
        camera.position.set(0, 0.60, 1.62)
      } else {
        const a = (pitch * Math.PI) / 180
        camera.position.set(0, 0.10 + distance * Math.sin(a), distance * Math.cos(a))
      }
      camera.lookAt(0, 0.10, 0)

      const group = new three.Group()

      const bowl = new three.LatheGeometry(
        PROFILE.map(([x, y]) => new three.Vector2(x, y)),
        112
      )

      // ——— pinch the front of the rim into a spout ———
      // A lathe cannot make a beak, so the vertices near the front are pulled
      // outward and down afterwards, strongest at the rim and fading to
      // nothing by the belly, which is exactly how the potter's thumb works.
      const pos = bowl.attributes.position as { array: Float32Array; count: number }
      const arr = pos.array
      let spoutY = RIM_Y
      let spoutZ = RIM_R
      for (let i = 0; i < pos.count; i++) {
        const x = arr[i * 3]
        const y = arr[i * 3 + 1]
        const z = arr[i * 3 + 2]
        const r = Math.hypot(x, z)
        if (r < 1e-4) continue

        let d = Math.atan2(z, x) - SPOUT_ANGLE
        d = Math.atan2(Math.sin(d), Math.cos(d)) // wrap to -PI..PI
        const near = Math.max(0, 1 - Math.abs(d) / SPOUT_SPREAD)
        if (near <= 0) continue
        const w = near * near * (3 - 2 * near)            // smooth across the lip
        const high = Math.max(0, Math.min(1, (y - 0.14) / (RIM_Y - 0.14)))
        const k = w * high * high

        const nr = r + 0.115 * k          // juts forward
        const ny = y - 0.105 * k          // and dips
        arr[i * 3] = (x / r) * nr
        arr[i * 3 + 1] = ny
        arr[i * 3 + 2] = (z / r) * nr
        if (k > 0.92 && ny < spoutY) {
          spoutY = ny
          spoutZ = nr
        }
      }
      bowl.computeVertexNormals()

      const mat = new three.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: paper,
        side: three.DoubleSide,
        uniforms: {
          uPaper: { value: paper ? 1 : 0 },
          uLight: { value: new three.Vector3() },
          uFlicker: { value: 1 },
        },
      })
      group.add(new three.Mesh(bowl, mat))

      // the oil, filling the bowl to just under the rim
      const oilGeo = new three.CircleGeometry(0.40, 64)
      oilGeo.rotateX(-Math.PI / 2)
      const oilMat = new three.ShaderMaterial({
        vertexShader: OIL_VERT,
        fragmentShader: OIL_FRAG,
        transparent: paper,
        uniforms: { uFlicker: { value: 1 }, uPaper: { value: paper ? 1 : 0 } },
      })
      const oil = new three.Mesh(oilGeo, oilMat)
      oil.position.y = OIL_Y
      group.add(oil)

      // the wick: a twist of cotton lying in the beak
      const wickGeo = new three.ConeGeometry(0.020, 0.10, 10)
      const wickMesh = new three.Mesh(wickGeo, mat)
      wickMesh.position.set(0, spoutY + 0.035, spoutZ - 0.02)
      wickMesh.rotation.x = 0.30
      group.add(wickMesh)

      group.position.y = BASE_Y
      scene.add(group)

      const wickWorld = new three.Vector3(0, spoutY + BASE_Y + 0.075, spoutZ - 0.02)
      const wickView = new three.Vector3()
      const ndc = new three.Vector3()
      let lastX = -1
      let lastY = -1

      return {
        scene,
        camera,
        update: (t) => {
          const f = 0.82 + 0.18 * Math.sin(t * 2.7) + 0.06 * Math.sin(t * 6.1)
          mat.uniforms.uFlicker.value = f
          oilMat.uniforms.uFlicker.value = f

          // the shader works in view space, so the light must be too
          camera.updateMatrixWorld()
          wickView.copy(wickWorld).applyMatrix4(camera.matrixWorldInverse)
          ;(mat.uniforms.uLight.value as { copy: (v: unknown) => void }).copy(wickView)

          if (wickCb.current) {
            ndc.copy(wickWorld).project(camera)
            const x = (ndc.x + 1) / 2
            const y = (1 - ndc.y) / 2
            if (Math.abs(x - lastX) > 0.001 || Math.abs(y - lastY) > 0.001) {
              lastX = x
              lastY = y
              wickCb.current(x, y)
            }
          }
        },
        dispose: () => {
          bowl.dispose()
          oilGeo.dispose()
          wickGeo.dispose()
          mat.dispose()
          oilMat.dispose()
        },
      }
    })
  }, [paper, stillness, pitch, distance, fov])

  return (
    <canvas
      key={`${theme}-${stillness}`}
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none block h-full w-full ${className}`}
    />
  )
}
