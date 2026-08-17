import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface ProjectPoint {
  date: string;        // YYYY-MM-DD (approximate)
  label: string;
  monthIndex: number;  // months since earliest date
}

// Real project timeline (approximate dates confirmed with user)
const projectMilestones: ProjectPoint[] = [
  { date: '2024-08-01', label: 'AutoCodeIQ', monthIndex: 0 },
  { date: '2024-11-15', label: 'Nexus', monthIndex: 3 },
  { date: '2025-03-01', label: 'ERM', monthIndex: 7 },
  { date: '2025-07-15', label: 'OpenReframe', monthIndex: 11 },
];

// "Today" endpoint for the timeline (today is Aug 2026 per context)
const todayMonthIndex = 24;

export default function AnimatedChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [animationProgress, setAnimationProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Trigger animation when in view
  useEffect(() => {
    if (isInView) {
      if (prefersReducedMotion) {
        setAnimationProgress(1);
      } else {
        const startTime = performance.now();
        const duration = 1500;

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setAnimationProgress(eased);

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        requestAnimationFrame(animate);
      }
    }
  }, [isInView, prefersReducedMotion]);

  // Animated visible portion of timeline (months)
  const visibleMonths = todayMonthIndex * animationProgress;

  // Chart dimensions
  const width = 760;
  const height = 280;
  const margin = { top: 40, right: 30, bottom: 60, left: 50 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Scales
  const xScale = (monthIdx: number) =>
    margin.left + (monthIdx / todayMonthIndex) * chartWidth;
  const yScale = (projectCount: number) =>
    margin.top + chartHeight - (projectCount / projectMilestones.length) * chartHeight;

  // Build the cumulative step path
  // x-axis = months (0 → today); y-axis = projects shipped (0 → 4)
  // Build segments: from each milestone's x, jumps up by 1
  const fullSegments: Array<{ x: number; y: number }> = [];
  let currentY = 0;
  for (let m = 0; m <= todayMonthIndex; m++) {
    // Bump y at the month of each milestone
    for (const milestone of projectMilestones) {
      if (milestone.monthIndex === m) {
        currentY += 1;
      }
    }
    fullSegments.push({ x: m, y: currentY });
  }

  // Filter by animation progress
  const visibleSegments = fullSegments.filter(
    (seg) => seg.x <= visibleMonths
  );

  // Build step path: horizontal then vertical
  let pathData = '';
  if (visibleSegments.length > 0) {
    pathData = `M${xScale(visibleSegments[0].x)},${yScale(visibleSegments[0].y)}`;
    for (let i = 1; i < visibleSegments.length; i++) {
      const prev = visibleSegments[i - 1];
      const curr = visibleSegments[i];
      // Step shape: go horizontal first, then vertical (or vice versa for clean steps)
      pathData += ` L${xScale(curr.x)},${yScale(prev.y)} L${xScale(curr.x)},${yScale(curr.y)}`;
    }
  }

  // Compute current "shipped" count for the title bar
  const currentCount = visibleSegments.length > 0
    ? visibleSegments[visibleSegments.length - 1].y
    : 0;

  // Y-axis ticks (0..4)
  const yTicks = [0, 1, 2, 3, 4];

  // X-axis ticks (months): label by month name
  const monthLabels: Array<{ idx: number; label: string }> = [
    { idx: 0, label: 'Aug \'24' },
    { idx: 6, label: 'Feb \'25' },
    { idx: 12, label: 'Aug \'25' },
    { idx: 18, label: 'Feb \'26' },
    { idx: 24, label: 'Aug \'26' },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="bg-bg-surface border border-border-subtle rounded-sm overflow-hidden"
    >
      <div className="terminal-card-titlebar">
        <span className="font-mono text-sm text-accent-violet">shipped.model</span>
        <span className="ml-auto font-mono text-xs text-text-muted">
          {currentCount} / {projectMilestones.length} projects
        </span>
      </div>

      <div className="terminal-card-body" style={{ height: `${height}px` }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          <defs>
            <linearGradient id="timelineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#F5B942" />
            </linearGradient>
          </defs>

          {/* Y-axis grid lines */}
          {yTicks.map((tick) => (
            <line
              key={tick}
              x1={margin.left}
              y1={yScale(tick)}
              x2={width - margin.right}
              y2={yScale(tick)}
              stroke="#232833"
              strokeWidth="0.5"
              strokeDasharray="3,3"
              opacity="0.5"
            />
          ))}

          {/* Axes */}
          <g stroke="#232833" strokeWidth="1">
            <line x1={margin.left} y1={margin.top} x2={margin.left} y2={height - margin.bottom} />
            <line x1={margin.left} y1={height - margin.bottom} x2={width - margin.right} y2={height - margin.bottom} />
          </g>

          {/* Y-axis ticks and labels */}
          <g fontFamily="'JetBrains Mono', monospace" fontSize="10" fill="#7B8496">
            {yTicks.map((tick) => {
              const y = yScale(tick);
              return (
                <g key={tick}>
                  <line x1={margin.left - 5} y1={y} x2={margin.left} y2={y} stroke="#232833" strokeWidth="1" />
                  <text x={margin.left - 8} y={y + 3} textAnchor="end" dominantBaseline="middle">
                    {tick}
                  </text>
                </g>
              );
            })}
          </g>

          {/* X-axis ticks and labels */}
          <g fontFamily="'JetBrains Mono', monospace" fontSize="10" fill="#7B8496">
            {monthLabels.map((m) => {
              const x = xScale(m.idx);
              return (
                <g key={m.idx}>
                  <line x1={x} y1={height - margin.bottom} x2={x} y2={height - margin.bottom + 5} stroke="#232833" strokeWidth="1" />
                  <text x={x} y={height - margin.bottom + 18} textAnchor="middle" dominantBaseline="middle">
                    {m.label}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Axis labels */}
          <text
            x={width / 2}
            y={height - 12}
            textAnchor="middle"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="10"
            fill="#7B8496"
          >
            timeline (months)
          </text>
          <text
            x={12}
            y={margin.top + chartHeight / 2}
            textAnchor="middle"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="10"
            fill="#7B8496"
            transform={`rotate(-90, 12, ${margin.top + chartHeight / 2})`}
          >
            projects shipped
          </text>

          {/* Timeline step line */}
          {pathData && (
            <path
              d={pathData}
              fill="none"
              stroke="url(#timelineGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Project markers (only show if visible) */}
          {projectMilestones.map((milestone, i) => {
            const cx = xScale(milestone.monthIndex);
            const cy = yScale(i + 1);
            // Only render if this point is visible (month reached)
            if (milestone.monthIndex > visibleMonths) return null;
            return (
              <g key={milestone.label}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={6}
                  fill="#0B0E14"
                  stroke="#A855F7"
                  strokeWidth="2"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={2.5}
                  fill="#A855F7"
                />
                <text
                  x={cx}
                  y={cy - 14}
                  textAnchor="middle"
                  fontFamily="'JetBrains Mono', monospace"
                  fontSize="10"
                  fill="#E4E7EC"
                >
                  {milestone.label}
                </text>
              </g>
            );
          })}

          {/* "Today" marker */}
          {visibleMonths >= todayMonthIndex && (
            <g>
              <line
                x1={xScale(todayMonthIndex)}
                y1={margin.top}
                x2={xScale(todayMonthIndex)}
                y2={height - margin.bottom}
                stroke="#7B8496"
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.6"
              />
              <text
                x={xScale(todayMonthIndex)}
                y={margin.top - 8}
                textAnchor="middle"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="10"
                fill="#7B8496"
              >
                today
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="px-4 pb-3 font-mono text-xs text-text-muted/60 border-t border-border-subtle">
        real project timeline · approximate dates
      </div>
    </motion.div>
  );
}