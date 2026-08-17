import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { personalInfo } from '../../data/content';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-4xl mx-auto" ref={ref}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-mono text-sm text-accent-violet mb-8"
        >
          GET /about
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="terminal-card p-6 font-mono text-sm"
        >
          <div className="space-y-2">
            <div>
              <span className="text-accent-amber">name:</span>{' '}
              <span className="text-text-primary">{personalInfo.name}</span>
            </div>
            <div>
              <span className="text-accent-amber">base:</span>{' '}
              <span className="text-text-primary">{personalInfo.education}</span>
            </div>
            <div>
              <span className="text-accent-amber">status:</span>{' '}
              <span className="text-text-primary">{personalInfo.year} · CGPA {personalInfo.cgpa}</span>
            </div>
            <div>
              <span className="text-accent-amber">location:</span>{' '}
              <span className="text-text-primary">{personalInfo.location}</span>
            </div>
            <div>
              <span className="text-accent-amber">tags:</span>{' '}
              <span className="text-text-primary">[ai/ml, full-stack, computer-vision]</span>
            </div>

            {/* Bio as YAML block scalar */}
            <div className="mt-3 pt-3 border-t border-border-subtle">
              <span className="text-accent-amber">bio:</span>{' '}
              <span className="text-text-muted">&gt;</span>
              <p className="pl-4 text-text-muted leading-relaxed mt-1">
                Third-year B.Tech CSE (AI & ML) student building practical machine
                learning and full-stack applications — from AI-assisted code review
                systems to computational photography pipelines. Cares about shipping
                things that actually run, not just demoing well.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}