'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'

import { useEffect, useRef } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { isSmallScreen, mountGL } from './mount'

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

// July 1983 seen from a distance: the rooftops of Colombo, black against
// the fires behind them, some of them alight, their windows lit ember; and
// over them the smoke — columns that lean, twist, spread as they cool, and
// lose themselves against the sky, with the odd spark thrown up into them.
// Six fbm calls per pixel over most of the band is the whole cost of this
// effect, so the octave count is what gets spent or saved on a phone.
const frag = (octaves: number) => /* glsl */ `
precision mediump float;
#define OCTAVES ${octaves}
#define HOMES_PER_UNIT 6.8
// where the five columns rise, as fractions of the band's width
#define COLUMN_X(k) ((k) == 0 ? 0.10 : (k) == 1 ? 0.31 : (k) == 2 ? 0.52 : (k) == 3 ? 0.72 : 0.89) * uAspect
varying vec2 vUv;
uniform float uTime;
uniform float uAspect;
uniform float uAlpha;
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
  for (int i = 0; i < OCTAVES; i++) { v += a * noise(p); p = p * 2.03 + vec2(13.0, 5.0); a *= 0.5; }
  return v;
}

// one column rising from x0, drifting with height; fire is how much of
// the blaze under it shows through its base
float column(vec2 uv, float x0, float lean, float width, float seed, float t, out float fire) {
  float h = uv.y;                       // 0 at the rooftops, 1 at the top
  // it leans further the higher it goes, wanders slowly, and twists on
  // itself the way a column does when the wind catches one side of it
  float twist = (fbm(vec2(seed * 3.0, h * 2.2 - t * 0.12)) - 0.5) * 0.18 * h;
  float cx = x0 + lean * pow(h, 1.5) + sin(t * 0.09 + seed * 8.0) * 0.03 * h + twist;
  // and spreads as it cools
  float w = width * (0.5 + 2.6 * pow(h, 0.85));
  // its edge is never a line: the air around it is folded by the same heat
  float warp = (fbm(vec2(uv.x * 2.4 + seed * 5.0, h * 3.2 - t * 0.16)) - 0.5) * 0.22 * (0.25 + h);
  float d = abs(uv.x + warp - cx) / w;

  float body = 1.0 - smoothstep(0.2, 1.25, d);
  // torn apart by turbulence, more with height
  float n = fbm(vec2(uv.x * 3.2 + seed * 17.0, uv.y * 2.4 - t * 0.20));
  body -= smoothstep(0.05, 1.0, h) * n * 1.30;
  // and it comes in billows, not a steady stream: the density rolls up the column
  body *= 0.55 + 0.9 * fbm(vec2(seed * 7.0 + uv.x * 1.5, h * 3.5 - t * 0.28));
  // thins out entirely before the top of the band
  body *= 1.0 - smoothstep(0.62, 1.0, h);
  body = clamp(body, 0.0, 1.0);

  // the fire under it: it flickers, and lights the smoke from inside
  float flick = 0.45 + 0.55 * noise(vec2(t * 2.6 + seed * 9.0, seed * 4.0));
  fire = body * exp(-h * 8.0) * flick * (1.0 - smoothstep(0.5, 1.4, d));
  return body;
}

// A seeded layout, with vacant plots, offset centres, overlapping widths
// and mixed roof orientations. The grid only accelerates the neighbour search;
// no visible feature repeats at its interval.
float dwellingKind(float cell) {
  float choice = hash(vec2(cell, 24.7));
  return choice > 0.88 ? 2.0 : (choice < 0.30 ? 0.0 : 1.0);
}

float eaves(float cell) {
  float kind = dwellingKind(cell);
  float variation = hash(vec2(cell, 3.0));
  if (kind > 1.5) return 0.095 + variation * 0.072;
  return kind < 0.5 ? 0.025 + variation * 0.024 : 0.033 + variation * 0.047;
}

vec2 footprint(float cell) {
  return vec2(cell + 0.5 + (hash(vec2(cell, 12.3)) - 0.5) * 0.76,
    0.25 + hash(vec2(cell, 19.1)) * 0.49);
}

float roofline(float x, out float burning, out float cell) {
  float bx = x * HOMES_PER_UNIT;
  float nearest = floor(bx);
  float height = 0.007 + noise(vec2(x * 3.0, 8.0)) * 0.009;
  cell = nearest;
  burning = 0.0;
  for (int j = -1; j <= 1; j++) {
    float i = nearest + float(j);
    // Irregular alleys and open ground separate some clusters.
    if (hash(vec2(i, 41.2)) < 0.13) continue;
    vec2 plot = footprint(i);
    float fx = (bx - plot.x) / (plot.y * 2.0) + 0.5;
    if (fx <= 0.0 || fx >= 1.0) continue;
    float kind = dwellingKind(i);
    float wall = eaves(i);
    float h = wall;
    float ridge = 0.28 + hash(vec2(i, 9.2)) * 0.43;
    float rise = 0.024 + hash(vec2(i, 8.0)) * 0.03;
    if (kind > 1.5) {
      float tankX = 0.15 + hash(vec2(i, 7.3)) * 0.5;
      h += step(tankX, fx) * step(fx, tankX + 0.13) * 0.013;
    } else if (kind < 0.5) {
      float pitch = fx < ridge ? fx / ridge : (1.0 - fx) / (1.0 - ridge);
      h += pow(max(pitch, 0.0), 0.72) * rise;
      h += (noise(vec2(fx * 53.0, i)) - 0.5) * 0.002;
    } else {
      // A side-on hipped roof, a gable or a lean-to, never all face-on.
      float orientation = hash(vec2(i, 31.0));
      float pitch = min(fx / ridge, (1.0 - fx) / (1.0 - ridge));
      if (orientation < 0.58) pitch = min(1.0, pitch * 1.7);
      if (orientation > 0.83) pitch = mix(0.32, 1.0, fx);
      h += max(pitch, 0.0) * rise;
      // An attached lower veranda breaks some of the facades.
      if (orientation < 0.32 && fx > 0.77) h = wall * 0.72 + (1.0 - fx) * 0.045;
    }
    float edge = smoothstep(0.0, 0.012, fx) * (1.0 - smoothstep(0.988, 1.0, fx));
    h = mix(0.008, h, edge);
    if (h > height) {
      height = h;
      cell = i;
      burning = step(0.53, hash(vec2(i, 6.0)));
    }
  }
  return height;
}

// sparks carried up in the columns: sparse, quick, gone
float sparks(vec2 uv, float t) {
  vec2 p = vec2(uv.x * 26.0, uv.y * 26.0 - t * 1.7);
  vec2 c = floor(p);
  vec2 f = fract(p) - 0.5;
  float r = hash(c);
  if (r < 0.955) return 0.0;
  vec2 j = vec2(hash(c + 1.3), hash(c + 5.7)) - 0.5;
  j.x += sin(t * 3.0 + r * 60.0) * 0.18;
  float d = length(f - j * 0.5);
  float s = 1.0 - smoothstep(0.0, 0.09, d);
  s *= 0.4 + 0.6 * pow(0.5 + 0.5 * sin(t * 9.0 + r * 80.0), 2.0);
  return s;
}

void main() {
  // the band reads bottom-up: y = 0 at the rooftops. The quad is drawn
  // straight in clip space, where uv.y is already 0 at the bottom; flipping
  // it, as this once did, hung the whole city from the top of the band.
  vec2 uv = vec2(vUv.x * uAspect, vUv.y);
  float t = uTime;

  float s = 0.0;
  float fire = 0.0;
  float fi;
  s += column(uv, COLUMN_X(0), 0.10, 0.030, 1.0, t, fi) * 0.95; fire += fi;
  s += column(uv, COLUMN_X(1), 0.14, 0.024, 2.0, t, fi) * 0.75; fire += fi * 0.7;
  s += column(uv, COLUMN_X(2), 0.08, 0.034, 3.0, t, fi) * 1.00; fire += fi;
  s += column(uv, COLUMN_X(3), 0.17, 0.020, 4.0, t, fi) * 0.65; fire += fi * 0.6;
  s += column(uv, COLUMN_X(4), 0.11, 0.028, 5.0, t, fi) * 0.85; fire += fi;
  s = clamp(s, 0.0, 1.0);
  fire = clamp(fire, 0.0, 1.0);

  // a haze pooling over the rooftops, where all the columns come from
  float haze = fbm(vec2(uv.x * 1.6, uv.y * 3.0 - t * 0.06)) * exp(-uv.y * 5.5) * 0.55;
  float m = clamp(s + haze, 0.0, 1.0);

  // the whole skyline is underlit, unevenly, by what is burning below it
  float glowAll = (0.5 + 0.5 * noise(vec2(t * 1.8, uv.x * 2.0))) * exp(-uv.y * 4.5);
  // sparks only low in the band, inside the smoke
  float sp = sparks(uv, t) * (1.0 - smoothstep(0.05, 0.55, uv.y)) * smoothstep(0.1, 0.4, s + haze);

  // soot, with the fire underneath it showing at the base
  vec3 soot  = vec3(0.086, 0.075, 0.067);
  vec3 lit   = vec3(0.243, 0.153, 0.106);
  vec3 ember = vec3(0.839, 0.310, 0.200);
  vec3 amber = vec3(0.929, 0.651, 0.239);
  vec3 col = mix(soot, lit, exp(-uv.y * 6.0) * 0.85);
  col += mix(ember, amber, 0.35) * fire * 0.75;
  col += ember * glowAll * m * 0.16;
  col = mix(col, mix(amber, vec3(1.0, 0.9, 0.7), 0.4), sp);

  float a = pow(m, 1.25) * uAlpha;
  a = max(a, sp * 0.85 * uAlpha);

  // ——— the city under it ———
  float burning, cell;
  float roof = roofline(uv.x, burning, cell);
  float inside = 1.0 - smoothstep(roof - 0.0015, roof + 0.0015, uv.y);
  // A smaller, offset row recedes behind the foreground, visible through gaps.
  float rearBurning, rearCell;
  float rearRoof = roofline(uv.x * 1.32 + 7.41, rearBurning, rearCell) * 0.72 + 0.024;
  float behind = 1.0 - smoothstep(rearRoof - 0.002, rearRoof + 0.002, uv.y);

  // The light lives in continuous world coordinates. Using each block's
  // cell/roof here stamps rectangular seams into the sky beside buildings.
  float fireBase = 0.04 + noise(vec2(uv.x * 2.1, 16.0)) * 0.035;
  float fireStrength = smoothstep(0.25, 0.7, noise(vec2(uv.x * 3.7, 24.0)));
  float over = max(uv.y - fireBase, 0.0);
  float horizon = exp(-over * 16.0)
    * (0.45 + 0.55 * noise(vec2(t * 0.7, uv.x * 2.4)))
    * (1.0 - inside);
  horizon *= 0.55 + 0.45 * fireStrength;

  // Continuous turbulence lets the flames merge behind adjacent facades.
  float fn = fbm(vec2(uv.x * 9.0, uv.y * 12.0 - t * 1.1));
  float reach = 0.05 + 0.09 * fn + 0.02 * noise(vec2(uv.x * 4.0, t * 1.6));
  float lick = fireStrength * (1.0 - smoothstep(0.0, reach, over)) * (1.0 - inside);
  lick *= smoothstep(0.28, 0.7, fn);

  // Houses have one row of windows and a doorway. Huts have only a low
  // entrance; the occasional apartment block has several window rows.
  float kind = dwellingKind(cell);
  vec2 plot = footprint(cell);
  float localX = (uv.x * HOMES_PER_UNIT - plot.x) / (plot.y * 2.0) + 0.5;
  float wall = eaves(cell);
  float columns = 2.0 + floor(hash(vec2(cell, 14.0)) * 3.0);
  float wx = fract(localX * columns);
  float wy = fract(uv.y * 32.0);
  float win = step(0.34, wx) * step(wx, 0.58) * step(0.30, wy) * step(wy, 0.62);
  win *= step(0.5, kind) * step(0.012, wall - uv.y);
  float door = step(0.44, localX) * step(localX, 0.57)
    * step(0.009, uv.y) * step(uv.y, wall * 0.62);
  win = max(win, door * (1.0 - step(1.5, kind)) * 0.65);
  win *= inside * step(0.10, localX) * step(localX, 0.90);
  float wi = floor(localX * columns) + cell * 17.0 + floor(uv.y * 32.0) * 131.0;
  float litWin = burning * step(0.4, hash(vec2(wi, 7.0))) * (0.35 + 0.65 * noise(vec2(t * 2.0 + wi, cell)));
  litWin += (1.0 - burning) * step(0.88, hash(vec2(wi, 8.0))) * 0.18;
  win *= litWin;

  vec3 night = vec3(0.027, 0.024, 0.020);
  vec3 flame = mix(ember, amber, fn);

  col += ember * horizon * 0.7;
  a = max(a, horizon * 0.5 * uAlpha);
  col = mix(col, flame, lick);
  a = max(a, lick * 0.95 * uAlpha);
  // The receding row catches a little reflected light; near houses remain dark.
  col = mix(col, vec3(0.063, 0.043, 0.033), behind * 0.88);
  a = mix(a, 0.94, behind);
  col = mix(col, night, inside);
  a = mix(a, 1.0, inside);
  col = mix(col, mix(ember, amber, 0.45), win);
  a = max(a, win * 0.85);

  if (uPaper > 0.5) {
    // a wash of lamp-black creeping up the sheet, warmer where the fire was;
    // the city an ink silhouette, its fires a rust stain over the roofs
    vec3 wash = mix(vec3(0.263, 0.220, 0.176), vec3(0.40, 0.22, 0.12), fire * 0.8);
    vec3 rust = vec3(0.478, 0.184, 0.110);
    vec3 ink = vec3(0.169, 0.129, 0.094);
    float pa = (pow(m, 1.4) * 0.55 + sp * 0.3) * uAlpha;
    wash = mix(wash, rust, clamp(horizon * 0.6 + lick, 0.0, 1.0));
    pa = max(pa, (horizon * 0.25 + lick * 0.55) * uAlpha);
    wash = mix(wash, ink, behind * 0.45);
    pa = max(pa, behind * 0.42);
    wash = mix(wash, ink, inside);
    pa = mix(pa, 0.82, inside);
    wash = mix(wash, rust, win);
    pa = max(pa, win * 0.7);
    gl_FragColor = vec4(wash, pa);
  } else {
    gl_FragColor = vec4(col, a);
  }
}
`

/** The burning city and the smoke standing over it: the base of Black July. */
export default function GlSmoke({ alpha = 0.85 }: { alpha?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
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
        fragmentShader: frag(isSmallScreen() ? 3 : 5),
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uAspect: { value: 1 },
          uAlpha: { value: alpha },
          uPaper: { value: paper ? 1 : 0 },
        },
      })
      const geometry = new three.PlaneGeometry(2, 2)
      scene.add(new three.Mesh(geometry, mat))

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
  }, [paper, alpha, stillness])

  return (
    <canvas
      key={`${theme}-${stillness}`}
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[62svh] w-full"
    />
  )
}
