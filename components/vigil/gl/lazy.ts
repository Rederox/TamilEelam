'use client'

import dynamic from 'next/dynamic'

/**
 * The WebGL layer, kept out of the first script.
 *
 * Nothing here draws before the opening is over (mount.ts waits for
 * `vigil-ready`), and a server has nothing to render for a canvas: yet the
 * shaders were a quarter of the JavaScript a reader had to download before
 * the text became interactive. Each component renders nothing until the
 * layer arrives; the CSS flames and grounds that stand in without WebGL
 * stand in for that moment too.
 */
// next/dynamic reads its arguments at compile time: the import and the
// options have to be written out in each call
export const AtmosphereStage = dynamic(() => import('./layer').then((m) => m.AtmosphereStage), { ssr: false })
export const FlameLayer = dynamic(() => import('./layer').then((m) => m.FlameLayer), { ssr: false })
export const GlDust = dynamic(() => import('./layer').then((m) => m.GlDust), { ssr: false })
export const GlEmbers = dynamic(() => import('./layer').then((m) => m.GlEmbers), { ssr: false })
export const GlFlameField = dynamic(() => import('./layer').then((m) => m.GlFlameField), { ssr: false })
export const GlJuillet = dynamic(() => import('./layer').then((m) => m.GlJuillet), { ssr: false })
export const GlPyre = dynamic(() => import('./layer').then((m) => m.GlPyre), { ssr: false })
export const GlSea = dynamic(() => import('./layer').then((m) => m.GlSea), { ssr: false })
export const GlSmoke = dynamic(() => import('./layer').then((m) => m.GlSmoke), { ssr: false })
export const GlVilakku = dynamic(() => import('./layer').then((m) => m.GlVilakku), { ssr: false })
