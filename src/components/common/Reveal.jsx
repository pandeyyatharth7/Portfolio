import { motion } from 'framer-motion'

/**
 * Small wrapper that fades + lifts its children on scroll-in.
 * Use as: <Reveal>...</Reveal> or <Reveal delay={0.1}>...</Reveal>.
 */
export default function Reveal({ children, delay = 0, y = 12, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
