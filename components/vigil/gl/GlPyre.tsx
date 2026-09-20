'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { reader, startReaderTracking } from '@/lib/motion'
import { isSmallScreen, mountGL } from './mount'

/**
 * The pages of the Jaffna Library, burning.
 *
 * Ninety-seven thousand books went up in one night. This is what the air
 * over the building held: leaves torn loose by the heat, each one a small
 * fire of its own — paper first, then a ragged front of embers eating in
 * from one corner, then char, then nothing. Around them the ash that used
 * to be the pages before; under them the bed of coals the building became,
 * and the sparks it still throws.
 *
 * One canvas, four materials, no CPU per particle: every position is a
 * function of time and a seed, so the whole scene is a handful of uniforms.
 * The canvas is pinned to the viewport inside the chapter, so the buffer is
 * one screen tall however long the chapter runs.
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
mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }
mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 rotZ(float a) { float c = cos(a), s = sin(a); return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0); }
`

// ————————————————————————————————————————————————————————————————
// The pages
// ————————————————————————————————————————————————————————————————

const PAGE_VERT = (octaves: number) => /* glsl */ `
precision highp float;
attribute vec4 aSeed;
uniform float uTime;
uniform vec2 uArea;
uniform float uDraft;
uniform float uPhase;   // the reader's passage through the chapter, 0..1
varying vec2 vUv;
varying vec2 vCorner;
varying float vBurn;
varying float vLife;
varying float vSeed;
varying float vLit;
varying float vFacing;
varying float vShow;
${NOISE(octaves)}

void main() {
  // each page lives once every ten to twenty seconds, then is born again
  float dur = mix(11.0, 20.0, aSeed.z);
  float life = fract(uTime / dur + aSeed.w);

  // torn loose low in the frame, where the fire is, and carried up by the
  // heat: fast at first, then slower as the leaf cools and the air lets go
  float rise = pow(life, 0.72);
  float x0 = (aSeed.x * 2.0 - 1.0) * uArea.x * 0.46;
  float y = mix(-uArea.y * 0.62, uArea.y * 0.66, rise);
  float sway = sin(life * 6.2832 * mix(0.7, 1.5, aSeed.y) + aSeed.y * 40.0) * mix(0.35, 1.0, aSeed.x);
  sway += (noise(vec2(uTime * 0.12 + aSeed.w * 50.0, aSeed.x * 9.0)) - 0.5) * 1.8;
  float x = x0 + sway;
  float z = (fract(aSeed.x * 7.31) * 2.0 - 1.0) * 2.2;

  // the reader's scroll draws air through the room: everything lifts
  y += uDraft * mix(0.8, 1.9, aSeed.y) * 1.3;
  x += uDraft * (aSeed.z - 0.5) * 0.9;

  // a leaf in an updraft never falls flat: it tumbles on all three axes,
  // faster while the fire has hold of it, lazily once it is only ash
  float spin = mix(1.0, 0.45, smoothstep(0.5, 1.0, life));
  float ta = uTime * mix(0.45, 1.05, aSeed.x) * spin + aSeed.w * 30.0;
  float rx = sin(ta * 0.9) * 1.1 + life * 2.4;
  float ry = ta * 0.55 + sin(ta * 0.37) * 0.8;
  float rz = sin(ta * 0.5 + aSeed.y * 12.0) * 0.9;

  // a leaf of a book: taller than wide, a hand's width or so
  float sz = mix(0.36, 0.60, fract(aSeed.z * 4.7));
  vec3 p = vec3(position.x * 0.72, position.y, 0.0) * sz;

  // the fire takes it from one corner
  vCorner = vec2(step(0.5, fract(aSeed.x * 3.3)), step(0.5, fract(aSeed.y * 5.1)));
  float burn = smoothstep(0.03, 0.82, life);
  vBurn = burn;

  // paper curls away from the heat: the char lifts and rolls toward the
  // unburnt side, and the whole sheet keeps a slow flutter in the draught
  float dc = length(uv - vCorner) / 1.42;
  float curl = burn * mix(0.9, 1.6, aSeed.y);
  p.z += (1.0 - dc) * (1.0 - dc) * curl * 0.16 * sz;
  p.z += sin(uv.y * 5.0 + uv.x * 3.0 + uTime * 2.2 + aSeed.w * 20.0) * 0.022 * sz;

  mat3 R = rotZ(rz) * rotY(ry) * rotX(rx);
  p = R * p;
  vec3 n = R * vec3(0.0, 0.0, 1.0);

  vec4 mv = modelViewMatrix * vec4(p + vec3(x, y, z), 1.0);
  vFacing = abs(normalize((modelViewMatrix * vec4(n, 0.0)).xyz).z);
  // lit from below by the fire it came out of
  vLit = 1.0 - smoothstep(-uArea.y * 0.55, uArea.y * 0.35, y);

  // the chapter ends on a fire that has mostly gone out: fewer leaves in
  // the air the further the reader has read
  float keep = mix(1.0, 0.3, smoothstep(0.55, 0.95, uPhase));
  vShow = 1.0 - smoothstep(keep - 0.12, keep, fract(aSeed.w * 2.9));

  vUv = uv;
  vLife = life;
  vSeed = aSeed.w;
  gl_Position = projectionMatrix * mv;
}
`

