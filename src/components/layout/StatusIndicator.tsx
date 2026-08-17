import { motion } from 'framer-motion';

interface StatusIndicatorProps {
  status?: string;
}

export default function StatusIndicator({ status = 'training' }: StatusIndicatorProps) {
  const statusConfig = {
    training: { color: 'bg-accent-amber', text: 'status: training' },
    'open-to-work': { color: 'bg-green-500', text: 'status: open-to-work' },
    available: { color: 'bg-green-500', text: 'status: available' },
    busy: { color: 'bg-red-500', text: 'status: busy' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.training;

  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`w-2 h-2 rounded-full ${config.color}`}
        animate={{
          opacity: [1, 0.5, 1],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <span className="font-mono text-xs text-text-muted">{config.text}</span>
    </div>
  );
}
