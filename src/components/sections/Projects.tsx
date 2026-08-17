import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { projects } from '../../data/content';
import TerminalCard from '../common/TerminalCard';

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const navigate = useNavigate();

  const handleProjectClick = (slug: string) => {
    navigate(`/model_zoo/${slug}`);
  };

  return (
    <section id="projects" className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl w-full" ref={ref}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-mono text-sm text-accent-violet mb-8"
        >
          GET /model_zoo
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <TerminalCard
              key={project.name}
              project={project}
              index={index}
              isLink={true}
              onClick={() => handleProjectClick(project.slug)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
