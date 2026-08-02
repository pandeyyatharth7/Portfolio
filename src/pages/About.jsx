import SectionHeader from '@/components/common/SectionHeader'
import Reveal from '@/components/common/Reveal'
import { profile, education, beyond } from '@/data/portfolio'

/**
 * About page.
 * - Bio paragraph
 * - Education timeline
 * - "Beyond code" — certifications, hackathons, languages
 */
export default function About() {
  return (
    <div className="container-page pt-32 pb-20">
      {/* ============================================================ */}
      {/* INTRO                                                          */}
      {/* ============================================================ */}
      <SectionHeader
        eyebrow="About"
        title="A third-year AI/ML student who likes shipping things that work."
        subtitle="I study CSE (AI & ML) at VIT Chennai, build practical ML and full-stack projects in my own time, and care a lot about the engineering details that decide whether a model or an API actually works in production."
      />

      <Reveal delay={0.15}>
        <div className="mt-12 grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4 text-pretty text-lg leading-relaxed text-ink-200">
            <p>
              I’m <span className="text-ink-100">{profile.name}</span>, a B.Tech CSE (AI & ML) student at{' '}
              <span className="text-ink-100">Vellore Institute of Technology (VIT), Chennai</span> (2024–2028),
              with a current CGPA of <span className="text-lime">8.20 / 10</span>. I live and study in Chennai,
              Tamil Nadu.
            </p>
            <p>
              Most of my time goes into two things: <span className="text-ink-100">machine learning</span> and{' '}
              <span className="text-ink-100">full-stack engineering</span>. I’m primarily looking for AI/ML
              internship and full-time roles, and I’m equally comfortable taking a Software Engineering
              position. My favorite work sits at the seam — a model that needs a real interface, an API
              that needs a real model behind it.
            </p>
            <p>
              My strongest tools are Python, JavaScript, React, PyTorch, and TensorFlow, and I have a working
              foundation in DSA, OOP, DBMS, Operating Systems, and Computer Networks. When I’m not
              building, I volunteer at college fests and tinker with the occasional AR/VR project.
            </p>
          </div>

          {/* Quick facts card. */}
          <aside className="rounded-2xl border border-ink-600 bg-ink-800/60 p-6">
            <p className="eyebrow text-lime">At a glance</p>
            <dl className="mt-4 space-y-3 text-sm">
              <FactRow label="Based in" value={profile.location} />
              <FactRow label="Focus" value="AI/ML (open to SWE)" />
              <FactRow label="Degree" value="B.Tech CSE (AI & ML)" />
              <FactRow label="Graduating" value="2028" />
              <FactRow label="Email" value={profile.contact.email} mono />
            </dl>
            <a
              href={`mailto:${profile.contact.email}`}
              className="btn-primary mt-6 w-full justify-center"
              data-cursor="link"
            >
              Email me
            </a>
          </aside>
        </div>
      </Reveal>

      {/* ============================================================ */}
      {/* EDUCATION                                                      */}
      {/* ============================================================ */}
      <section className="mt-24">
        <SectionHeader
          eyebrow="Education"
          title="A short academic timeline."
        />
        <ol className="mt-10 grid gap-6">
          {education.map((e, i) => (
            <Reveal key={e.school} delay={i * 0.05}>
              <li className="relative grid gap-3 rounded-2xl border border-ink-600 bg-ink-800/40 p-6 sm:grid-cols-[180px_1fr]">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-lime">
                    {e.period}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-ink-100">{e.school}</h3>
                  <p className="mt-1 text-sm text-ink-200">{e.degree}</p>
                  <p className="mt-3 text-sm text-ink-300">{e.detail}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ============================================================ */}
      {/* BEYOND CODE                                                    */}
      {/* ============================================================ */}
      <section className="mt-24">
        <SectionHeader
          eyebrow="Beyond code"
          title="The other things I show up for."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {/* Certifications */}
          <Reveal>
            <div className="h-full rounded-2xl border border-ink-600 bg-ink-800/40 p-6">
              <p className="eyebrow text-lime">Certifications</p>
              <ul className="mt-4 space-y-3">
                {beyond.certifications.map((c) => (
                  <li key={c.name}>
                    <p className="text-sm text-ink-100">{c.name}</p>
                    <p className="text-xs text-ink-300">{c.org}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Hackathons */}
          <Reveal delay={0.05}>
            <div className="h-full rounded-2xl border border-ink-600 bg-ink-800/40 p-6">
              <p className="eyebrow text-lime">Hackathons</p>
              <ul className="mt-4 space-y-3">
                {beyond.hackathons.map((h) => (
                  <li key={h.name}>
                    <p className="text-sm text-ink-100">{h.name}</p>
                    <p className="text-xs text-ink-300">{h.org}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Languages */}
          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl border border-ink-600 bg-ink-800/40 p-6">
              <p className="eyebrow text-lime">Languages</p>
              <ul className="mt-4 space-y-3">
                {beyond.languages.map((l) => (
                  <li key={l.name} className="flex items-center justify-between">
                    <span className="text-sm text-ink-100">{l.name}</span>
                    <span className="font-mono text-xs text-ink-300">{l.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

function FactRow({ label, value, mono = false }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-ink-600/60 pb-3 last:border-none last:pb-0">
      <dt className="text-ink-300">{label}</dt>
      <dd className={['text-right text-ink-100', mono ? 'font-mono text-xs' : ''].join(' ')}>
        {value}
      </dd>
    </div>
  )
}
