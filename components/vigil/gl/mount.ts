import type * as THREE from 'three'
import { prefersReducedMotion } from '@/lib/motion'

export interface GLBuild {
  scene: THREE.Scene
  camera: THREE.Camera
  /**
   * t: elapsed seconds, dt: seconds since last frame.
   * Return false to say there is nothing on screen worth drawing; the frame
   * is then skipped entirely. The page-wide layers spend most of the vigil
   * with an empty scene, and clearing a full-viewport buffer for nothing is
   * the single most wasteful thing they can do.
   */
  update?: (t: number, dt: number) => boolean | void
  resize?: (w: number, h: number, dpr: number) => void
  /** normalized pointer, -1..1 on both axes */
  pointer?: (x: number, y: number) => void
  dispose?: () => void
}

export type GLBuilder = (three: typeof THREE, canvas: HTMLCanvasElement) => GLBuild

/**
 * Shared lifecycle for the vigil's WebGL layer: lazy three.js load (own chunk),
 * DPR cap, pause when offscreen or tab hidden, resize, pointer, full disposal.
 * Calls onFail when WebGL cannot start so the caller can keep its 2D fallback.
 */
export function mountGL(canvas: HTMLCanvasElement, build: GLBuilder, onFail?: () => void): () => void {
  // Allocate contexts only near the viewport, after the opening is readable.
  // The inner lifecycle pauses rendering again when the chapter leaves view.
  let near = false
  let unmount: (() => void) | null = null
  const sync = () => {
    const wanted = near && !document.hidden && !prefersReducedMotion()
      && document.documentElement.dataset.loading !== 'true'
    if (wanted && !unmount) unmount = mountVisibleGL(canvas, build, onFail)
  }
  const observer = new IntersectionObserver(([entry]) => {
    near = entry.isIntersecting
    sync()
  }, { rootMargin: '240px' })
  observer.observe(canvas)
  window.addEventListener('vigil-ready', sync)
  window.addEventListener('vigil-reading-change', sync)
  document.addEventListener('visibilitychange', sync)
  return () => {
    observer.disconnect()
    window.removeEventListener('vigil-ready', sync)
    window.removeEventListener('vigil-reading-change', sync)
    document.removeEventListener('visibilitychange', sync)
    unmount?.()
  }
}

