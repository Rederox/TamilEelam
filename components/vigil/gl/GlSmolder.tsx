'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { mountGL, prefersReducedMotion } from './mount'

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

// The library the morning it burned: not a raging fire but a dying one.
// Deep-red heat breathing along the ground, the rare tongue of flame
// still reaching amber before it gives up.
const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uAspect;
uniform float uAlpha;
uniform float uPaper;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    v += amp * noise(p);
    p = p * 2.03 + vec2(17.0, 9.0);
    amp *= 0.5;
  }
  return v;
}

void main() {
  // heat rising in slow motion
  vec2 p = vec2(vUv.x * uAspect * 2.6, vUv.y * 2.2 - uTime * 0.10);
  float n = fbm(p);
  float m = fbm(p * 2.1 + vec2(5.2, uTime * 0.06));
  float body = n * 0.7 + m * 0.3;

  // strongest at the ground, licked upward by the noise
  float reach = mix(1.15, 1.45, 0.5 + 0.5 * sin(uTime * 0.22));
  float f = max(body - vUv.y * reach, 0.0);

  vec3 blood = vec3(0.561, 0.137, 0.094); // #8f2318
  vec3 ember = vec3(0.839, 0.310, 0.200); // #d64f33
  vec3 amber = vec3(0.929, 0.651, 0.239); // #eda63d

  vec3 col = blood * pow(f, 0.9) * 1.2;
  col += ember * pow(f, 2.0) * 0.9;
  col += amber * pow(f, 4.5) * 0.5;

  float breathe = 0.86 + 0.14 * sin(uTime * 0.45);
  float a = clamp(pow(f, 1.2) * 1.6, 0.0, 1.0) * uAlpha * breathe;
  a *= smoothstep(1.0, 0.55, vUv.y); // fully dissolved well below the text

  // on paper the fire is not seen but left behind: a scorch creeping up the leaf
  vec3 char  = vec3(0.180, 0.129, 0.086);
  vec3 singe = vec3(0.427, 0.255, 0.129);
  vec3 pcol = mix(singe, char, pow(f, 1.6));
  float pa = clamp(pow(f, 1.5) * 1.3, 0.0, 1.0) * uAlpha * 0.62 * breathe;
  pa *= smoothstep(1.0, 0.55, vUv.y);

  gl_FragColor = uPaper > 0.5 ? vec4(pcol, pa) : vec4(col * a, a);
}
`

// Shader band along the bottom of the fire chapter.
// Renders nothing under prefers-reduced-motion or without WebGL:
// the CSS breathing gradient behind it already carries the scene.
export default function GlSmolder({ alpha = 0.75 }: { alpha?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const paper = theme === 'paper'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || prefersReducedMotion()) return

    return mountGL(canvas, (three) => {
      const scene = new three.Scene()
      const camera = new three.OrthographicCamera(-1, 1, 1, -1, 0, 1)

      const mat = new three.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uAspect: { value: 1 },
          uAlpha: { value: alpha },
          uPaper: { value: paper ? 1 : 0 },
        },
      })
      scene.add(new three.Mesh(new three.PlaneGeometry(2, 2), mat))

      return {
        scene,
        camera,
        update: (t) => {
          mat.uniforms.uTime.value = t
        },
        resize: (w, h) => {
          mat.uniforms.uAspect.value = w / h
        },
      }
    })
  }, [alpha, paper])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[38svh] w-full"
      aria-hidden="true"
    />
  )
}
