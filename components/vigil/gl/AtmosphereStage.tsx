'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'

import { useEffect, useRef } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { getAir, setStageGL, type AirKind } from '@/lib/atmosphere'
import { AIR_FRAG, AIR_VERT } from './air'
import { createBoxCache, isSmallScreen, mountGL, prefersReducedMotion } from './mount'

/** At most this many rectangles of one kind are ever on screen at once. */
const POOL = 3

const KINDS: AirKind[] = ['ground', 'motes', 'cloth', 'rake']

type Uniforms = Record<string, { value: number }>

/**
 * One canvas for every chapter's air.
 *
 * Each frame the stage reads where the registered rectangles currently sit
 * and draws the right material into each one, exactly as <FlameLayer> does
 * for flames. The camera works in CSS pixels with the origin top-left, so a
 * mesh placed at a DOM rect covers it precisely while the page scrolls.
 *
 * It sits at z-1: above every chapter's background, below every chapter's
 * text. Nothing is drawn outside a registered rectangle.
 */
export default function AtmosphereStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const paper = theme === 'paper'

  const stillness = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || stillness) return

    // phones pay for every octave across a full-width rectangle
    const octaves = isSmallScreen() ? 3 : 5

    const unmount = mountGL(
      canvas,
      (three) => {
        const scene = new three.Scene()
        // 1 world unit = 1 CSS pixel, y increasing downward like the DOM
        const camera = new three.OrthographicCamera(0, 1, 0, 1, -10, 10)
        const geo = new three.PlaneGeometry(1, 1)

        const pools = new Map<AirKind, THREEMesh[]>()
        for (const kind of KINDS) {
          const meshes = Array.from({ length: POOL }, () => {
            const mat = new three.ShaderMaterial({
              vertexShader: AIR_VERT,
              fragmentShader: AIR_FRAG[kind](octaves),
              transparent: true,
              depthWrite: false,
              depthTest: false,
              // the y-down camera reverses the quad's winding
              side: three.DoubleSide,
              blending: paper ? three.NormalBlending : three.AdditiveBlending,
              uniforms: {
                uTime: { value: 0 },
                uSeed: { value: 0 },
                uAlpha: { value: 0 },
                uWarm: { value: 0.5 },
                uPaper: { value: paper ? 1 : 0 },
                uAspect: { value: 1 },
                uProgress: { value: 0 },
              },
            })
            const mesh = new three.Mesh(geo, mat) as unknown as THREEMesh
            mesh.frustumCulled = false
            mesh.visible = false
            scene.add(mesh as never)
            return mesh
          })
          pools.set(kind, meshes)
        }

        setStageGL(true)
        const boxes = createBoxCache()

        return {
          scene,
          camera,
          update: (t) => {
            boxes.tick(performance.now())
            const vh = window.innerHeight
            const scrollY = window.scrollY
            const used = new Map<AirKind, number>()

            getAir().forEach((h) => {
              const taken = used.get(h.kind) ?? 0
              if (taken >= POOL) return

              const b = boxes.get(h.el)
              if (b.width === 0 || b.height === 0) return
              const top = b.top - scrollY
              // a rectangle just off either edge still gets drawn, so nothing
              // appears abruptly at the moment it crosses the viewport line
              if (top + b.height < -120 || top > vh + 120) return

              // 0 as the rect's top touches the bottom edge, 1 as its bottom
              // leaves the top: the reader's own passage through the chapter
              const p = (vh - top) / (vh + b.height)
              h.progress = Math.min(1, Math.max(0, p))

              const mesh = pools.get(h.kind)![taken]
              used.set(h.kind, taken + 1)

              mesh.visible = true
              mesh.position.set(b.left - window.scrollX + b.width / 2, top + b.height / 2, 0)
              mesh.scale.set(b.width, b.height, 1)

              const u = mesh.material.uniforms as Uniforms
              u.uTime.value = t
              u.uSeed.value = h.seed
              u.uAlpha.value = h.intensity
              u.uWarm.value = h.warmth
              u.uAspect.value = b.width / b.height
              u.uProgress.value = h.progress
            })

            let drawn = 0
            for (const kind of KINDS) {
              const meshes = pools.get(kind)!
              const n = used.get(kind) ?? 0
              drawn += n
              for (let i = n; i < POOL; i++) meshes[i].visible = false
            }
            // between chapters there is no air to draw at all
            return drawn > 0
          },
          resize: (w, h) => {
            boxes.invalidate()
            const cam = camera as unknown as {
              left: number; right: number; top: number; bottom: number
              updateProjectionMatrix: () => void
            }
            cam.left = 0
            cam.right = w
            cam.top = 0
            cam.bottom = h
            cam.updateProjectionMatrix()
          },
          dispose: () => {
            setStageGL(false)
            geo.dispose()
            pools.forEach((meshes) => meshes.forEach((m) => m.material.dispose()))
          },
        }
      },
      () => setStageGL(false)
    )

    return () => {
      unmount()
      setStageGL(false)
    }
  }, [paper, stillness])

  return (
    <canvas
      key={`${theme}-${stillness}`}
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] h-full w-full"
    />
  )
}

/** The slice of three's Mesh this file touches, without importing three eagerly. */
interface THREEMesh {
  visible: boolean
  frustumCulled: boolean
  position: { set: (x: number, y: number, z: number) => void }
  scale: { set: (x: number, y: number, z: number) => void }
  material: { uniforms: Record<string, { value: number }>; dispose: () => void }
}
