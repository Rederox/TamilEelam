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

// The sea at Mullivaikkal: near-black water under a starless sky,
// one warm path of light on it — the vigil flame reflected.
// uAgitation slides the water toward blood while the shells fall.
const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uAspect;
uniform float uAgitation;
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
  float horizon = 0.42;
  vec3 col = vec3(0.0);
  float a = 0.0;

  if (vUv.y < horizon) {
    float depth = (horizon - vUv.y) / horizon; // 0 at horizon, 1 at bottom
    float persp = pow(depth, 0.62);

    float speed = uTime * mix(0.045, 0.10, uAgitation);
    vec2 wuv = vec2(
      (vUv.x - 0.5) * uAspect * mix(30.0, 4.5, persp),
      persp * 15.0 + speed * 3.0
    );
    float n = fbm(wuv + vec2(speed * 2.0, 0.0));
    float crest = pow(smoothstep(0.42, 0.92, n), 2.0);

    // cold, bone-tinted black water
    vec3 water = vec3(0.028, 0.026, 0.024) + vec3(0.06, 0.057, 0.052) * n * depth;
    water += vec3(0.17, 0.163, 0.148) * crest * depth * 0.32;

    // the flame's reflection, broken by the waves
    float wob = sin(vUv.y * 46.0 + uTime * 0.6) * 0.008 * (1.0 - depth);
    float path = exp(-abs(vUv.x - 0.5 + wob) * mix(30.0, 8.0, persp));
    float flick = 0.8 + 0.2 * sin(uTime * 2.9 + vUv.y * 34.0);
    water += vec3(0.929, 0.651, 0.239) * path * (crest * 0.55 + 0.05) * flick;

    // while the shells fall, the water remembers
    water = mix(water, water + vec3(0.30, 0.045, 0.02) * (crest * 0.7 + 0.1) * depth, uAgitation);

    col = water;
    a = uAlpha * smoothstep(0.0, 0.10, depth);

    if (uPaper > 0.5) {
      // drawn, not lit: a sepia wash with the crests left as bare paper
      vec3 wash = vec3(0.310, 0.239, 0.161);
      vec3 deep = vec3(0.157, 0.114, 0.075);
      col = mix(wash, deep, depth * 0.8);
      col = mix(col, vec3(0.478, 0.184, 0.110), uAgitation * 0.55);
      a = uAlpha * 0.42 * smoothstep(0.0, 0.10, depth) * (0.55 + 0.45 * (1.0 - crest));
      a *= 1.0 - path * 0.75; // the reflected flame stays unmarked paper
    }
  } else {
    // a breath of haze above the waterline
    float d = vUv.y - horizon;
    a = uAlpha * exp(-d * 46.0) * 0.22;
    col = vec3(0.085, 0.08, 0.072);
    if (uPaper > 0.5) {
      col = vec3(0.310, 0.239, 0.161);
      a *= 0.6;
    }
  }

  gl_FragColor = vec4(col, a);
}
`

// Fullscreen shader quad; sits at the base of the Mullivaikkal chapter.
// Renders nothing at all under prefers-reduced-motion or without WebGL —
// the chapter is complete without it.
export default function GlSea({ agitation = 0, alpha = 0.9 }: { agitation?: number; alpha?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const agitationRef = useRef(agitation)
  agitationRef.current = agitation
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
          uAgitation: { value: 0 },
          uAlpha: { value: alpha },
          uPaper: { value: paper ? 1 : 0 },
        },
      })
      scene.add(new three.Mesh(new three.PlaneGeometry(2, 2), mat))

      return {
        scene,
        camera,
        update: (t, dt) => {
          mat.uniforms.uTime.value = t
          // ease toward the target so the blood arrives like a tide, not a switch
          const cur = mat.uniforms.uAgitation.value as number
          mat.uniforms.uAgitation.value = cur + (agitationRef.current - cur) * Math.min(1, dt * 0.8)
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
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  )
}
