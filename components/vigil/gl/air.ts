/**
 * The four materials the vigil's air is made of.
 *
 * Every one of these is slow on purpose. The register is a dark room lit by
 * one lamp: nothing here may flash, strobe, or announce itself. The fastest
 * term in any of these shaders completes in about six seconds.
 *
 * All four share the same contract:
 *   vUv.y = 1 at the top of the rectangle, 0 at the bottom
 *   uProgress = 0 when the rectangle enters the viewport, 1 when it leaves
 *   uPaper    = 1 in the archive theme, where light becomes ink
 */

export const AIR_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

/** Shared value noise, matching the rest of the vigil's shaders. */
const NOISE = /* glsl */ `
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < OCTAVES; i++) { v += a * noise(p); p = p * 2.03 + vec2(19.0, 7.0); a *= 0.5; }
  return v;
}
`

const HEAD = (octaves: number) => /* glsl */ `
precision mediump float;
#define OCTAVES ${octaves}
varying vec2 vUv;
uniform float uTime;
uniform float uSeed;
uniform float uAlpha;
uniform float uWarm;
uniform float uPaper;
uniform float uAspect;
uniform float uProgress;
${NOISE}

// the vigil's palette, as the shaders see it
const vec3 C_ASH   = vec3(0.592, 0.537, 0.478);
const vec3 C_BONE  = vec3(0.925, 0.890, 0.827);
const vec3 C_GOLD  = vec3(0.788, 0.608, 0.184);
const vec3 C_FLAME = vec3(0.929, 0.651, 0.239);
const vec3 C_EMBER = vec3(0.839, 0.310, 0.200);
const vec3 C_INK   = vec3(0.169, 0.129, 0.094);
`

/**
 * Ground.
 *
 * Raking light crossing slow relief. Used for the land that was always there
 * (chapter I) and for the depth under the atlas (chapter VII). The light does
 * not travel on a timer: it travels with the reader, so the relief only turns
 * over while the chapter is actually being read.
 */
export const groundFrag = (octaves: number) => /* glsl */ `
${HEAD(octaves)}
void main() {
  vec2 uv = vec2(vUv.x * uAspect, vUv.y);
  float x = uv.x / max(uAspect, 0.001);

  // Broad landforms, not fine grain. Detail below a few percent of the
  // rectangle disappears entirely at the opacity this register allows, so
  // the noise is kept large and the contrast is put into the lighting.
  vec2 q = uv * 1.15 + vec2(uSeed * 21.0, -uTime * 0.012);
  float h = fbm(q);
  h = h * 0.78 + fbm(q * 2.2 + vec2(h, 0.0)) * 0.22;
  // pull the midtones apart into ridges and hollows
  float ridge = smoothstep(0.33, 0.74, h);

  // the light rakes across as the reader descends the chapter
  float sweep = mix(-0.30, 1.30, uProgress);
  float lit = 1.0 - smoothstep(0.0, 0.95, abs(x - sweep));
  lit = pow(lit, 0.8);

  // slope facing the light catches it; the far side keeps its shadow
  float dx = fbm(q + vec2(0.07, 0.0)) - h;
  float face = clamp(0.5 + dx * 7.0, 0.0, 1.0);

  float body = ridge * (0.28 + 0.72 * face) * lit;
  // held clear of the chapter's own top and bottom edges
  body *= smoothstep(0.0, 0.30, vUv.y) * smoothstep(1.0, 0.70, vUv.y);
  body = clamp(body, 0.0, 1.0);

  vec3 warm = mix(C_ASH, C_GOLD, uWarm);
  vec3 col = mix(warm * 0.45, warm, body);
  float a = pow(body, 1.15) * uAlpha * 0.5;

  if (uPaper > 0.5) {
    // by daylight the relief is hatched into the sheet, not lit from the side
    gl_FragColor = vec4(C_INK, pow(clamp(ridge * lit, 0.0, 1.0), 1.5) * uAlpha * 0.22);
  } else {
    gl_FragColor = vec4(col * a, a);
  }
}
`

/**
 * Motes.
 *
 * Particulate suspended in a shaft of light. Cold and mineral over the
 * statute chapter, where it reads as archive dust; warm over the promise,
 * where the same grains read as embers that never quite went out.
 */
