import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import CustomCursor from './CustomCursor.jsx'
import ScrollProgress from './ScrollProgress.jsx'

/**
 * App-wide shell: navbar, scroll progress, custom cursor, footer.
 * Pages render into the `{children}` slot.
 */
export default function Layout({ children }) {
  const location = useLocation()
  const [useCustomCursor, setUseCustomCursor] = useState(false)

  // Apply the custom-cursor class only on devices with a fine pointer (desktop / mouse users).
  // This avoids the broken "cursor: none" experience on touch.
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (hover: hover)')
    const update = () => setUseCustomCursor(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  // Scroll to top on route change.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [location.pathname])

  return (
    <div className={useCustomCursor ? 'cursor-hidden' : ''}>
      <ScrollProgress />
      {useCustomCursor && <CustomCursor />}
      <Navbar />
      <main id="content" className="relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  )
}