const PAGE_FRAG = (octaves: number) => /* glsl */ `
precision highp float;
varying vec2 vUv;
varying vec2 vCorner;
varying float vBurn;
varying float vLife;
varying float vSeed;
varying float vLit;
varying float vFacing;
varying float vShow;
uniform float uTime;
uniform float uPaper;
uniform float uAlpha;
${NOISE(octaves)}

void main() {
  vec2 uv = vUv;

  // ——— the leaf itself: a text block, lines of type, a margin ———
  float pitch = 15.0;
  float row = floor(uv.y * pitch + vSeed);
  float line = fract(uv.y * pitch + vSeed);
  float ink = smoothstep(0.30, 0.42, line) * (1.0 - smoothstep(0.58, 0.70, line));
  float words = step(0.42, noise(vec2(uv.x * 42.0 + vSeed * 90.0, row * 3.0)));
  float margin = step(0.10, uv.x) * step(uv.x, 0.88) * step(0.07, uv.y) * step(uv.y, 0.93);
  // the last line of a paragraph stops short
  float short_ = step(fract(row * 0.37 + vSeed), 0.8) + step(uv.x, 0.55);
  float text = ink * words * margin * clamp(short_, 0.0, 1.0);

  // ——— the fire eats in from the corner, along a ragged front ———
  float d = length(uv - vCorner) / 1.42;
  float n = fbm(uv * 5.0 + vSeed * 17.0);
  float front = vBurn * 1.40 - 0.18 + (n - 0.5) * 0.42;
  float f = front - d;                          // > 0 burnt, < 0 still paper

  float hole = smoothstep(0.05, 0.13, f);        // gone
  float char_ = smoothstep(-0.12, 0.02, f);      // blackening ahead of the flame
  float rim = 1.0 - smoothstep(0.0, 0.085, abs(f - 0.035));
  // the edge breathes, and brightest where the front is moving fastest
  rim *= 0.70 + 0.30 * sin(uTime * 8.0 + vSeed * 50.0 + uv.x * 22.0 + uv.y * 15.0);
  rim *= smoothstep(0.0, 0.08, vBurn) * (1.0 - smoothstep(0.85, 1.0, vBurn));
  // the whole sheet glows a little through, near the front
  float near = (1.0 - smoothstep(0.0, 0.30, abs(f))) * smoothstep(0.0, 0.08, vBurn);

  // ——— colour ———
  // unlit paper in a dark room is not white; lit from the fire, it is amber
  vec3 dim = vec3(0.30, 0.26, 0.21);
  vec3 lit = vec3(0.93, 0.74, 0.46);
  vec3 paper = mix(dim, lit, vLit * 0.85);
  paper *= 0.55 + 0.45 * vFacing;               // edge-on, it goes dark
  vec3 col = mix(paper, paper * 0.30, text);
  vec3 charCol = vec3(0.06, 0.045, 0.035);
  col = mix(col, charCol, char_);
  vec3 ember = vec3(0.84, 0.31, 0.20);
  vec3 hot = vec3(1.0, 0.86, 0.58);
  col += mix(ember, hot, near * 0.5) * near * 0.45;
  col = mix(col, mix(ember, hot, rim * 0.8), rim);

  float a = (1.0 - hole) * uAlpha * vShow;
  a *= smoothstep(0.0, 0.05, vLife) * (1.0 - smoothstep(0.86, 1.0, vLife));

  if (uPaper > 0.5) {
    // on the archive sheet a burning page is a burnt one: an ink outline,
    // the type, and a scorched edge, with the fire left to the imagination
    vec3 inkCol = vec3(0.169, 0.129, 0.094);
    vec3 scorch = vec3(0.35, 0.22, 0.10);
    float outline = 1.0 - step(0.035, min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y)));
    float pa = (outline * 0.55 + text * 0.5 + char_ * 0.9) * (1.0 - hole) * vShow;
    pa *= smoothstep(0.0, 0.05, vLife) * (1.0 - smoothstep(0.86, 1.0, vLife));
    gl_FragColor = vec4(mix(inkCol, scorch, char_ * (1.0 - rim) + rim * 0.6), pa * uAlpha * 0.85);
  } else {
    gl_FragColor = vec4(col, a);
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
varying float vFade;
varying float vSeed;
varying float vGlow;
${NOISE(octaves)}

void main() {
  float dur = mix(16.0, 30.0, aSeed.z);
  float life = fract(uTime / dur + aSeed.w);

  // ash does not rise; it is let go of, high up, and settles on everything
  float x = (aSeed.x * 2.0 - 1.0) * uArea.x * 0.52;
  float y = mix(uArea.y * 0.62, -uArea.y * 0.62, life);
  // a flake falls the way a leaf falls: slipping sideways, catching, turning
  x += sin(life * 6.2832 * mix(1.5, 3.0, aSeed.y) + aSeed.x * 30.0) * mix(0.25, 0.7, aSeed.y);
  x += (noise(vec2(uTime * 0.08 + aSeed.w * 40.0, aSeed.y * 7.0)) - 0.5) * 2.4;
  y += sin(uTime * mix(0.8, 1.6, aSeed.x) + aSeed.w * 60.0) * 0.06;
  // a scroll stirs it back up
  y += uDraft * mix(0.5, 1.4, aSeed.x) * 1.6;
  float z = (fract(aSeed.y * 9.13) * 2.0 - 1.0) * 2.5;

  vec4 mv = modelViewMatrix * vec4(x, y, z, 1.0);
  // a flake is a few pixels across: the size is in world units, and the
  // projection below multiplies it by roughly twenty-five
  float size = mix(0.10, 0.30, fract(aSeed.z * 6.3));
  gl_PointSize = max(1.0, size * uPix * (150.0 / -mv.z));

  vFade = smoothstep(0.0, 0.08, life) * (1.0 - smoothstep(0.8, 1.0, life));
  // it turns over as it falls, so it catches the light and loses it
  vFade *= 0.55 + 0.45 * sin(uTime * mix(2.0, 5.0, aSeed.y) + aSeed.x * 90.0);
  // a few flakes are still burning when they are let go
  vGlow = step(0.82, fract(aSeed.w * 3.7)) * (1.0 - smoothstep(0.0, 0.45, life));
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

void main() {
  vec2 p = gl_PointCoord - 0.5;
  float ang = atan(p.y, p.x);
  // no flake is round: three or four lobes, a different shape for each
  float r = 0.32 + 0.11 * sin(ang * 3.0 + vSeed * 40.0) + 0.06 * sin(ang * 7.0 + vSeed * 90.0);
  float flake = 1.0 - smoothstep(r - 0.10, r + 0.04, length(p));

  vec3 ash = vec3(0.34, 0.31, 0.28);
  vec3 ember = vec3(0.84, 0.31, 0.20);
  vec3 col = mix(ash, ember, vGlow);
  float a = flake * vFade * uAlpha * mix(0.62, 1.0, vGlow);

  if (uPaper > 0.5) {
    gl_FragColor = vec4(vec3(0.27, 0.20, 0.13), flake * vFade * uAlpha * 0.35);
  } else {
    gl_FragColor = vec4(col, a);
  }
}
`

