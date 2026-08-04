import type * as THREE from 'three'

export interface GLBuild {
  scene: THREE.Scene
  camera: THREE.Camera
  /** t: elapsed seconds, dt: seconds since last frame */
  update?: (t: number, dt: number) => void
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
  let disposed = false
  let teardown: (() => void) | null = null

  ;(async () => {
    let three: typeof THREE
    try {
      three = await import('three')
    } catch {
      onFail?.()
      return
    }
    if (disposed) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new three.WebGLRenderer({ canvas, alpha: true, antialias: false })
    } catch {
      onFail?.()
      return
    }

    const built = build(three, canvas)
    let raf = 0
    let running = false
    let visible = false
    let prev = -1

    const clock = new three.Clock()

    const dprCap = () => Math.min(window.devicePixelRatio || 1, 1.75)
    const resize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (!w || !h) return
      const dpr = dprCap()
      renderer.setPixelRatio(dpr)
      renderer.setSize(w, h, false)
      const cam = built.camera as THREE.PerspectiveCamera
      if ((cam as THREE.PerspectiveCamera).isPerspectiveCamera) {
        cam.aspect = w / h
        cam.updateProjectionMatrix()
      }
      built.resize?.(w, h, dpr)
    }

    const frame = () => {
      if (!running) return
      const t = clock.getElapsedTime()
      const dt = prev < 0 ? 0.016 : Math.min(t - prev, 0.1)
      prev = t
      built.update?.(t, dt)
      renderer.render(built.scene, built.camera)
      raf = requestAnimationFrame(frame)
    }

    const setRunning = (on: boolean) => {
      if (on === running) return
      running = on
      if (on) {
        prev = -1
        resize()
        frame()
      } else {
        cancelAnimationFrame(raf)
      }
    }

    const io = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting
      setRunning(visible && !document.hidden)
    })
    io.observe(canvas)

    const onVis = () => setRunning(visible && !document.hidden)
    document.addEventListener('visibilitychange', onVis)

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const onPointer = (e: PointerEvent) => {
      built.pointer?.((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1)
    }
    if (built.pointer) window.addEventListener('pointermove', onPointer, { passive: true })

    const onLost = (e: Event) => {
      e.preventDefault()
      setRunning(false)
    }
    canvas.addEventListener('webglcontextlost', onLost)

    teardown = () => {
      setRunning(false)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pointermove', onPointer)
      canvas.removeEventListener('webglcontextlost', onLost)
      built.dispose?.()
      built.scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
        else mat?.dispose()
      })
      renderer.dispose()
    }
    if (disposed) teardown()
  })()

  return () => {
    disposed = true
    teardown?.()
  }
}

/** True when the GL layer should not run at all (reduced motion). */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Coarse heuristic to halve particle budgets on phones. */
export function isSmallScreen(): boolean {
  return typeof window !== 'undefined' && (window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches)
}
