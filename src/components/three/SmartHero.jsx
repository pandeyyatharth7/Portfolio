import { useEffect, useState, lazy, Suspense } from 'react'
import HeroFallback from './HeroFallback.jsx'

// Lazy-load the heavy 3D scene so it doesn't block first paint.
const NeuralGraph = lazy(() => import('./NeuralGraph.jsx'))

/**
 * Decides whether to render the 3D neural-graph scene or a 2D fallback.
 * Heuristics:
 *   - prefers-reduced-motion: reduce  -> fallback
 *   - (pointer: coarse)                -> fallback (mobile / touch)
 *   - WebGL unavailable                -> fallback
 */
export default function SmartHero() {
  const [mode, setMode] = useState('fallback') // 'fallback' | 'scene'

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    let webgl = true
    try {
      const c = document.createElement('canvas')
      webgl = !!(c.getContext('webgl') || c.getContext('experimental-webgl'))
    } catch {
      webgl = false
    }
    if (!reduce && !coarse && webgl) {
      setMode('scene')
    } else {
      setMode('fallback')
    }
  }, [])

  if (mode === 'fallback') return <HeroFallback />

  return (
    <Suspense fallback={<HeroFallback />}>
      <NeuralGraph />
    </Suspense>
  )
}
