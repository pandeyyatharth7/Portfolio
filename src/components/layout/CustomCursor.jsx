import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * A two-layer custom cursor: a tiny dot and a larger ring that lags slightly.
 * Hidden when the pointer leaves the window; expands on interactive elements.
 */
export default function CustomCursor() {
  const [hidden, setHidden] = useState(true)
  const [variant, setVariant] = useState('default') // 'default' | 'link' | 'view'
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  // Lag/spring physics — the ring trails the dot for a nice weighty feel.
  const ringX = useSpring(x, { damping: 28, stiffness: 250, mass: 0.5 })
  const ringY = useSpring(y, { damping: 28, stiffness: 250, mass: 0.5 })

  useEffect(() => {
    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setHidden(false)
    }
    const onLeave = () => setHidden(true)
    const onEnter = () => setHidden(false)

    // Inspect elements under the pointer to swap the cursor variant.
    const onOver = (e) => {
      const el = e.target.closest('a, button, [data-cursor]')
      if (!el) {
        setVariant('default')
        return
      }
      const v = el.getAttribute('data-cursor')
      if (v === 'view') setVariant('view')
      else setVariant('link')
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mouseover', onOver)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mouseover', onOver)
    }
  }, [x, y])

  const dotSize = 6
  const ringSizes = { default: 28, link: 44, view: 64 }

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full bg-lime mix-blend-difference"
        style={{
          x,
          y,
          width: dotSize,
          height: dotSize,
          translateX: -dotSize / 2,
          translateY: -dotSize / 2,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ duration: 0.1 }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border border-lime/70"
        style={{
          x: ringX,
          y: ringY,
          width: ringSizes[variant],
          height: ringSizes[variant],
          translateX: -ringSizes[variant] / 2,
          translateY: -ringSizes[variant] / 2,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {variant === 'view' && (
          <span className="absolute inset-0 grid place-items-center text-[10px] font-mono uppercase tracking-widest text-lime">
            view
          </span>
        )}
      </motion.div>
    </>
  )
}
