'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'

import { useEffect, useRef } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { mountGL, prefersReducedMotion } from './mount'

/**
 * கார்த்திகைப் பூ — Gloriosa superba, the glory lily.
 *
 * The flower of Maaveerar Naal, which opens in November. Six petals, each
 * reflexed: they leave the base, sweep up and outward, and the margin waves
 * so hard that the whole head reads as a standing fire. That resemblance is
 * the reason it is the flower it is, so the geometry has to earn it —
 * nothing here is a billboard or a texture.
 *
 * A petal is a parametric ribbon over (u along its length, v across its
 * width). The centreline arcs out and up; the width swells and tapers; the
 * margin is displaced along the surface normal by a wave that grows toward
 * the tip. Six of those, turned around the axis, plus the stamens that
 * radiate almost horizontally beneath them.
 */

const PETALS = 6
const NU = 44
const NV = 11

/** Where the centreline of a petal is at u, before the petal is turned. */
function centre(u: number): [number, number] {
  // out from the axis, then the tip flicks further out
  const r = 0.055 + 0.50 * u + 0.16 * u * u * u
  // up fast at first, easing as it reaches its height
  const y = 1.06 * Math.sin(u * 1.36)
  return [r, y]
}

/** Half-width of the petal at u: pinched at the base, drawn to a point. */
function halfWidth(u: number): number {
  return 0.255 * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.72)), 0.85)
}

