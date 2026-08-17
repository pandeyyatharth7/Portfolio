import { motion } from 'framer-motion';
import { personalInfo } from '../../data/content';

export default function Hero() {
  const bootSequence = [
    '$ python init.py --user=yatharth_pandey',
    'Loading checkpoint... done',
    'Status: actively training. Open to SWE/AI-ML internships.',
  ];

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-6xl w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-3 mb-8">
            {bootSequence.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.3,
                  ease: 'easeOut',
                }}
                className="font-mono text-sm text-text-muted"
              >
                {line}
              </motion.div>
            ))}
          </div>

          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
              className="text-5xl md:text-7xl font-bold text-text-primary mb-4"
            >
              {personalInfo.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4, ease: 'easeOut' }}
              className="text-xl md:text-2xl text-accent-violet font-medium"
            >
              {personalInfo.role}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6, ease: 'easeOut' }}
              className="text-lg text-accent-violet mt-3"
            >
              I don't just train models — I ship them.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