// ————————————————————————————————————————————————————————————————
// The sparks
// ————————————————————————————————————————————————————————————————

const SPARK_VERT = (octaves: number) => /* glsl */ `
precision highp float;
attribute vec4 aSeed;
uniform float uTime;
uniform vec2 uArea;
uniform float uPix;
uniform float uDraft;
uniform float uHeat;    // how alive the ground fire is right now
varying float vFade;
varying float vHeat;
varying vec2 vDir;
varying float vStretch;
${NOISE(octaves)}

// where a spark is at a given moment of its life
vec3 sparkPos(float life, vec4 s, float t) {
  float x = (s.x * 2.0 - 1.0) * uArea.x * 0.48;
  // thrown up hard, then slowing as the heat lets go; few get very far
  float y = -uArea.y * 0.56 + pow(life, 0.62) * uArea.y * mix(0.30, 0.85, s.y * s.y);
  // and knocked about by the turbulence over the fire
  x += (noise(vec2(life * 5.0 + s.w * 40.0, s.x * 20.0)) - 0.5) * 2.2 * life;
  x += sin(life * 20.0 * mix(0.6, 1.4, s.z) + s.w * 30.0) * 0.12;
  x += uDraft * (s.z - 0.5) * 1.5;
  y += uDraft * mix(0.5, 1.5, s.y);
  float z = (fract(s.y * 6.71) * 2.0 - 1.0) * 1.5;
  return vec3(x, y, z);
}

void main() {
  float dur = mix(1.6, 3.4, aSeed.z);
  float life = fract(uTime / dur + aSeed.w);
  vec3 p = sparkPos(life, aSeed, uTime);
  // a moment ago, to know which way it is going
  vec3 q = sparkPos(max(life - 0.02, 0.0), aSeed, uTime);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vec4 mq = modelViewMatrix * vec4(q, 1.0);
  vec4 cp = projectionMatrix * mv;
  vec4 cq = projectionMatrix * mq;
  vec2 dir = cp.xy / cp.w - cq.xy / cq.w;
  float speed = length(dir);
  vDir = speed > 1e-5 ? dir / speed : vec2(0.0, 1.0);
  // the faster it moves, the longer it streaks
  vStretch = 1.0 + clamp(speed * 60.0, 0.0, 2.2);

  float size = mix(0.18, 0.42, fract(aSeed.w * 5.7));
  gl_PointSize = max(1.0, size * uPix * (150.0 / -mv.z) * vStretch);

  // only a fraction fly at any moment: the fire throws them in fits
  float gust = smoothstep(0.35, 0.75, noise(vec2(uTime * 0.35, aSeed.x * 3.0)));
  vFade = smoothstep(0.0, 0.06, life) * (1.0 - smoothstep(0.55, 1.0, life));
  vFade *= mix(0.25, 1.0, gust) * uHeat;
  // a spark flares as air reaches it
  vFade *= 0.7 + 0.3 * pow(max(0.0, sin(uTime * 17.0 + aSeed.w * 90.0)), 3.0);
  vHeat = life;
  gl_Position = cp;
}
`

