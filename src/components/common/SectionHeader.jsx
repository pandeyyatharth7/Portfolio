import Reveal from './Reveal.jsx'

/**
 * A consistent section header used on every page.
 * - eyebrow (small monospaced label)
 * - title (large display headline)
 * - optional subtitle
 */
export default function SectionHeader({ eyebrow, title, subtitle, align = 'left' }) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left'
  return (
    <div className={`max-w-3xl ${alignment}`}>
      {eyebrow && (
        <Reveal>
          <p className="eyebrow text-lime">{eyebrow}</p>
        </Reveal>
      )}
      {title && (
        <Reveal delay={0.05}>
          <h2 className="h-display mt-3 text-3xl text-ink-100 sm:text-4xl md:text-5xl text-balance">
            {title}
          </h2>
        </Reveal>
      )}
      {subtitle && (
        <Reveal delay={0.1}>
          <p className="mt-4 text-pretty text-ink-200 sm:text-lg">{subtitle}</p>
        </Reveal>
      )}
    </div>
  )
}
