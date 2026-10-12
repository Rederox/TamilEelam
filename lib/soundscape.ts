'use client'

/**
 * The place, heard.
 *
 * The places are real field recordings (public/audio, credited in
 * data/soundCredits.ts): a tropical shore, a fire, wind in trees, a forest
 * in Tamil Nadu at first light. They are fetched only once the reader has
 * asked for sound, and never loop audibly: a bed plays a fresh stretch of
 * its recording each time, crossfaded into the last. What a recording can
 * not do — a room's resonance, a wick, the weight under a far gun — is
 * made on the spot from noise and a few oscillators.
 *
 * A *layer* is one place's sound (the sea, the fire, a dawn); it is silent
 * until the reader is there.
 * Each layer follows one presence channel (lib/presence.ts), which a chapter
 * writes while it is on screen, so the sea is heard only at the coast, the
 * crackle only at the library.
 *
 * The layers share one context, one small room (a convolution reverb, so a
 * bell or a gun carries) and one limiter. Everything they create is owned by
 * the kit, which stops it all together once the fade-out is over, so a layer
 * never has to clean up after itself.
 */

import { getPresence, onPresence, type Channel } from './presence'

export type NoiseKind = 'white' | 'pink' | 'brown'

export interface Kit {
  audio: AudioContext
  /** the mix: everything a layer makes ends up here */
  out: AudioNode
  /** send a node here to place it in the room: it comes back with a tail */
  room: AudioNode
  /** a few seconds of coloured noise, made once */
  noise(kind: NoiseKind): AudioBuffer
  /** coloured noise, looping, already running, from a random point in it */
  loop(kind: NoiseKind): AudioBufferSourceNode
  /** an oscillator, already running */
  osc(type: OscillatorType, hz: number): OscillatorNode
  /** a stereo position, -1..1; a plain pass-through where panning is missing */
  pan(value: number): AudioNode
  /** a timeout that dies with the soundscape */
  later(fn: () => void, ms: number): void
  /** events at random, `rate()` per second on average (0 skips); a Poisson process */
  poisson(rate: () => number, fn: () => void): void
  /** a recording from public/audio, decoded; fetched one at a time, in the order asked for, and only once */
  sample(file: string): Promise<AudioBuffer | null>
  /** a source the kit should stop when the soundscape ends */
  own(src: AudioScheduledSourceNode): void
  /** false once the soundscape has been stopped */
  alive(): boolean
}

/**
 * `start` builds the layer's graph into `out` and reads `level()` (0..1,
 * smoothed) to know when to be quiet. It may return a function the mix
 * calls every frame with that level — for what has to follow the scroll
 * closely, like how muffled a place still is.
 */
export interface Layer {
  channel: Channel
  /** loudness at presence 1 */
  peak: number
  start(kit: Kit, out: GainNode, level: () => number): void | ((level: number) => void)
}

const FADE = 0.5

function makeNoise(audio: AudioContext, kind: NoiseKind): AudioBuffer {
  const seconds = kind === 'white' ? 4 : 6
  const buf = audio.createBuffer(1, Math.ceil(audio.sampleRate * seconds), audio.sampleRate)
  const d = buf.getChannelData(0)
  if (kind === 'white') {
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  } else if (kind === 'pink') {
    // Paul Kellet's filter: equal energy per octave, the sound of wind and surf
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < d.length; i++) {
      const w = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + w * 0.0555179
      b1 = 0.99332 * b1 + w * 0.0750759
      b2 = 0.969 * b2 + w * 0.153852
      b3 = 0.8665 * b3 + w * 0.3104856
      b4 = 0.55 * b4 + w * 0.5329522
      b5 = -0.7616 * b5 - w * 0.016898
      d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11
      b6 = w * 0.115926
    }
  } else {
    // white noise integrated: the weight under a fire or a swell
    let last = 0
    for (let i = 0; i < d.length; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02
      d[i] = last * 3.5
    }
  }
  return buf
}

/** A room: noise that dies away and darkens as it goes, as air swallows the highs first. */
function makeRoom(audio: AudioContext, seconds: number): AudioBuffer {
  const n = Math.ceil(audio.sampleRate * seconds)
  const buf = audio.createBuffer(2, n, audio.sampleRate)
  const early = Math.floor(audio.sampleRate * 0.012)
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c)
    let lp = 0
    for (let i = early; i < n; i++) {
      const t = i / n
      lp += (0.55 - 0.5 * t) * (Math.random() * 2 - 1 - lp)
      d[i] = lp * Math.pow(1 - t, 3)
    }
  }
  return buf
}