const SPARK_FRAG = /* glsl */ `
precision mediump float;
uniform float uPaper;
uniform float uAlpha;
varying float vFade;
varying float vHeat;
varying vec2 vDir;
varying float vStretch;

void main() {
  vec2 p = gl_PointCoord - 0.5;
  p.y = -p.y;
  float along = dot(p, vDir);
  float across = dot(p, vec2(-vDir.y, vDir.x));
  // a streak: long along its flight, tight across it
  float d = length(vec2(along, across * vStretch)) * 2.0;
  float glow = 1.0 - smoothstep(0.0, 1.0, d);
  glow = pow(glow, 1.6);

  vec3 hot = vec3(1.0, 0.90, 0.66);
  vec3 amber = vec3(0.93, 0.65, 0.24);
  vec3 cool = vec3(0.60, 0.15, 0.09);
  // white-hot leaving the fire, red by the time it goes out
  vec3 col = mix(hot, amber, smoothstep(0.0, 0.3, vHeat));
  col = mix(col, cool, smoothstep(0.35, 1.0, vHeat));
  float a = glow * vFade * uAlpha;

  if (uPaper > 0.5) {
    gl_FragColor = vec4(vec3(0.48, 0.24, 0.13), glow * vFade * uAlpha * 0.45);
  } else {
    gl_FragColor = vec4(col * a, a);
  }
}
`

// ————————————————————————————————————————————————————————————————
// The ground fire
// ————————————————————————————————————————————————————————————————

const GROUND_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

// The library the morning it burned: not a raging fire but a dying one.
// A bed of coals along the ground, each breathing on its own, dark cracks
// between them; deep-red heat lifting off it; the rare tongue still
// reaching amber before it gives up. The air above it shimmers.
const GROUND_FRAG = (octaves: number) => /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uAspect;
uniform float uAlpha;
uniform float uPaper;
uniform float uHeat;
${NOISE(octaves)}