function buildPetal(
  three: typeof import('three'),
  seed: number
): import('three').BufferGeometry {
  const pos: number[] = []
  const nrm: number[] = []
  const att: number[] = [] // u, v, and how far out on the margin
  const idx: number[] = []

  const P = (u: number, v: number): [number, number, number] => {
    const [r, y] = centre(u)
    const w = halfWidth(u)

    // the blade is not flat: it troughs along its middle like a gutter
    const cup = (1 - v * v) * 0.085 * Math.sin(Math.PI * u)
    // and the whole petal twists slowly as it rises
    const twist = 0.42 * u * u

    // the crisped margin — the wave that makes it look like flame
    const wave =
      Math.sin(u * 13.0 + seed * 5.1) *
      0.058 *
      Math.abs(v) *
      Math.pow(Math.max(0, (u - 0.12) / 0.88), 1.4)

    const across = v * w
    // local frame: x is outward, y up, z across the petal
    const x = r + cup + wave * 0.55 + across * Math.sin(twist) * 0.35
    const yy = y + wave + across * Math.sin(twist) * 0.15
    const z = across * Math.cos(twist)
    return [x, yy, z]
  }

  for (let i = 0; i < NU; i++) {
    const u = i / (NU - 1)
    for (let j = 0; j < NV; j++) {
      const v = (j / (NV - 1)) * 2 - 1
      const [x, y, z] = P(u, v)
      pos.push(x, y, z)
      att.push(u, v, Math.abs(v))
      nrm.push(0, 0, 0)
    }
  }
  for (let i = 0; i < NU - 1; i++) {
    for (let j = 0; j < NV - 1; j++) {
      const a = i * NV + j
      const b = a + NV
      idx.push(a, b, a + 1, a + 1, b, b + 1)
    }
  }

  const g = new three.BufferGeometry()
  g.setAttribute('position', new three.Float32BufferAttribute(pos, 3))
  g.setAttribute('aPetal', new three.Float32BufferAttribute(att, 3))
  g.setAttribute('normal', new three.Float32BufferAttribute(nrm, 3))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

const VERT = /* glsl */ `
precision mediump float;
attribute vec3 aPetal;   // u along, v across, |v|
varying vec3 vA;
varying vec3 vN;
varying vec3 vPos;
void main() {
  vA = aPetal;
  vN = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`

/**
 * The petal's colour is its own map: green where it leaves the stem, gold
 * through the middle, and deep ember toward the tip, with the wavy margin
 * catching the light the way the real flower's crisped edge does.
 *
 * Petals are thin, so they are lit from both sides — a leaf held up to a
 * lamp glows rather than going black.
 */
const FRAG = /* glsl */ `
precision mediump float;
varying vec3 vA;
varying vec3 vN;
varying vec3 vPos;
uniform float uPaper;
uniform float uBreath;

const vec3 C_GREEN = vec3(0.404, 0.541, 0.169);
const vec3 C_GOLD  = vec3(0.906, 0.729, 0.157);
const vec3 C_EMBER = vec3(0.831, 0.157, 0.212);
const vec3 C_DEEP  = vec3(0.478, 0.071, 0.129);
const vec3 C_INK   = vec3(0.169, 0.129, 0.094);

void main() {
  float u = vA.x;
  float edge = vA.z;

  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(-vPos);
  // one warm source, high and slightly toward the reader
  vec3 L = normalize(vec3(0.35, 0.9, 0.55));

  float lambert = max(dot(N, L), 0.0);
  // thin tissue: light coming through the back of the petal
  float through = pow(max(dot(-N, L), 0.0), 1.6) * 0.55;
  float rim = pow(1.0 - abs(dot(N, V)), 2.2);

  // along the petal: green foot, gold waist, ember head
  vec3 col = mix(C_GREEN, C_GOLD, smoothstep(0.04, 0.30, u));
  col = mix(col, C_EMBER, smoothstep(0.26, 0.62, u));
  col = mix(col, C_DEEP, smoothstep(0.74, 1.0, u) * 0.55);

  // the crisped margin keeps the gold the flower actually has
  col = mix(col, C_GOLD, smoothstep(0.62, 1.0, edge) * smoothstep(0.10, 0.42, u) * 0.75);

  float shade = 0.30 + 0.70 * lambert;
  col *= shade + through;
  col += C_GOLD * rim * 0.22 * uBreath;

  if (uPaper > 0.5) {
    float ink = 1.0 - clamp(lambert * 0.8 + rim * 0.35, 0.0, 1.0);
    gl_FragColor = vec4(C_INK, ink * 0.72);
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`

const STEM_VERT = /* glsl */ `
precision mediump float;
varying float vY;
varying vec3 vN;
void main() {
  vY = position.y;
  vN = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
const STEM_FRAG = /* glsl */ `
precision mediump float;
varying float vY;
varying vec3 vN;
uniform float uPaper;
void main() {
  vec3 N = normalize(vN);
  float l = 0.35 + 0.65 * max(dot(N, normalize(vec3(0.35, 0.9, 0.55))), 0.0);
  vec3 green = mix(vec3(0.235, 0.325, 0.110), vec3(0.478, 0.616, 0.212), clamp(vY * 1.6 + 0.4, 0.0, 1.0));
  if (uPaper > 0.5) { gl_FragColor = vec4(vec3(0.169, 0.129, 0.094), (1.0 - l) * 0.7); }
  else { gl_FragColor = vec4(green * l, 1.0); }
}
`

/**
 * The flower, standing where the vigil opens.
 *
 * It turns very slowly — a plant moves, and the head is not symmetric, so
 * standing perfectly still would read as a photograph rather than a thing
 * that is alive. It does not follow the pointer.
 */
export default function GlKaarthigai({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const paper = theme === 'paper'

  const stillness = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || stillness) return

    return mountGL(canvas, (three) => {
      const scene = new three.Scene()
      const camera = new three.PerspectiveCamera(30, 1, 0.1, 40)
      camera.position.set(0, 0.86, 3.05)
      camera.lookAt(0, 0.52, 0)

      const head = new three.Group()

      const petalMat = new three.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: paper,
        side: three.DoubleSide,
        uniforms: { uPaper: { value: paper ? 1 : 0 }, uBreath: { value: 1 } },
      })

      const geos: import('three').BufferGeometry[] = []
      for (let i = 0; i < PETALS; i++) {
        const g = buildPetal(three, i * 1.7)
        geos.push(g)
        const m = new three.Mesh(g, petalMat)
        m.rotation.y = (i / PETALS) * Math.PI * 2
        // no two petals of a real flower sit at the same angle
        m.rotation.z = -0.06 + 0.12 * Math.sin(i * 2.1)
        m.scale.setScalar(0.94 + 0.1 * Math.sin(i * 1.3))
        head.add(m)
      }

      const stemMat = new three.ShaderMaterial({
        vertexShader: STEM_VERT,
        fragmentShader: STEM_FRAG,
        transparent: paper,
        side: three.DoubleSide,
        uniforms: { uPaper: { value: paper ? 1 : 0 } },
      })

      // the stamens: they radiate almost flat, well below the petals
      const filament = new three.CylinderGeometry(0.009, 0.006, 1, 6, 1, true)
      filament.translate(0, 0.5, 0)
      const anther = new three.SphereGeometry(0.030, 10, 8)
      anther.scale(2.4, 0.8, 0.8)
      for (let i = 0; i < PETALS; i++) {
        const a = (i / PETALS) * Math.PI * 2 + 0.5
        const arm = new three.Group()
        const f = new three.Mesh(filament, stemMat)
        f.scale.y = 0.62 + 0.10 * Math.sin(i * 1.9)
        // laid over almost horizontal, drooping at the end
        f.rotation.z = -1.28
        arm.add(f)
        const tip = new three.Mesh(anther, stemMat)
        const len = f.scale.y
        tip.position.set(Math.sin(1.28) * len, Math.cos(1.28) * len, 0)
        tip.rotation.z = -0.5
        arm.add(tip)
        arm.rotation.y = a
        arm.position.y = 0.10
        head.add(arm)
      }

      // the stalk it stands on
      const stalk = new three.CylinderGeometry(0.020, 0.030, 0.62, 8)
      const stalkMesh = new three.Mesh(stalk, stemMat)
      stalkMesh.position.y = -0.31
      head.add(stalkMesh)

      head.position.y = -0.28
      scene.add(head)

      return {
        scene,
        camera,
        update: (t) => {
          // a plant is never quite still
          head.rotation.y = 0.28 + 0.10 * Math.sin(t * 0.11)
          head.rotation.z = 0.022 * Math.sin(t * 0.17 + 1.2)
          petalMat.uniforms.uBreath.value = 0.85 + 0.15 * Math.sin(t * 0.6)
        },
        dispose: () => {
          geos.forEach((g) => g.dispose())
          filament.dispose()
          anther.dispose()
          stalk.dispose()
          petalMat.dispose()
          stemMat.dispose()
        },
      }
    })
  }, [paper, stillness])

  return (
    <canvas
      key={`${theme}-${stillness}`}
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none block h-full w-full ${className}`}
    />
  )
}
