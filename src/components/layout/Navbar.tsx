import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StatusIndicator from './StatusIndicator';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'GET /', href: '#home' },
    { label: 'GET /about', href: '#about' },
    { label: 'GET /model_zoo', href: '#projects' },
    { label: 'GET /requirements', href: '#skills' },
    { label: 'POST /connect', href: '#contact' },
  ];

  // When clicking a nav link: if we're on a case study or non-home route,
  // navigate to "/" first, then scroll to the section after navigation.
  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');

    if (location.pathname !== '/') {
      // Navigate to home; the small delay lets the page mount before scroll.
      navigate('/');
      // Use a hash in the URL and let the browser handle scrolling on next tick
      window.history.replaceState(null, '', `/#${targetId}`);
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      // Already on home; just scroll
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Logo "GET /" click should always return to home
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      window.history.replaceState(null, '', '/#home');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg-base/95 backdrop-blur-sm border-b border-border-subtle' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="#home"
          onClick={handleHomeClick}
          className="font-mono text-sm text-accent-violet font-medium hover:text-accent-amber transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-violet focus:ring-offset-2 focus:ring-offset-bg-base rounded px-1"
        >
          yatharth_pandey
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="font-mono text-xs text-text-muted hover:text-accent-violet transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-violet focus:ring-offset-2 focus:ring-offset-bg-base rounded px-2 py-1 cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </div>

        <StatusIndicator status="training" />
      </div>

      {/* Mobile menu */}
      <div className="md:hidden px-6 pb-4 flex flex-col gap-2">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            className="font-mono text-xs text-text-muted hover:text-accent-violet transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-violet focus:ring-offset-2 focus:ring-offset-bg-base rounded px-2 py-1 cursor-pointer"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}