// a bed of coals: cells packed together, each glowing on its own slow
// breath, with dark cracks where they meet
float coals(vec2 uv, float t, out float inside) {
  vec2 p = uv * vec2(9.0, 5.5);
  vec2 i = floor(p), f = fract(p);
  float md = 8.0, md2 = 8.0, glow = 0.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 g = vec2(float(x), float(y));
      vec2 o = vec2(hash(i + g), hash(i + g + 7.3));
      vec2 r = g + o - f;
      float d = dot(r, r);
      if (d < md) {
        md2 = md; md = d;
        // most coals have gone dark; the ones still alive breathe slowly
        float alive = pow(hash(i + g + 5.9), 2.5);
        glow = alive * (0.55 + 0.45 * sin(t * mix(0.35, 1.1, hash(i + g + 3.1)) + hash(i + g + 1.7) * 6.2832));
      } else if (d < md2) {
        md2 = d;
      }
    }
  }
  inside = smoothstep(0.0, 0.22, md2 - md);
  return glow;
}

void main() {
  vec2 uv = vUv;
  // the band is two fifths of the viewport tall: keep the grain square
  float asp = uAspect * 2.5;
  // the air over the coals bends what is seen through it
  uv.x += (fbm(vec2(uv.x * 4.0 + 3.0, uv.y * 3.0 - uTime * 0.45)) - 0.5) * 0.035 * (1.0 - uv.y);

  // heat rising in slow motion
  vec2 p = vec2(uv.x * asp * 2.6, uv.y * 2.2 - uTime * 0.10);
  float n = fbm(p);
  float m = fbm(p * 2.1 + vec2(5.2, uTime * 0.06));
  float body = n * 0.7 + m * 0.3;

  // strongest at the ground, licked upward by the noise; lower as it dies
  float reach = mix(1.15, 1.45, 0.5 + 0.5 * sin(uTime * 0.22));
  float f = max(body - uv.y * reach, 0.0) * mix(0.6, 1.0, uHeat);

  float inside;
  float g = coals(vec2(uv.x * asp, uv.y), uTime, inside);
  // the bed is not a tiling: it lies in drifts, with bare ground between
  float drift = smoothstep(0.30, 0.75, fbm(vec2(uv.x * asp * 1.3 + 40.0, uv.y * 4.0)));
  float bed = (1.0 - smoothstep(0.0, 0.20, uv.y)) * pow(inside, 1.4) * g * drift * uHeat;
  // a coal flares as air reaches it, then settles
  float flare = pow(noise(vec2(uTime * 0.7, uv.x * asp * 5.0)), 6.0) * (1.0 - smoothstep(0.0, 0.3, uv.y)) * uHeat;

  vec3 blood = vec3(0.561, 0.137, 0.094);
  vec3 ember = vec3(0.839, 0.310, 0.200);
  vec3 amber = vec3(0.929, 0.651, 0.239);
  vec3 hot   = vec3(0.969, 0.831, 0.533);

  vec3 col = blood * pow(f, 0.9) * 1.2;
  col += ember * pow(f, 2.0) * 0.9;
  col += amber * pow(f, 4.5) * 0.5;
  col += mix(blood, mix(ember, amber, g * g), g) * bed * 0.85;
  col += mix(amber, hot, flare) * flare * 0.45;

  float breathe = 0.86 + 0.14 * sin(uTime * 0.45);
  float a = clamp(pow(f, 1.2) * 1.6 + bed * 0.7 + flare * 0.4, 0.0, 1.0) * uAlpha * breathe;
  a *= smoothstep(1.0, 0.55, uv.y); // fully dissolved well below the text

  // on paper the fire is not seen but left behind: a scorch creeping up the leaf
  vec3 char_ = vec3(0.180, 0.129, 0.086);
  vec3 singe = vec3(0.427, 0.255, 0.129);
  float pf = max(f, bed * 0.8);
  vec3 pcol = mix(singe, char_, pow(pf, 1.6));
  float pa = clamp(pow(pf, 1.5) * 1.3, 0.0, 1.0) * uAlpha * 0.62 * breathe;
  pa *= smoothstep(1.0, 0.55, uv.y);

  gl_FragColor = uPaper > 0.5 ? vec4(pcol, pa) : vec4(col * a, a);
}
`

interface Props {
  /** overall strength 0..1 */
  alpha?: number
  /** pages in the air on desktop (fewer on phones) */
  pages?: number
  className?: string
}

/**
 * The air over the burning library. Placed inside a `relative` section; it
 * pins itself to the viewport for as long as the section is under the
 * reader, exactly like the sea under Mullivaikkal.
 */
export default function GlPyre({ alpha = 1, pages = 26, className = '' }: Props) {
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
      // a phone pays for every octave across a full-screen band
      const octaves = small ? 3 : 4
      const pageCount = small ? Math.ceil(pages * 0.45) : pages
      const ashCount = small ? 60 : 150
      const sparkCount = small ? 40 : 110

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
        uHeat: { value: 1 },
        uAspect: { value: 1 },
      }

      // ——— the ground fire: a band along the bottom of the viewport ———
      // drawn straight in clip space, so the camera above has no say in it
      const groundGeo = new three.PlaneGeometry(2, 2 * 0.40)
      groundGeo.translate(0, -1 + 0.40, 0)
      const groundMat = new three.ShaderMaterial({
        vertexShader: GROUND_VERT,
        fragmentShader: GROUND_FRAG(octaves),
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: paper ? three.NormalBlending : three.AdditiveBlending,
        uniforms: shared,
      })
      const ground = new three.Mesh(groundGeo, groundMat)
      ground.frustumCulled = false
      ground.renderOrder = -1
      scene.add(ground)

      // ——— the pages: one quad, drawn once per leaf ———
      const plane = new three.PlaneGeometry(1, 1, 6, 8)
      const pageGeo = new three.InstancedBufferGeometry()
      pageGeo.setIndex(plane.index)
      pageGeo.setAttribute('position', plane.attributes.position)
      pageGeo.setAttribute('uv', plane.attributes.uv)
      pageGeo.setAttribute('aSeed', new three.InstancedBufferAttribute(seeds(pageCount), 4))
      pageGeo.instanceCount = pageCount
      const pageMat = new three.ShaderMaterial({
        vertexShader: PAGE_VERT(octaves),
        fragmentShader: PAGE_FRAG(octaves),
        transparent: true,
        depthWrite: false,
        depthTest: false,
        side: three.DoubleSide,
        blending: three.NormalBlending,
        uniforms: shared,
      })
      const pageMesh = new three.Mesh(pageGeo, pageMat)
      pageMesh.frustumCulled = false
      pageMesh.renderOrder = 1
      scene.add(pageMesh)

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
      ash.renderOrder = 0
      scene.add(ash)

      // ——— the sparks ———
      const sparkGeo = new three.BufferGeometry()
      sparkGeo.setAttribute('position', new three.BufferAttribute(new Float32Array(sparkCount * 3), 3))
      sparkGeo.setAttribute('aSeed', new three.BufferAttribute(seeds(sparkCount), 4))
      const sparkMat = new three.ShaderMaterial({
        vertexShader: SPARK_VERT(octaves),
        fragmentShader: SPARK_FRAG,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: paper ? three.NormalBlending : three.AdditiveBlending,
        uniforms: shared,
      })
      const sparks = new three.Points(sparkGeo, sparkMat)
      sparks.frustumCulled = false
      sparks.renderOrder = 2
      scene.add(sparks)

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
            // where the reader is in the chapter: the fire is fiercest
            // early and has mostly gone to ash by the end
            const r = section.getBoundingClientRect()
            const vh = window.innerHeight
            const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)))
            phase += (p - phase) * Math.min(1, dt * 2)
            shared.uPhase.value = phase
            shared.uHeat.value = 1 - 0.75 * smoothstep(0.5, 0.95, phase)
          }
        },
        resize: (w, h, dpr) => {
          const worldH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360)
          shared.uArea.value.set(worldH * (w / h), worldH)
          shared.uPix.value = dpr
          shared.uAspect.value = w / h
        },
        dispose: () => {
          groundGeo.dispose()
          groundMat.dispose()
          plane.dispose()
          pageGeo.dispose()
          ashGeo.dispose()
          sparkGeo.dispose()
          pageMat.dispose()
          ashMat.dispose()
          sparkMat.dispose()
        },
      }
    })

    return () => {
      unmount()
      stopTracking()
    }
  }, [alpha, pages, paper, stillness])

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