export const motesFrag = (octaves: number) => /* glsl */ `
${HEAD(octaves)}

// one drifting layer of grains
float layer(vec2 uv, float scale, float speed, float seed) {
  vec2 p = uv * scale;
  p.y += uTime * speed;              // they fall, very slowly
  p.x += sin(uTime * 0.07 + seed * 9.0 + p.y * 0.5) * 0.25;
  vec2 c = floor(p);
  vec2 f = fract(p) - 0.5;
  float r = hash(c + seed * 31.0);
  if (r < 0.86) return 0.0;          // most cells are empty air
  vec2 jitter = vec2(hash(c + 3.1), hash(c + 7.7)) - 0.5;
  float d = length((f - jitter * 0.6) * vec2(1.0, 1.0));
  float grain = 1.0 - smoothstep(0.0, 0.30, d);
  // each grain turns over as it falls, so the field never reads as a texture
  grain *= 0.45 + 0.55 * sin(uTime * 0.5 + r * 40.0);
  return max(grain, 0.0);
}

void main() {
  vec2 uv = vec2(vUv.x * uAspect, vUv.y);

  float m = layer(uv, 11.0, 0.012, uSeed) * 0.9
          + layer(uv, 19.0, 0.021, uSeed + 4.0) * 0.55
          + layer(uv, 31.0, 0.033, uSeed + 9.0) * 0.30;

  // a shaft of light falling from the top corner: grains outside it stay dark
  float shaft = 1.0 - smoothstep(0.15, 1.15, abs(uv.x / max(uAspect, 0.001) - 0.30) + (1.0 - vUv.y) * 0.35);
  // it strengthens as the reader settles into the chapter, then withdraws
  shaft *= smoothstep(0.0, 0.35, uProgress) * smoothstep(1.0, 0.68, uProgress);

  float body = m * shaft;
  vec3 col = mix(C_ASH * 0.9, C_FLAME, uWarm);
  float a = clamp(body, 0.0, 1.0) * uAlpha * 0.5;

  if (uPaper > 0.5) {
    gl_FragColor = vec4(C_INK, clamp(body, 0.0, 1.0) * uAlpha * 0.22);
  } else {
    gl_FragColor = vec4(col * a, a);
  }
}
`

/**
 * Cloth.
 *
 * Heavy fabric hanging in still air, moving only because a room is never
 * quite still. It stands behind the symbols: a flag is cloth before it is
 * an emblem.
 */
export const clothFrag = (octaves: number) => /* glsl */ `
${HEAD(octaves)}
void main() {
  vec2 uv = vec2(vUv.x * uAspect, vUv.y);

  // vertical folds, wandering: the warp of a hanging cloth
  float t = uTime * 0.09 + uSeed * 17.0;
  float wander = fbm(vec2(uv.x * 1.3, t * 0.35)) - 0.5;
  float folds = sin(uv.x * 7.5 + wander * 3.2 + sin(t * 0.5) * 0.35);

  // the fold deepens toward the bottom, where the weight gathers
  folds *= mix(0.35, 1.0, 1.0 - vUv.y);
  // and slackens where the cloth is pinned at the top
  float slack = smoothstep(1.0, 0.55, vUv.y);

  float shade = 0.5 + 0.5 * folds;
  // weave: the grain you only see when light crosses the surface
  float weave = fbm(uv * vec2(38.0, 30.0)) * 0.12;

  float body = (pow(shade, 2.2) * 0.8 + weave) * slack;
  // the cloth is only lit while the chapter holds the reader
  body *= smoothstep(0.0, 0.22, uProgress) * smoothstep(1.0, 0.78, uProgress);

  vec3 col = mix(C_ASH, mix(C_GOLD, C_EMBER, 0.35), uWarm);
  float a = clamp(body, 0.0, 1.0) * uAlpha * 0.34;

  if (uPaper > 0.5) {
    gl_FragColor = vec4(C_INK, clamp(body, 0.0, 1.0) * uAlpha * 0.16);
  } else {
    gl_FragColor = vec4(col * a, a);
  }
}
`

/**
 * Rake.
 *
 * Low light crossing a surface at a shallow angle. This is the only one of
 * the four that brightens rather than settles: it carries the diaspora
 * chapter toward dawn, and it is the last air the reader passes through.
 */
export const rakeFrag = (octaves: number) => /* glsl */ `
${HEAD(octaves)}
void main() {
  vec2 uv = vec2(vUv.x * uAspect, vUv.y);
  float x = uv.x / max(uAspect, 0.001);

  // the sun is still below the edge: light arrives almost horizontally
  float angle = 0.22;
  float along = x + (1.0 - vUv.y) * angle;

  // one broad band, and a narrower brighter one inside it
  float lead = mix(-0.6, 1.6, uProgress);
  float broad = 1.0 - smoothstep(0.0, 0.85, abs(along - lead));
  float keen  = 1.0 - smoothstep(0.0, 0.22, abs(along - lead));

  // the air it crosses is not clean: it carries the same grain as the rest
  float haze = fbm(vec2(uv.x * 2.2 + uSeed * 11.0, uv.y * 1.6 - uTime * 0.020));
  float body = broad * (0.45 + 0.55 * haze) + keen * 0.55;

  // grounded at the bottom edge, gone before the text
  body *= smoothstep(0.0, 0.22, vUv.y) * smoothstep(1.0, 0.55, vUv.y);

  vec3 low = mix(C_EMBER, C_FLAME, 0.55);
  vec3 col = mix(low, mix(C_FLAME, C_BONE, 0.35), pow(clamp(keen, 0.0, 1.0), 1.5));
  col = mix(mix(C_ASH, low, 0.5), col, uWarm);

  float a = clamp(body, 0.0, 1.0) * uAlpha * 0.40;

  if (uPaper > 0.5) {
    // dawn on a sheet is a warm stain, not a beam
    gl_FragColor = vec4(mix(C_INK, C_GOLD, 0.3), clamp(body, 0.0, 1.0) * uAlpha * 0.20);
  } else {
    gl_FragColor = vec4(col * a, a);
  }
}
`

export const AIR_FRAG: Record<string, (octaves: number) => string> = {
  ground: groundFrag,
  motes: motesFrag,
  cloth: clothFrag,
  rake: rakeFrag,
}
