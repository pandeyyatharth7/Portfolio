import { useEffect, useState } from 'react';

const logLines = [
  '[INFO] rendering /model_zoo...',
  '[INFO] checkpoint autocodeiq.pt loaded',
  '[INFO] connection idle — awaiting POST /connect',
  '[DEBUG] tensor shape [1, 512, 512] → [1, 256, 256]',
  '[INFO] batch normalized, loss=0.2341',
  '[INFO] gradient clip norm=1.0',
  '[DEBUG] cudaMemcpyAsync H2D 2.3ms',
  '[INFO] epoch 47/100 — val_loss=0.1892',
  '[INFO] checkpoint nexus_inventory.pt saved',
  '[DEBUG] db pool: 8/10 connections active',
  '[INFO] request GET /api/items 12ms',
  '[INFO] rendering /requirements...',
  '[DEBUG] webpack chunk [vendors] cached',
  '[INFO] connection idle — awaiting POST /connect',
];

export default function StreamingLog() {
  const [offset, setOffset] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    if (!mediaQuery.matches) {
      // Cycle through log lines every 2.5 seconds
      const interval = setInterval(() => {
        setOffset((prev) => (prev + 1) % logLines.length);
      }, 2500);
      return () => {
        clearInterval(interval);
        mediaQuery.removeEventListener('change', handleChange);
      };
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Show only 1-2 lines max in this contained footer strip
  const visibleLine = logLines[offset];

  if (prefersReducedMotion) {
    return (
      <div
        className="font-mono text-xs text-text-muted/70 truncate"
        role="log"
        aria-live="polite"
        aria-label="System log"
      >
        {logLines[0]}
      </div>
    );
  }

  return (
    <div
      className="font-mono text-xs text-text-muted/70 truncate"
      role="log"
      aria-live="polite"
      aria-label="System log"
    >
      <span key={offset} className="inline-block">
        {visibleLine}
      </span>
    </div>
  );
}