import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionHeader from '@/components/common/SectionHeader'
import { skillGroups } from '@/data/portfolio'

/**
 * Skills page.
 * - Grouped cards, each with a one-line blurb and a list of skills.
 * - Animated bars per skill — fills on scroll-in.
 * - Confident levels (1-5) drive the bar fill width.
 */
export default function Skills() {
  return (
    <div className="container-page pt-32 pb-20">
      <SectionHeader
        eyebrow="Skills"
        title="A toolbox grouped by what I actually do with it."
        subtitle="These are the tools I reach for — not the ones I once opened a tutorial for. Levels reflect how comfortable I am shipping production work in them, not certifications."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {skillGroups.map((g, i) => (
          <SkillGroup key={g.name} group={g} index={i} />
        ))}
      </div>

      <Footnote />
    </div>
  )
}

function SkillGroup({ group, index }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: (index % 2) * 0.05 }}
      className="rounded-2xl border border-ink-600 bg-ink-800/40 p-6"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-medium text-ink-100">{group.name}</h2>
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-300">
          {group.skills.length} skills
        </span>
      </div>
      <p className="mt-1.5 text-sm text-ink-300">{group.blurb}</p>

      <ul className="mt-6 space-y-3">
        {group.skills.map((s) => (
          <SkillBar key={s.name} name={s.name} level={s.level} />
        ))}
      </ul>
    </motion.section>
  )
}

function SkillBar({ name, level }) {
  // Trigger the fill animation only once the row is in view.
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [pct, setPct] = useState(0)

  useEffect(() => {
    if (inView) {
      // Map 1-5 to 20-100 so even "basic" looks like *something*.
      setPct(Math.max(20, (level / 5) * 100))
    }
  }, [inView, level])

  return (
    <li ref={ref}>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-ink-100">{name}</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-300">
          {levelLabel(level)}
        </span>
      </div>
      <div
        className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-700"
        role="progressbar"
        aria-valuenow={level}
        aria-valuemin={1}
        aria-valuemax={5}
        aria-label={`${name} proficiency: ${levelLabel(level)}`}
      >
        <motion.div
          className="h-full origin-left rounded-full bg-lime"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: inView ? 1 : 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: `${pct}%`,
            boxShadow: '0 0 12px rgba(182, 255, 60, 0.4)',
          }}
        />
      </div>
    </li>
  )
}

function levelLabel(level) {
  if (level >= 5) return 'Fluent'
  if (level >= 4) return 'Strong'
  if (level >= 3) return 'Solid'
  if (level >= 2) return 'Working'
  return 'Familiar'
}

function Footnote() {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-12 text-center text-sm text-ink-300"
    >
      Levels are my honest self-assessment of production comfort — not badges.
    </motion.p>
  )
}
