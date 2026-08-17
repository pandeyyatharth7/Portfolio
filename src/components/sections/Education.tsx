import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface EducationEntry {
  date: string;
  institution: string;
  degree: string;
  detail: string;
}

const entries: EducationEntry[] = [
  {
    date: '2024–2028',
    institution: 'Vellore Institute of Technology (VIT), Chennai',
    degree: 'B.Tech Computer Science and Engineering (AI & ML)',
    detail:
      'CGPA 8.20/10. Coursework in DSA, OOP, DBMS, Operating Systems, Computer Networks, Machine Learning, Deep Learning.',
  },
  {
    date: 'Apr 2024',
    institution: 'Shri Ram Global School',
    degree: 'Class 12 (CBSE)',
    detail:
      '80%. Strong in mathematics and the sciences — the foundation under everything I build now.',
  },
  {
    date: 'Apr 2022',
    institution: 'Narayana E-Techno School',
    degree: 'Class 10 (CBSE)',
    detail: '91%.',
  },
];

export default function Education() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto" ref={ref}>
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs text-accent-amber tracking-wider uppercase block mb-2"
        >
          education
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl font-bold text-text-primary mb-12"
        >
          Education
        </motion.h2>

        {/* Vertical timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border-subtle" />

          <div className="space-y-10">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.date}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                className="relative pl-8"
              >
                {/* Dot on the timeline */}
                <div className="absolute left-0 top-2 w-[15px] h-[15px] rounded-full bg-bg-base border-2 border-accent-violet" />

                {/* Date label */}
                <span className="font-mono text-xs text-accent-amber block mb-1">
                  {entry.date}
                </span>

                {/* Terminal card */}
                <div className="terminal-card p-4">
                  <h3 className="font-mono text-sm font-semibold text-text-primary mb-1">
                    {entry.institution}
                  </h3>
                  <p className="font-mono text-xs text-accent-violet mb-1">
                    {entry.degree}
                  </p>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {entry.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
