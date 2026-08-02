import { Link } from 'react-router-dom'
import { profile } from '@/data/portfolio'

/**
 * Site-wide footer. Mirrors the navbar's identity block and the contact points.
 */
export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative z-10 mt-24 border-t border-ink-600/60 bg-ink-900/60">
      <div className="container-page grid gap-10 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md border border-ink-600 bg-ink-800 font-mono text-xs text-lime">
              {profile.initials}
            </span>
            <span className="text-sm font-medium text-ink-100">{profile.name}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink-300">
            {profile.role}. Based in {profile.location}.
          </p>
        </div>

        <div>
          <p className="eyebrow">Pages</p>
          <ul className="mt-3 grid grid-cols-2 gap-y-1.5 text-sm text-ink-200">
            <li><Link className="link-underline" to="/">Home</Link></li>
            <li><Link className="link-underline" to="/about">About</Link></li>
            <li><Link className="link-underline" to="/projects">Projects</Link></li>
            <li><Link className="link-underline" to="/skills">Skills</Link></li>
            <li><Link className="link-underline" to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Contact</p>
          <ul className="mt-3 space-y-1.5 text-sm text-ink-200">
            <li>
              <a className="link-underline" href={`mailto:${profile.contact.email}`}>
                {profile.contact.email}
              </a>
            </li>
            <li>
              <a className="link-underline" href={profile.contact.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a className="link-underline" href={profile.contact.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-600/60">
        <div className="container-page flex flex-col items-start justify-between gap-2 py-5 text-xs text-ink-300 sm:flex-row sm:items-center">
          <p>© {year} {profile.name}. Built with React, Vite, Tailwind, and a few too many triangles.</p>
          <p>
            <span className="text-lime">●</span>&nbsp;Open to AI/ML & SWE roles
          </p>
        </div>
      </div>
    </footer>
  )
}