function createKit(audio: AudioContext) {
  const buffers = new Map<NoiseKind, AudioBuffer>()
  const sources = new Set<AudioScheduledSourceNode>()
  const timers = new Set<number>()
  let alive = true

  const out = audio.createGain()
  const limiter = audio.createDynamicsCompressor()
  limiter.threshold.value = -16
  limiter.knee.value = 14
  limiter.ratio.value = 5
  limiter.attack.value = 0.006
  limiter.release.value = 0.25
  const master = audio.createGain()
  out.connect(limiter)
  limiter.connect(master)
  master.connect(audio.destination)

  const room = audio.createGain()
  const verb = audio.createConvolver()
  verb.buffer = makeRoom(audio, 2.6)
  const back = audio.createGain()
  back.gain.value = 0.6
  room.connect(verb)
  verb.connect(back)
  back.connect(out)

  // recordings come down one at a time so the first one asked for is heard first
  const samples = new Map<string, Promise<AudioBuffer | null>>()
  let queue: Promise<unknown> = Promise.resolve()
  const sample = (file: string) => {
    let p = samples.get(file)
    if (!p) {
      p = queue.then(async () => {
        if (!alive) return null
        try {
          const res = await fetch(`/audio/${file}`)
          if (!res.ok) return null
          return await audio.decodeAudioData(await res.arrayBuffer())
        } catch {
          return null
        }
      })
      queue = p
      samples.set(file, p)
    }
    return p
  }

  const noise = (kind: NoiseKind) => {
    let buf = buffers.get(kind)
    if (!buf) buffers.set(kind, (buf = makeNoise(audio, kind)))
    return buf
  }

  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.delete(id)
      if (alive) fn()
    }, ms)
    timers.add(id)
  }

  const kit: Kit = {
    audio,
    out,
    room,
    noise,
    loop(kind) {
      const buf = noise(kind)
      const src = audio.createBufferSource()
      src.buffer = buf
      src.loop = true
      src.start(0, Math.random() * buf.duration)
      sources.add(src)
      return src
    },
    osc(type, hz) {
      const o = audio.createOscillator()
      o.type = type
      o.frequency.value = hz
      o.start()
      sources.add(o)
      return o
    },
    pan(value) {
      if (typeof audio.createStereoPanner !== 'function') return audio.createGain()
      const p = audio.createStereoPanner()
      p.pan.value = value
      return p
    },
    later,
    sample,
    own(src) {
      sources.add(src)
      src.addEventListener('ended', () => sources.delete(src))
    },
    alive: () => alive,
    poisson(rate, fn) {
      const next = () => {
        const r = rate()
        if (r <= 0) return later(next, 300)
        later(() => {
          if (rate() > 0) fn()
          next()
        }, (-Math.log(1 - Math.random()) / r) * 1000)
      }
      next()
    },
  }

  return {
    kit,
    master,
    /** fade out, then stop everything that was started */
    dispose() {
      alive = false
      timers.forEach((id) => window.clearTimeout(id))
      timers.clear()
      const now = audio.currentTime
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(master.gain.value, now)
      master.gain.linearRampToValueAtTime(0, now + FADE)
      window.setTimeout(() => {
        sources.forEach((s) => {
          try {
            s.stop()
          } catch {
            /* already stopped */
          }
        })
        sources.clear()
        master.disconnect()
      }, FADE * 1000 + 50)
    },
  }
}

interface Active {
  kit: Kit
  events: GainNode
  dispose: () => void
  raf: number
  unsubscribe: (() => void)[]
}

let active: Active | null = null

/** Builds the mix on `audio` and starts every layer. Call once, from a running context. */
export function startSoundscape(audio: AudioContext, layers: Layer[]): Kit {
  if (active) return active.kit
  const { kit, dispose } = createKit(audio)

  // one-off sounds (a lamp being lit) are not tied to any place; they stay under the ambience
  const events = audio.createGain()
  events.gain.value = 0.3
  events.connect(kit.out)

  // the place the reader is in now starts (and so downloads) first; the rest follow in reading order
  const ordered = layers
    .map((layer, i) => ({ layer, i, near: getPresence(layer.channel) }))
    .sort((a, b) => b.near - a.near || a.i - b.i)
  const states = ordered.map(({ layer, near }) => {
    const out = audio.createGain()
    out.gain.value = 0
    out.connect(kit.out)
    // what a layer sends to the room fades with it too, or a place would go on echoing after the reader has left
    const room = audio.createGain()
    room.gain.value = 0
    room.connect(kit.room)
    const state = { out, room, peak: layer.peak, level: near, target: near, follow: undefined as ((level: number) => void) | undefined }
    state.follow = layer.start({ ...kit, room }, out, () => state.level) || undefined
    return { state, channel: layer.channel }
  })

  const unsubscribe = states.map(({ state, channel }) =>
    onPresence(channel, (v) => {
      state.target = v
    })
  )

  const next: Active = { kit, events, dispose, raf: 0, unsubscribe }
  // the level chases the scroll with a quarter-second time constant, whatever the frame rate
  let last = performance.now()
  const tick = (now: number) => {
    const follow = 1 - Math.exp(-Math.min(0.1, (now - last) / 1000) / 0.25)
    last = now
    for (const { state } of states) {
      state.level += (state.target - state.level) * follow
      state.out.gain.value = state.room.gain.value = state.level * state.peak
      state.follow?.(state.level)
    }
    next.raf = requestAnimationFrame(tick)
  }
  next.raf = requestAnimationFrame(tick)
  active = next
  return kit
}

export function stopSoundscape(): void {
  if (!active) return
  const { raf, unsubscribe, dispose } = active
  active = null
  if (raf) cancelAnimationFrame(raf)
  unsubscribe.forEach((u) => u())
  dispose()
}

/** A sound that belongs to a gesture, not a place. Does nothing while the ambience is off. */
export function playOnce(sound: (kit: Kit, out: AudioNode) => void): void {
  if (active) sound(active.kit, active.events)
}
