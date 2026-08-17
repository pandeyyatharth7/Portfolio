import { motion } from 'framer-motion';
import type { Project } from '../../types';

interface TerminalCardProps {
  project: Project;
  index?: number;
  isLink?: boolean;
  onClick?: () => void;
}

const statusConfig = {
  shipped: { color: 'bg-green-500', label: 'shipped' },
  live: { color: 'bg-green-500', label: 'live' },
  training: { color: 'bg-accent-amber', label: 'training' },
  private: { color: 'bg-text-muted', label: 'private' },
};

export default function TerminalCard({ project, index = 0, isLink = false, onClick }: TerminalCardProps) {
  const config = statusConfig[project.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="terminal-card flex flex-col h-full"
      role={isLink ? 'button' : undefined}
      tabIndex={isLink ? 0 : undefined}
      onKeyDown={isLink && onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }} : undefined}
      onClick={isLink ? onClick : undefined}
      style={isLink ? { cursor: 'pointer' } : undefined}
    >
      {/* Title bar */}
      <div className="terminal-card-titlebar">
        <span className="font-mono text-sm text-accent-violet">
          {project.name.toLowerCase().replace(/\s+/g, '_')}.model
        </span>
        <div className="ml-auto flex items-center gap-2">
          <div className={`terminal-status-dot ${config.color}`} aria-label={`Status: ${config.label}`} />
          <span className="font-mono text-xs text-text-muted">{config.label}</span>
        </div>
      </div>

      {/* Card body */}
      <div className="terminal-card-body flex flex-col flex-grow">
        <h3 className="font-semibold text-text-primary mb-2">{project.task}</h3>

        <p className="font-mono text-sm text-text-muted mb-4">{project.architecture}</p>

        <p className="text-text-muted text-sm mb-4 flex-grow">{project.description}</p>

        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {project.metrics.map((metric, idx) => (
              <div key={idx} className="bg-bg-base rounded px-3 py-2">
                <div className="font-mono text-xs text-text-muted">{metric.label}</div>
                <div className="font-mono text-sm text-text-primary">{metric.value}</div>
              </div>
            ))}
          </div>
        )}

        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-accent-violet hover:text-accent-amber transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-violet focus:ring-offset-2 focus:ring-offset-bg-surface rounded px-2 py-1 -mx-2 mt-auto self-start"
            onClick={(e) => e.stopPropagation()}
          >
            view →
          </a>
        )}
      </div>
    </motion.div>
  );
}