function mountVisibleGL(canvas: HTMLCanvasElement, build: GLBuilder, onFail?: () => void): () => void {
  let disposed = false
  let teardown: (() => void) | null = null

  ;(async () => {
    let three: typeof THREE
    try {
      three = await import('three')
    } catch {
      if (!disposed) onFail?.()
      return
    }
    if (disposed) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new three.WebGLRenderer({ canvas, alpha: true, antialias: false,
        powerPreference: isConstrainedDevice() ? 'low-power' : 'default' })
      // Empty layers can call clear() before their first render(). Initialize
      // the clear alpha explicitly: WebKit otherwise paints an opaque black
      // surface over the document until this layer has something to render.
      renderer.setClearColor(0x000000, 0)
    } catch {
      onFail?.()
      return
    }

    let built: GLBuild
    try { built = build(three, canvas) } catch {
      renderer.dispose(); renderer.forceContextLoss(); onFail?.(); return
    }
    let raf = 0
    let running = false
    let visible = false
    let prev = -1

    const timer = new three.Timer()

    // Pixel cost grows quadratically with DPR; phones keep the same scene at 1x.
    const dprCap = (w: number, h: number) => {
      const constrained = isConstrainedDevice()
      // Chapter canvases can be several screens tall. Bound both total memory
      // and texture dimensions, including on older mobile GPUs.
      return Math.min(
        window.devicePixelRatio || 1,
        constrained ? 1 : 1.75,
        Math.sqrt((constrained ? 2_000_000 : 4_000_000) / (w * h)),
        Math.min(renderer.capabilities.maxTextureSize, 4096) / Math.max(w, h),
      )
    }
    let frameInterval = 1000 / (isConstrainedDevice() ? 30 : 60)
    let lastFrame = -Infinity
    const resize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (!w || !h) return
      const dpr = dprCap(w, h)
      frameInterval = 1000 / (isConstrainedDevice() ? 30 : 60)
      renderer.setPixelRatio(dpr)
      renderer.setSize(w, h, false)
      const cam = built.camera as THREE.PerspectiveCamera
      if ((cam as THREE.PerspectiveCamera).isPerspectiveCamera) {
        cam.aspect = w / h
        cam.updateProjectionMatrix()
      }
      built.resize?.(w, h, dpr)
    }

    let cleared = false
    const frame = (now: number) => {
      if (!running) return
      raf = requestAnimationFrame(frame)
      if (now - lastFrame < frameInterval - 1) return
      lastFrame = now
      timer.update()
      const t = timer.getElapsed()
      const dt = prev < 0 ? 0.016 : Math.min(t - prev, 0.1)
      prev = t
      const draw = built.update?.(t, dt)
      if (draw === false) {
        // clear once on the way out so nothing is left burned into the buffer,
        // then stop touching the GPU until there is something to say
        if (!cleared) {
          renderer.clear()
          cleared = true
        }
      } else {
        cleared = false
        renderer.render(built.scene, built.camera)
      }
    }

    const setRunning = (on: boolean) => {
      if (on === running) return
      running = on
      if (on) {
        prev = -1
        lastFrame = -Infinity
        resize()
        raf = requestAnimationFrame(frame)
      } else {
        cancelAnimationFrame(raf)
      }
    }

    // a lost context renders nothing but still accepts draw calls: without
    // this flag the observers below would happily restart a dead loop
    let lost = false
    const wanted = () => visible && !document.hidden && !lost

    const io = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting
      setRunning(wanted())
    })
    io.observe(canvas)

    const onVis = () => setRunning(wanted())
    document.addEventListener('visibilitychange', onVis)

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const onPointer = (e: PointerEvent) => {
      built.pointer?.((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1)
    }
    if (built.pointer) window.addEventListener('pointermove', onPointer, { passive: true })

    // preventDefault is what lets the browser hand the context back
    const onLost = (e: Event) => {
      e.preventDefault()
      lost = true
      setRunning(false)
    }
    const onRestored = () => {
      lost = false
      setRunning(wanted())
    }
    canvas.addEventListener('webglcontextlost', onLost)
    canvas.addEventListener('webglcontextrestored', onRestored)

    teardown = () => {
      setRunning(false)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pointermove', onPointer)
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      built.dispose?.()
      built.scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
        else mat?.dispose()
      })
      renderer.dispose()
      // dispose() frees three's own objects but leaves the GL context alive.
      // Seven of these remount on every theme toggle and browsers cap live
      // contexts at around sixteen, so the oldest would start going dark.
      renderer.forceContextLoss()
    }
    if (disposed) teardown()
  })()

  return () => {
    disposed = true
    teardown?.()
  }
}

/** Re-exported so the GL layer keeps one import for its guards. */
export { prefersReducedMotion } from '@/lib/motion'

/** A box in document space, which scrolling does not change. */
export interface DocBox {
  left: number
  top: number
  width: number
  height: number
}

/**
 * Caches where elements sit in the document so the per-frame loops stop
 * measuring them.
 *
 * getBoundingClientRect() is viewport-relative, so a scrolling layer has to
 * re-read it every frame — twenty-odd reads per frame between the flames and
 * the chapter air. Document coordinates only change when the layout changes,
 * which on this page means a resize, a font swap, or an accordion opening.
 * Scroll position is then a single subtraction.
 */
export function createBoxCache(refreshMs = 500) {
  let boxes = new WeakMap<HTMLElement, DocBox>()
  let due = 0

  const measure = (el: HTMLElement): DocBox => {
    const r = el.getBoundingClientRect()
    return {
      left: r.left + window.scrollX,
      top: r.top + window.scrollY,
      width: r.width,
      height: r.height,
    }
  }

  return {
    /** Call once per frame, before reading any boxes. */
    tick(nowMs: number) {
      if (nowMs >= due) {
        due = nowMs + refreshMs
        boxes = new WeakMap()
      }
    },
    /** Drop everything now, e.g. on resize or when the registry changes. */
    invalidate() {
      boxes = new WeakMap()
      due = 0
    },
    get(el: HTMLElement): DocBox {
      let b = boxes.get(el)
      if (!b) {
        b = measure(el)
        boxes.set(el, b)
      }
      return b
    },
  }
}

/** Coarse heuristic to halve particle budgets on phones. */
export function isSmallScreen(): boolean {
  return typeof window !== 'undefined' && (window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches)
}

function isConstrainedDevice(): boolean {
  const device = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  return isSmallScreen() || (device.hardwareConcurrency > 0 && device.hardwareConcurrency <= 4)
    || (device.deviceMemory !== undefined && device.deviceMemory <= 4)
    || device.connection?.saveData === true
}
