import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * Top-of-page scroll progress bar. Hidden until the user has scrolled a bit.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-50 h-0.5 w-full origin-left bg-lime"
      style={{ scaleX }}
    />
  )
}
