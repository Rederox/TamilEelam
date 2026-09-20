'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'

import { useEffect, useRef } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { mountGL } from './mount'

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

// A perspective ocean surface with wind-driven swell, Fresnel reflections,
// broken specular light and coastal haze. No image or video is downloaded.
const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uAspect;
uniform float uAgitation;
uniform float uAlpha;
uniform float uPaper;
uniform float uStormTime;
uniform float uStorm;
uniform float uBlood;
uniform float uHorizon;
uniform float uStillness;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), u.x),
             mix(hash(i + vec2(0., 1.)), hash(i + vec2(1.)), u.x), u.y);
}
float waves(vec2 p, float t) {
  float h = sin(p.x * .52 + p.y * 1.3 - t * .85) * .32;
  h += sin(p.x * -.83 + p.y * 1.94 - t * 1.15) * .16;
  h += sin(p.x * 1.7 + p.y * 2.8 - t * 1.55 + sin(p.y * .6)) * .075;
  h += sin(p.x * -3.1 + p.y * 4.8 - t * 1.9) * .034;
  h += (noise(p * 5. + vec2(t * .18, -t * .35)) - .5) * .045;
  return h * (1. + uAgitation * .48);
}
vec3 sky(float h, float x) {
  vec3 col = mix(vec3(.27, .285, .28), vec3(.047, .067, .081), smoothstep(0., .7, h));
  float cloud = noise(vec2(x * 4. + uTime * .009, h * 6.));
  cloud += noise(vec2(x * 9. - uTime * .013, h * 13.)) * .35;
  col *= .66 + .34 * smoothstep(.25, .9, cloud);
  col += vec3(.19, .14, .09) * exp(-h * 15.) * .35;
  return col;
}
// Three spaced lightning strikes and seven staggered impacts per twelve seconds.
// Events use scene-local time, so returning to this passage restarts the sequence.
float segment(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  return length(p - a - ab * clamp(dot(p - a, ab) / dot(ab, ab), 0., 1.));
}
float bolt(vec2 p, float x) {
  p.x += (noise(vec2(p.y * 180., 3.)) - .5) * .007;
  float d = segment(p, vec2(x, .96), vec2(x - .025, .87));
  d = min(d, segment(p, vec2(x - .025, .87), vec2(x + .014, .875)));
  d = min(d, segment(p, vec2(x + .014, .875), vec2(x - .03, .75)));
  d = min(d, segment(p, vec2(x - .03, .75), vec2(x - .012, .765)));
  d = min(d, segment(p, vec2(x - .012, .765), vec2(x - .05, .67)));
  d = min(d, segment(p, vec2(x - .025, .87), vec2(x - .074, .84)));
  d = min(d, segment(p, vec2(x - .074, .84), vec2(x - .09, .785)));
  return exp(-d * 1100.) * .6 + exp(-d * 170.) * .1;
}
vec3 bombardment(vec2 uv, vec3 col) {
  // Keep the event geometry attached to the gently changing waterline.
  uv.y += .66 - uHorizon;
  float cycle = floor(uStormTime / 12.);
  float time = mod(uStormTime, 12.);
  float skyMask = smoothstep(.65, .70, uv.y);
  for (int j = 0; j < 3; j++) {
    float strike = float(j);
    float strikeX = .17 + hash(vec2(cycle + strike * 11., 17.)) * .37;
    float age = time - (.65 + strike * 3.9);
    if (age < 0. || age > .65) continue;
    float lightning = smoothstep(0., .1, age) * (1. - smoothstep(.18, .65, age));
    col += vec3(.46, .51, .53) * lightning * uStorm *
      (bolt(uv, strikeX) + exp(-length((uv - vec2(strikeX, .83)) * vec2(3., 2.)) * 4.) * .18 * skyMask);
  }
  for (int i = 0; i < 7; i++) {
    float seed = float(i);
    float age = time - (1.45 + seed * 1.35 + hash(vec2(seed, cycle)) * .35);
    if (age < -.45 || age > 6.) continue;
    float x = .09 + hash(vec2(cycle + seed * 7., 29.)) * .49;
    float ignition = smoothstep(0., .16, age) * exp(-max(age, 0.) * 1.8);
    vec2 delta = (uv - vec2(x, .667)) * vec2(uAspect, 1.);
    float turbulence = noise(uv * vec2(160., 200.) + vec2(age * .4, -age * .8));
    float fire = exp(-length(delta * vec2(1., 1.5)) * 32.) * (.55 + turbulence * .7);
    float core = exp(-length(delta * vec2(1., 1.2)) * 125.);
    col += (vec3(.92, .30, .055) * fire + vec3(1., .76, .35) * core) * ignition * uStorm;
    float flight = clamp((age + .45) / .45, 0., 1.);
    vec2 tip = mix(vec2(x - .10, .81), vec2(x, .667), flight);
    float trail = exp(-segment(uv, tip, tip + vec2(-.014, .02)) * 1800.);
    float arriving = smoothstep(-.45, -.38, age) * (1. - smoothstep(-.06, 0., age));
    col += vec3(.42, .30, .16) * trail * arriving * uStorm;
    // Smoke grows upward and drifts while the fire subsides.
    float rise = clamp(age, 0., 6.);
    vec2 plume = (uv - vec2(x + rise * .007, .675 + rise * .011));
    plume /= vec2(.012 + rise * .009, .012 + rise * .019);
    float cloud = exp(-dot(plume, plume) * 1.6);
    cloud *= .55 + .45 * noise(uv * vec2(75., 95.) + vec2(0., -uStormTime * .08));
    float smoke = smoothstep(.15, 1.3, age) * (1. - smoothstep(4., 6., age));
    col = mix(col, vec3(.055, .047, .039), cloud * smoke * skyMask * uStorm * .8);
    // Broken orange reflections travel down the wave faces.
    float depth = max(.66 - uv.y, 0.);
    float reflection = exp(-abs(uv.x - x + sin(uv.y * 95. + uTime) * .005) * (45. - depth * 35.));
    reflection *= (.35 + .65 * noise(vec2(uv.x * 120., uv.y * 240. + uTime * .7)));
    col += vec3(.46, .17, .04) * reflection * ignition * exp(-depth * 5.) * (1. - skyMask) * uStorm;
  }
  return col;
}
void main() {
  float horizon = uHorizon;
  float t = uTime;
  vec3 col;
  if (vUv.y > horizon) {
    col = sky((vUv.y - horizon) / (1. - horizon), vUv.x);
  } else {
    float screenDepth = (horizon - vUv.y) / horizon;
    float z = 1.55 / max(screenDepth, .012);
    vec2 p = vec2((vUv.x - .5) * uAspect * z * 1.7, z);
    float h = waves(p, t);
    // Larger sampling footprints at the horizon suppress distant shimmer.
    float e = .035 + z * .003;
    vec3 normal = normalize(vec3((h - waves(p + vec2(e, 0.), t)) / e, 1.,
                                 (h - waves(p + vec2(0., e), t)) / e));
    vec3 eye = normalize(vec3(-p.x, 1.6, -z));
    float fresnel = .035 + .965 * pow(1. - max(dot(normal, eye), 0.), 5.);
    vec3 reflected = reflect(-eye, normal);
    vec3 water = mix(vec3(.025, .067, .076), vec3(.08, .13, .135), smoothstep(-.4, .4, h));
    col = mix(water, sky(max(reflected.y, 0.), vUv.x + normal.x * .2), fresnel * .85);
    vec3 light = normalize(vec3(-.4, .24, 1.));
    float spec = pow(max(dot(reflect(-light, normal), eye), 0.), 95.);
    col += vec3(.72, .65, .48) * spec * .65;
    float ridge = smoothstep(.32, .54, h) * smoothstep(.1, .8, screenDepth);
    col += vec3(.21, .25, .24) * ridge * .3;
    float fog = 1. - exp(-z * .022);
    col = mix(col, sky(0., vUv.x), fog);
    // Small wavelets wash over the near shore; no abrupt flashes.
    float wash = sin(screenDepth * 25. - t * .7 + noise(vec2(vUv.x * 8., t * .08)) * 2.);
    float foam = smoothstep(.92, 1., wash) * smoothstep(.7, 1., screenDepth);
    col += vec3(.23, .25, .23) * foam * .3;
    // A symbolic red tide travels through the water, retaining wave detail.
    float current = noise(p * vec2(.21, .38) + vec2(t * .018, -t * .045));
    current += noise(p * vec2(.53, .18) - vec2(t * .025, 0.)) * .4;
    float tendrils = smoothstep(.35, .92, current);
    float tide = uBlood * smoothstep(.015, .42, screenDepth) * (.46 + tendrils * .54);
    float luminance = dot(col, vec3(.299, .587, .114));
    vec3 redWater = vec3(.16, .012, .018) + vec3(.85, .12, .10) * luminance;
    col = mix(col, redWater, tide * .86);
  }
  if (uStorm > .001) col = bombardment(vUv, col);
  float vignette = 1. - .25 * pow(abs(vUv.x - .5) * 2., 2.);
  col *= vignette * (1. - uStillness * .25);
  if (uPaper > .5) {
    float ink = dot(col, vec3(.299, .587, .114));
    col = mix(vec3(.58, .48, .34), vec3(.23, .20, .16), clamp(ink * 2., 0., 1.));
    col = mix(col, vec3(.40, .15, .12), uBlood * (1. - smoothstep(horizon - .25, horizon, vUv.y)) * .55);
  }
  gl_FragColor = vec4(col, uAlpha);
}
`

// Fullscreen shader quad; sits at the base of the Mullivaikkal chapter.
// Renders nothing at all under prefers-reduced-motion or without WebGL —
// the chapter is complete without it.
export default function GlSea({
  agitation,
  chapterScene,
  alpha = 0.9,
}: {
  /** A ref rather than a number: Mullivaikkal drives this from its scroll
      loop, and a plain prop would mean a React render on every frame. */
  agitation?: { current: number }
  chapterScene?: { current: number }
  alpha?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fallback = useRef(0)
  const agitationRef = agitation ?? fallback
  const { theme } = useTheme()
  const paper = theme === 'paper'

  const stillness = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || stillness) return

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
          uStormTime: { value: 0 },
          uStorm: { value: 0 },
          uBlood: { value: 0 },
          uHorizon: { value: .66 },
          uStillness: { value: 0 },
        },
      })
      scene.add(new three.Mesh(new three.PlaneGeometry(2, 2), mat))

      return {
        scene,
        camera,
        update: (_t, dt) => {
          const calm = chapterScene?.current === 5 || chapterScene?.current === 9
          const ease = (name: string, target: number, speed: number) => {
            const uniform = mat.uniforms[name]
            uniform.value += (target - uniform.value) * (1 - Math.exp(-dt * speed))
          }
          ease('uStillness', calm ? 1 : 0, .6)
          // Integrate wave time: changing scenes must never jump the wave phase.
          mat.uniforms.uTime.value += dt * (1 + mat.uniforms.uAgitation.value * .3) * (1 - mat.uniforms.uStillness.value * .6)
          const shelling = agitationRef.current > .5
          mat.uniforms.uStorm.value = shelling ? 1 : 0
          mat.uniforms.uStormTime.value = shelling ? mat.uniforms.uStormTime.value + dt : 0
          ease('uBlood', shelling ? 1 : 0, shelling ? .38 : .45)
          ease('uHorizon', shelling ? .70 : calm ? .63 : .66, .45)
          // Ease changes in wind and warmth across scene boundaries.
          const cur = mat.uniforms.uAgitation.value as number
          mat.uniforms.uAgitation.value = cur + (agitationRef.current - cur) * Math.min(1, dt * 0.8)
        },
        resize: (w, h) => {
          mat.uniforms.uAspect.value = w / h
        },
      }
    })
  }, [alpha, paper, stillness, agitationRef, chapterScene])

  return (
    <canvas
      key={`${theme}-${stillness}`}
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  )
}
