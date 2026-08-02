import { motion } from 'framer-motion'

/**
 * 2D fallback for the hero scene — used when:
 *   1. The user is on a mobile / touch device.
 *   2. The user has `prefers-reduced-motion: reduce` set.
 *   3. WebGL is unavailable.
 *
 * Concept: a small neural-graph illustration — same idea as the 3D scene,
 * just done in 2D SVG so it still reads as the same thing.
 */
export default function HeroFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Soft glow — keeps the same atmosphere as the 3D scene. */}
      <div
        aria-hidden="true"
        className="absolute -right-32 -top-20 h-[460px] w-[460px] rounded-full opacity-50 blur-3xl"
        style={{ background: 'radial-gradient(closest-side, #B6FF3C, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -left-20 h-[380px] w-[380px] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(closest-side, #B6FF3C, transparent 70%)' }}
      />

      <motion.svg
        aria-hidden="true"
        viewBox="0 0 600 400"
        className="absolute inset-0 h-full w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <defs>
          <pattern id="grid-fb" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          </pattern>
          <radialGradient id="core-fb" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#B6FF3C" stopOpacity="1" />
            <stop offset="100%" stopColor="#B6FF3C" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid-fb)" />

        {/* Edges — drawn as faint lines, then a brighter pulse traveling along a few of them. */}
        <g stroke="#B6FF3C" strokeWidth="0.5" opacity="0.18">
          {generateEdges().map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </g>

        {/* Animated "signal" dots traveling along select edges for a sense of activity. */}
        {pulsePaths().map((d, i) => (
          <motion.circle
            key={i}
            r="1.8"
            fill="#B6FF3C"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeInOut',
            }}
          >
            <animateMotion dur="2.4s" repeatCount="indefinite" path={d} begin={`${i * 0.4}s`} />
          </motion.circle>
        ))}

        {/* Nodes — one per layer column. */}
        {generateNodes().map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="9" fill="url(#core-fb)" opacity="0.45" />
            <circle
              cx={cx}
              cy={cy}
              r="3"
              fill="#B6FF3C"
              style={{ filter: 'drop-shadow(0 0 4px #B6FF3C)' }}
            >
              <animate
                attributeName="r"
                values="2.5;4;2.5"
                dur={`${2 + (i % 5) * 0.4}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
      </motion.svg>
    </div>
  )
}

// --- Layout helpers (mirror the 3D scene's column structure) ---

const COLS = [5, 7, 7, 5, 3]
const X_STEP = 600 / (COLS.length + 1)

function columnX(i) {
  return X_STEP * (i + 1)
}

function columnY(count, idx) {
  const top = 60
  const bottom = 340
  if (count === 1) return (top + bottom) / 2
  return top + ((bottom - top) * idx) / (count - 1)
}

function generateNodes() {
  const out = []
  for (let c = 0; c < COLS.length; c++) {
    for (let n = 0; n < COLS[c]; n++) {
      out.push([columnX(c), columnY(COLS[c], n)])
    }
  }
  return out
}

function generateEdges() {
  // Connect every node in column c to every node in column c+1.
  const cols = []
  let idx = 0
  for (let c = 0; c < COLS.length; c++) {
    cols[c] = []
    for (let n = 0; n < COLS[c]; n++) {
      cols[c].push(idx++)
    }
  }
  const edges = []
  for (let c = 0; c < cols.length - 1; c++) {
    for (const a of cols[c]) {
      for (const b of cols[c + 1]) {
        const [x1, y1] = generateNodes()[a]
        const [x2, y2] = generateNodes()[b]
        edges.push([x1, y1, x2, y2])
      }
    }
  }
  return edges
}

function pulsePaths() {
  // A handful of representative inter-column edges for the signal animation.
  const cols = [5, 7, 7, 5, 3]
  const paths = []
  for (let c = 0; c < cols.length - 1; c++) {
    for (let n = 0; n < Math.min(cols[c], 3); n++) {
      const aIdx = cols.slice(0, c).reduce((s, k) => s + k, 0) + Math.floor((n * (cols[c] - 1)) / 2)
      const bIdx = cols.slice(0, c + 1).reduce((s, k) => s + k, 0) + Math.floor((n * (cols[c + 1] - 1)) / 2)
      const nodes = generateNodes()
      const [x1, y1] = nodes[aIdx]
      const [x2, y2] = nodes[bIdx]
      // Slight curve so the path reads as motion, not a straight line.
      const cx = (x1 + x2) / 2
      const cy = (y1 + y2) / 2 - 14
      paths.push(`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`)
    }
  }
  return paths
}
