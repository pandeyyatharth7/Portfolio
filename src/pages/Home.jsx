import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SmartHero from '@/components/three/SmartHero'
import Reveal from '@/components/common/Reveal'
import { profile, projects, manifesto } from '@/data/portfolio'

/**
 * Home / Landing.
 * Structure:
 *   1. Hero  — 3D neural-graph background, opener, primary CTA, status pill.
 *   2. Manifesto — three bold statements. This is what recruiters should remember.
 *   3. Featured projects — top 2 projects with "see all" link.
 *   4. "What I'm looking for" callout — clarifies AI/ML primary, SWE open.
 */
export default function Home() {
  const featured = projects.slice(0, 2)

  return (
    <>
      {/* ============================================================ */}
      {/* HERO                                                          */}
      {/* ============================================================ */}
      <section className="relative min-h-[90vh] overflow-hidden">
        {/* Neural graph / 2D fallback behind the hero copy. */}
        <SmartHero />

        {/* Vignette to keep text readable on bright displays. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-900/0 via-ink-900/20 to-ink-900"
        />

        <div className="container-page relative grid min-h-[90vh] content-center py-28">
          <div className="max-w-4xl">
            <Reveal>
              <p className="eyebrow inline-flex items-center gap-2 rounded-full border border-ink-600 bg-ink-800/60 px-3 py-1 backdrop-blur">
                <span className="inline-block h-1.5 w-1.5 animate-pulse-soft rounded-full bg-lime" />
                <span className="text-ink-200">{profile.positioning.primary}</span>
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="h-display mt-6 text-4xl text-ink-100 sm:text-6xl md:text-7xl text-balance">
                {profile.name}.
                <br />
                <span className="text-ink-200">Building the layer between</span>{' '}
                <span className="text-lime">models</span>
                <br className="hidden sm:block" />
                <span className="text-ink-200">and the</span>{' '}
                <span className="text-lime">people who use them</span>.
              </h1>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-7 max-w-2xl text-pretty text-lg text-ink-200 sm:text-xl">
                Third-year B.Tech CSE (AI & ML) at VIT Chennai. I work across the full
                stack — from PyTorch and CUDA to React and Node — because the interesting
                problems don’t sit on one side of it.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link to="/projects" className="btn-primary" data-cursor="link">
                  See my work
                  <span aria-hidden="true">→</span>
                </Link>
                <Link to="/contact" className="btn-ghost" data-cursor="link">
                  Get in touch
                </Link>
                <span className="text-xs text-ink-300">
                  · {profile.positioning.secondary}
                </span>
              </div>
            </Reveal>
          </div>

          {/* Scroll cue */}
          <motion.div
            aria-hidden="true"
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-ink-300">
              <span>Scroll</span>
              <span className="h-10 w-px bg-gradient-to-b from-lime to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* MANIFESTO                                                     */}
      {/* ============================================================ */}
      <section className="relative border-y border-ink-600/60 bg-ink-900">
        <div className="container-page py-20 md:py-28">
          <Reveal>
            <p className="eyebrow text-lime">In three lines</p>
            <h2 className="sr-only">What I do, in three lines</h2>
          </Reveal>

          <ol className="mt-10 grid gap-10 md:gap-14">
            {manifesto.map((m, i) => (
              <Reveal key={m.headline} delay={i * 0.05}>
                <li className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 md:grid-cols-[80px_1fr]">
                  <span className="font-mono text-sm text-lime">
                    0{i + 1}
                  </span>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-300">
                      {m.label}
                    </p>
                    <p className="h-display mt-2 text-2xl text-ink-100 sm:text-4xl md:text-5xl text-balance">
                      {m.headline}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FEATURED PROJECTS                                             */}
      {/* ============================================================ */}
      <section className="relative">
        <div className="container-page py-20 md:py-28">
          <div className="flex items-end justify-between gap-6">
            <Reveal>
              <div>
                <p className="eyebrow text-lime">Selected work</p>
                <h2 className="h-display mt-3 text-3xl text-ink-100 sm:text-4xl">
                  Things I’ve built recently.
                </h2>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Link to="/projects" className="hidden btn-ghost sm:inline-flex" data-cursor="link">
                All projects →
              </Link>
            </Reveal>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <Link
                  to="/projects"
                  className="card-lift group block h-full rounded-2xl border border-ink-600 bg-ink-800/60 p-6"
                  data-cursor="view"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="eyebrow text-lime">{p.name}</p>
                    <span className="text-ink-300 transition-transform group-hover:translate-x-1 group-hover:text-lime">
                      →
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-medium text-ink-100">
                    {p.tagline}
                  </h3>
                  <p className="mt-2 text-sm text-ink-200">{p.summary}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {p.stack.slice(0, 5).map((s) => (
                      <li
                        key={s}
                        className="rounded-full border border-ink-600 px-2.5 py-0.5 text-[11px] font-mono text-ink-200"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <Link
              to="/projects"
              className="mt-8 inline-flex items-center gap-2 text-sm text-ink-200 hover:text-lime sm:hidden"
            >
              See all projects →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CTA / "WHAT I'M LOOKING FOR"                                  */}
      {/* ============================================================ */}
      <section className="relative">
        <div className="container-page pb-24">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-ink-600 bg-gradient-to-br from-ink-800 to-ink-900 p-8 sm:p-12">
              <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-40" />
              <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
                <div>
                  <p className="eyebrow text-lime">What I’m looking for</p>
                  <h2 className="h-display mt-3 text-2xl text-ink-100 sm:text-3xl text-balance">
                    AI/ML internships or full-time roles.
                    <span className="text-ink-300"> Software Engineering too.</span>
                  </h2>
                  <p className="mt-3 max-w-xl text-pretty text-ink-200">
                    If your team needs someone who can hold an ML model in one hand and
                    ship the API in the other, let’s talk.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 md:justify-end">
                  <Link to="/contact" className="btn-primary" data-cursor="link">
                    Email me
                  </Link>
                  <Link to="/about" className="btn-ghost" data-cursor="link">
                    More about me
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
