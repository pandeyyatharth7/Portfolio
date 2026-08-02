import SectionHeader from '@/components/common/SectionHeader'
import Reveal from '@/components/common/Reveal'
import { projects } from '@/data/portfolio'

/**
 * Projects page — a grid of case-study cards.
 * Each card: header, summary, problem, approach, stack, role, outcome, links.
 * Cards stay 2D (no 3D) for performance and readability.
 */
export default function Projects() {
  return (
    <div className="container-page pt-32 pb-20">
      <SectionHeader
        eyebrow="Projects"
        title="Case studies, not just screenshots."
        subtitle="A closer look at the projects I’m proudest of — the problem, the approach, the trade-offs, and what shipped."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.05}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function ProjectCard({ project }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-600 bg-ink-800/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-lime hover:shadow-lime">
      {/* Decorative corner marker. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-lime/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-0"
      />

      <header className="flex items-start justify-between gap-3">
        <p className="eyebrow text-lime">{project.name}</p>
        <div className="flex items-center gap-2">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-ink-600 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-200 transition-colors hover:border-lime hover:text-lime"
              data-cursor="link"
            >
              Live ↗
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-ink-600 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-200 transition-colors hover:border-lime hover:text-lime"
              data-cursor="link"
            >
              Code ↗
            </a>
          )}
        </div>
      </header>

      <h3 className="mt-4 text-xl font-medium text-ink-100">{project.tagline}</h3>
      <p className="mt-2 text-sm text-ink-200">{project.summary}</p>

      <Section label="Problem" body={project.problem} />
      <Section label="Approach" items={project.approach} />
      <Section label="Outcome" body={project.outcome} />

      <div className="mt-auto pt-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-300">Stack</p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <li
              key={s}
              className="rounded-full border border-ink-600 bg-ink-900/40 px-2.5 py-0.5 text-[11px] font-mono text-ink-200"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

function Section({ label, body, items }) {
  return (
    <div className="mt-5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-ink-300">{label}</p>
      {body && <p className="mt-1.5 text-sm text-ink-200">{body}</p>}
      {items && (
        <ul className="mt-1.5 space-y-1 text-sm text-ink-200">
          {items.map((it) => (
            <li key={it} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-lime" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
