import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Education from './components/sections/Education';
import Projects from './components/sections/Projects';
import Timeline from './components/sections/Timeline';
import Skills from './components/sections/Skills';
import Contact from './components/sections/Contact';
import CaseStudy from './components/pages/CaseStudy';
import './styles/index.css';

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/model_zoo/:slug" element={<CaseStudy />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Education />
      <Projects />
      <Timeline />
      <Skills />
      <Contact />
    </>
  );
}

export default App;