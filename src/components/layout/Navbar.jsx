import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { profile } from '@/data/portfolio'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/skills', label: 'Skills' },
  { to: '/contact', label: 'Contact' },
]

/**
 * Sticky navbar with active-link highlight and a mobile drawer.
 * Becomes translucent with a backdrop blur once the user scrolls.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile drawer when navigating.
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'border-b border-ink-600/60 bg-ink-900/70 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      ].join(' ')}
    >
      <div className="container-page flex h-16 items-center justify-between">
        {/* Logo / wordmark — links to home. */}
        <Link
          to="/"
          className="group flex items-center gap-2 text-ink-100 hover:text-lime"
          aria-label={`${profile.name} — Home`}
        >
          <span className="grid h-8 w-8 place-items-center rounded-md border border-ink-600 bg-ink-800 font-mono text-xs text-lime transition-all group-hover:border-lime group-hover:shadow-lime-soft">
            {profile.initials}
          </span>
          <span className="hidden text-sm font-medium sm:inline">
            {profile.name}
          </span>
        </Link>

        {/* Desktop nav. */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                [
                  'relative rounded-full px-3 py-1.5 text-sm transition-colors',
                  isActive
                    ? 'text-lime'
                    : 'text-ink-200 hover:text-ink-100',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <span className="relative">
                  {l.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-lime"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTA. */}
        <Link
          to="/contact"
          className="hidden btn-primary md:inline-flex"
        >
          Get in touch
        </Link>

        {/* Mobile burger. */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="grid h-9 w-9 place-items-center rounded-md border border-ink-600 text-ink-100 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span aria-hidden="true" className="relative block h-3.5 w-4">
            <span
              className={[
                'absolute left-0 top-0 h-px w-full bg-current transition-all',
                open ? 'translate-y-1.5 rotate-45' : '',
              ].join(' ')}
            />
            <span
              className={[
                'absolute left-0 top-1.5 h-px w-full bg-current transition-all',
                open ? 'opacity-0' : '',
              ].join(' ')}
            />
            <span
              className={[
                'absolute left-0 bottom-0 h-px w-full bg-current transition-all',
                open ? '-translate-y-1.5 -rotate-45' : '',
              ].join(' ')}
            />
          </span>
        </button>
      </div>

      {/* Mobile drawer. */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-ink-600/60 bg-ink-900/95 backdrop-blur-md"
            aria-label="Mobile"
          >
            <ul className="container-page flex flex-col py-3">
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) =>
                      [
                        'block rounded-md px-3 py-2.5 text-sm transition-colors',
                        isActive
                          ? 'text-lime bg-ink-800'
                          : 'text-ink-200 hover:bg-ink-800 hover:text-ink-100',
                      ].join(' ')
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
              <li className="pt-2">
                <Link to="/contact" className="btn-primary w-full justify-center">
                  Get in touch
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
